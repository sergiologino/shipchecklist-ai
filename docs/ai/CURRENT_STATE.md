# ShipChecklist.ai — Current State

> Last updated: 2026-02-15

## Status: MVP deployed on Vercel

## What Works
- URL input and comprehensive audit via GPT-4o Vision
- Screenshot capture via Thum.io
- Page content + HTTP headers extraction for analysis
- 50+ checks across 10 categories
- Report storage in Supabase (`ship_reports`, `ship_payments`)
- Freemium model (3 free categories + paid unlock)
- USDT payment on Polygon with on-chain verification
- Report sharing with dynamic OG images
- LocalStorage-based history (last 50 audits)
- Promo code system (in-memory, 4 codes)
- Social sharing buttons
- Google Analytics integration

## Known Issues / Bugs
- **ShareButtons.tsx references `roastpage-ai.com`** instead of `shipchecklist-ai` domain (copy-paste bug from sibling project)
- **ScoreCircle.tsx**: unused import of `getStatusColor`
- Promo code usage tracked in-memory — resets on every deploy/restart
- No rate limiting on API endpoints
- No authentication / user accounts

## Unknown / TBD
- **Testing**: no test framework configured, no tests exist. → TBD
- **CI/CD**: no pipeline configs found. → TBD
- **Monitoring**: no error tracking (Sentry, etc.) beyond GA. → TBD
- **Supabase migrations**: no migration files found. Schema managed manually? → TBD
- **Custom domain**: only `shipchecklist-ai.vercel.app` found. Custom domain planned? → TBD

## Security Concerns
- `.env.local` contains real API keys — verify it's in `.gitignore`
- No rate limiting → potential abuse of OpenAI API
- Shares same Supabase instance and wallet as roastpage-ai
