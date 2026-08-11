# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- GitHub Actions cron workflow (`.github/workflows/production-api-health.yml`) that probes production `https://www.prasadjawale.live/api` (`/`, `/health`, `/images`) once a day.
- GitHub Actions cron workflow (`.github/workflows/keep-supabase-alive.yml`) that pings Postgres daily via `DATABASE_URL` to keep the Supabase project from pausing.
- `docs/upload.md` documenting the photography read / upload / delete pipeline.
- `NEXT_PUBLIC_API_URL` in `client/.env.local.example` for admin photo mutations against FastAPI.
- Test coverage: frontend `npm run test:coverage` (Vitest + v8); backend `pytest` with `pytest-cov` (configured in `app/pyproject.toml`). CI runs both.
- Backend pytest suite restored (`tests/`): routes, auth (JWT + API key), photo upload/delete service, and Photo schema validation.

### Fixed

- Duplicate photo uploads again return **409**: `PhotoStorageService` re-raises `ValueError` from the DB layer instead of wrapping it as a generic database error.

### Changed

- Gallery upload and delete now call FastAPI (`POST /upload`, `DELETE /delete/{id}`) with the admin Supabase Bearer JWT instead of writing to Supabase from the browser.
- Public gallery reads always use Next.js `GET /api/images` (no longer redirected when `NEXT_PUBLIC_API_URL` is set).
- Changelog lives at `docs/CHANGELOG.md`.
- Backend Python style pass: Ruff lint/format clean, Google-style docstrings, and broader pytest coverage for auth JWKS, database, and storage helpers.
- Frontend TypeScript style pass: ESLint clean, Google-style JSDoc on client exports, and broader Vitest coverage for `lib/` helpers and `GET /api/images`.
- `client/README.md` and `app/README.md` rewritten for the current Next.js + FastAPI photo pipeline (public `/api/images` reads, JWT upload/delete, correct local vs Vercel route prefixes).


### Removed

- Direct Supabase Storage upload/remove and `photographs` table insert/delete from `client/lib/photos.ts`.
- Static photograph fallback (`app/data.py`): `GET /images` now returns **503** when the database is unavailable instead of serving sample Cloudinary data.

[unreleased]: https://github.com/Tydos/portfolio/commits/main
