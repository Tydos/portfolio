"""Authentication helpers for admin-protected routes."""

from auth.auth import verify_admin_key

__all__ = ["verify_admin_key"]
