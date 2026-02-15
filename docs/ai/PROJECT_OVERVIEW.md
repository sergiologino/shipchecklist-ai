# ShipChecklist.ai — Project Overview

## What
AI-powered pre-launch website audit tool that checks 50+ items across 10 categories, giving a pass/fail/warning verdict with fix instructions for each.

## Target User
Founders, developers, indie hackers who need a comprehensive checklist before shipping a website or SaaS product.

## Business Model
Freemium:
- **Free**: 3 categories (~15 checks)
- **Full Audit ($7.99)**: all 10 categories (50+ checks) with detailed fixes and priorities
- **Promo codes**: LAUNCH2025, SHIPIT, PRODUCTHUNT, FRIEND — in-memory tracking, resets on deploy

## Payment
USDT on Polygon, one-time per report, on-chain verification via transaction hash.

## Core Flow
1. User enters URL
2. App fetches screenshot (Thum.io), extracts page content + HTTP headers
3. OpenAI GPT-4o Vision analyzes against checklist
4. Report saved to Supabase, displayed as pass/fail checklist
5. Paid unlock via USDT → on-chain verification → full report

## URLs / Domains
- Production: `shipchecklist-ai.vercel.app` (Vercel)
- Supabase project: `ohxqvvfrcolnyolmceua.supabase.co` (shared with roastpage-ai)

## Key Third-Party Services
| Service | Purpose |
|---------|---------|
| OpenAI (GPT-4o) | AI analysis |
| Supabase | Database (PostgreSQL) |
| Thum.io | Screenshot capture |
| Polygon RPC | Payment verification |
| Google Analytics (GT-K8HQMXXL) | Analytics |
| Vercel | Hosting & deployment |

## Relationship to RoastPage.ai
Both projects share the same Supabase instance and USDT wallet. ShipChecklist is a "sibling" product with a different analysis approach (checklist vs. scoring) but very similar architecture.
