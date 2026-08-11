# Backend (`app/`)

FastAPI service for portfolio photography: public image listing, admin JPEG upload, and admin delete. Postgres (Supabase) holds metadata; Supabase Storage holds files.

Part of the monorepo at the repo root. Pipeline docs: [`../docs/upload.md`](../docs/upload.md). Frontend counterpart: [`../client/README.md`](../client/README.md).

## Stack

- **FastAPI** + **Pydantic**, **uvicorn**
- **PostgreSQL** via `psycopg2` connection pool (`DATABASE_URL`)
- **Supabase Storage** for image bytes; **Pillow** for dimensions
- Admin auth: Supabase Bearer JWT (GitHub OAuth user) or deprecated `X-API-Key`
- Lint/format: **Ruff**; tests: **pytest** + **pytest-cov**

## Layout

```
app/
├── main.py                 # FastAPI entry + CORS + lifespan
├── api/
│   └── routes.py           # /images, /upload, /delete/{id}, /health, /
├── auth/
│   └── auth.py             # JWT (JWKS) + X-API-Key dependency
├── schemas/
│   ├── config.py           # Settings from env
│   └── photo.py            # Photo models
├── services/
│   ├── database.py         # Pool + photograph queries
│   ├── storage.py          # Supabase Storage uploader
│   └── photo_operations.py # Upload/delete orchestration
├── tests/
├── requirements.txt
└── pyproject.toml          # pytest-cov / ruff / project metadata
```

## Routes (local)

Locally the app listens on `http://localhost:8000` **without** an `/api` prefix:

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/` | — | Welcome payload |
| `GET` | `/health` | — | Liveness + DB connectivity |
| `GET` | `/images?limit=&offset=` | — | Paginated photographs; **503** if DB unavailable |
| `POST` | `/upload` | Bearer JWT or `X-API-Key` | Upload one `.jpg`/`.jpeg` |
| `DELETE` | `/delete/{id}` | Bearer JWT or `X-API-Key` | Delete photograph by id |

On Vercel, the same routes are served under the `/api` prefix (`/api/images`, `/api/upload`, …) via root [`vercel.json`](../vercel.json).

There is **no** batch-upload endpoint; the gallery UI uploads files one at a time.

## Auth

- **Preferred:** `Authorization: Bearer <supabase_access_token>` for the admin GitHub user (`ADMIN_GITHUB_USERNAME`, default `Tydos`). JWT is verified against Supabase JWKS.
- **Scripts / curl:** `X-API-Key: <ADMIN_API_KEY>` (deprecated for browser use; still supported).

The Next.js `/admin` UI gate alone is not enough — FastAPI enforces auth on mutations.

## Upload behavior

1. Reject non-JPEG filenames (**400**)
2. Upload bytes to Supabase Storage
3. Read width/height with Pillow
4. Insert into `photographs`
5. On DB failure, roll back the storage object
6. Duplicate filename → **409**

### Curl (API key)

```bash
curl -X POST http://localhost:8000/upload \
  -H "X-API-Key: $ADMIN_API_KEY" \
  -F "file=@photo.jpg" \
  -F "category=nature"

curl -X DELETE http://localhost:8000/delete/123 \
  -H "X-API-Key: $ADMIN_API_KEY"
```

### `photographs` table

| Column | Type | Notes |
|--------|------|-------|
| `id` | SERIAL | Primary key |
| `filename` | VARCHAR | Unique storage key / filename |
| `url` | VARCHAR | Public Storage URL |
| `category` | VARCHAR | Label (default `nature`) |
| `width` / `height` | INTEGER | Pixels |
| `created_at` | TIMESTAMP | Default `CURRENT_TIMESTAMP` |

## Setup

From the **repo root**:

```bash
cp .env.example .env
# fill DATABASE_URL, ADMIN_API_KEY, ADMIN_GITHUB_USERNAME,
# SUPABASE_URL, SUPABASE_KEY, SUPABASE_BUCKET
```

Install and run (from `app/`):

```bash
pip install -r requirements.txt
# Dev tools: pip install pytest pytest-cov ruff
# or: uv sync --group dev

uvicorn main:app --reload --port 8000
```

Interactive docs: `http://localhost:8000/docs`

Settings load via `load_dotenv(override=True)` at import time — restart the process after editing `.env` (uvicorn `--reload` does not watch `.env`).

Required env (see root [`.env.example`](../.env.example)):

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Postgres connection string |
| `SUPABASE_URL` / `SUPABASE_KEY` | Storage + JWKS (service/anon as configured) |
| `SUPABASE_BUCKET` | Public bucket name (default `images`) |
| `ADMIN_API_KEY` | Legacy header auth for scripts |
| `ADMIN_GITHUB_USERNAME` | GitHub login allowed for JWT admin |

## Commands

```bash
cd app
ruff check . && ruff format .
pytest tests/ -v
```

Coverage is enabled via `pyproject.toml` (`pytest-cov`).

Production uptime is checked daily by `.github/workflows/production-api-health.yml` against `https://www.prasadjawale.live/api` (manual run via **Actions → Production API Health → Run workflow**).

## Style / tests

When changing Python under `app/`:

1. `ruff check .` and `ruff format .`
2. Add or update pytest near the code you touch (`tests/`)
3. Follow PEP 8; keep routes thin and logic in `services/`
4. Google-style docstrings on modules, classes, and public functions

See [`../AGENTS.md`](../AGENTS.md) for the full checklist.
