export interface CheckReport {
  id: string
  url: string
  overallScore: number
  passedCount: number
  failedCount: number
  warningCount: number
  summary: string
  categories: CheckCategory[]
  isPaid: boolean
  createdAt: string
}

export interface CheckCategory {
  name: string
  icon: string
  checks: CheckItem[]
  isFree: boolean
}

export interface CheckItem {
  name: string
  status: "pass" | "fail" | "warning" | "info"
  description: string
  fix: string
  priority: "critical" | "high" | "medium" | "low"
}

export interface PaymentRecord {
  id: string
  reportId: string
  amount: number
  currency: string
  txHash: string
  status: "pending" | "confirmed" | "failed"
  createdAt: string
}