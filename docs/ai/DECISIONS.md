# ShipChecklist.ai — Decisions Log

> Architecture and design decisions inferred from the codebase.

## D-001: Fork of RoastPage.ai Architecture
- **Choice**: Same tech stack and structure as roastpage-ai
- **Why (inferred)**: Rapid development by reusing proven architecture
- **Evidence**: Nearly identical file structure, same deps, same Supabase instance, same wallet

## D-002: Checklist vs. Scoring Approach
- **Choice**: Pass/fail/warning checks instead of percentage scores per category
- **Why (inferred)**: Checklists are more actionable for pre-launch verification
- **Trade-off**: Less nuanced than scoring, but clearer pass/fail signals

## D-003: Single AI Model (GPT-4o for all)
- **Choice**: GPT-4o for both free and paid (no mini model for free tier)
- **Why (inferred)**: Checklist format needs consistent quality even for free users
- **Trade-off**: Higher API costs per analysis compared to roastpage-ai free tier

## D-004: 10 Audit Categories
- **Choice**: 10 categories covering SEO, Performance, Mobile, Security, Legal, Branding, Analytics, Accessibility, Links, Launch Readiness
- **Why (inferred)**: Comprehensive pre-launch checklist coverage
- **Free tier**: First 3 categories (SEO, Performance, Mobile)

## D-005: Shared Infrastructure with RoastPage
- **Choice**: Same Supabase instance, same USDT wallet
- **Why (inferred)**: Simplicity, shared revenue stream
- **Trade-off**: Tight coupling between projects; Supabase tables distinguished by prefix (`ship_`)

## D-006: No Auth (Same as RoastPage)
- **Choice**: No user accounts
- **Why (inferred)**: Reduce friction for single-use audit tool

## D-007: Lower Price Point ($7.99 vs $9.99)
- **Choice**: $7.99 per full audit vs $9.99 on roastpage
- **Why (inferred)**: Possibly lower perceived value for checklist vs. detailed roast, or pricing experiment
