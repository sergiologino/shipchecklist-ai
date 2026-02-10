"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ClipboardCheck, ArrowLeft, ExternalLink, Trash2, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { extractDomain } from "@/lib/utils"

interface HistoryItem { id: string; url: string; score: number; createdAt: string }

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem("shipchecklist_history")
      if (stored) setHistory(JSON.parse(stored))
    } catch {}
  }, [])

  function clearAll() {
    setHistory([])
    localStorage.removeItem("shipchecklist_history")
  }

  return (
    <div className="min-h-screen pb-20">
      <nav className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-dark-300 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
            <ClipboardCheck className="w-5 h-5 text-emerald-500" />
            <span className="font-bold">ShipChecklist<span className="text-emerald-500">.ai</span></span>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <Clock className="w-7 h-7 text-emerald-500" /> My Audits
          </h1>
          {history.length > 0 && (
            <button onClick={clearAll} className="flex items-center gap-1 text-sm text-dark-400 hover:text-red-400 transition">
              <Trash2 className="w-4 h-4" /> Clear all
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-20">
            <ClipboardCheck className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-dark-300 mb-2">No audits yet</h2>
            <p className="text-dark-400 mb-6">Run your first pre-launch check to see it here</p>
            <Link href="/" className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-bold transition glow-green">
              Run Audit
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/report/${item.id}`} className="glass-card flex items-center justify-between hover:border-emerald-500/30 transition-colors block">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-black"
                      style={{ color: item.score >= 80 ? "#22c55e" : item.score >= 60 ? "#eab308" : "#ef4444", border: `2px solid ${item.score >= 80 ? "#22c55e" : item.score >= 60 ? "#eab308" : "#ef4444"}` }}>
                      {item.score}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold truncate flex items-center gap-1">
                        {extractDomain(item.url)} <ExternalLink className="w-3 h-3 text-dark-400 flex-shrink-0" />
                      </div>
                      <div className="text-xs text-dark-400">
                        {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <span className="text-dark-400 text-sm flex-shrink-0 ml-4">View →</span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}