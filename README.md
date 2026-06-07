# Personal Portfolio

Full-stack portfolio site — Next.js frontend + FastAPI backend.

### Project Versions

**v0 — Node + React (CRA)**  
Initial setup with a separate Express backend and React frontend. Frequent CORS issues due to cross-domain API calls on Vercel.

**v1 — FastAPI Backend**  
Replaced Node with FastAPI for future ML integration. Added Pydantic validation, PostgreSQL (Supabase), and image uploads (Cloudinary → Supabase Storage). Included fallback data for reliability.

**v2 — Next.js Migration**  
Moved frontend to Next.js (later migrated to TypeScript) for taking advantage of image based optimisation. Introduced SSR, App Router, optimized images, and a full gallery system. GitHub Projects data became dynamic via API.

**v3 — Unified Deployment**  
Merged frontend and backend instances into a single Vercel project for easy management. Backend served at `/api/*`, eliminating CORS. Required build/config fixes for Python support.

### Current Stack
- **Frontend:** Next.js 14, TypeScript, Tailwind  
- **Backend:** FastAPI (Python 3.11, Pydantic v2)  
- **Storage:** Supabase (DB + storage)  
- **Deployment:** Single Vercel project  
- **CI:** GitHub Actions (Vitest, pytest, ruff)

## Supabase Setup Notes

- **Use the anon key** (`eyJ...` JWT) for the frontend — it is safe to expose publicly via `NEXT_PUBLIC_*` env vars.
- **Database table access:** Grant the `anon` role CRUD permissions on each table and enable RLS with matching policies, otherwise PostgREST returns 403.
  ```sql
  GRANT SELECT, INSERT, UPDATE, DELETE ON your_table TO anon;
  CREATE POLICY "Public access" ON your_table FOR ALL TO anon USING (true) WITH CHECK (true);
  ```
- **Supabase Storage bucket access:** Storage buckets also require CRUD access policies set in the Storage → Policies section, otherwise uploads/reads return 403.

## Prerequisites

- Node.js 20+
- Python 3.11+

## Setup

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

## Running Locally

**Frontend** (http://localhost:3000):
```bash
cd client
npm install
npm run dev
```

**Backend** (http://localhost:8000):
```bash
pip install -r app/requirements.txt
cd app && uvicorn main:app --reload --port 8000
```

## Tests

```bash
# Frontend
cd client && npm run test:run

# Backend
cd app && pytest tests/ -v
```
