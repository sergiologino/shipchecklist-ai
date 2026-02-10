import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/store"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const report = await store.getReport(params.id)
  if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 })

  if (!report.isPaid) {
    return NextResponse.json({
      ...report,
      categories: report.categories.map(cat => {
        if (cat.isFree) return cat
        return { ...cat, checks: [] }
      }),
    })
  }
  return NextResponse.json(report)
}