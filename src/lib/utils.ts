export function isValidUrl(s: string): boolean {
  try { const u = new URL(s); return u.protocol === "http:" || u.protocol === "https:" } catch { return false }
}
export function normalizeUrl(url: string): string {
  let c = url.trim(); if (!c.startsWith("http://") && !c.startsWith("https://")) c = "https://" + c; return c
}
export function extractDomain(url: string): string {
  try { return new URL(url).hostname } catch { return url }
}
export function getStatusColor(status: string): string {
  if (status === "pass") return "#22c55e"
  if (status === "warning") return "#eab308"
  if (status === "fail") return "#ef4444"
  return "#64748b"
}
export function getStatusBg(status: string): string {
  if (status === "pass") return "bg-green-500/20 text-green-400 border-green-500/30"
  if (status === "warning") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  if (status === "fail") return "bg-red-500/20 text-red-400 border-red-500/30"
  return "bg-gray-500/20 text-gray-400 border-gray-500/30"
}