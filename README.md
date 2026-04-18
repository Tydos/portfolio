# Portfolio

Frontend-only site: **Next.js 14**, **React 18**, **Tailwind CSS 3**. Photo sections use **react-photo-album**. **@vercel/analytics** is integrated. This repo does not include the backend; the client reads JSON from an HTTP API.

**Stack (see `client/package.json`)**

- Build: Next.js 14 with App Router
- UI: `react`, `react-dom`, `react-feather`; Font Awesome loaded from `client/public/index.html`
- Deploy: Vercel (automatic static optimization and ISR)

**API**

Base URL: `NEXT_PUBLIC_API_URL` (no trailing slash), or fallback in [`client/constants/config.js`](client/constants/config.js).

| Method | Path | Used for |
|--------|------|----------|
| GET | `/api/projects` | Projects list |
| GET | `/api/images?limit=&offset=` | Gallery images (`fetchPhotos` maps to `src` / `width` / `height`) |

**Run locally**

```bash
cd client
npm install
npm run dev
```

Dev server defaults to port 3000. Set `NEXT_PUBLIC_API_URL` in `client/.env.local` if the API is not the bundled default.

**Production build**

```bash
cd client
npm run build
npm run start
```

Artifacts: `client/.next/`.

**Vercel**

Set **Root Directory** to `client` (automatic Next.js detection and deployment).
