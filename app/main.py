import logging
import os
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.auth_routes import router as auth_router
from api.image_routes import router as image_router
from config import config
from services import database as db
from services import s3
from services.cache import ping_redis


def _configure_logging() -> None:
    root = logging.getLogger()
    level_name = os.environ.get("LOG_LEVEL", "INFO").upper()
    root.setLevel(getattr(logging, level_name, logging.INFO))
    if not root.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(
            logging.Formatter("%(asctime)s %(levelname)s [%(name)s] %(message)s")
        )
        root.addHandler(handler)


_configure_logging()


@asynccontextmanager
async def lifespan(application: FastAPI):
    logging.info("Starting up — initializing resources")
    yield
    logging.info("Shutting down — closing database pool")
    db.close_pool()


app = FastAPI(
    title="Image Hosting API",
    description="Self-hosted image hosting platform — FastAPI backend",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    db_ok = db.ping()
    redis_ok = ping_redis()
    try:
        s3.ensure_bucket()
        s3_ok = True
    except Exception:
        s3_ok = False

    body = {
        "message": "server active",
        "database": "connected" if db_ok else "failed",
        "redis": "connected" if redis_ok else "unavailable",
        "s3": "connected" if s3_ok else "failed",
    }
    if not (db_ok and s3_ok):
        from fastapi.responses import JSONResponse

        return JSONResponse(status_code=503, content=body)
    return body


@app.get("/api")
def read_root():
    return {"message": "Image Hosting API"}


app.include_router(auth_router)
app.include_router(image_router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=config.PORT, reload=True)
