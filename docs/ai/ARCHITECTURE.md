# ShipChecklist.ai — Architecture

## Tech Stack
- **Framework**: Next.js 14.2.21 (App Router)
- **Language**: TypeScript 5.7.2
- **UI**: React 18.3.1, Tailwind CSS 3.4.17, Framer Motion 11.15.0
- **Icons**: Lucide React
- **Toasts**: Sonner
- **IDs**: nanoid
- **Database**: Supabase (PostgreSQL) via `@supabase/supabase-js` 2.47.12
- **AI**: OpenAI SDK 4.77.0
- **Deployment**: Vercel

## Directory Structure
```
src/
├── app/
│   ├── layout.tsx              # Root layout (metadata, GA, Sonner)
│   ├── page.tsx                # Homepage (URL input, features, pricing, FAQ)
│   ├── globals.css             # Global styles (dark theme, emerald/cyan accents)
│   ├── history/page.tsx        # LocalStorage-based history
│   ├── report/[id]/page.tsx    # Report detail page (checklist view)
│   ├── share/[id]/             # Share pages (metadata + redirect)
│   └── api/
│       ├── check/route.ts      # Main audit endpoint (POST)
│       ├── report/[id]/route.ts# Get report (GET)
│       ├── payment/verify/route.ts # Payment verification (POST)
│       ├── health/route.ts     # Health check (GET)
│       └── og/route.tsx        # OG image generation (GET, Edge)
├── components/
│   ├── CheckCategoryCard.tsx   # Category card with pass/fail/warning checks
│   ├── ScoreCircle.tsx         # Circular score visualization
│   ├── PaymentModal.tsx        # USDT payment flow
│   ├── LoadingAnimation.tsx    # Multi-stage loading indicator
│   └── ShareButtons.tsx        # Social sharing
└── lib/
    ├── prompts.ts              # AI system & user prompts
    ├── store.ts                # Supabase CRUD operations
    ├── supabase.ts             # Supabase client init
    ├── types.ts                # TypeScript interfaces
    └── utils.ts                # URL validation, status colors, etc.
```

## Database Tables (Supabase)

### `ship_reports`
| Column | Type | Notes |
|--------|------|-------|
| id | string (PK) | nanoid |
| url | string | Audited URL |
| overall_score | number | 0–100 |
| passed_count | number | Number of passed checks |
| failed_count | number | Number of failed checks |
| warning_count | number | Number of warnings |
| summary | string | AI summary |
| categories | json[] | CheckCategory objects |
| is_paid | boolean | Payment status |
| created_at | timestamp | Auto |

### `ship_payments`
| Column | Type | Notes |
|--------|------|-------|
| id | string (PK) | nanoid |
| report_id | string (FK) | → ship_reports.id |
| amount | number | 7.99 |
| currency | string | "USDT" |
| tx_hash | string | Polygon tx hash |
| status | string | pending/confirmed/failed |
| created_at | timestamp | Auto |

## API Routes

| Method | Path | Purpose |
|--------|------|---------|
| POST | /api/check | Audit URL → AI → save report |
| GET | /api/report/[id] | Get report (hides locked categories if !paid) |
| POST | /api/payment/verify | Verify USDT tx on Polygon |
| GET | /api/health | Health check |
| GET | /api/og | Dynamic OG image (Edge runtime) |

## AI Model
- **Model**: `gpt-4o` (single model, no tier split like roastpage)
- Analyzes screenshot (Vision) + page content + HTTP headers

## Audit Categories (10 total)
1. SEO Basics
2. Performance
3. Mobile Ready
4. Security
5. Legal & Compliance
6. Branding & Assets
7. Analytics & Tracking
8. Accessibility
9. Links & Navigation
10. Launch Readiness

Free categories: first 3 (SEO, Performance, Mobile).

## Check Item Structure
Each check returns:
- **status**: pass / fail / warning / info
- **name**: check title
- **description**: what was found
- **fix**: how to fix it
- **priority**: critical / high / medium / low

## Payment Flow
Same as RoastPage.ai — USDT on Polygon, on-chain verification, same wallet address.

## Environment Variables
```
OPENAI_API_KEY            # OpenAI API key
SUPABASE_URL              # Supabase project URL
SUPABASE_ANON_KEY         # Supabase anon key
USDT_WALLET_ADDRESS       # Server-side wallet address
NEXT_PUBLIC_USDT_WALLET   # Client-side wallet address
```
