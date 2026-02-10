import type { Metadata } from "next"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "ShipChecklist.ai - Pre-Launch Website Audit | 50+ Checks in 30 Seconds",
  description: "AI checks your website for 50+ launch-readiness issues: SEO, performance, security, mobile, legal, accessibility.",
  keywords: ["launch checklist", "website audit", "pre-launch check", "SEO audit"],
  openGraph: {
    title: "ShipChecklist.ai - Never Launch Without Checking First",
    description: "AI audits your website for 50+ launch-readiness issues in 30 seconds.",
    type: "website",
    url: "https://shipchecklist-ai.vercel.app",
    siteName: "ShipChecklist.ai",
    images: [{ url: "/api/og", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShipChecklist.ai - Pre-Launch Website Audit",
    description: "50+ automated checks before you launch.",
    images: ["/api/og"],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL("https://shipchecklist-ai.vercel.app"),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className="min-h-screen bg-dark-950 text-white antialiased">
        {children}
        <Toaster theme="dark" position="top-right"
          toastOptions={{ style: { background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", color: "#f1f5f9" } }}
        />
      </body>
    </html>
  )
}