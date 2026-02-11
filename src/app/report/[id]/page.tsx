"use client"
import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { ClipboardCheck, ArrowLeft, ExternalLink, Lock, Unlock, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { CheckReport } from "@/lib/types"
import { extractDomain } from "@/lib/utils"
import ScoreCircle from "@/components/ScoreCircle"
import CheckCategoryCard from "@/components/CheckCategoryCard"
import PaymentModal from "@/components/PaymentModal"
import LoadingAnimation from "@/components/LoadingAnimation"
import ShareButtons from "@/components/ShareButtons"

const WALLET = process.env.NEXT_PUBLIC_USDT_WALLET || ""
const PRICE = 7.99

export default function ReportPage({ params }: { params: { id: string } }) {
  const [report, setReport] = useState<CheckReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)

  const fetchReport = useCallback(async () => {
    try {
      const res = await fetch(`/api/report/${params.id}`)
      if (!res.ok) throw new Error("Report not found")
      const data = await res.json()
      setReport(data)
      try {
        const key = "shipchecklist_history"
        const stored = localStorage.getItem(key)
        const history = stored ? JSON.parse(stored) : []
        const item = { id: data.id, url: data.url, score: data.overallScore, createdAt: data.createdAt }
        const updated = [item, ...history.filter((h: any) => h.id !== data.id)].slice(0, 50)
        localStorage.setItem(key, JSON.stringify(updated))
      } catch {}
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }, [params.id])

  useEffect(() => { fetchReport() }, [fetchReport])

  if (loading) return <LoadingAnimation />
  if (error || !report) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-400 mb-4">{error || "Report not found"}</p>
        <Link href="/" className="text-emerald-500 hover:underline">Back to home</Link>
      </div>
    </div>
  )

  const freeCategories = report.categories.filter(c => c.isFree)
  const paidCategories = report.categories.filter(c => !c.isFree)
  const hasLocked = !report.isPaid && paidCategories.length > 0

  return (
    <div className="min-h-screen pb-20">
      <nav className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-dark-300 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" /><ClipboardCheck className="w-5 h-5 text-emerald-500" />
            <span className="font-bold hidden sm:inline">ShipChecklist<span className="text-emerald-500">.ai</span></span>
          </Link>
          <a href={report.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-dark-400 hover:text-white transition truncate max-w-[200px]">
            {extractDomain(report.url)} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Pre-Launch Audit Results ✅</h1>
          <div className="flex justify-center mb-6"><ScoreCircle score={report.overallScore} /></div>
          <div className="flex justify-center gap-6 mb-4">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-500" /><span className="text-green-400 font-bold">{report.passedCount} passed</span></div>
            <div className="flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500" /><span className="text-red-400 font-bold">{report.failedCount} failed</span></div>
            <div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-yellow-500" /><span className="text-yellow-400 font-bold">{report.warningCount} warnings</span></div>
          </div>
          <p className="text-dark-200 max-w-2xl mx-auto text-lg">{report.summary}</p>
        </motion.div>

        <div className="space-y-6 mb-8">
          <h2 className="text-xl font-bold flex items-center gap-2"><Unlock className="w-5 h-5 text-green-500" /> {report.isPaid || paidCategories.length === 0 ? "Full Audit" : "Free Checks"}</h2>
          {freeCategories.map((cat, i) => <CheckCategoryCard key={i} category={cat} index={i} />)}
        </div>

        {hasLocked && (
          <div className="mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4"><Lock className="w-5 h-5 text-dark-400" /> Locked ({paidCategories.length} more categories)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {paidCategories.map((cat, i) => <CheckCategoryCard key={i} category={cat} index={i} locked />)}
            </div>
            <div className="glass-card border-emerald-500/30 text-center">
              <h3 className="text-2xl font-bold mb-2">Unlock Full Audit ✅</h3>
              <p className="text-dark-300 mb-2">All {report.categories.length} categories with 50+ checks</p>
              <div className="text-4xl font-black text-emerald-500 mb-1">${PRICE}</div>
              <p className="text-sm text-dark-400 mb-6">One-time | USDT on Polygon</p>
              <button onClick={() => setShowPayment(true)}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-bold text-lg transition glow-green">
                Unlock Full Report
              </button>
            </div>
          </div>
        )}

        {report.isPaid && paidCategories.length > 0 && (
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2"><Unlock className="w-5 h-5 text-green-500" /> Full Audit</h2>
            {paidCategories.map((cat, i) => <CheckCategoryCard key={i} category={cat} index={i + freeCategories.length} />)}
          </div>
        )}

        <div className="mt-12 mb-8"><ShareButtons score={report.overallScore} url={report.url} /></div>
        <div className="text-center space-y-2">
          <Link href="/" className="text-emerald-500 hover:underline text-sm block">Check another site →</Link>
          <a href="https://roastpage-ai.com" className="text-orange-400 hover:underline text-sm block">Also try: RoastPage.ai - AI Landing Page Roaster 🔥</a>
        </div>
      </div>

      {showPayment && <PaymentModal reportId={params.id} walletAddress={WALLET} price={PRICE} onSuccess={() => { setShowPayment(false); fetchReport() }} onClose={() => setShowPayment(false)} />}
    </div>
  )
}