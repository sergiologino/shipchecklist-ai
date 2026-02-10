"use client"
import { motion } from "framer-motion"
import { CheckCircle2, XCircle, AlertTriangle, Info, Lock } from "lucide-react"
import { CheckCategory } from "@/lib/types"
import { getStatusBg } from "@/lib/utils"

function StatusIcon({ status }: { status: string }) {
  if (status === "pass") return <CheckCircle2 className="w-5 h-5 text-green-500" />
  if (status === "fail") return <XCircle className="w-5 h-5 text-red-500" />
  if (status === "warning") return <AlertTriangle className="w-5 h-5 text-yellow-500" />
  return <Info className="w-5 h-5 text-dark-400" />
}

export default function CheckCategoryCard({ category, index, locked }: { category: CheckCategory; index: number; locked?: boolean }) {
  const passed = category.checks.filter(c => c.status === "pass").length
  const failed = category.checks.filter(c => c.status === "fail").length
  const warnings = category.checks.filter(c => c.status === "warning").length
  const total = category.checks.length

  if (locked) {
    return (
      <div className="glass-card opacity-50 relative overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-sm bg-dark-950/60 z-10 flex items-center justify-center">
          <Lock className="w-8 h-8 text-dark-400" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.icon}</span>
          <div>
            <h3 className="font-semibold">{category.name}</h3>
            <p className="text-sm text-dark-500">Unlock to see checks</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="glass-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.icon}</span>
          <div>
            <h3 className="font-bold text-lg">{category.name}</h3>
            <div className="flex gap-3 text-xs mt-1">
              {passed > 0 && <span className="text-green-400">{passed} passed</span>}
              {failed > 0 && <span className="text-red-400">{failed} failed</span>}
              {warnings > 0 && <span className="text-yellow-400">{warnings} warnings</span>}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-black ${failed === 0 ? "text-green-500" : "text-red-500"}`}>
            {passed}/{total}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {category.checks.map((check, j) => (
          <div key={j} className={`rounded-lg p-3 border ${check.status === "fail" ? "bg-red-500/5 border-red-500/20" : check.status === "warning" ? "bg-yellow-500/5 border-yellow-500/20" : "bg-dark-800/30 border-dark-700/30"}`}>
            <div className="flex items-start gap-3">
              <StatusIcon status={check.status} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">{check.name}</h4>
                  {check.priority === "critical" && check.status === "fail" && (
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-red-500/20 text-red-400 border border-red-500/30 uppercase font-bold">critical</span>
                  )}
                </div>
                <p className="text-dark-300 text-sm mt-0.5">{check.description}</p>
                {check.fix && check.status !== "pass" && (
                  <div className="mt-2 bg-emerald-500/10 border border-emerald-500/20 rounded p-2">
                    <p className="text-emerald-400 text-xs">Fix: {check.fix}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}