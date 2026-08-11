"""Unit tests for PhotoStorageService upload/delete orchestration."""

from unittest.mock import MagicMock

import pytest
from psycopg2 import DatabaseError

from services.photo_operations import PhotoStorageService


@pytest.fixture
def uploader():
    return MagicMock()


@pytest.fixture
def database():
    return MagicMock()


@pytest.fixture
def service(uploader, database):
    return PhotoStorageService(uploader, database)


def test_upload_one_success(service, uploader, database):
    uploader.upload.return_value = {
        "url": "https://example.com/a.jpg",
        "width": 100,
        "height": 200,
        "storage_key": "a.jpg",
    }
    database.upload_photo_to_db.return_value = 5

    result = service.upload_one(b"bytes", "A.JPG", "nature")

    uploader.upload.assert_called_once_with(b"bytes", "a.jpg")
    assert result == {
        "id": 5,
        "filename": "a.jpg",
        "url": "https://example.com/a.jpg",
        "width": 100,
        "height": 200,
        "category": "nature",
    }
    uploader.delete.assert_not_called()


def test_upload_one_duplicate_rolls_back_storage(service, uploader, database):
    uploader.upload.return_value = {
        "url": "https://example.com/a.jpg",
        "width": 100,
        "height": 200,
        "storage_key": "a.jpg",
    }
    database.upload_photo_to_db.side_effect = ValueError("Duplicate filename: a.jpg")

    with pytest.raises(ValueError, match="Duplicate"):
        service.upload_one(b"bytes", "a.jpg", "nature")

    uploader.delete.assert_called_once_with("a.jpg")


def test_upload_one_db_failure_rolls_back_storage(service, uploader, database):
    uploader.upload.return_value = {
        "url": "https://example.com/a.jpg",
        "width": 100,
        "height": 200,
        "storage_key": "a.jpg",
    }
    database.upload_photo_to_db.side_effect = RuntimeError("boom")

    with pytest.raises(DatabaseError):
        service.upload_one(b"bytes", "a.jpg", "nature")

    uploader.delete.assert_called_once_with("a.jpg")


def test_upload_one_storage_failure(service, uploader):
    uploader.upload.return_value = None
    with pytest.raises(RuntimeError, match="Storage upload failed"):
        service.upload_one(b"bytes", "a.jpg", "nature")


def test_delete_one_success(service, uploader, database):
    database.delete_photo_by_id.return_value = "gone.jpg"
    uploader.delete.return_value = True

    service.delete_one(3)

    database.delete_photo_by_id.assert_called_once_with(3)
    uploader.delete.assert_called_once_with("gone.jpg")


def test_delete_one_not_found(service, database, uploader):
    database.delete_photo_by_id.side_effect = ValueError("Photo 9 not found")
    with pytest.raises(ValueError, match="not found"):
        service.delete_one(9)
    uploader.delete.assert_not_called()


def test_delete_one_storage_orphan_logged(service, uploader, database, caplog):
    database.delete_photo_by_id.return_value = "orphan.jpg"
    uploader.delete.return_value = False

    with caplog.at_level("ERROR"):
        service.delete_one(1)

    assert any("ORPHAN" in msg for msg in caplog.messages)
