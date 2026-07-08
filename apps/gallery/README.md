# Gallery App

Image gallery UI with lazy-loading grid, search, category filters, and admin upload/delete.

**Stack:** Next.js 14, React 18, Tailwind CSS 3

**API:** [`apps/image-api`](../image-api) — configure via `NEXT_PUBLIC_IMAGE_API_URL` (see [`.env.local.example`](.env.local.example)).

## Run locally

From the repo root:

```bash
npm install
docker compose up -d
npm run dev:gallery
```

Dev server runs on port **3001**.

## Build

```bash
npm run build -w apps/gallery
```
