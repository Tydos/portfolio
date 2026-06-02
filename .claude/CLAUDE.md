# Portfolio Project — CLAUDE.md

## Project Overview

Full-stack personal portfolio website. Next.js (TypeScript) frontend + FastAPI (Python) backend, deployed together on Vercel. Photos stored in Supabase; projects pulled live from GitHub API.

---

## Running the Project

### Frontend (Next.js)
```bash
cd client
npm install       # first time only
npm run dev       # http://localhost:3000
```

### Backend (FastAPI)
```bash
pip install -r app/requirements.txt        # first time only
uvicorn app.main:app --reload --port 8000  # http://localhost:8000
```
Must run from the **repo root** — all imports use `app.*` package paths.

### Environment Variables
Copy `.env.example` to `.env` at the repo root and fill in values:
```
DATABASE_URL=       # Supabase PostgreSQL connection string
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ADMIN_API_KEY=      # secret key for upload endpoints
SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_BUCKET=
```

Frontend reads `NEXT_PUBLIC_API_URL` (set in Vercel or locally in `client/.env.local`).  
Default backend URL: `https://portfolio-backend-server-phi.vercel.app`

---

## Project Structure

```
portfolio/
├── client/               # Next.js 14 frontend (TypeScript)
│   ├── app/              # App Router pages
│   │   ├── layout.tsx    # Root layout — Geist font, Vercel Analytics
│   │   ├── page.tsx      # Home (server component, fetches GitHub projects)
│   │   ├── gallery/page.tsx        # Photo gallery with upload/search/filter
│   │   └── projects/[slug]/page.tsx # Dynamic project detail with README
│   ├── components/
│   │   ├── HomeClient.tsx          # Main client orchestrator
│   │   ├── sections/               # Splash, About, Resume, Projects, Photography, Contact, Gallery
│   │   ├── cards/                  # ProjectCard, PhotoCard, SkillStack
│   │   └── layout/                 # Navbar, Footer
│   ├── lib/
│   │   ├── api.ts        # fetchPhotos, uploadPhotos — calls FastAPI backend
│   │   ├── github.ts     # fetchGithubProjects, fetchGithubProject — GitHub REST API
│   │   └── api.test.ts   # Vitest unit tests
│   ├── constants/
│   │   ├── config.ts     # API_CONFIG, GITHUB_USERNAME ("Tydos"), NAV_ITEMS, API_ENDPOINTS
│   │   └── resume.ts     # Static resume data: skills, experience, education, publications
│   ├── types/index.ts    # Shared TypeScript interfaces
│   ├── next.config.mjs   # Image domains: Cloudinary, GitHub raw, Supabase
│   ├── package.json      # Next.js 14.2, React 18, Tailwind 3, Vitest 3
│   └── tsconfig.json     # strict mode, paths alias @/*
│
├── app/                  # FastAPI backend (Python 3.11)
│   ├── main.py           # App entry, CORS middleware, lifespan startup
│   ├── data.py           # Static fallback photo data (13 sample photos)
│   ├── api/routes.py     # All endpoints (see API Routes below)
│   ├── auth/auth.py      # Admin API key dependency
│   ├── schemas/
│   │   ├── config.py     # Settings (pydantic-settings): DB, Supabase, CORS, API keys
│   │   └── photo.py      # Photo pydantic model
│   ├── services/
│   │   ├── database.py         # DatabaseManager — psycopg2 connection pool
│   │   ├── cloud_storage.py    # CloudinaryUploader, SupabaseUploader
│   │   └── photo_upload.py     # PhotoUploadService — upload + DB persistence
│   ├── tests/
│   │   ├── test_api.py         # pytest integration tests
│   │   └── wrk_benchmark.sh    # Load testing (requires brew install wrk)
│   └── requirements.txt
│
├── .github/workflows/
│   ├── frontend-tests.yml  # Lint + Vitest on push/PR to main (working-dir: client)
│   └── server-tests.yml    # ruff lint + pytest on push to main (working-dir: server ⚠️ bug: should be app/)
│
├── vercel.json             # Vercel multi-service config (web → client/, api → app/main.py)
├── .env.example
└── README.md               # Minimal (2 lines)
```

---

## API Routes (FastAPI)

Base URL in production: `https://portfolio-backend-server-phi.vercel.app`  
Mounted at `/_/app` on the combined Vercel deployment.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/images` | — | Paginated photos; falls back to static data if DB unavailable |
| POST | `/api/upload` | Admin key | Upload single JPEG to Supabase |
| POST | `/api/upload-batch` | Admin key | Upload multiple JPEGs to Supabase |
| GET | `/api/health` | — | Health check with DB connectivity status |
| GET | `/` | — | Welcome message |

Admin endpoints require `X-Admin-Key: <ADMIN_API_KEY>` header.

---

## Tech Stack

### Frontend
| Layer | Choice |
|-------|--------|
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript 6 (strict) |
| Styling | Tailwind CSS 3.4 + typography plugin |
| UI | react-feather, react-photo-album, react-github-calendar |
| Markdown | next-mdx-remote, react-markdown, rehype-highlight |
| Analytics | @vercel/analytics |
| Font | Geist Sans |
| Tests | Vitest 3.2 + @vitest/coverage-v8 |

### Backend
| Layer | Choice |
|-------|--------|
| Framework | FastAPI 0.133.1 |
| Server | Uvicorn 0.41 |
| Language | Python 3.11 |
| Database | PostgreSQL via Supabase (psycopg2-binary) |
| Storage | Supabase Storage (primary), Cloudinary (legacy) |
| Validation | Pydantic 2.12.5 |
| Image ops | Pillow |
| Tests | pytest |
| Linting | ruff |

---

## Key Conventions

- GitHub username constant lives in `client/constants/config.ts` as `GITHUB_USERNAME = "Tydos"`.
- All API calls to the backend go through `client/lib/api.ts`; GitHub calls go through `client/lib/github.ts`.
- Resume content is fully static in `client/constants/resume.ts` — no API calls needed.
- The gallery page handles its own upload flow; admin key is never exposed client-side (would need a server action or proxy for production security).
- Photos fall back to static data in `app/data.py` when Supabase is unreachable — gallery always renders something.
- `server-tests.yml` has a bug: `working-directory: server` should be `working-directory: app`.

---

## Deployment (Vercel)

`vercel.json` configures two services:
- **web** → `client/` directory (Next.js, route prefix `/`)
- **api** → `app/main.py` (FastAPI, route prefix `/_/app`)

CI runs on GitHub Actions before deploy. No auto-deploy config in repo — assumed set up in Vercel dashboard.
