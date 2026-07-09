"""Apply SQL migrations in order. Usage: python -m db.migrate"""

import logging
from pathlib import Path

import psycopg2

from config import config

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
logger = logging.getLogger(__name__)

MIGRATIONS_DIR = Path(__file__).parent / "migrations"


def migrate() -> None:
    conn = psycopg2.connect(config.DATABASE_URL)
    try:
        with conn.cursor() as cur:
            for sql_file in sorted(MIGRATIONS_DIR.glob("*.sql")):
                logger.info("Applying %s", sql_file.name)
                cur.execute(sql_file.read_text())
        conn.commit()
        logger.info("Migrations complete")
    finally:
        conn.close()


if __name__ == "__main__":
    migrate()
