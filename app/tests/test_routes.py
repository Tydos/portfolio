"""API route tests — public reads and authenticated upload/delete."""

from io import BytesIO
from unittest.mock import patch

import jwt


def test_root(client):
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["message"] == "Portfolio Backend API Gateway"


def test_get_images(client):
    photos = [
        {
            "id": 1,
            "filename": "a.jpg",
            "url": "https://example.com/a.jpg",
            "category": "nature",
            "width": 100,
            "height": 200,
        }
    ]
    with patch("api.routes.db.fetch_photographs", return_value=photos):
        r = client.get("/images")
    assert r.status_code == 200
    assert r.json() == photos


def test_get_images_returns_503_on_db_error(client):
    with patch("api.routes.db.fetch_photographs", side_effect=Exception("db down")):
        r = client.get("/images")
    assert r.status_code == 503
    assert r.json()["detail"] == "Database unavailable"


def test_get_images_query_validation(client):
    assert client.get("/images?limit=0").status_code == 422
    assert client.get("/images?limit=101").status_code == 422
    assert client.get("/images?offset=-1").status_code == 422


def test_health_db_up(client):
    with patch("api.routes.db.ping", return_value=True):
        r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"message": "server active", "database": "connected"}


def test_health_db_down(client):
    with patch("api.routes.db.ping", return_value=False):
        r = client.get("/health")
    assert r.status_code == 503
    assert r.json()["detail"]["database"] == "connection failed"


def test_upload_requires_auth(client):
    r = client.post(
        "/upload",
        files=[("file", ("test.jpg", BytesIO(b"img"), "image/jpeg"))],
    )
    assert r.status_code == 401
    assert r.json()["detail"] == "Authentication required"


def test_upload_wrong_api_key(client, admin_api_key):
    r = client.post(
        "/upload",
        files=[("file", ("test.jpg", BytesIO(b"img"), "image/jpeg"))],
        headers={"X-API-Key": "wrong"},
    )
    assert r.status_code == 401
    assert r.json()["detail"] == "Invalid API key"


def test_upload_with_api_key(client, admin_headers):
    created = {
        "id": 42,
        "filename": "test.jpg",
        "url": "https://test.supabase.co/storage/v1/object/public/images/test.jpg",
        "width": 1080,
        "height": 1920,
        "category": "nature",
    }
    with patch(
        "api.routes._upload_service.upload_one", return_value=created
    ) as mock_up:
        r = client.post(
            "/upload",
            files=[("file", ("test.jpg", BytesIO(b"img"), "image/jpeg"))],
            data={"category": "nature"},
            headers=admin_headers,
        )
    assert r.status_code == 201
    assert r.json() == created
    mock_up.assert_called_once()
    args = mock_up.call_args[0]
    assert args[1] == "test.jpg"
    assert args[2] == "nature"


def test_upload_with_bearer_jwt(client, monkeypatch):
    monkeypatch.setattr("auth.auth.settings.ADMIN_GITHUB_USERNAME", "Tydos")
    created = {
        "id": 7,
        "filename": "shot.jpg",
        "url": "https://example.com/shot.jpg",
        "width": 800,
        "height": 600,
        "category": "street",
    }
    payload = {"user_metadata": {"user_name": "Tydos"}}
    with (
        patch("auth.auth._decode_supabase_token", return_value=payload),
        patch("api.routes._upload_service.upload_one", return_value=created),
    ):
        r = client.post(
            "/upload",
            files=[("file", ("shot.jpg", BytesIO(b"img"), "image/jpeg"))],
            data={"category": "street"},
            headers={"Authorization": "Bearer fake.jwt.token"},
        )
    assert r.status_code == 201
    assert r.json()["id"] == 7


def test_upload_bearer_non_admin_forbidden(client, monkeypatch):
    monkeypatch.setattr("auth.auth.settings.ADMIN_GITHUB_USERNAME", "Tydos")
    with patch(
        "auth.auth._decode_supabase_token",
        return_value={"user_metadata": {"user_name": "someone-else"}},
    ):
        r = client.post(
            "/upload",
            files=[("file", ("shot.jpg", BytesIO(b"img"), "image/jpeg"))],
            headers={"Authorization": "Bearer fake.jwt.token"},
        )
    assert r.status_code == 403


def test_upload_bearer_expired(client):
    with patch(
        "auth.auth._decode_supabase_token",
        side_effect=jwt.ExpiredSignatureError("expired"),
    ):
        r = client.post(
            "/upload",
            files=[("file", ("shot.jpg", BytesIO(b"img"), "image/jpeg"))],
            headers={"Authorization": "Bearer expired.token"},
        )
    assert r.status_code == 401
    assert r.json()["detail"] == "Token expired"


def test_upload_rejects_non_jpeg(client, admin_headers):
    r = client.post(
        "/upload",
        files=[("file", ("photo.png", BytesIO(b"img"), "image/png"))],
        headers=admin_headers,
    )
    assert r.status_code == 400
    assert "jpg" in r.json()["detail"].lower()


def test_upload_duplicate_filename_conflict(client, admin_headers):
    with patch(
        "api.routes._upload_service.upload_one",
        side_effect=ValueError("Duplicate filename: test.jpg"),
    ):
        r = client.post(
            "/upload",
            files=[("file", ("test.jpg", BytesIO(b"img"), "image/jpeg"))],
            headers=admin_headers,
        )
    assert r.status_code == 409
    assert "Duplicate" in r.json()["detail"]


def test_delete_requires_auth(client):
    assert client.delete("/delete/1").status_code == 401


def test_delete_success(client, admin_headers):
    with patch("api.routes._upload_service.delete_one") as mock_del:
        r = client.delete("/delete/12", headers=admin_headers)
    assert r.status_code == 204
    mock_del.assert_called_once_with(12)


def test_delete_not_found(client, admin_headers):
    with patch(
        "api.routes._upload_service.delete_one",
        side_effect=ValueError("Photo 99 not found"),
    ):
        r = client.delete("/delete/99", headers=admin_headers)
    assert r.status_code == 404
    assert "99" in r.json()["detail"]
