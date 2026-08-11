"""API routes for portfolio data and photography management."""

import logging
from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile

from auth.auth import verify_admin_key
from services.database import db
from services.photo_operations import PhotoStorageService
from services.storage import SupabaseUploader

router = APIRouter()
logger = logging.getLogger(__name__)

_uploader = SupabaseUploader()
_upload_service = PhotoStorageService(_uploader, db)


@router.get("/images")
def get_images(
    limit: Annotated[int, Query(ge=1, le=100)] = 10,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> list[dict]:
    """Return a page of photographs from the database.

    Args:
        limit: Maximum number of photos to return (1–100).
        offset: Number of photos to skip.

    Returns:
        A list of photograph dicts from the database.

    Raises:
        HTTPException: 503 when the database is unavailable.
    """
    try:
        return db.fetch_photographs(limit, offset)
    except Exception as exc:
        logger.exception("Database unavailable while fetching photographs")
        raise HTTPException(
            status_code=503,
            detail="Database unavailable",
        ) from exc


@router.post("/upload", status_code=201, dependencies=[Depends(verify_admin_key)])
async def upload(
    file: Annotated[UploadFile, File()],
    category: Annotated[str, Form()] = "nature",
) -> dict:
    """Upload a JPEG photograph (admin authenticated).

    Args:
        file: Multipart JPEG upload.
        category: Photo category label (defaults to ``nature``).

    Returns:
        Created photograph metadata including the new database id.

    Raises:
        HTTPException: 400 if the file is not JPEG; 409 on duplicate filename.
    """
    if not file.filename or not file.filename.lower().endswith((".jpg", ".jpeg")):
        raise HTTPException(
            status_code=400, detail="Only .jpg/.jpeg files are accepted"
        )

    file_bytes = await file.read()
    try:
        photo = _upload_service.upload_one(file_bytes, file.filename, category)
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e)) from e
    return photo


@router.delete(
    "/delete/{photo_id}", status_code=204, dependencies=[Depends(verify_admin_key)]
)
async def delete_photo(photo_id: int) -> None:
    """Delete a photograph by id (admin authenticated).

    Args:
        photo_id: Primary key of the photograph to delete.

    Raises:
        HTTPException: 404 if the photograph does not exist.
    """
    try:
        _upload_service.delete_one(photo_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e


@router.get("/health")
def health() -> dict:
    """Report API and database connectivity status.

    Returns:
        A status payload indicating the server is active and whether the
        database responded to a ping.

    Raises:
        HTTPException: 503 when the database ping fails.
    """
    if not db.ping():
        raise HTTPException(
            status_code=503,
            detail={"message": "server active", "database": "connection failed"},
        )
    return {"message": "server active", "database": "connected"}


@router.get("/")
def read_root() -> dict[str, str]:
    """Return a simple API gateway identity payload.

    Returns:
        A short message identifying this service.
    """
    return {"message": "Portfolio Backend API Gateway"}
