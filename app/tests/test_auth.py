"""Unit tests for admin auth dependency."""

from unittest.mock import MagicMock, patch

import jwt
import pytest
from fastapi import HTTPException

from auth import auth as auth_module
from auth.auth import verify_admin_key


@pytest.fixture(autouse=True)
def _clear_jwks_cache():
    """Reset the module-level JWKS cache between tests."""
    auth_module._jwks_cache["keys"] = []
    auth_module._jwks_cache["fetched_at"] = 0.0
    yield
    auth_module._jwks_cache["keys"] = []
    auth_module._jwks_cache["fetched_at"] = 0.0


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
        assert verify_admin_key(authorization="Bearer tok", x_api_key=None) is None


def test_verify_bearer_prefers_jwt_over_api_key(monkeypatch):
    """Bearer path runs first; invalid JWT should not fall through to API key."""
    monkeypatch.setattr("auth.auth.settings.ADMIN_API_KEY", "secret")
    with (
        patch(
            "auth.auth._decode_supabase_token",
            side_effect=jwt.InvalidTokenError("bad"),
        ),
        pytest.raises(HTTPException) as exc,
    ):
        verify_admin_key(authorization="Bearer bad", x_api_key="secret")
    assert exc.value.status_code == 401
    assert "Invalid token" in exc.value.detail


def test_get_jwks_fetches_and_caches(monkeypatch):
    monkeypatch.setattr("auth.auth.settings.SUPABASE_URL", "https://test.supabase.co")
    response = MagicMock()
    response.raise_for_status = MagicMock()
    response.json.return_value = {"keys": [{"kid": "k1"}]}
    with patch("auth.auth.httpx.get", return_value=response) as get:
        first = auth_module._get_jwks()
        second = auth_module._get_jwks()
    assert first == [{"kid": "k1"}]
    assert second == first
    get.assert_called_once()


def test_decode_supabase_token_no_keys():
    with (
        patch("auth.auth._get_jwks", return_value=[]),
        patch("auth.auth.jwt.get_unverified_header", return_value={"kid": "missing"}),
        pytest.raises(jwt.InvalidTokenError, match="No matching public key"),
    ):
        auth_module._decode_supabase_token("fake.token")


def test_decode_supabase_token_success():
    key_data = {"kid": "k1", "kty": "EC"}
    public_key = object()
    with (
        patch("auth.auth._get_jwks", return_value=[key_data]),
        patch("auth.auth.jwt.get_unverified_header", return_value={"kid": "k1"}),
        patch(
            "auth.auth.jwt.algorithms.ECAlgorithm.from_jwk",
            return_value=public_key,
        ),
        patch(
            "auth.auth.jwt.decode",
            return_value={"sub": "user-1"},
        ) as decode,
    ):
        payload = auth_module._decode_supabase_token("fake.token")
    assert payload["sub"] == "user-1"
    decode.assert_called_once()
