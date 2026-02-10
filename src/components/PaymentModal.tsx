"use client"
import { useState } from "react"
import { Copy, Check, Loader2, Wallet, X, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface Props { reportId: string; walletAddress: string; price: number; onSuccess: () => void; onClose: () => void }

export default function PaymentModal({ reportId, walletAddress, price, onSuccess, onClose }: Props) {
  const [txHash, setTxHash] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [copied, setCopied] = useState(false)

  async function copyW() {
    await navigator.clipboard.writeText(walletAddress)
    setCopied(true); toast.success("Wallet address copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  async function verify() {
    if (!txHash.trim()) { toast.error("Please enter transaction hash"); return }
    if (!txHash.startsWith("0x") || txHash.length < 60) { toast.error("Invalid transaction hash"); return }
    setVerifying(true)
    try {
      const res = await fetch("/api/payment/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reportId, txHash: txHash.trim() }) })
      const data = await res.json()
      if (res.ok && data.status === "confirmed") { toast.success("Payment verified!"); onSuccess() }
      else toast.error(data.error || "Verification failed")
    } catch { toast.error("Network error") }
    finally { setVerifying(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-card max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-dark-400 hover:text-white"><X className="w-5 h-5" /></button>
        <div className="text-center mb-6">
          <Wallet className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold">Unlock Full Audit</h3>
          <div className="text-3xl font-black text-emerald-500 mt-2">${price}</div>
          <p className="text-dark-400 text-sm mt-1">USDT on Polygon</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-dark-200 block mb-2">Step 1: Send {price} USDT (Polygon) to:</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-dark-800 px-3 py-2.5 rounded-lg text-xs text-dark-200 break-all font-mono">{walletAddress}</code>
              <button onClick={copyW} className="flex-shrink-0 p-2.5 bg-dark-700 rounded-lg hover:bg-dark-600 transition">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-dark-500 mt-1">Use <strong className="text-purple-400">Polygon network</strong>, not Ethereum!</p>
          </div>
          <div>
            <label className="text-sm font-semibold text-dark-200 block mb-2">Step 2: Paste transaction hash:</label>
            <input type="text" value={txHash} onChange={e => setTxHash(e.target.value)} placeholder="0x..."
              className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono" />
          </div>
          <button onClick={verify} disabled={verifying || !txHash.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-xl text-white font-bold transition disabled:opacity-50 flex items-center justify-center gap-2">
            {verifying ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : "Verify Payment & Unlock"}
          </button>
          <a href="https://polygonscan.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 text-xs text-dark-400 hover:text-dark-200 transition">
            View on PolygonScan <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}