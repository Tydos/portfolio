"""PostgreSQL access via a connection pool, mirroring the photographs/users schema."""

import logging
from contextlib import contextmanager
from typing import Any

from psycopg2.extras import RealDictCursor
from psycopg2.pool import ThreadedConnectionPool

from config import config

logger = logging.getLogger(__name__)

_pool: ThreadedConnectionPool | None = None


def _get_pool() -> ThreadedConnectionPool:
    global _pool
    if _pool is None:
        _pool = ThreadedConnectionPool(1, 20, dsn=config.DATABASE_URL)
    return _pool


@contextmanager
def _cursor():
    pool = _get_pool()
    conn = pool.getconn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            yield cur
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        pool.putconn(conn)


def _row_to_photo(row: dict[str, Any]) -> dict[str, Any]:
    created_at = row.get("created_at")
    return {
        "id": row["id"],
        "filename": row["filename"],
        "category": row["category"],
        "width": row["width"],
        "height": row["height"],
        "size_bytes_input": row.get("size_bytes_input"),
        "size_bytes_optimized": row.get("size_bytes_optimized"),
        "cdn_url_thumb": row["cdn_url_thumb"],
        "cdn_url_medium": row["cdn_url_medium"],
        "cdn_url_original": row["cdn_url_original"],
        "created_at": created_at.isoformat() if created_at else None,
    }


def ping() -> bool:
    try:
        with _cursor() as cur:
            cur.execute("SELECT 1")
        return True
    except Exception:
        return False


def get_user_by_github(github_username: str) -> dict[str, Any] | None:
    with _cursor() as cur:
        cur.execute(
            "SELECT id, role FROM users WHERE github_username = %s",
            (github_username,),
        )
        return cur.fetchone()


def upsert_user(github_username: str, role: str = "viewer") -> dict[str, Any]:
    with _cursor() as cur:
        cur.execute(
            """
            INSERT INTO users (github_username, role)
            VALUES (%s, %s)
            ON CONFLICT (github_username)
            DO UPDATE SET github_username = EXCLUDED.github_username
            RETURNING id, role
            """,
            (github_username, role),
        )
        return cur.fetchone()


def insert_photo(photo: dict[str, Any]) -> dict[str, Any]:
    with _cursor() as cur:
        cur.execute(
            """
            INSERT INTO photographs (
              filename, category, width, height,
              size_bytes_input, size_bytes_optimized,
              s3_key_original, s3_key_thumb, s3_key_medium,
              cdn_url_original, cdn_url_thumb, cdn_url_medium,
              uploaded_by
            ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING *
            """,
            (
                photo["filename"],
                photo["category"],
                photo["width"],
                photo["height"],
                photo["size_bytes_input"],
                photo["size_bytes_optimized"],
                photo["s3_key_original"],
                photo["s3_key_thumb"],
                photo["s3_key_medium"],
                photo["cdn_url_original"],
                photo["cdn_url_thumb"],
                photo["cdn_url_medium"],
                photo.get("uploaded_by"),
            ),
        )
        return _row_to_photo(cur.fetchone())


def fetch_photos(
    limit: int, offset: int, category: str | None = None
) -> dict[str, Any]:
    with _cursor() as cur:
        if category:
            cur.execute(
                "SELECT COUNT(*)::int AS total FROM photographs WHERE category = %s",
                (category,),
            )
        else:
            cur.execute("SELECT COUNT(*)::int AS total FROM photographs")
        total = cur.fetchone()["total"]

        where = "WHERE category = %(category)s" if category else ""
        cur.execute(
            f"""
            SELECT id, filename, category, width, height,
                   size_bytes_input, size_bytes_optimized,
                   cdn_url_thumb, cdn_url_medium, cdn_url_original, created_at
            FROM photographs
            {where}
            ORDER BY created_at DESC
            LIMIT %(limit)s OFFSET %(offset)s
            """,
            {"limit": limit, "offset": offset, "category": category},
        )
        rows = cur.fetchall()

    return {"data": [_row_to_photo(r) for r in rows], "total": total}


def get_photo_by_id(photo_id: int) -> dict[str, Any] | None:
    with _cursor() as cur:
        cur.execute("SELECT * FROM photographs WHERE id = %s", (photo_id,))
        row = cur.fetchone()
    return _row_to_photo(row) if row else None


def delete_photo(photo_id: int) -> list[str]:
    """Delete a photo row and return its S3 keys for cleanup."""
    with _cursor() as cur:
        cur.execute(
            """
            DELETE FROM photographs WHERE id = %s
            RETURNING s3_key_original, s3_key_thumb, s3_key_medium
            """,
            (photo_id,),
        )
        row = cur.fetchone()
    if not row:
        raise ValueError("Photo not found")
    return [row["s3_key_original"], row["s3_key_thumb"], row["s3_key_medium"]]


def close_pool() -> None:
    global _pool
    if _pool is not None:
        _pool.closeall()
        _pool = None
