"""Database- and storage-agnostic photograph upload/delete orchestration."""

import logging

from psycopg2 import DatabaseError

from schemas.photo import Photo
from services.database import DatabaseManager
from services.storage import StorageUploader

logger = logging.getLogger(__name__)


class PhotoStorageService:
    """Coordinate photograph uploads and deletes across storage and the DB."""

    def __init__(self, uploader: StorageUploader, database: DatabaseManager) -> None:
        """Store collaborators used for upload/delete workflows.

        Args:
            uploader: Object storage adapter (e.g. Supabase).
            database: Database manager for photograph metadata.
        """
        self._uploader = uploader
        self._db = database

    def delete_one(self, photo_id: int) -> None:
        """Delete a photograph from the DB first, then storage.

        Deleting the DB row first avoids orphaned metadata if storage delete
        fails; storage failures are logged for manual cleanup.

        Args:
            photo_id: Primary key of the photograph to delete.

        Raises:
            ValueError: If the photograph id is not found in the database.
        """
        filename = self._db.delete_photo_by_id(photo_id)

        storage_deleted = self._uploader.delete(filename)
        if not storage_deleted:
            logger.error(
                "ORPHAN: '%s' removed from DB but storage delete failed — clean up manually",
                filename,
            )

    def upload_one(self, file_bytes: bytes, filename: str, category: str) -> dict:
        """Upload bytes to storage, then persist metadata in the database.

        Storage is written first so failed DB inserts can roll back the object
        and avoid broken gallery entries.

        Args:
            file_bytes: Raw image contents.
            filename: Original filename (normalized to lowercase).
            category: Photograph category label.

        Returns:
            Created photograph metadata including the new database id.

        Raises:
            RuntimeError: If storage returns no result without raising.
            ValueError: If the filename is a duplicate (after storage rollback).
            DatabaseError: If metadata insert fails for a non-duplicate reason.
        """
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
        except Exception as exc:
            # Delete the uploaded file since DB upload failed to avoid orphaned files
            self._uploader.delete(result["storage_key"])
            logger.exception(
                "DB upload failed, deleted uploaded file to avoid orphan: %s", filename
            )
            raise DatabaseError("Failed to upload photo metadata to database") from exc

        return {
            "id": photo_id,
            "filename": filename,
            "url": result["url"],
            "width": result["width"],
            "height": result["height"],
            "category": category,
        }
