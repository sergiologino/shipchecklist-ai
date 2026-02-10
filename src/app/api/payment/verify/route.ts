import { NextRequest, NextResponse } from "next/server"
import { store } from "@/lib/store"
import { nanoid } from "nanoid"

const WALLET = (process.env.USDT_WALLET_ADDRESS || "").toLowerCase()
const USDT_CONTRACT = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"

async function verifyOnChain(txHash: string): Promise<boolean> {
  try {
    const res = await fetch("https://polygon-rpc.com", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", method: "eth_getTransactionReceipt", params: [txHash], id: 1 }),
    })
    const data = await res.json()
    const receipt = data.result
    if (!receipt || receipt.status !== "0x1") return false
    return receipt.logs?.some((log: any) => {
      const isUSDT = log.address?.toLowerCase() === USDT_CONTRACT
      const isTransfer = log.topics?.[0] === TRANSFER_TOPIC
      const to = log.topics?.[2] ? "0x" + log.topics[2].slice(26).toLowerCase() : ""
      return isUSDT && isTransfer && to === WALLET
    }) || false
  } catch { return false }
}

export async function POST(request: NextRequest) {
  try {
    const { reportId, txHash } = await request.json()
    if (!reportId || !txHash) return NextResponse.json({ error: "Missing data" }, { status: 400 })
    const report = await store.getReport(reportId)
    if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 })
    if (report.isPaid) return NextResponse.json({ status: "confirmed" })
    const verified = await verifyOnChain(txHash)
    if (!verified) return NextResponse.json({ error: "Transaction not verified. Wait 30s and retry." }, { status: 400 })
    await store.setPayment({ id: nanoid(12), reportId, amount: 7.99, currency: "USDT", txHash, status: "confirmed", createdAt: new Date().toISOString() })
    await store.updateReport(reportId, { isPaid: true })
    return NextResponse.json({ status: "confirmed" })
  } catch (error: any) {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}