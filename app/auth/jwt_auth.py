"""JWT auth dependencies, mirroring middleware/auth.ts."""

from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from fastapi import Depends, HTTPException, Request

from config import config

ALGORITHM = "HS256"


def sign_token(payload: dict[str, Any]) -> str:
    to_encode = {
        **payload,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
    }
    return jwt.encode(to_encode, config.JWT_SECRET, algorithm=ALGORITHM)


def require_auth(request: Request) -> dict[str, Any]:
    header = request.headers.get("authorization", "")
    if not header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication required")
    try:
        return jwt.decode(header[7:], config.JWT_SECRET, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def require_admin(user: dict[str, Any] = Depends(require_auth)) -> dict[str, Any]:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user
