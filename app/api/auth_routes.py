"""GitHub OAuth code exchange + current-user endpoint, mirroring routes/auth.ts."""

from typing import Any

import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from auth.jwt_auth import require_auth, sign_token
from config import config
from middleware.rate_limit import auth_limiter
from services import database as db

router = APIRouter(prefix="/api/auth", tags=["auth"])


class GithubCallbackBody(BaseModel):
    code: str | None = None


@router.post("/github/callback", dependencies=[Depends(auth_limiter)])
async def github_callback(body: GithubCallbackBody):
    if not body.code:
        raise HTTPException(status_code=400, detail="Missing code")

    if not config.GITHUB_CLIENT_ID or not config.GITHUB_CLIENT_SECRET:
        raise HTTPException(status_code=503, detail="GitHub OAuth not configured")

    async with httpx.AsyncClient() as client:
        token_res = await client.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            json={
                "client_id": config.GITHUB_CLIENT_ID,
                "client_secret": config.GITHUB_CLIENT_SECRET,
                "code": body.code,
            },
        )
        token_data = token_res.json()

        access_token = token_data.get("access_token")
        if not access_token:
            raise HTTPException(
                status_code=401, detail=token_data.get("error", "OAuth failed")
            )

        user_res = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github+json",
            },
        )

    if user_res.status_code != 200:
        raise HTTPException(status_code=401, detail="Failed to fetch GitHub user")

    login = user_res.json()["login"]
    role = "admin" if login == config.ADMIN_GITHUB_USERNAME else "viewer"

    user = db.upsert_user(login, role)
    token = sign_token({"sub": user["id"], "github_username": login, "role": role})

    return {
        "token": token,
        "user": {"id": user["id"], "github_username": login, "role": role},
    }


@router.get("/me")
async def me(current: dict[str, Any] = Depends(require_auth)):
    user = db.get_user_by_github(current["github_username"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user["id"],
        "github_username": current["github_username"],
        "role": user["role"],
    }
