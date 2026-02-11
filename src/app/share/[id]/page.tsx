import { Metadata } from "next"
import ShareRedirect from "./redirect"

type Props = { params: { id: string } }

async function getReport(id: string) {
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://shipchecklist-ai.vercel.app"
    const res = await fetch(`${baseUrl}/api/report/${id}`, { cache: "no-store" })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const report = await getReport(params.id)
  if (!report) return { title: "ShipChecklist.ai" }

  let domain = "unknown"
  try { domain = new URL(report.url).hostname } catch {}

  const ogImage = `https://shipchecklist-ai.vercel.app/api/og?score=${report.overallScore}&site=${encodeURIComponent(domain)}&passed=${report.passedCount}&failed=${report.failedCount}`
  const title = `${domain} scored ${report.overallScore}/100 on ShipChecklist.ai`
  const description = report.summary || `Pre-launch audit for ${domain}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://shipchecklist-ai.vercel.app/share/${params.id}`,
      siteName: "ShipChecklist.ai",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  }
}

export default function SharePage({ params }: Props) {
  return <ShareRedirect id={params.id} />
}