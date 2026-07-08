# Portfolio Monorepo

Personal portfolio + full-stack image hosting platform.

All deployable apps live under [`apps/`](apps/) — frontend sites and the image API.

## Structure

| Package | Description | Port |
|---------|-------------|------|
| [`apps/portfolio`](apps/portfolio) | Personal site (About, Resume, Projects, Contact) | 3000 |
| [`apps/gallery`](apps/gallery) | Image gallery UI with lazy-loading grid + admin | 3001 |
| [`apps/image-api`](apps/image-api) | Express API — Sharp, S3, PostgreSQL, JWT, rate limiting | 8000 |
| [`packages/shared-types`](packages/shared-types) | Shared TypeScript types | — |

## Prerequisites

- **Node.js 20+**
- **Docker** — required for the image API (Postgres, LocalStack S3, Redis)

---

## How to Run

### 1. Install dependencies

From the repo root:

```bash
npm install
```

### 2. Portfolio only (no Docker)

The portfolio app is standalone and does not need the API or Docker.

```bash
cp apps/portfolio/.env.local.example apps/portfolio/.env.local   # optional
npm run dev:portfolio
```

Open [http://localhost:3000](http://localhost:3000).

### 3. Full image platform (API + gallery)

**Start infrastructure**

```bash
docker compose up -d
```

This starts Postgres (port **5433**), LocalStack S3 (port **4566**), and Redis (port **6379**).

**Configure the API**

```bash
cp apps/image-api/.env.example apps/image-api/.env
npm run migrate -w @portfolio/image-api
```

The default `.env` values work with `docker compose` — no edits needed for local dev.

**Configure the gallery (optional)**

```bash
cp apps/gallery/.env.local.example apps/gallery/.env.local
```

Defaults point at `http://localhost:8000` for the API. Set `NEXT_PUBLIC_GITHUB_CLIENT_ID` only if you need admin upload/delete via GitHub OAuth.

**Start services**

Use separate terminals, or run the API and gallery together:

```bash
# Option A — one command (API + gallery)
npm run dev:image

# Option B — separate terminals
npm run dev:api       # http://localhost:8000
npm run dev:gallery   # http://localhost:3001
```

**Verify**

| URL | What |
|-----|------|
| [http://localhost:8000/api/health](http://localhost:8000/api/health) | API health (DB, S3, Redis) |
| [http://localhost:8000/api/images](http://localhost:8000/api/images) | Photo list JSON |
| [http://localhost:3001](http://localhost:3001) | Gallery UI |
| [http://localhost:3001/admin](http://localhost:3001/admin) | Admin login (GitHub OAuth) |

**Portfolio alongside gallery**

```bash
npm run dev:portfolio   # http://localhost:3000
```

---

## npm Scripts

Run all commands from the repo root.

| Script | Description |
|--------|-------------|
| `npm run dev:portfolio` | Portfolio site (port 3000) |
| `npm run dev:gallery` | Gallery app (port 3001) |
| `npm run dev:api` | Image API (port 8000) |
| `npm run dev:image` | API + gallery concurrently |
| `npm run dev:api:bench` | API with rate limiting disabled |
| `npm run build:portfolio` | Production build — portfolio |
| `npm run build:gallery` | Production build — gallery |
| `npm run build:api` | Compile image-api TypeScript |
| `npm run test:api` | Jest tests for image-api |
| `npm run seed` | Seed photo metadata (see below) |
| `npm run benchmark` | API latency benchmark |

---

## Seeding & Benchmarks

Requires the API running and Docker up (LocalStack for `--upload`).

```bash
# Metadata only (no S3 files)
npm run seed -- --count=100

# With S3 uploads via LocalStack
npm run seed -- --count=100 --upload

# Latency benchmark (API must be running)
npm run benchmark
```

Reports are saved to [`docs/benchmarks/`](docs/benchmarks/).

---

## Environment Variables

| File | Used by |
|------|---------|
| [`apps/image-api/.env.example`](apps/image-api/.env.example) | Image API — DB, S3, Redis, JWT, GitHub OAuth |
| [`apps/gallery/.env.local.example`](apps/gallery/.env.local.example) | Gallery — API URL, GitHub client ID |
| [`apps/portfolio/.env.local.example`](apps/portfolio/.env.local.example) | Portfolio — gallery link, GitHub username |

Copy each to `.env` / `.env.local` before running. Defaults work for local development except GitHub OAuth credentials (needed for admin upload/delete).

---

## Features

- **Express REST API** — upload, resize, paginated list, delete
- **Sharp pipeline** — thumb (400px WebP), medium (1200px WebP), original (2400px JPEG)
- **AWS S3 + CloudFront** — LocalStack locally; real AWS in production
- **PostgreSQL** — indexed schema with user roles (viewer/admin)
- **JWT auth** — GitHub OAuth for admin upload/delete
- **Rate limiting** — Redis-backed limits on read/upload/auth routes
- **Intersection Observer** — lazy-loaded masonry grid in gallery app
- **Jest tests** — API routes, Sharp utils, auth middleware
- **CI/CD** — GitHub Actions per package; EC2 deploy workflow (manual trigger)
