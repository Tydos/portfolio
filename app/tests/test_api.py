from io import BytesIO
from unittest.mock import patch
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_images():
    with patch("app.api.routes.db.fetch_photographs", return_value=[]):
        assert client.get("/images").status_code == 200


def test_get_images_falls_back_to_static_on_db_error():
    with patch("app.api.routes.db.fetch_photographs", side_effect=Exception("db down")):
        r = client.get("/images")
        assert r.status_code == 200
        assert r.json()  # static fallback data is non-empty


def test_upload_no_auth():
    r = client.post("/upload", files=[("file", ("test.jpg", BytesIO(b"img"), "image/jpeg"))])
    assert r.status_code == 422


def test_upload_wrong_key():
    r = client.post(
        "/upload",
        files=[("file", ("test.jpg", BytesIO(b"img"), "image/jpeg"))],
        headers={"X-API-Key": "wrong"},
    )
    assert r.status_code == 401


def test_upload_correct_key():
    mock_upload_result = {
        "url": "https://example.supabase.co/storage/v1/object/public/images/test.jpg",
        "width": 1080,
        "height": 1920,
        "storage_key": "images/test.jpg",
    }
    with patch("app.auth.auth.settings") as mock_settings, \
         patch("app.api.routes._upload_service.upload_one") as mock_upload_one:
        mock_settings.ADMIN_API_KEY = "test-key"
        mock_upload_one.return_value = {
            "id": 42,
            "filename": "test.jpg",
            "url": mock_upload_result["url"],
            "width": 1080,
            "height": 1920,
            "category": "nature",
        }
        r = client.post(
            "/upload",
            files=[("file", ("test.jpg", BytesIO(b"img"), "image/jpeg"))],
            data={"category": "nature"},
            headers={"X-API-Key": "test-key"},
        )
    assert r.status_code == 201
    assert r.json()["id"] == 42
    assert r.json()["filename"] == "test.jpg"


def test_upload_rejects_non_jpeg():
    with patch("app.auth.auth.settings") as mock_settings:
        mock_settings.ADMIN_API_KEY = "test-key"
        r = client.post(
            "/upload",
            files=[("file", ("photo.png", BytesIO(b"img"), "image/png"))],
            headers={"X-API-Key": "test-key"},
        )
    assert r.status_code == 400


def test_upload_batch_correct_key():
    with patch("app.auth.auth.settings") as mock_settings, \
         patch("app.api.routes._upload_service.upload_one") as mock_upload_one:
        mock_settings.ADMIN_API_KEY = "test-key"
        mock_upload_one.return_value = {
            "id": 1,
            "filename": "a.jpg",
            "url": "https://example.supabase.co/storage/v1/object/public/images/a.jpg",
            "width": 800,
            "height": 600,
            "category": "travel",
        }
        r = client.post(
            "/upload-batch",
            files=[("files", ("a.jpg", BytesIO(b"img"), "image/jpeg"))],
            data={"category": "travel"},
            headers={"X-API-Key": "test-key"},
        )
    assert r.status_code == 200
    body = r.json()
    assert len(body["uploaded"]) == 1
    assert body["uploaded"][0]["filename"] == "a.jpg"


def test_health_db_up():
    with patch("app.api.routes.db.ping", return_value=True):
        r = client.get("/health")
        assert r.status_code == 200
        assert r.json()["database"] == "connected"


def test_health_db_down():
    with patch("app.api.routes.db.ping", return_value=False):
        assert client.get("/health").status_code == 503
