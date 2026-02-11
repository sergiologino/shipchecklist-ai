"use client"
import { Share2 } from "lucide-react"
import { toast } from "sonner"
import { extractDomain } from "@/lib/utils"

export default function ShareButtons({ score, url, reportId }: { score: number; url: string; reportId?: string }) {
  const domain = extractDomain(url)
  const shareUrl = reportId ? `https://shipchecklist-ai.vercel.app/share/${reportId}` : "https://shipchecklist-ai.vercel.app"
  const text = `${domain} scored ${score}/100 on ShipChecklist.ai pre-launch audit`

  const channels = [
    { name: "X Twitter", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}` },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
    { name: "Telegram", href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}` },
    { name: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}` },
  ]

  async function copyLink() { await navigator.clipboard.writeText(shareUrl); toast.success("Link copied!") }

  return (
    <div className="text-center">
      <p className="text-dark-400 mb-4 text-sm">Share your results</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {channels.map(ch => (
          <a key={ch.name} href={ch.href} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-sm font-medium transition hover:bg-white/10">
            {ch.name}
          </a>
        ))}
        <button onClick={copyLink} className="inline-flex items-center gap-2 px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-sm font-medium transition hover:bg-white/10">
          <Share2 className="w-3.5 h-3.5" /> Copy
        </button>
      </div>
    </div>
  )
}