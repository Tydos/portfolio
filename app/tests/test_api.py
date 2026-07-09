"""Smoke tests for the image hosting API."""

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_root():
    res = client.get("/api")
    assert res.status_code == 200
    assert res.json()["message"] == "Image Hosting API"


def test_health():
    res = client.get("/api/health")
    assert res.status_code in (200, 503)
    body = res.json()
    assert "database" in body
    assert "redis" in body
    assert "s3" in body
