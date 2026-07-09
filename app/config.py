import os

from dotenv import load_dotenv

load_dotenv()


def _csv(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


class Config:
    PORT = int(os.environ.get("PORT", "8000"))
    DATABASE_URL = os.environ.get(
        "DATABASE_URL",
        "postgresql://portfolio:portfolio@localhost:5433/portfolio",
    )

    AWS_ENDPOINT = os.environ.get("AWS_ENDPOINT")
    AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID", "test")
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY", "test")
    S3_BUCKET = os.environ.get("S3_BUCKET", "images")

    CLOUDFRONT_URL = os.environ.get("CLOUDFRONT_URL", "http://localhost:4566/images")
    JWT_SECRET = os.environ.get("JWT_SECRET", "dev-secret-change-in-production")
    REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379")

    GITHUB_CLIENT_ID = os.environ.get("GITHUB_CLIENT_ID", "")
    GITHUB_CLIENT_SECRET = os.environ.get("GITHUB_CLIENT_SECRET", "")
    ADMIN_GITHUB_USERNAME = os.environ.get("ADMIN_GITHUB_USERNAME", "Tydos")

    CORS_ORIGINS = _csv(
        os.environ.get("CORS_ORIGINS", "http://localhost:3001,http://localhost:3000")
    )
    DISABLE_RATE_LIMIT = os.environ.get("DISABLE_RATE_LIMIT") == "true"


config = Config()
