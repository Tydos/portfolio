# AGENTS.md

Guidance for AI agents working in this repository.

## What this is

Personal portfolio for **Prasad Jawale** (SWE / AIML): recruiter-first proof (resume, projects, publication) plus a photography gallery. Full-stack — Next.js frontend (`client/`) and FastAPI backend (`app/`).

Canonical product and design intent live in:

- [`PRODUCT.md`](PRODUCT.md) — users, IA, positioning, constraints
- [`DESIGN.md`](DESIGN.md) — Cupertino Portfolio design system (tokens, do/don't)
- [`docs/CHANGELOG.md`](docs/CHANGELOG.md) — notable changes ([Keep a Changelog](https://keepachangelog.com/en/1.1.0/))
- [`docs/upload.md`](docs/upload.md) — photography read / upload / delete pipeline

Do not silently rebrand or invent credentials, metrics, employers, or testimonials.

## Layout

```
portfolio/
├── PRODUCT.md / DESIGN.md   # Product + design source of truth
├── docs/                    # CHANGELOG.md, upload.md, …
├── client/                  # Next.js 14 (App Router) frontend
│   ├── app/                 # Routes: home, projects/[slug], admin, api/images
│   ├── components/          # sections/, layout/, cards/, ui/
│   ├── constants/           # resume, featured projects, site config
│   ├── lib/                 # photos, projects, supabase, auth, hooks
│   └── types/
└── app/                     # FastAPI backend
    ├── main.py              # Entry
    ├── api/                 # Routes
    ├── auth/                # JWT / API key admin auth
    ├── schemas/             # Pydantic + settings
    ├── services/            # DB, storage, photo ops
    └── tests/
```

Vercel deploys **both** frontend and backend from this monorepo via root [`vercel.json`](vercel.json) (`experimentalServices`):

| Service | Entrypoint | Route prefix |
|---------|------------|--------------|
| `web` | `client` (Next.js) | `/` |
| `api` | `app/main.py` (FastAPI) | `/api` |

Locally the FastAPI app is usually `http://localhost:8000` with routes like `/images` and `/upload`. On Vercel those same routes are served under the `/api` prefix (e.g. `/api/images`, `/api/upload`).

## Commands

```bash
# Env (repo root)
cp .env.example .env

# Frontend — http://localhost:3000
cd client && npm install && npm run dev
cd client && npm run lint
cd client && npm run lint -- --fix   # autofix when safe
cd client && npm run test:run
cd client && npm run test:coverage
cd client && npm run build

# Backend — http://localhost:8000
pip install -r app/requirements.txt
# Dev/test tools (pytest, pytest-cov, ruff): pip install pytest pytest-cov ruff
# or: cd app && uv sync --group dev
cd app && uvicorn main:app --reload --port 8000
cd app && ruff check . && ruff format .
cd app && pytest tests/ -v   # coverage via pytest-cov (see app/pyproject.toml)
```

Frontend: public gallery reads via Next `/api/images`; admin upload/delete need `NEXT_PUBLIC_API_URL` (see `client/.env.local.example`). Backend secrets: `DATABASE_URL`, `ADMIN_API_KEY`, `SUPABASE_*` (see `.env.example`). Never commit `.env` / `.env.local`.

## Stack conventions

### Frontend (`client/`)

- Next.js 14 App Router, React 18, TypeScript, Tailwind 3, Geist Sans
- Home is one scroll: About → Experience → Projects → Portfolio (photography)
- Content constants in `client/constants/`; project MDX/detail via `client/lib/projects.ts`
- Photos: public reads via Next `/api/images` (`lib/photos.ts`); admin upload/delete via FastAPI with Bearer JWT; gallery UI in `components/sections/`
- Prefer existing tokens (`accent`, `ink`, `text-hero`, `text-section`) over new palette or fonts
- Preserve incumbent look unless the user explicitly asks for a redesign
- Match existing component patterns under `components/`; keep sections focused and scannable

#### TypeScript / JavaScript style (required for all `client/` changes)

When writing or changing TypeScript or JavaScript in this repo:

1. **Lint and format** — Always run `npm run lint` under `client/` before finishing and fix issues. Apply safe autofixes with `npm run lint -- --fix`. Match indentation, quotes, and import style of surrounding files (ESLint / `eslint-config-next`); do not leave inconsistent formatting.
2. **Tests** — Add or update Vitest coverage near the code you touch (`*.test.ts` / `*.test.tsx` beside the module, usually under `lib/`). New behavior needs tests; bug fixes should include a regression test when practical. Run `npm run test:run` (or `npm run test:coverage`) and keep it green.
3. **Conventions** — Prefer TypeScript over plain JS for new code. Use clear `camelCase` for values/functions, `PascalCase` for React components and types, `UPPER_SNAKE_CASE` for true constants. Favor explicit types on exported APIs; avoid `any` unless unavoidable and localized. Keep modules focused; follow existing App Router / React patterns in `app/` and `components/`.
4. **JSDoc (Google style)** — Document exported functions, classes, and non-obvious helpers with [Google-style JSDoc](https://google.github.io/styleguide/jsguide.html#jsdoc) (`@param`, `@returns`, `@throws` when they apply). Types belong in TypeScript signatures; JSDoc explains behavior and constraints. Private/local helpers may use a short one-liner when the name is sufficient.

Example:

```typescript
/**
 * Fetch a page of photographs for the public gallery.
 *
 * @param limit - Maximum number of photos to return.
 * @param offset - Number of photos to skip.
 * @returns Photos plus total count for pagination.
 * @throws When the images API responds with a non-OK status.
 */
export async function fetchPhotos(
  limit: number,
  offset: number,
): Promise<{ photos: Photo[]; total: number }> {
  // ...
}
```

### Backend (`app/`)

- FastAPI + Pydantic; PostgreSQL (Supabase) + Supabase Storage for photos
- Public: `GET /images`, `GET /health`; admin `POST /upload` and `DELETE /delete/{id}` require Supabase Bearer JWT (or deprecated `X-API-Key`)
- Keep upload/DB logic in `services/`; schemas in `schemas/`; thin route handlers
- JPG/JPEG only for uploads; duplicate filenames → 409

#### Python style (required for all `app/` changes)

When writing or changing Python in this repo:

1. **Lint and format** — Always run `ruff check .` and `ruff format .` under `app/` before finishing. Fix lint issues; do not leave unformatted code.
2. **Tests** — Add or update pytest coverage near the code you touch (`app/tests/`). New behavior needs tests; bug fixes should include a regression test when practical. Run `pytest tests/ -v` and keep it green.
3. **PEP 8** — Follow [PEP 8](https://peps.python.org/pep-0008/) (naming, imports, line length via Ruff defaults, spacing). Prefer clear names over clever ones; keep modules focused.
4. **Docstrings (Google style)** — Use [Google-style docstrings](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings) for modules, classes, and public functions/methods. Include `Args:`, `Returns:`, `Raises:`, and `Yields:` sections when they apply. Private helpers may use a short one-liner when the name is sufficient.

Example:

```python
def fetch_photographs(self, limit: int, offset: int) -> list[dict]:
    """Fetch a page of photograph rows from the database.

    Args:
        limit: Maximum number of rows to return (1–100 at the API layer).
        offset: Number of rows to skip.

    Returns:
        A list of photograph dicts with id, filename, url, category, width,
        and height.

    Raises:
        RuntimeError: If ``DATABASE_URL`` is missing or the pool cannot be
            created.
    """
```

## Working rules

1. **Recruiter path first** — Identity, proof, and contact stay easy to find; photography must not block the hiring story.
2. **Proof over decoration** — Prefer real resume/project/publication data already in the repo.
3. **Design continuity** — Follow `DESIGN.md` (system blue accent, Geist, pills, flat content / lifted media). No purple gradients, serif display swaps, or dark-default rethemes without an explicit redesign ask.
4. **Accessibility baseline** — Keyboard-reachable nav, focus-visible, meaningful image/link names; honor `prefers-reduced-motion` for reveals.
5. **Scope** — Change only what the task needs. Do not refactor unrelated areas or add docs the user did not ask for.
6. **Tests** — For behavior changes, update or add Vitest (`client`) / pytest (`app`) coverage near the code you touch. Also follow **TypeScript / JavaScript style** and **Python style** above (lint, format, language conventions, Google-style docs).
7. **Changelog** — For every notable user- or operator-facing change, update [`docs/CHANGELOG.md`](docs/CHANGELOG.md) in the same change set. Follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/):
   - Put new entries under `## [Unreleased]` (do not invent a version unless the user asks to cut a release).
   - Group under `Added` / `Changed` / `Deprecated` / `Removed` / `Fixed` / `Security` as appropriate; omit empty groups.
   - Write for humans: notable behavior, not commit noise or pure refactors unless they affect operators.
   - Use ISO dates (`YYYY-MM-DD`) when promoting `Unreleased` into a versioned section.
   - On release (only when asked): move `Unreleased` items into `## [X.Y.Z] - YYYY-MM-DD`, leave a fresh empty `Unreleased`, and refresh compare links at the bottom.
8. **Git** — Commit only when asked; never commit secrets.

## Quick pointers

| Task | Start here |
|------|------------|
| Home sections / copy | `client/components/sections/`, `client/constants/resume.ts` |
| Featured projects | `client/constants/featuredProjects.ts`, `client/lib/projects.ts` |
| Gallery / lightbox | `client/components/sections/Portfolio.tsx`, `Gallery.tsx`, `client/lib/photos.ts` |
| Photo pipeline docs | `docs/upload.md` |
| Admin photo tools | `client/app/admin/`, backend `app/api/routes.py` |
| Changelog | `docs/CHANGELOG.md` |
| Design tokens | `client/tailwind.config.js`, `DESIGN.md` |
| Product constraints | `PRODUCT.md` |
