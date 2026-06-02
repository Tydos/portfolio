# Personal Portfolio

Full-stack portfolio site — Next.js frontend + FastAPI backend.

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
uvicorn app.main:app --reload --port 8000
```

## Tests

```bash
# Frontend
cd client && npm run test:run

# Backend
cd app && pytest tests/ -v
```
