# Recruiter frontend (`web/recruiter/`)

Next.js 14 portfolio for hiring: About → Experience → Projects, with links to the separate photography site.

No Supabase or FastAPI on this app — external data is **GitHub REST API** only (`lib/projects.ts` README fetches). Deploy as a **Next.js-only** Vercel project (root [`vercel.json`](../../vercel.json) has no `api` service).

Product/design: [`../../PRODUCT.md`](../../PRODUCT.md), [`../../DESIGN.md`](../../DESIGN.md).

## Setup

From repo root:

```bash
npm install
cp web/recruiter/.env.local.example web/recruiter/.env.local
npm run dev:recruiter   # http://localhost:3000
```

Set `NEXT_PUBLIC_PHOTOGRAPHY_URL` in production to your photography site URL.

## Commands

```bash
npm run dev -w @portfolio/recruiter
npm run lint -w @portfolio/recruiter
npm run test:run -w @portfolio/recruiter
npm run build -w @portfolio/recruiter
```

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Home: About, Experience, Projects |
| `/projects/[slug]` | Featured project detail |

See [`../../AGENTS.md`](../../AGENTS.md) for lint/test conventions.
