"""Unit tests for SupabaseUploader with mocked HTTP and image I/O."""

from io import BytesIO
from unittest.mock import MagicMock, patch

import pytest
from PIL import Image

from services.storage import SupabaseUploader


def _jpeg_bytes(width: int = 8, height: int = 12) -> bytes:
    buffer = BytesIO()
    Image.new("RGB", (width, height), color=(10, 20, 30)).save(buffer, format="JPEG")
    return buffer.getvalue()


@pytest.fixture
def uploader(monkeypatch) -> SupabaseUploader:
    """Build an uploader with settings and Supabase client stubbed."""
    monkeypatch.setattr(
        "services.storage.settings.SUPABASE_URL", "https://test.supabase.co"
    )
    monkeypatch.setattr("services.storage.settings.SUPABASE_KEY", "test-key")
    monkeypatch.setattr("services.storage.settings.SUPABASE_BUCKET", "images")
    with patch("services.storage.create_client", return_value=MagicMock()):
        return SupabaseUploader()


def test_init_requires_settings(monkeypatch):
    monkeypatch.setattr("services.storage.settings.SUPABASE_URL", None)
    monkeypatch.setattr("services.storage.settings.SUPABASE_KEY", None)
    with pytest.raises(ValueError, match="must be set"):
        SupabaseUploader()


def test_upload_success(uploader):
    response = MagicMock()
    response.is_success = True
    with patch("services.storage.httpx.post", return_value=response) as post:
        result = uploader.upload(_jpeg_bytes(16, 24), "shot.jpg")
    assert result["width"] == 16
    assert result["height"] == 24
    assert result["storage_key"] == "shot.jpg"
    assert result["url"].endswith("/images/shot.jpg")
    post.assert_called_once()


def test_upload_http_failure(uploader):
    response = MagicMock()
    response.is_success = False
    response.status_code = 500
    response.text = "boom"
    with (
        patch("services.storage.httpx.post", return_value=response),
        pytest.raises(RuntimeError, match="Supabase 500"),
    ):
        uploader.upload(_jpeg_bytes(), "shot.jpg")


def test_delete_success(uploader):
    assert uploader.delete("shot.jpg") is True
    uploader._client.storage.from_.assert_called_once_with("images")


def test_delete_failure(uploader):
    uploader._client.storage.from_.return_value.remove.side_effect = RuntimeError(
        "network"
    )
    assert uploader.delete("shot.jpg") is False
