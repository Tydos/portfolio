"""Admin authentication dependency for protected API routes."""

import time

import httpx
import jwt
from fastapi import Header, HTTPException

from schemas.config import settings

_jwks_cache: dict = {"keys": [], "fetched_at": 0.0}
_JWKS_TTL = 3600


def _get_jwks() -> list[dict]:
    """Fetch Supabase JWKS, using a short in-memory cache.

    Returns:
        A list of JWK dicts from the Supabase auth well-known endpoint.
    """
    if time.time() - _jwks_cache["fetched_at"] < _JWKS_TTL and _jwks_cache["keys"]:
        return _jwks_cache["keys"]
    response = httpx.get(
        f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json", timeout=5
    )
    response.raise_for_status()
    keys = response.json().get("keys", [])
    _jwks_cache["keys"] = keys
    _jwks_cache["fetched_at"] = time.time()
    return keys


def _decode_supabase_token(token: str) -> dict:
    """Decode and verify a Supabase ES256 access token.

    Args:
        token: Bearer JWT string (without the ``Bearer `` prefix).

    Returns:
        The verified JWT payload.

    Raises:
        jwt.InvalidTokenError: If no matching JWKS key is found or decode fails.
    """
    kid = jwt.get_unverified_header(token).get("kid")
    keys = _get_jwks()
    key_data = next((k for k in keys if k.get("kid") == kid), keys[0] if keys else None)
    if not key_data:
        raise jwt.InvalidTokenError("No matching public key found in JWKS")
    public_key = jwt.algorithms.ECAlgorithm.from_jwk(key_data)
    return jwt.decode(token, public_key, algorithms=["ES256"], audience="authenticated")


def verify_admin_key(
    authorization: str | None = Header(None, alias="Authorization"),
    x_api_key: str | None = Header(None, alias="X-API-Key"),
) -> None:
    """Verify admin credentials via Bearer JWT or deprecated API key.

    Prefers a Supabase Bearer JWT whose ``user_metadata.user_name`` matches
    ``ADMIN_GITHUB_USERNAME``. Falls back to ``X-API-Key`` for scripts.

    Args:
        authorization: Optional ``Authorization`` header value.
        x_api_key: Optional deprecated ``X-API-Key`` header value.

    Raises:
        HTTPException: 401 for missing/invalid credentials; 403 when the JWT
            belongs to a non-admin GitHub user.
    """
    # Primary: Supabase Bearer JWT (GitHub OAuth, ES256)
    if authorization and authorization.startswith("Bearer "):
        token = authorization.removeprefix("Bearer ")
        try:
            payload = _decode_supabase_token(token)
        except jwt.ExpiredSignatureError as exc:
            raise HTTPException(status_code=401, detail="Token expired") from exc
        except jwt.InvalidTokenError as exc:
            raise HTTPException(
                status_code=401, detail=f"Invalid token: {exc}"
            ) from exc

        username = (payload.get("user_metadata") or {}).get("user_name", "")
        if username != settings.ADMIN_GITHUB_USERNAME:
            raise HTTPException(status_code=403, detail="Not authorized as admin")
        return

    # Deprecated: X-API-Key (kept for scripts/curl)
    if x_api_key:
        if not settings.ADMIN_API_KEY or x_api_key != settings.ADMIN_API_KEY:
            raise HTTPException(status_code=401, detail="Invalid API key")
        return

    raise HTTPException(status_code=401, detail="Authentication required")
