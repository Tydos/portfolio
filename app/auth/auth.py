"""Admin authentication dependency."""

import time
from typing import Optional

import httpx
import jwt
from fastapi import Header, HTTPException

from schemas.config import settings

_jwks_cache: dict = {"keys": [], "fetched_at": 0.0}
_JWKS_TTL = 3600


def _get_jwks() -> list[dict]:
    if time.time() - _jwks_cache["fetched_at"] < _JWKS_TTL and _jwks_cache["keys"]:
        return _jwks_cache["keys"]
    r = httpx.get(f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json", timeout=5)
    r.raise_for_status()
    keys = r.json().get("keys", [])
    _jwks_cache["keys"] = keys
    _jwks_cache["fetched_at"] = time.time()
    return keys


def _decode_supabase_token(token: str) -> dict:
    kid = jwt.get_unverified_header(token).get("kid")
    keys = _get_jwks()
    key_data = next((k for k in keys if k.get("kid") == kid), keys[0] if keys else None)
    if not key_data:
        raise jwt.InvalidTokenError("No matching public key found in JWKS")
    public_key = jwt.algorithms.ECAlgorithm.from_jwk(key_data)
    return jwt.decode(token, public_key, algorithms=["ES256"], audience="authenticated")


def verify_admin_key(
    authorization: Optional[str] = Header(None, alias="Authorization"),
    x_api_key: Optional[str] = Header(None, alias="X-API-Key"),
) -> None:
    # Primary: Supabase Bearer JWT (GitHub OAuth, ES256)
    if authorization and authorization.startswith("Bearer "):
        token = authorization.removeprefix("Bearer ")
        try:
            payload = _decode_supabase_token(token)
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Token expired")
        except jwt.InvalidTokenError as exc:
            raise HTTPException(status_code=401, detail=f"Invalid token: {exc}")

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
