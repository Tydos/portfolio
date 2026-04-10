# Portfolio

Frontend-only SPA: **Create React App 5** (`react-scripts`), **React 18**, **Tailwind CSS 3**, **React Router v6**. Photo sections use **react-photo-album**. **@vercel/analytics** is mounted in `App.js`. This repo does not include the backend; the client reads JSON from an HTTP API.

**Stack (see `client/package.json`)**

- Build: CRA / Webpack via `react-scripts`
- UI: `react`, `react-dom`, `react-feather`; Font Awesome loaded from `client/public/index.html`
- Deploy: static `build/` on Vercel; `client/vercel.json` rewrites non-file routes to `/` for client-side routing

**API**

Base URL: `REACT_APP_API_URL` (no trailing slash), or fallback in [`client/src/constants/config.js`](client/src/constants/config.js).

| Method | Path | Used for |
|--------|------|----------|
| GET | `/api/skills` | Skills list |
| GET | `/api/projects` | Projects list |
| GET | `/api/images?limit=&offset=` | Gallery images (`fetchPhotos` maps to `src` / `width` / `height`) |

**Run locally**

```bash
cd client
npm install
npm start
```

Dev server defaults to port 3000. Set `REACT_APP_API_URL` in `client/.env.local` if the API is not the bundled default.

**Production build**

```bash
cd client
npm run build
```

Artifacts: `client/build/`.

**Vercel**

Set **Root Directory** to `client`, framework preset Create React App (or `npm run build` / output `build`).
