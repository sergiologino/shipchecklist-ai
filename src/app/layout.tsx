import type { Metadata } from "next"
import Script from "next/script"
import { Toaster } from "sonner"
import "./globals.css"

export const metadata: Metadata = {
  title: "ShipChecklist.ai - Pre-Launch Website Audit | 50+ Checks in 30 Seconds",
  description: "AI checks your website for 50+ launch-readiness issues: SEO, performance, security, mobile, legal, accessibility. Never forget a critical item before launch again.",
  keywords: ["launch checklist", "website audit", "pre-launch check", "SEO audit", "website review", "launch ready", "site checker", "website launch", "pre-launch audit"],
  authors: [{ name: "ShipChecklist.ai" }],
  openGraph: {
    title: "ShipChecklist.ai - Never Launch Unprepared Again",
    description: "AI audits your website for 50+ launch-readiness issues in 30 seconds. SEO, security, performance, legal, accessibility.",
    type: "website",
    url: "https://shipchecklist-ai.vercel.app",
    siteName: "ShipChecklist.ai",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "ShipChecklist.ai - Pre-Launch Audit" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShipChecklist.ai - Pre-Launch Website Audit",
    description: "50+ automated checks before you launch. Never forget critical items again.",
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
        <link rel="canonical" href="https://shipchecklist-ai.vercel.app" />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-J77YBKV04K" strategy="afterInteractive" />
        <Script id="ga" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-J77YBKV04K');`}
        </Script>
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