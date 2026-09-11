# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- npm workspaces monorepo: `web/recruiter` (hiring portfolio), `web/photography` (gallery + admin), and shared `packages/theme` (Tailwind preset and base CSS).
- Cross-links between sites via `NEXT_PUBLIC_PHOTOGRAPHY_URL` and `NEXT_PUBLIC_RECRUITER_URL`.
- `web/photography/vercel.json` for deploying photography Next.js + FastAPI on a dedicated Vercel project.

### Changed

- Photography site redesign: Wired editorial aesthetic with a black/white/yellow palette, full-bleed hero, Anton display typeface, square image frames, hover captions, and bold typographic pagination.
- Photography navbar and footer recolored to black chrome with yellow hover accents; interactive chrome on the photography app uses sharp rectangles instead of pills.
- Recruiter home no longer embeds the gallery; photography lives on the separate app with the same Cupertino design tokens.
- Root `vercel.json` targets `web/recruiter` only; photography deploy uses its app directory as the Vercel root.
- GitHub Actions frontend workflow runs lint and tests for both `web/recruiter` and `web/photography`.
- Frontend workspace directory renamed from `apps/` to `web/`.
- Site headers show a one-line role tagline under the name (from `HERO.role`).
- Photography admin mutations default to same-origin `/api` on Vercel when `NEXT_PUBLIC_API_URL` is unset; docs state FastAPI deploys only with the photography project.
- Photography gallery reads query Supabase directly from TypeScript (removed Next `GET /api/images`). Recruiter app uses GitHub REST API only for external data.
- Photography site: compact hero, minimal header/footer, less gallery chrome.
- Photography hero welcome haiku for first-time visitors.
- Hero nature photography strip (latest `nature` category or curated ids) before the main gallery.
- Photography hero redesigned in a Wired-inspired editorial layout (kicker, headline, mosaic, gallery rule).
- Photography hero copy reduced to a single title; Wired split layout (title + mosaic) retained.
- Photography hero converted into a full-bleed image carousel: up to four curated `nature` photographs cycle with prev/next arrow buttons, a bold typographic slide counter, keyboard navigation, and per-slide editorial titles following the Wired headline style.
- Removed the "Photography" role kicker above the hero headline so the carousel titles stand alone.
- Hero carousel auto-advances every 5 seconds, pausing while hovered, focused, hidden, or when `prefers-reduced-motion` is enabled.

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
