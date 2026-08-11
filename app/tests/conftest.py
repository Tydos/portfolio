"""Shared fixtures for backend tests."""

from __future__ import annotations

import os
from collections.abc import Iterator
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

# Required before Settings / SupabaseUploader import (CI has no .env).
os.environ.setdefault("NEXT_PUBLIC_SUPABASE_URL", "https://test.supabase.co")
os.environ.setdefault("NEXT_PUBLIC_SUPABASE_ANON_KEY", "test-anon-key")
os.environ.setdefault("ADMIN_API_KEY", "test-admin-key")
os.environ.setdefault("ADMIN_GITHUB_USERNAME", "Tydos")
os.environ.setdefault("DATABASE_URL", "postgresql://test:test@localhost:5432/test")

# routes.py constructs SupabaseUploader at import time.
_create_client_patcher = patch("supabase.create_client", return_value=MagicMock())
_create_client_patcher.start()

from main import app


@pytest.fixture
def client() -> Iterator[TestClient]:
    """Yield a FastAPI TestClient bound to the app under test."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def admin_api_key(monkeypatch: pytest.MonkeyPatch) -> str:
    """Pin deprecated X-API-Key auth to a known value for tests."""
    monkeypatch.setattr("auth.auth.settings.ADMIN_API_KEY", "test-admin-key")
    return "test-admin-key"


@pytest.fixture
def admin_headers(admin_api_key: str) -> dict[str, str]:
    """Return headers that authenticate via the deprecated API key."""
    return {"X-API-Key": admin_api_key}
