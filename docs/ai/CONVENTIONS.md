# ShipChecklist.ai — Conventions

## File & Folder Structure
- Next.js App Router: all pages in `src/app/`
- API routes in `src/app/api/`
- Reusable components in `src/components/`
- Shared logic, types, configs in `src/lib/`

## Naming
- Components: PascalCase (`CheckCategoryCard.tsx`, `ScoreCircle.tsx`)
- Lib files: camelCase (`prompts.ts`, `store.ts`, `utils.ts`)
- API routes: `route.ts` inside named folders
- Types: PascalCase interfaces in `lib/types.ts`
- DB tables: snake_case with `ship_` prefix (`ship_reports`, `ship_payments`)

## Styling
- Tailwind CSS with custom dark theme palette (`dark-50` to `dark-950`)
- Emerald/cyan accent colors
- Glass morphism effects via custom CSS classes in `globals.css`
- Framer Motion for animations (check-bounce keyframe)
- No CSS modules, no styled-components

## Code Patterns
- `"use client"` directive on interactive components
- Server components by default
- Supabase operations abstracted in `lib/store.ts`
- AI prompts separated into `lib/prompts.ts`
- nanoid for ID generation
- Status-based coloring: pass=green, fail=red, warning=yellow, info=blue

## API Patterns
- Next.js Route Handlers (App Router style)
- JSON request/response
- Error responses: `{ error: string }` with appropriate HTTP status

## Package Manager
- npm (package-lock.json present)

## Scripts
- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — start production server
