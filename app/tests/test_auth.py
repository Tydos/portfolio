"""Unit tests for admin auth dependency."""

from unittest.mock import patch

import jwt
import pytest
from fastapi import HTTPException

from auth.auth import verify_admin_key


def test_verify_missing_credentials():
    with pytest.raises(HTTPException) as exc:
        verify_admin_key(authorization=None, x_api_key=None)
    assert exc.value.status_code == 401
    assert exc.value.detail == "Authentication required"


def test_verify_api_key_ok(monkeypatch):
    monkeypatch.setattr("auth.auth.settings.ADMIN_API_KEY", "secret")
    assert verify_admin_key(authorization=None, x_api_key="secret") is None


def test_verify_api_key_wrong(monkeypatch):
    monkeypatch.setattr("auth.auth.settings.ADMIN_API_KEY", "secret")
    with pytest.raises(HTTPException) as exc:
        verify_admin_key(authorization=None, x_api_key="nope")
    assert exc.value.status_code == 401


def test_verify_api_key_when_unset(monkeypatch):
    monkeypatch.setattr("auth.auth.settings.ADMIN_API_KEY", None)
    with pytest.raises(HTTPException) as exc:
        verify_admin_key(authorization=None, x_api_key="anything")
    assert exc.value.status_code == 401


def test_verify_bearer_admin(monkeypatch):
    monkeypatch.setattr("auth.auth.settings.ADMIN_GITHUB_USERNAME", "Tydos")
    with patch(
        "auth.auth._decode_supabase_token",
        return_value={"user_metadata": {"user_name": "Tydos"}},
    ):
        assert (
            verify_admin_key(authorization="Bearer tok", x_api_key=None) is None
        )


def test_verify_bearer_prefers_jwt_over_api_key(monkeypatch):
    """Bearer path runs first; invalid JWT should not fall through to API key."""
    monkeypatch.setattr("auth.auth.settings.ADMIN_API_KEY", "secret")
    with patch(
        "auth.auth._decode_supabase_token",
        side_effect=jwt.InvalidTokenError("bad"),
    ):
        with pytest.raises(HTTPException) as exc:
            verify_admin_key(authorization="Bearer bad", x_api_key="secret")
    assert exc.value.status_code == 401
    assert "Invalid token" in exc.value.detail
