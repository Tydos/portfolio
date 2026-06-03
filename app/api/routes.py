"""API routes for portfolio data and photography management."""

import logging
from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile

from auth.auth import verify_admin_key
from data import photographs
from services.database import db
from services.cloud_storage import SupabaseUploader
from services.photo_upload import PhotoUploadService

router = APIRouter()
logger = logging.getLogger(__name__)

_uploader = SupabaseUploader()
_upload_service = PhotoUploadService(_uploader, db)


@router.get("/images")
def get_images(limit: int = Query(10, ge=1, le=100), offset: int = Query(0, ge=0)):
    # falls back to static data if DB is unavailable
    try:
        return db.fetch_photographs(limit, offset)
    except Exception:
        logger.exception("Database unavailable, falling back to static photographs")
        return photographs


@router.post("/upload", status_code=201, dependencies=[Depends(verify_admin_key)])
async def upload(
    file: UploadFile = File(...),
    category: str = Form(default="nature"),
):
    if not file.filename.lower().endswith((".jpg", ".jpeg")):
        raise HTTPException(
            status_code=400, detail="Only .jpg/.jpeg files are accepted"
        )

    file_bytes = await file.read()
    try:
        photo = _upload_service.upload_one(file_bytes, file.filename, category)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    return photo


@router.delete(
    "/delete/{photo_id}", status_code=204, dependencies=[Depends(verify_admin_key)]
)
async def delete_photo(photo_id: int):
    try:
        filename = db.delete_photo_by_id(photo_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    _uploader.delete(filename)


@router.get("/health")
def health():
    if not db.ping():
        raise HTTPException(
            status_code=503,
            detail={"message": "server active", "database": "connection failed"},
        )
    return {"message": "server active", "database": "connected"}


@router.get("/")
def read_root():
    return {"message": "Portfolio Backend API Gateway"}
