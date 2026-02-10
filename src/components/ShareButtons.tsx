"use client"
import { Share2 } from "lucide-react"
import { toast } from "sonner"

export default function ShareButtons({ score, url }: { score: number; url: string }) {
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://shipchecklist-ai.vercel.app"
  const text = `My website scored ${score}/100 on the pre-launch checklist! ${siteUrl}`
  const enc = encodeURIComponent(text)
  const encUrl = encodeURIComponent(siteUrl)

  const channels = [
    { name: "Twitter", icon: "X", href: `https://twitter.com/intent/tweet?text=${enc}` },
    { name: "LinkedIn", icon: "in", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}` },
    { name: "Telegram", icon: "TG", href: `https://t.me/share/url?url=${encUrl}&text=${enc}` },
    { name: "WhatsApp", icon: "WA", href: `https://wa.me/?text=${enc}` },
  ]

  async function copyLink() { await navigator.clipboard.writeText(siteUrl); toast.success("Link copied!") }

  return (
    <div className="text-center">
      <p className="text-dark-400 mb-4 text-sm">Share your results</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {channels.map(ch => (
          <a key={ch.name} href={ch.href} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-sm font-medium transition hover:bg-white/10">
            {ch.icon} {ch.name}
          </a>
        ))}
        <button onClick={copyLink} className="inline-flex items-center gap-2 px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-xl text-sm font-medium transition hover:bg-white/10">
          <Share2 className="w-3.5 h-3.5" /> Copy
        </button>
      </div>
    </div>
  )
}