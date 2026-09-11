# Photography frontend (`web/photography/`)

Next.js 14 gallery, admin upload/delete, and GitHub-gated `/admin`.

Deploy as a Vercel project with **Root Directory** `web/photography`. FastAPI is bundled via [`vercel.json`](vercel.json) for mutations only.

Pipeline: [`../../docs/upload.md`](../../docs/upload.md). Backend details: [`../../app/README.md`](../../app/README.md).

## Data flow

| Concern | Path |
|---------|------|
| Public gallery reads | Browser → Supabase (`photographs` table, anon key + RLS) |
| Admin upload / delete | Browser → FastAPI `POST /upload`, `DELETE /delete/{id}` (Bearer JWT) |

## Setup

```bash
npm install
cp web/photography/.env.local.example web/photography/.env.local
npm run dev:photography   # http://localhost:3001
```

Vercel env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, plus FastAPI secrets (`DATABASE_URL`, `SUPABASE_*`, admin auth) on the photography project.

## Commands

```bash
npm run dev -w @portfolio/photography
npm run lint -w @portfolio/photography
npm run test:run -w @portfolio/photography
npm run build -w @portfolio/photography
```

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Intro + gallery |
| `/admin` | GitHub OAuth for admins |

See [`../../AGENTS.md`](../../AGENTS.md) for lint/test conventions.
