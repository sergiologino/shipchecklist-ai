import { supabase } from "./supabase"
import { CheckReport, PaymentRecord } from "./types"

export const store = {
  async getReport(id: string): Promise<CheckReport | undefined> {
    const { data } = await supabase.from("ship_reports").select("*").eq("id", id).single()
    if (!data) return undefined
    return { id: data.id, url: data.url, overallScore: data.overall_score, passedCount: data.passed_count,
      failedCount: data.failed_count, warningCount: data.warning_count, summary: data.summary,
      categories: data.categories, isPaid: data.is_paid, createdAt: data.created_at }
  },
  async setReport(r: CheckReport): Promise<void> {
    await supabase.from("ship_reports").insert({
      id: r.id, url: r.url, overall_score: r.overallScore, passed_count: r.passedCount,
      failed_count: r.failedCount, warning_count: r.warningCount, summary: r.summary,
      categories: r.categories, is_paid: r.isPaid, created_at: r.createdAt })
  },
  async updateReport(id: string, u: Partial<CheckReport>): Promise<CheckReport | undefined> {
    const updates: any = {}
    if (u.isPaid !== undefined) updates.is_paid = u.isPaid
    await supabase.from("ship_reports").update(updates).eq("id", id)
    return this.getReport(id)
  },
  async setPayment(p: PaymentRecord): Promise<void> {
    await supabase.from("ship_payments").insert({
      id: p.id, report_id: p.reportId, amount: p.amount, currency: p.currency,
      tx_hash: p.txHash, status: p.status, created_at: p.createdAt })
  },
}