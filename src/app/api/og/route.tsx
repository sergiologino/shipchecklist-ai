import { ImageResponse } from "next/og"
export const runtime = "edge"
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const score = searchParams.get("score") || "?"
  return new ImageResponse(
    (
      <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#020617", color: "white", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <span style={{ fontSize: "48px" }}>✅</span>
          <span style={{ fontSize: "40px", fontWeight: 800 }}>ShipChecklist.ai</span>
        </div>
        <div style={{ fontSize: "24px", color: "#22c55e", fontWeight: 700 }}>Pre-Launch Website Audit</div>
        <div style={{ fontSize: "20px", color: "#94a3b8", marginTop: "16px" }}>50+ checks in 30 seconds</div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}