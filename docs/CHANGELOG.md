# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Home **Portfolio** teaser after Projects mirrors the `/portfolio` editorial hero carousel (same slides, controls, wired styling) with a link to the full gallery.
- `/portfolio` uses the gallery branch wired editorial UI (black/yellow theme, Anton display type, dedicated header/footer, splash hero, masonry gallery).
- Header **Résumé** button linking to `RESUME_URL` in `client/constants/config.ts` (Google Drive PDF).
- LeetCode profile link (`leetcode.com/u/prsdjwl`) in hero strip, footer, and `SOCIAL_LINKS` (brand-colored icon).
- CodeChef profile link (`codechef.com/users/tydos`) in hero strip, footer, and `SOCIAL_LINKS` (brand-colored icon).
- Kaggle profile link (`kaggle.com/prasadjawale`) in hero strip, footer, and `SOCIAL_LINKS` (brand-colored icon).
- Recruiter-only frontend mode: set `NEXT_PUBLIC_INCLUDE_PHOTOGRAPHY=false` (or `npm run dev:recruiter` in `client/`) to omit the photography section and Portfolio nav item.
- GitHub Actions cron workflow (`.github/workflows/production-api-health.yml`) that probes production `https://www.prasadjawale.live/api` (`/`, `/health`, `/images`) once a day.
- GitHub Actions cron workflow (`.github/workflows/keep-supabase-alive.yml`) that pings Postgres daily via `DATABASE_URL` to keep the Supabase project from pausing.
- `docs/upload.md` documenting the photography read / upload / delete pipeline.
- `NEXT_PUBLIC_API_URL` in `client/.env.local.example` for admin photo mutations against FastAPI.
- Test coverage: frontend `npm run test:coverage` (Vitest + v8); backend `pytest` with `pytest-cov` (configured in `app/pyproject.toml`). CI runs both.
- Backend pytest suite restored (`tests/`): routes, auth (JWT + API key), photo upload/delete service, and Photo schema validation.

### Fixed

- Cmd/Ctrl/Shift-clicking a project row now opens the project the way the browser expects (new tab/window) instead of being hijacked into same-tab navigation.
- Nav pill highlighting after clicking a section: `scroll-padding-top` on `html` stacked with each section's `scroll-mt`, landing sections ~168px down and leaving the previous section marked active.
- Header no longer overflows horizontally on very narrow phones (~320px and below); the name truncates instead of pushing the résumé button and menu off-screen.
- Photo lightbox uses dynamic viewport height (`dvh`, with a `vh` fallback), so tall photos and the category caption are no longer clipped by mobile browser toolbars; background scroll is locked on iOS Safari.
- Gallery pagination ticks no longer overlap each other as the photo count grows, so taps land on the intended page.
- Page gutters are consistent across header, hero, sections, gallery, and footer (`px-4 sm:px-6`), so content lines up at every breakpoint.

### Changed

- Photography header restored to a minimal bar (Photography + Engineering link only).
- Photography lives on `/portfolio` (removed from the home scroll); nav **Portfolio** links there; Experience/Projects from that page link back to `/#resume` and `/#projects`.
- Photography gallery layout (from `gallery` branch): tighter masonry spacing, hover title/category captions, editorial category filters and prev/next pagination.
- Social profile links are minimal inline rows (icon + label, muted text, 44px tap height, `nav` landmark) in the hero and footer.
- GitHub and LinkedIn social icons use brand marks (Simple Icons) instead of generic stroke icons.
- Home Projects section anchor is `#projects` (replaces `#technical-eye`).
- Projects: category filters (All, AIML, SWE, Android, MLOps), sort by latest GitHub commit, skim summaries, text-left / image-right layout.
- Slim fixed header bar and identity strip; home opens on Experience (no full-screen About hero).
- Hero role and proof: location (New York, United States) and personal interests.
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
