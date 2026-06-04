# Implemented a basic storage upload interface and a Supabase implementation.
from abc import ABC, abstractmethod
from io import BytesIO
import logging

import httpx
from PIL import Image
from supabase import create_client, Client

from schemas.config import settings

logger = logging.getLogger(__name__)


# Abstract base class from which all storage uploaders should inherit. This allows us to swap out the underlying storage implementation without changing the rest of the codebase
class StorageUploader(ABC):
    @abstractmethod
    def upload(self, file_bytes: bytes, filename: str) -> dict: ...

    @abstractmethod
    def delete(self, storage_key: str) -> bool: ...


# Abstract Supabase Logic and expose upload/delete methods.
class SupabaseUploader(StorageUploader):
    def __init__(self):
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set")

        self._client: Client = create_client(
            settings.SUPABASE_URL, settings.SUPABASE_KEY
        )
        self._bucket = settings.SUPABASE_BUCKET

    def upload(self, file_bytes: bytes, filename: str) -> dict:
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
        try:
            self._client.storage.from_(self._bucket).remove([storage_key])
            logger.info("Deleted %s from Supabase", storage_key)
            return True
        except Exception:
            logger.exception("Failed to delete %s", storage_key)
            return False
