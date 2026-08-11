# Personal Portfolio

Full-stack portfolio for **Prasad Jawale** — Next.js frontend (`client/`) + FastAPI backend (`app/`).

- Product: [`PRODUCT.md`](PRODUCT.md)
- Design: [`DESIGN.md`](DESIGN.md)
- Changelog: [`docs/CHANGELOG.md`](docs/CHANGELOG.md)
- Photography pipeline: [`docs/upload.md`](docs/upload.md)
- Frontend details: [`client/README.md`](client/README.md)
- Backend details: [`app/README.md`](app/README.md)

## Setup

```bash
cp .env.example .env
# Frontend env: cp client/.env.local.example client/.env.local
```

## Running locally

**Frontend** (http://localhost:3000):

```bash
cd client && npm install && npm run dev
```

**Backend** (http://localhost:8000):

```bash
pip install -r app/requirements.txt
cd app && uvicorn main:app --reload --port 8000
```

On Vercel, both services deploy from this monorepo (`vercel.json`): web at `/`, API under `/api`.

## Tests / lint

```bash
# Frontend
cd client && npm run lint && npm run test:run

# Backend
cd app && ruff check . && ruff format . && pytest tests/ -v
```
