# Personal Portfolio (monorepo)

Full-stack portfolio for **Prasad Jawale** — two Next.js frontends plus a shared FastAPI backend for photography.

| App | Path | Purpose |
|-----|------|---------|
| Recruiter | [`web/recruiter/`](web/recruiter/) | Resume, projects, publication proof |
| Photography | [`web/photography/`](web/photography/) | Gallery (Supabase reads), admin + FastAPI mutations |
| API | [`app/`](app/) | FastAPI (upload/delete; deployed with photography on Vercel) |
| Design tokens | [`packages/theme/`](packages/theme/) | Shared Tailwind preset and base CSS |

- Product: [`PRODUCT.md`](PRODUCT.md)
- Design: [`DESIGN.md`](DESIGN.md)
- Changelog: [`docs/CHANGELOG.md`](docs/CHANGELOG.md)
- Photography pipeline: [`docs/upload.md`](docs/upload.md)
- Recruiter frontend: [`web/recruiter/README.md`](web/recruiter/README.md)
- Photography frontend: [`web/photography/README.md`](web/photography/README.md)
- Backend: [`app/README.md`](app/README.md)

## Setup

```bash
cp .env.example .env
npm install
cp web/recruiter/.env.local.example web/recruiter/.env.local
cp web/photography/.env.local.example web/photography/.env.local
```

Set cross-links in production:

- `NEXT_PUBLIC_PHOTOGRAPHY_URL` on the recruiter project
- `NEXT_PUBLIC_RECRUITER_URL` on the photography project

## Running locally

**Recruiter** (http://localhost:3000):

```bash
npm run dev:recruiter
```

**Photography** (http://localhost:3001):

```bash
npm run dev:photography
```

**Backend** (http://localhost:8000 — required for photo admin):

```bash
pip install -r app/requirements.txt
cd app && uvicorn main:app --reload --port 8000
```

## Vercel (two projects)

Create **two** Vercel projects from this repo:

1. **Recruiter** — Root Directory: `web/recruiter` (Next.js only; root `vercel.json` also targets this app).
2. **Photography** — Root Directory: `web/photography` (uses [`web/photography/vercel.json`](web/photography/vercel.json) for Next.js + FastAPI under `/api`).

Configure env vars on each project as in the respective `.env.local.example` files.

## Tests / lint

```bash
npm run lint
npm run test

# Backend
cd app && ruff check . && ruff format . && pytest tests/ -v
```
