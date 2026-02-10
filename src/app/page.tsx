"use client"
import { useState, FormEvent } from "react"
import { motion } from "framer-motion"
import { ClipboardCheck, Search, Shield, Smartphone, Scale, BarChart3, Zap, Globe, Loader2, Check, ArrowRight, ChevronDown, Star, Eye } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { normalizeUrl, isValidUrl } from "@/lib/utils"

const categories = [
  { icon: Search, title: "SEO Basics", desc: "Title, meta, OG tags, sitemap, structured data" },
  { icon: Zap, title: "Performance", desc: "Page size, images, compression, speed" },
  { icon: Smartphone, title: "Mobile Ready", desc: "Responsive design, viewport, touch targets" },
  { icon: Shield, title: "Security", desc: "HTTPS, SSL, security headers, mixed content" },
  { icon: Scale, title: "Legal & Compliance", desc: "Privacy policy, terms, cookie consent" },
  { icon: Eye, title: "Accessibility", desc: "Alt tags, contrast, semantic HTML, ARIA" },
]

const faqs = [
  { q: "What does it check?", a: "50+ items across 10 categories: SEO, performance, security, mobile, legal, branding, analytics, accessibility, links, and launch readiness." },
  { q: "How is this different from Lighthouse?", a: "Lighthouse focuses on performance metrics. We check EVERYTHING for launch: legal pages, OG tags, broken links, favicon, 404 page, cookie consent, and more." },
  { q: "What do I get for free?", a: "Quick audit of 3 categories (15+ checks). Full audit with all 10 categories (50+ checks) is $7.99." },
  { q: "Can I check any website?", a: "Yes! Check your own site or audit competitors. Any public URL works." },
]

export default function HomePage() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!url.trim()) { toast.error("Please enter a URL"); return }
    const cleanUrl = normalizeUrl(url)
    if (!isValidUrl(cleanUrl)) { toast.error("Please enter a valid URL"); return }
    setLoading(true)
    try {
      const res = await fetch("/api/check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: cleanUrl }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Check failed")
      router.push(`/report/${data.id}`)
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-7 h-7 text-emerald-500" />
            <span className="text-xl font-bold">ShipChecklist<span className="text-emerald-500">.ai</span></span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/history" className="text-sm text-dark-300 hover:text-white transition">My Audits</a><a href="#pricing" className="text-sm text-dark-300 hover:text-white transition">Pricing</a>
            <a href="#faq" className="text-sm text-dark-300 hover:text-white transition">FAQ</a>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-emerald-300 mb-6">
              <ClipboardCheck className="w-4 h-4" /> 50+ automated checks
            </div>
            <h1 className="text-5xl sm:text-7xl font-black mb-6 leading-tight">
              Never launch<br /><span className="text-gradient">unprepared</span> again вњ…
            </h1>
            <p className="text-xl text-dark-300 mb-10 max-w-2xl mx-auto">
              AI audits your website for <span className="text-white font-semibold">50+ launch-readiness issues</span> вЂ” SEO, security, performance, legal, accessibility вЂ” in 30 seconds.
            </p>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://your-website.com"
                    className="w-full pl-12 pr-4 py-4 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg" disabled={loading} />
                </div>
                <button type="submit" disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-xl text-white font-bold text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 glow-green whitespace-nowrap">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Checking...</> : <>Run Audit <ClipboardCheck className="w-5 h-5" /></>}
                </button>
              </div>
            </form>
            <p className="text-sm text-dark-400 mt-4">Free quick audit - Full report $7.99</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">What we <span className="text-gradient">check</span></h2>
          <p className="text-dark-300 text-center mb-12 max-w-xl mx-auto">10 categories, 50+ checks вЂ” everything you need before launch</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="glass-card hover:border-emerald-500/30 transition-colors group">
                <f.icon className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-dark-300 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 bg-dark-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Simple <span className="text-gradient">pricing</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="glass-card">
              <h3 className="text-xl font-bold mb-2">Quick Audit</h3>
              <div className="text-3xl font-black mb-4">Free</div>
              <ul className="space-y-3 mb-6">
                {["3 categories checked", "15+ individual checks", "Basic fix recommendations"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-dark-200"><Check className="w-4 h-4 text-green-500 flex-shrink-0" /> {item}</li>
                ))}
              </ul>
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="w-full py-3 rounded-xl border border-dark-600 hover:border-dark-400 text-dark-200 font-semibold transition">Try Free</button>
            </div>
            <div className="glass-card border-emerald-500/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full text-xs font-bold">COMPLETE</div>
              <h3 className="text-xl font-bold mb-2">Full Audit вњ…</h3>
              <div className="text-3xl font-black mb-1">$7.99</div>
              <div className="text-sm text-dark-400 mb-4">per site, one-time</div>
              <ul className="space-y-3 mb-6">
                {["All 10 categories", "50+ individual checks", "Priority-ranked fixes", "Critical issue alerts", "Detailed fix instructions", "Accessibility audit", "Legal compliance check"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-dark-200"><Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> {item}</li>
                ))}
              </ul>
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold transition glow-green">
                Get Full Audit <ArrowRight className="inline w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12"><span className="text-gradient">FAQ</span></h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card cursor-pointer select-none" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold pr-4">{faq.q}</h3>
                  <ChevronDown className={`w-5 h-5 text-dark-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </div>
                {openFaq === i && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-dark-300 text-sm mt-3">{faq.a}</motion.p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to <span className="text-gradient">ship</span>? вњ…</h2>
          <p className="text-dark-300 mb-8">Check everything before your users do.</p>
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-bold text-lg transition glow-green">
            Run Audit Now <ClipboardCheck className="inline w-5 h-5 ml-1" />
          </button>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-emerald-500" /><span className="font-bold">ShipChecklist<span className="text-emerald-500">.ai</span></span></div>
          <p className="text-sm text-dark-400">Also try: <a href="https://roastpage-ai.com" className="text-orange-400 hover:underline">RoastPage.ai</a> - AI Landing Page Roaster</p>
        </div>
      </footer>
    </div>
  )
}