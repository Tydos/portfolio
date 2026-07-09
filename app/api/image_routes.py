"""Image listing, upload, and deletion, mirroring routes/images.ts."""

import logging
import re
import time
from typing import Any

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Query,
    UploadFile,
)

from auth.jwt_auth import require_admin
from middleware.rate_limit import public_read_limiter, upload_limiter
from services import database as db
from services import s3
from services.cache import cache_get, cache_invalidate, cache_set
from services.images import process_image

router = APIRouter(prefix="/api/images", tags=["images"])
logger = logging.getLogger(__name__)

MAX_UPLOAD_BYTES = 20 * 1024 * 1024


@router.get("", dependencies=[Depends(public_read_limiter)])
def list_images(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    category: str | None = None,
):
    cache_key = f"gallery:{category or 'all'}:{limit}:{offset}"
    cached = cache_get(cache_key)
    if cached:
        return {**cached, "limit": limit, "offset": offset, "cached": True}

    try:
        result = db.fetch_photos(limit, offset, category)
    except Exception:
        logger.exception("Database unavailable")
        raise HTTPException(status_code=503, detail="Database unavailable")

    cache_set(cache_key, result)
    return {**result, "limit": limit, "offset": offset, "cached": False}


@router.get("/{photo_id}", dependencies=[Depends(public_read_limiter)])
def get_image(photo_id: int):
    photo = db.get_photo_by_id(photo_id)
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")
    return photo


@router.post("/upload", status_code=201, dependencies=[Depends(upload_limiter)])
async def upload_image(
    file: UploadFile = File(...),
    category: str = Form(default="nature"),
    user: dict[str, Any] = Depends(require_admin),
):
    if not re.search(r"\.jpe?g$", file.filename or "", re.IGNORECASE):
        raise HTTPException(status_code=400, detail="Only JPEG files are accepted")

    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File too large (max 20 MB)")

    filename = f"{int(time.time() * 1000)}_{file.filename.lower()}"
    base_key = re.sub(r"\.[^.]+$", "", filename)

    s3.ensure_bucket()
    processed = process_image(data, base_key)

    for variant in (processed.original, processed.medium, processed.thumb):
        s3.upload_object(variant.s3_key, variant.buffer, variant.content_type)

    optimized_bytes = (
        processed.original.bytes + processed.medium.bytes + processed.thumb.bytes
    )

    photo = db.insert_photo(
        {
            "filename": filename,
            "category": category or "nature",
            "width": processed.original.width,
            "height": processed.original.height,
            "size_bytes_input": processed.input_bytes,
            "size_bytes_optimized": optimized_bytes,
            "s3_key_original": processed.original.s3_key,
            "s3_key_thumb": processed.thumb.s3_key,
            "s3_key_medium": processed.medium.s3_key,
            "cdn_url_original": s3.get_cdn_url(processed.original.s3_key),
            "cdn_url_thumb": s3.get_cdn_url(processed.thumb.s3_key),
            "cdn_url_medium": s3.get_cdn_url(processed.medium.s3_key),
            "uploaded_by": user.get("sub"),
        }
    )

    cache_invalidate("gallery:*")

    return {**photo, "compression_ratio": processed.compression_ratio}


@router.delete(
    "/{photo_id}", status_code=204, dependencies=[Depends(require_admin)]
)
def delete_image(photo_id: int):
    try:
        keys = db.delete_photo(photo_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Photo not found")
    s3.delete_objects(keys)
    cache_invalidate("gallery:*")
