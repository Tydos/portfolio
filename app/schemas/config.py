"""Configuration module for the application."""

import os
from dotenv import load_dotenv

load_dotenv(override=True)


class Settings:
    """Application settings."""

    # API Configuration
    API_TITLE = "Portfolio Backend Server"
    API_DESCRIPTION = "Vercel + FastAPI API Gateway for Portfolio"
    API_VERSION = "1.0.0"

    # Database Configuration
    DATABASE_URL = os.getenv("DATABASE_URL")

    # Supabase Configuration (NEXT_PUBLIC_ vars are shared with the frontend)
    SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL") or os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY") or os.getenv(
        "SUPABASE_KEY"
    )
    SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "images")

    # CORS Configuration
    CORS_ORIGINS = ["*"]
    CORS_ALLOW_CREDENTIALS = True
    CORS_ALLOW_METHODS = ["*"]
    CORS_ALLOW_HEADERS = ["*"]

    # Admin Authentication
    ADMIN_API_KEY = os.getenv("ADMIN_API_KEY")

    # Supabase Auth (GitHub OAuth)
    ADMIN_GITHUB_USERNAME = os.getenv("ADMIN_GITHUB_USERNAME", "Tydos")


settings = Settings()
