"""Configuration module for the application."""

import os
from typing import ClassVar

from dotenv import load_dotenv

load_dotenv(override=True)


class Settings:
    """Application settings loaded from environment variables."""

    # API Configuration
    API_TITLE: ClassVar[str] = "Portfolio Backend Server"
    API_DESCRIPTION: ClassVar[str] = "Vercel + FastAPI API Gateway for Portfolio"
    API_VERSION: ClassVar[str] = "1.0.0"

    # Database Configuration
    DATABASE_URL: ClassVar[str | None] = os.getenv("DATABASE_URL")

    # Supabase Configuration (NEXT_PUBLIC_ vars are shared with the frontend)
    SUPABASE_URL: ClassVar[str | None] = os.getenv(
        "NEXT_PUBLIC_SUPABASE_URL"
    ) or os.getenv("SUPABASE_URL")
    SUPABASE_KEY: ClassVar[str | None] = os.getenv(
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    ) or os.getenv("SUPABASE_KEY")
    SUPABASE_BUCKET: ClassVar[str] = os.getenv("SUPABASE_BUCKET", "images")

    # CORS Configuration
    CORS_ORIGINS: ClassVar[list[str]] = ["*"]
    CORS_ALLOW_CREDENTIALS: ClassVar[bool] = True
    CORS_ALLOW_METHODS: ClassVar[list[str]] = ["*"]
    CORS_ALLOW_HEADERS: ClassVar[list[str]] = ["*"]

    # Admin Authentication
    ADMIN_API_KEY: ClassVar[str | None] = os.getenv("ADMIN_API_KEY")

    # Supabase Auth (GitHub OAuth)
    ADMIN_GITHUB_USERNAME: ClassVar[str] = os.getenv("ADMIN_GITHUB_USERNAME", "Tydos")


settings = Settings()
