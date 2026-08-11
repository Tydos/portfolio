# Frontend (`client/`)

Next.js 14 (App Router) portfolio UI for **Prasad Jawale**: recruiter-first home page (About → Experience → Projects → Portfolio) plus project detail pages and a GitHub-gated admin gate for photography.

Part of the monorepo at the repo root. Product/design intent: [`../PRODUCT.md`](../PRODUCT.md), [`../DESIGN.md`](../DESIGN.md). Photography pipeline: [`../docs/upload.md`](../docs/upload.md).

## Stack

- **Next.js 14** App Router, **React 18**, **TypeScript**, **Tailwind 3**, Geist Sans
- Gallery: `react-photo-album`; project READMEs via `react-markdown`
- Auth (admin): Supabase JS + GitHub OAuth
- Analytics: `@vercel/analytics`
- Tests: Vitest (`npm run test:run` / `test:coverage`)
- Lint: ESLint via `eslint-config-next` (`npm run lint`)

## Layout

```
client/
├── app/                 # Routes: home, projects/[slug], admin, api/images
├── components/          # sections/, layout/, cards/, ui/
├── constants/           # resume, featured projects, site config
├── lib/                 # photos, projects, supabase, auth, hooks
├── types/
└── package.json
```

## How data flows

| Concern | Path |
|---------|------|
| Public gallery reads | Browser → Next `GET /api/images` → Supabase (`photographs`) |
| Featured projects | Curated list in `constants/featuredProjects.ts` (not a remote projects API) |
| Admin upload / delete | Browser → FastAPI `POST /upload`, `DELETE /delete/{id}` with Supabase Bearer JWT |

Set `NEXT_PUBLIC_API_URL` (no trailing slash) so admin mutations reach FastAPI. Locally that is usually `http://localhost:8000`. On Vercel, FastAPI is mounted under `/api` (see root [`vercel.json`](../vercel.json)).

Full upload/delete details: [`../docs/upload.md`](../docs/upload.md).

## Setup

```bash
cd client
cp .env.local.example .env.local
npm install
```

Minimum for local gallery reads (see `.env.local.example`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or anon key)
- Optional server-only: `SUPABASE_ANON_KEY` / `SUPABASE_URL` for `/api/images`

For admin upload/delete from the UI:

- `NEXT_PUBLIC_API_URL=http://localhost:8000`
- FastAPI running with root `.env` configured (see [`../app/README.md`](../app/README.md))

## Commands

```bash
npm run dev          # http://localhost:3000
npm run build
npm run start
npm run lint
npm run lint -- --fix
npm run test:run
npm run test:coverage
```

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Home: About, Experience, Projects, Portfolio |
| `/projects/[slug]` | Featured project detail + cleaned GitHub README |
| `/admin` | GitHub OAuth gate; admins use Portfolio section for upload/delete |
| `/api/images` | Public paginated photos (`limit`, `offset`) |

## Style / tests

When changing TypeScript under `client/`:

1. Lint/format with `npm run lint` (autofix: `npm run lint -- --fix`)
2. Add or update Vitest next to touched modules (`*.test.ts` under `lib/` / `app/`)
3. Prefer TypeScript, explicit exported types, no `any`
4. Google-style JSDoc on exported functions and non-obvious helpers

See [`../AGENTS.md`](../AGENTS.md) for the full checklist.
