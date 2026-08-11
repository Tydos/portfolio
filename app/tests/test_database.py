"""Unit tests for DatabaseManager with mocked psycopg2 connections."""

from unittest.mock import MagicMock, patch

import pytest
from psycopg2.errors import UniqueViolation

from schemas.photo import Photo
from services.database import DatabaseManager


@pytest.fixture
def manager() -> DatabaseManager:
    """Return a manager with a fake DSN (no real pool)."""
    return DatabaseManager(db_url="postgresql://test:test@localhost:5432/test")


def _photo() -> Photo:
    return Photo(
        filename="shot.jpg",
        url="https://example.com/shot.jpg",
        width=100,
        height=200,
        category="nature",
    )


def test_get_connection_pool_requires_url():
    mgr = DatabaseManager(db_url=None)
    mgr.db_url = None
    with pytest.raises(RuntimeError, match="DATABASE_URL"):
        mgr.get_connection_pool()


def test_get_connection_pool_creates_once(manager):
    fake_pool = MagicMock()
    with patch(
        "services.database.pool.ThreadedConnectionPool", return_value=fake_pool
    ) as ctor:
        first = manager.get_connection_pool()
        second = manager.get_connection_pool()
    assert first is fake_pool
    assert second is fake_pool
    ctor.assert_called_once()


def test_close_pool(manager):
    fake_pool = MagicMock()
    manager.connection_pool = fake_pool
    manager.close_pool()
    fake_pool.closeall.assert_called_once()
    assert manager.connection_pool is None


def test_close_pool_noop_when_unset(manager):
    manager.connection_pool = None
    manager.close_pool()  # should not raise


def test_ping_success(manager):
    conn = MagicMock()
    cur = MagicMock()
    conn.cursor.return_value.__enter__.return_value = cur
    with (
        patch.object(manager, "get_connection", return_value=conn),
        patch.object(manager, "return_connection") as ret,
    ):
        assert manager.ping() is True
    cur.execute.assert_called_once_with("SELECT 1")
    ret.assert_called_once_with(conn)


def test_ping_failure(manager):
    with patch.object(manager, "get_connection", side_effect=RuntimeError("down")):
        assert manager.ping() is False


def test_upload_photo_to_db_success(manager):
    conn = MagicMock()
    cur = MagicMock()
    cur.fetchone.return_value = (42,)
    conn.cursor.return_value.__enter__.return_value = cur
    with (
        patch.object(manager, "get_connection", return_value=conn),
        patch.object(manager, "return_connection"),
    ):
        photo_id = manager.upload_photo_to_db(_photo())
    assert photo_id == 42
    conn.commit.assert_called_once()


def test_upload_photo_to_db_duplicate(manager):
    conn = MagicMock()
    cur = MagicMock()
    cur.execute.side_effect = UniqueViolation("duplicate")
    conn.cursor.return_value.__enter__.return_value = cur
    with (
        patch.object(manager, "get_connection", return_value=conn),
        patch.object(manager, "return_connection"),
        pytest.raises(ValueError, match="Duplicate filename"),
    ):
        manager.upload_photo_to_db(_photo())
    conn.rollback.assert_called_once()


def test_upload_photo_to_db_missing_id(manager):
    conn = MagicMock()
    cur = MagicMock()
    cur.fetchone.return_value = None
    conn.cursor.return_value.__enter__.return_value = cur
    with (
        patch.object(manager, "get_connection", return_value=conn),
        patch.object(manager, "return_connection"),
        pytest.raises(RuntimeError, match="INSERT returned no id"),
    ):
        manager.upload_photo_to_db(_photo())


def test_delete_photo_by_id_success(manager):
    conn = MagicMock()
    cur = MagicMock()
    cur.fetchone.return_value = ("gone.jpg",)
    conn.cursor.return_value.__enter__.return_value = cur
    with (
        patch.object(manager, "get_connection", return_value=conn),
        patch.object(manager, "return_connection"),
    ):
        assert manager.delete_photo_by_id(9) == "gone.jpg"


def test_delete_photo_by_id_not_found(manager):
    conn = MagicMock()
    cur = MagicMock()
    cur.fetchone.return_value = None
    conn.cursor.return_value.__enter__.return_value = cur
    with (
        patch.object(manager, "get_connection", return_value=conn),
        patch.object(manager, "return_connection"),
        pytest.raises(ValueError, match="Photo 9 not found"),
    ):
        manager.delete_photo_by_id(9)


def test_fetch_photographs(manager):
    conn = MagicMock()
    cur = MagicMock()
    cur.fetchall.return_value = [
        {
            "id": 1,
            "filename": "a.jpg",
            "url": "https://example.com/a.jpg",
            "category": "nature",
            "width": 10,
            "height": 20,
        }
    ]
    conn.cursor.return_value.__enter__.return_value = cur
    with (
        patch.object(manager, "get_connection", return_value=conn),
        patch.object(manager, "return_connection"),
    ):
        rows = manager.fetch_photographs(limit=5, offset=0)
    assert rows[0]["filename"] == "a.jpg"
    cur.execute.assert_called_once()


def test_create_photographs_table(manager):
    conn = MagicMock()
    cur = MagicMock()
    conn.cursor.return_value.__enter__.return_value = cur
    with (
        patch.object(manager, "get_connection", return_value=conn),
        patch.object(manager, "return_connection"),
    ):
        manager.create_photographs_table()
    conn.commit.assert_called_once()
    cur.execute.assert_called_once()


def test_create_photographs_table_rolls_back_on_error(manager):
    conn = MagicMock()
    cur = MagicMock()
    cur.execute.side_effect = RuntimeError("ddl failed")
    conn.cursor.return_value.__enter__.return_value = cur
    with (
        patch.object(manager, "get_connection", return_value=conn),
        patch.object(manager, "return_connection"),
        pytest.raises(RuntimeError, match="ddl failed"),
    ):
        manager.create_photographs_table()
    conn.rollback.assert_called_once()


def test_get_and_return_connection(manager):
    fake_pool = MagicMock()
    conn = MagicMock()
    fake_pool.getconn.return_value = conn
    manager.connection_pool = fake_pool

    assert manager.get_connection() is conn
    manager.return_connection(conn)
    manager.return_connection(None)

    fake_pool.getconn.assert_called_once()
    fake_pool.putconn.assert_called_once_with(conn)
