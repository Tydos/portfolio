"""Redis-backed fixed-window rate limiting, mirroring middleware/rateLimit.ts.

Falls back to an in-memory window per process when Redis is unavailable.
"""

import time

from fastapi import HTTPException, Request

from config import config
from services.cache import get_redis

_memory: dict[str, tuple[int, float]] = {}


def _hit(key: str, window_seconds: int) -> int:
    client = get_redis()
    if client is not None:
        try:
            count = client.incr(key)
            if count == 1:
                client.expire(key, window_seconds)
            return count
        except Exception:
            pass

    now = time.monotonic()
    count, reset_at = _memory.get(key, (0, now + window_seconds))
    if now >= reset_at:
        count, reset_at = 0, now + window_seconds
    count += 1
    _memory[key] = (count, reset_at)
    return count


class RateLimiter:
    def __init__(self, prefix: str, max_requests: int, window_seconds: int, message: str):
        self.prefix = prefix
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.message = message

    def __call__(self, request: Request) -> None:
        if config.DISABLE_RATE_LIMIT:
            return
        ip = request.client.host if request.client else "unknown"
        window = int(time.time() // self.window_seconds)
        count = _hit(f"{self.prefix}{ip}:{window}", self.window_seconds)
        if count > self.max_requests:
            raise HTTPException(status_code=429, detail=self.message)


public_read_limiter = RateLimiter(
    "rl:read:", 100, 60, "Too many requests, please try again later."
)
upload_limiter = RateLimiter("rl:upload:", 10, 3600, "Upload rate limit exceeded.")
auth_limiter = RateLimiter("rl:auth:", 20, 60, "Too many auth attempts.")
