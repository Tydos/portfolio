"""Best-effort Redis cache, mirroring services/cache.ts."""

import json
import logging
from typing import Any

import redis

from config import config

logger = logging.getLogger(__name__)

_client: redis.Redis | None = None


def get_redis() -> redis.Redis | None:
    global _client
    if _client is not None:
        return _client
    try:
        _client = redis.Redis.from_url(
            config.REDIS_URL,
            decode_responses=True,
            socket_connect_timeout=1,
            socket_timeout=1,
        )
        return _client
    except Exception:
        return None


def cache_get(key: str) -> Any | None:
    client = get_redis()
    if client is None:
        return None
    try:
        value = client.get(key)
        return json.loads(value) if value else None
    except Exception:
        return None


def cache_set(key: str, value: Any, ttl_seconds: int = 60) -> None:
    client = get_redis()
    if client is None:
        return
    try:
        client.set(key, json.dumps(value), ex=ttl_seconds)
    except Exception:
        pass  # cache is best-effort


def cache_invalidate(pattern: str) -> None:
    client = get_redis()
    if client is None:
        return
    try:
        keys = client.keys(pattern)
        if keys:
            client.delete(*keys)
    except Exception:
        pass


def ping_redis() -> bool:
    client = get_redis()
    if client is None:
        return False
    try:
        return client.ping()
    except Exception:
        return False
