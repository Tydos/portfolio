"""Object storage upload interface and Supabase implementation."""

import logging
from abc import ABC, abstractmethod
from io import BytesIO

import httpx
from PIL import Image
from supabase import Client, create_client

from schemas.config import settings

logger = logging.getLogger(__name__)


class StorageUploader(ABC):
    """Abstract storage uploader used by photo orchestration services."""

    @abstractmethod
    def upload(self, file_bytes: bytes, filename: str) -> dict:
        """Upload bytes and return public URL plus dimensions.

        Args:
            file_bytes: Raw image contents.
            filename: Object key / filename in the bucket.

        Returns:
            Dict with ``url``, ``width``, ``height``, and ``storage_key``.
        """

    @abstractmethod
    def delete(self, storage_key: str) -> bool:
        """Delete an object from storage.

        Args:
            storage_key: Object key previously returned from ``upload``.

        Returns:
            True on success; False when deletion fails.
        """


class SupabaseUploader(StorageUploader):
    """Supabase Storage implementation of ``StorageUploader``."""

    def __init__(self) -> None:
        """Create a Supabase client for the configured bucket.

        Raises:
            ValueError: If Supabase URL or key settings are missing.
        """
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set")

        self._client: Client = create_client(
            settings.SUPABASE_URL, settings.SUPABASE_KEY
        )
        self._bucket = settings.SUPABASE_BUCKET

    def upload(self, file_bytes: bytes, filename: str) -> dict:
        """Upload a JPEG to Supabase Storage and return its public metadata.

        Args:
            file_bytes: Raw JPEG contents.
            filename: Destination object key in the bucket.

        Returns:
            Dict with ``url``, ``width``, ``height``, and ``storage_key``.

        Raises:
            RuntimeError: If the Supabase Storage HTTP upload fails.
        """
        key = filename
        with Image.open(BytesIO(file_bytes)) as img:
            width, height = img.size
        upload_url = f"{settings.SUPABASE_URL}/storage/v1/object/{self._bucket}/{key}"
        response = httpx.post(
            upload_url,
            content=file_bytes,
            headers={
                "Authorization": f"Bearer {settings.SUPABASE_KEY}",
                "Content-Type": "image/jpeg",
            },
        )
        if not response.is_success:
            raise RuntimeError(f"Supabase {response.status_code}: {response.text}")
        public_url = (
            f"{settings.SUPABASE_URL}/storage/v1/object/public/{self._bucket}/{key}"
        )
        logger.info("Uploaded %s to Supabase at %s", filename, public_url)
        return {"url": public_url, "width": width, "height": height, "storage_key": key}

    def delete(self, storage_key: str) -> bool:
        """Remove an object from the configured Supabase bucket.

        Args:
            storage_key: Object key to delete.

        Returns:
            True when removal succeeds; False when an exception occurs.
        """
        try:
            self._client.storage.from_(self._bucket).remove([storage_key])
            logger.info("Deleted %s from Supabase", storage_key)
            return True
        except Exception:
            logger.exception("Failed to delete %s", storage_key)
            return False
