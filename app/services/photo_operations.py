# Generic photo upload script that is database and storage agnostic. It relies on the uploader and database manager to handle the specifics of each service.

import logging

from psycopg2 import DatabaseError
from schemas.photo import Photo
from services.storage import StorageUploader
from services.database import DatabaseManager

logger = logging.getLogger(__name__)


class PhotoStorageService:
    def __init__(self, uploader: StorageUploader, database: DatabaseManager):
        self._uploader = uploader
        self._db = database

    # delete from DB first to avoid orphaned storage if DB delete fails. If storage delete fails, we log the error.
    def delete_one(self, photo_id: int) -> None:
        filename = self._db.delete_photo_by_id(photo_id)

        storage_deleted = self._uploader.delete(filename)
        if not storage_deleted:
            logger.error(
                "ORPHAN: '%s' removed from DB but storage delete failed — clean up manually",
                filename,
            )

    # upload to storage first to avoid broken photo entries in DB. If DB upload fails, we delete the uploaded file from storage to avoid orphans.
    def upload_one(self, file_bytes: bytes, filename: str, category: str) -> dict:
        filename = filename.lower()
        result = self._uploader.upload(file_bytes, filename)
        if result is None:
            raise RuntimeError("Storage upload failed without exception")

        photo = Photo(
            filename=filename,
            url=result["url"],
            width=result["width"],
            height=result["height"],
            category=category,
        )
        try:
            photo_id = self._db.upload_photo_to_db(photo)
        except ValueError:
            # Duplicate filename (and other validation) — roll back storage, re-raise for 409
            self._uploader.delete(result["storage_key"])
            raise
        except Exception:
            # Delete the uploaded file since DB upload failed to avoid orphaned files
            self._uploader.delete(result["storage_key"])
            logger.exception(
                "DB upload failed, deleted uploaded file to avoid orphan: %s", filename
            )
            raise DatabaseError("Failed to upload photo metadata to database")

        return {
            "id": photo_id,
            "filename": filename,
            "url": result["url"],
            "width": result["width"],
            "height": result["height"],
            "category": category,
        }
