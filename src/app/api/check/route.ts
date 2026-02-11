import { NextRequest, NextResponse } from "next/server"
import { nanoid } from "nanoid"
import { CHECK_SYSTEM_PROMPT, buildCheckPrompt } from "@/lib/prompts"
import { store } from "@/lib/store"
import { CheckReport, CheckCategory } from "@/lib/types"
import { isValidUrl } from "@/lib/utils"

const PROMO_CODES: Record<string, number> = {
  "LAUNCH2025": 10,
  "SHIPIT": 5,
  "PRODUCTHUNT": 20,
  "FRIEND": 3,
}
const promoUsage: Record<string, number> = {}

function validatePromo(code: string): boolean {
  if (!code) return false
  const upper = code.toUpperCase()
  const limit = PROMO_CODES[upper]
  if (!limit) return false
  const used = promoUsage[upper] || 0
  if (used >= limit) return false
  promoUsage[upper] = used + 1
  return true
}

async function checkUrlExists(url: string): Promise<boolean> {
  try {
    const c = new AbortController()
    const t = setTimeout(() => c.abort(), 10000)
    const r = await fetch(url, { method: "GET", signal: c.signal, headers: { "User-Agent": "Mozilla/5.0 (compatible; ShipCheckBot/1.0)" }, redirect: "follow" })
    clearTimeout(t)
    return r.ok
  } catch { return false }
}

async function getScreenshotBase64(url: string): Promise<string | null> {
  try {
    const sUrl = `https://image.thum.io/get/width/1280/crop/900/noanimate/${url}`
    const c = new AbortController()
    const t = setTimeout(() => c.abort(), 15000)
    const res = await fetch(sUrl, { signal: c.signal })
    clearTimeout(t)
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    return `data:image/png;base64,${Buffer.from(buf).toString("base64")}`
  } catch { return null }
}

async function fetchPageData(url: string): Promise<{ text: string; headers: string }> {
  try {
    const c = new AbortController()
    const t = setTimeout(() => c.abort(), 8000)
    const r = await fetch(url, { signal: c.signal, headers: { "User-Agent": "Mozilla/5.0 (compatible; ShipCheckBot/1.0)" } })
    clearTimeout(t)
    const headersStr = Array.from(r.headers.entries()).map(([k, v]) => `${k}: ${v}`).join("\n")
    const html = await r.text()
    const text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 5000)
    return { text, headers: headersStr }
  } catch { return { text: "", headers: "" } }
}

async function analyzeWithAI(url: string, screenshot: string | null, pageText: string, headers: string) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error("OpenAI API key not configured")
  const userContent: any[] = [{ type: "text", text: buildCheckPrompt(url, pageText, headers) }]
  if (screenshot) userContent.push({ type: "image_url", image_url: { url: screenshot, detail: "high" } })

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o", messages: [
        { role: "system", content: CHECK_SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      max_tokens: 4096, temperature: 0.5, response_format: { type: "json_object" },
    }),
  })
  if (!response.ok) throw new Error("AI analysis failed. Please try again.")
  const data = await response.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error("AI analysis failed.")
  try { return JSON.parse(content) } catch { throw new Error("AI returned invalid response.") }
}

export async function POST(request: NextRequest) {
  try {
    const { url, promoCode } = await request.json()
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 })
    if (!isValidUrl(url)) return NextResponse.json({ error: "Please enter a valid URL" }, { status: 400 })

    const exists = await checkUrlExists(url)
    if (!exists) return NextResponse.json({ error: "Website not reachable." }, { status: 400 })

    const isPromo = promoCode ? validatePromo(promoCode) : false
    const reportId = nanoid(12)

    const [screenshot, pageData] = await Promise.all([getScreenshotBase64(url), fetchPageData(url)])
    if (!screenshot && !pageData.text) return NextResponse.json({ error: "Could not load page." }, { status: 400 })

    const analysis = await analyzeWithAI(url, screenshot, pageData.text, pageData.headers)
    if (!analysis.categories) return NextResponse.json({ error: "AI could not analyze." }, { status: 500 })

    const categories: CheckCategory[] = analysis.categories.map((cat: any, i: number) => ({
      name: cat.name || `Category ${i+1}`, icon: cat.icon || "check",
      checks: (cat.checks || []).map((ch: any) => ({
        name: ch.name || "", status: ch.status || "info",
        description: ch.description || "", fix: ch.fix || "", priority: ch.priority || "medium",
      })),
      isFree: isPromo ? true : i < 3,
    }))

    const report: CheckReport = {
      id: reportId, url,
      overallScore: Math.round(analysis.overallScore || 50),
      passedCount: analysis.passedCount || 0,
      failedCount: analysis.failedCount || 0,
      warningCount: analysis.warningCount || 0,
      summary: analysis.summary || "Audit complete.",
      categories, isPaid: isPromo, createdAt: new Date().toISOString(),
    }
    await store.setReport(report)
    return NextResponse.json({ id: reportId, status: "complete", promo: isPromo })
  } catch (error: any) {
    console.error("Check error:", error)
    return NextResponse.json({ error: error.message || "Analysis failed." }, { status: 500 })
  }
}