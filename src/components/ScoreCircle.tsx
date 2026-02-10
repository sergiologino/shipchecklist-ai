"use client"
import { getStatusColor } from "@/lib/utils"

export default function ScoreCircle({ score, size = 140 }: { score: number; size?: number }) {
  const sw = 8
  const r = (size - sw) / 2
  const c = 2 * Math.PI * r
  const offset = c - (score / 100) * c
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : score >= 40 ? "#f97316" : "#ef4444"

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="score-circle">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e293b" strokeWidth={sw} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.5s ease-out" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black" style={{ color }}>{score}</span>
        <span className="text-xs text-dark-400 mt-1">/ 100</span>
      </div>
    </div>
  )
}