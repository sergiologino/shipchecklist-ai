"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ClipboardCheck } from "lucide-react"

export default function ShareRedirect({ id }: { id: string }) {
  const router = useRouter()
  useEffect(() => { router.replace(`/report/${id}`) }, [id, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <ClipboardCheck className="w-12 h-12 text-emerald-500 animate-pulse mx-auto mb-4" />
        <p className="text-dark-300">Loading your audit...</p>
      </div>
    </div>
  )
}