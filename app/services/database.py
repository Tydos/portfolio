"""Database connection pool and photograph CRUD operations."""

from __future__ import annotations

import logging
from collections.abc import Iterator
from contextlib import contextmanager
from typing import Any

from psycopg2 import pool
from psycopg2.errors import UniqueViolation
from psycopg2.extras import RealDictCursor

from schemas.config import settings
from schemas.photo import Photo

logger = logging.getLogger("app").getChild(__name__)


class DatabaseManager:
    """Manages database connections and photograph operations."""

    def __init__(self, db_url: str | None = None) -> None:
        """Initialize the manager with an optional database URL.

        Args:
            db_url: Postgres DSN. Defaults to ``settings.DATABASE_URL``.
        """
        self.db_url = db_url or settings.DATABASE_URL
        self.connection_pool = None

    def get_connection_pool(self) -> pool.ThreadedConnectionPool:
        """Return the shared threaded connection pool, creating it if needed.

        Returns:
            A ``ThreadedConnectionPool`` bound to ``self.db_url``.

        Raises:
            RuntimeError: If ``DATABASE_URL`` / ``db_url`` is missing.
        """
        if not self.db_url:
            raise RuntimeError("Missing DATABASE_URL environment variable")
        if self.connection_pool is None:
            self.connection_pool = pool.ThreadedConnectionPool(
                minconn=2, maxconn=10, dsn=self.db_url
            )
        return self.connection_pool

    def close_pool(self) -> None:
        """Close all pooled connections and clear the pool reference."""
        if self.connection_pool is not None:
            self.connection_pool.closeall()
            self.connection_pool = None
            logger.info("Database connection pool closed")

    def get_connection(self) -> Any:
        """Borrow a connection from the pool.

        Returns:
            A psycopg2 connection object.
        """
        return self.get_connection_pool().getconn()

    def return_connection(self, conn: Any) -> None:
        """Return a borrowed connection to the pool.

        Args:
            conn: Connection previously obtained via ``get_connection``.
        """
        if conn is not None:
            self.get_connection_pool().putconn(conn)

    @contextmanager
    def _connection(self) -> Iterator[Any]:
        """Yield a pooled connection and always return it afterward."""
        conn = self.get_connection()
        try:
            yield conn
        finally:
            self.return_connection(conn)

    def create_photographs_table(self) -> None:
        """Create the ``photographs`` table if it does not already exist.

        Raises:
            Exception: Propagates database errors after rolling back.
        """
        with self._connection() as conn:
            try:
                with conn.cursor() as cur:
                    cur.execute("""
                        CREATE TABLE IF NOT EXISTS photographs (
                            id SERIAL PRIMARY KEY,
                            filename VARCHAR(255) NOT NULL UNIQUE,
                            url VARCHAR(2048) NOT NULL,
                            category VARCHAR(50) DEFAULT 'nature' NOT NULL,
                            width INTEGER NOT NULL DEFAULT 1080,
                            height INTEGER NOT NULL DEFAULT 1920,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                        );
                    """)
                conn.commit()
                logger.info("Photographs table created successfully")
            except Exception:
                conn.rollback()
                logger.exception("Failed to create photographs table")
                raise

    def ping(self) -> bool:
        """Check whether the database accepts a simple query.

        Returns:
            True if ``SELECT 1`` succeeds; False on any connection/query error.
        """
        try:
            with self._connection() as conn, conn.cursor() as cur:
                cur.execute("SELECT 1")
            return True
        except Exception:
            logger.exception("Database ping failed")
            return False

    def _photo_to_tuple(self, photo: Photo) -> tuple:
        """Convert a Photo model into an INSERT parameter tuple."""
        return (
            photo.filename.lower(),
            str(photo.url),
            photo.category,
            photo.width,
            photo.height,
        )

    def upload_photo_to_db(self, photo: Photo) -> int:
        """Insert a photograph row and return its generated id.

        Args:
            photo: Validated photograph metadata to persist.

        Returns:
            The new row's primary key.

        Raises:
            ValueError: If the filename already exists (unique violation).
            RuntimeError: If INSERT returns no id.
            Exception: Propagates other database errors after rollback.
        """
        with self._connection() as conn:
            try:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        INSERT INTO photographs (filename, url, category, width, height)
                        VALUES (%s, %s, %s, %s, %s)
                        RETURNING id;
                        """,
                        self._photo_to_tuple(photo),
                    )
                    result = cur.fetchone()
                conn.commit()
                if result is None:
                    raise RuntimeError(
                        "INSERT returned no id — this should never happen"
                    )
                return result[0]
            except UniqueViolation as exc:
                conn.rollback()
                raise ValueError(f"Duplicate filename: {photo.filename}") from exc
            except Exception:
                conn.rollback()
                logger.exception("Failed to upload photo to database")
                raise

    def delete_photo_by_id(self, photo_id: int) -> str:
        """Delete a photograph row and return its filename for storage cleanup.

        Args:
            photo_id: Primary key of the photograph to delete.

        Returns:
            The deleted photograph's filename.

        Raises:
            ValueError: If no row matches ``photo_id``.
            Exception: Propagates other database errors after rollback.
        """
        with self._connection() as conn:
            try:
                with conn.cursor() as cur:
                    cur.execute(
                        "DELETE FROM photographs WHERE id = %s RETURNING filename;",
                        (photo_id,),
                    )
                    row = cur.fetchone()
                conn.commit()
                if row is None:
                    raise ValueError(f"Photo {photo_id} not found")
                return row[0]
            except Exception:
                conn.rollback()
                raise

    def fetch_photographs(self, limit: int, offset: int) -> list[dict]:
        """Fetch a page of photograph rows from the database.

        Args:
            limit: Maximum number of rows to return (1–100 at the API layer).
            offset: Number of rows to skip.

        Returns:
            A list of photograph dicts with id, filename, url, category, width,
            and height.
        """
        with (
            self._connection() as conn,
            conn.cursor(cursor_factory=RealDictCursor) as cur,
        ):
            cur.execute(
                """
                SELECT id, filename, url, category, width, height
                FROM photographs
                ORDER BY id
                LIMIT %s OFFSET %s;
                """,
                (limit, offset),
            )
            return [dict(r) for r in cur.fetchall()]


db = DatabaseManager()
