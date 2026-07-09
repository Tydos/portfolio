# Image Hosting Platform

Self-hosted image gallery with a **React SPA** frontend and a **Python FastAPI** backend — mirroring the stack from `feature/image-hosting-platform` (PostgreSQL, S3/LocalStack, Redis, GitHub OAuth, Pillow image pipeline).

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, React Router |
| Backend | FastAPI, Pydantic v2, Pillow, boto3, psycopg2, Redis |
| Database | PostgreSQL 16 |
| Object storage | S3 (LocalStack in dev) |
| Cache | Redis 7 |
| Auth | GitHub OAuth → JWT |

## Prerequisites

- Node.js 20+
- Python 3.11+
- Docker & Docker Compose

## Quick Start

### 1. Infrastructure

```bash
docker compose up -d
```

### 2. Backend

```bash
cp .env.example .env
pip install -r app/requirements.txt
cd app && python -m db.migrate
uvicorn main:app --reload --port 8000
```

### 3. Frontend

```bash
cp client/.env.local.example client/.env.local
cd client && npm install && npm run dev
```

Gallery runs at **http://localhost:3001**, API at **http://localhost:8000**.

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | — | Health check (DB, Redis, S3) |
| GET | `/api/images` | — | List photos (paginated) |
| GET | `/api/images/{id}` | — | Single photo |
| POST | `/api/images/upload` | Admin JWT | Upload JPEG |
| DELETE | `/api/images/{id}` | Admin JWT | Delete photo |
| POST | `/api/auth/github/callback` | — | Exchange OAuth code for JWT |
| GET | `/api/auth/me` | JWT | Current user |

## Image Pipeline

Each upload produces three variants (via Pillow):

- **original** — max 2400px JPEG (q85)
- **medium** — max 1200px WebP (q82)
- **thumb** — max 400px WebP (q80)

## Tests

```bash
# Backend
cd app && pip install pytest ruff && pytest tests/ -v

# Frontend
cd client && npm run build
```

## Branch

This work lives on `feature/image-hosting-python`, branched from `main`.
