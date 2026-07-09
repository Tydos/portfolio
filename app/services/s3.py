"""S3 (LocalStack in dev) object storage, mirroring services/s3.ts."""

import boto3
from botocore.config import Config as BotoConfig

from config import config

_s3 = boto3.client(
    "s3",
    region_name=config.AWS_REGION,
    endpoint_url=config.AWS_ENDPOINT,
    aws_access_key_id=config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=config.AWS_SECRET_ACCESS_KEY,
    config=BotoConfig(s3={"addressing_style": "path"} if config.AWS_ENDPOINT else {}),
)


def get_cdn_url(key: str) -> str:
    return f"{config.CLOUDFRONT_URL.rstrip('/')}/{key}"


def ensure_bucket() -> None:
    try:
        _s3.head_bucket(Bucket=config.S3_BUCKET)
    except Exception:
        _s3.create_bucket(Bucket=config.S3_BUCKET)


def upload_object(key: str, body: bytes, content_type: str) -> None:
    _s3.put_object(
        Bucket=config.S3_BUCKET,
        Key=key,
        Body=body,
        ContentType=content_type,
        CacheControl="public, max-age=31536000, immutable",
    )


def delete_objects(keys: list[str]) -> None:
    for key in keys:
        _s3.delete_object(Bucket=config.S3_BUCKET, Key=key)
