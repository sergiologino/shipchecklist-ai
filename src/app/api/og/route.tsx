import { ImageResponse } from "next/og"
export const runtime = "edge"
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const score = searchParams.get("score") || "?"
  const site = searchParams.get("site") || ""
  const passed = searchParams.get("passed") || ""
  const failed = searchParams.get("failed") || ""

  const hasDetails = site || passed || failed

  return new ImageResponse(
    (
      <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#020617", color: "white", fontFamily: "sans-serif", padding: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <span style={{ fontSize: "48px" }}>✅</span>
          <span style={{ fontSize: "40px", fontWeight: 800 }}>ShipChecklist.ai</span>
        </div>

        {hasDetails ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {site && (
              <div style={{ fontSize: "22px", color: "#94a3b8", marginBottom: "16px" }}>{decodeURIComponent(site)}</div>
            )}
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "16px" }}>
              <span style={{ fontSize: "72px", fontWeight: 900, color: Number(score) >= 80 ? "#22c55e" : Number(score) >= 60 ? "#eab308" : Number(score) >= 40 ? "#f97316" : "#ef4444" }}>{score}</span>
              <span style={{ fontSize: "28px", color: "#64748b" }}>/100</span>
            </div>
            {(passed || failed) && (
              <div style={{ display: "flex", gap: "24px", fontSize: "20px" }}>
                {passed && <span style={{ color: "#22c55e" }}>{passed} passed</span>}
                {failed && <span style={{ color: "#ef4444" }}>{failed} failed</span>}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: "24px", color: "#22c55e", fontWeight: 700 }}>Pre-Launch Website Audit</div>
            <div style={{ fontSize: "20px", color: "#94a3b8", marginTop: "16px" }}>50+ checks in 30 seconds</div>
          </div>
        )}
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
