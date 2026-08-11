"""Photo schema model for database and API validation."""

from typing import Literal

from pydantic import BaseModel, Field, HttpUrl, field_validator


class Photo(BaseModel):
    """Pydantic model for photograph data validation."""

    id: int | None = Field(default=None, description="primary key generated db side")
    filename: str = Field(..., min_length=1, description="filename")
    url: HttpUrl = Field(..., description="Public URL of the image")
    width: int = Field(default=1080, gt=0, description="Image width in pixels")
    height: int = Field(default=1920, gt=0, description="Image height in pixels")
    category: Literal[
        "nature",
        "landscape",
        "urban",
        "portrait",
        "abstract",
        "other",
        "aero",
        "architecture",
        "astrophotography",
        "minimalism",
        "street",
        "travel",
    ] = Field(default="nature", description="Photo category")

    @field_validator("filename")
    @classmethod
    def validate_filename_no_traversal(cls, value: str) -> str:
        """Reject path traversal characters in filename.

        Args:
            value: Candidate filename string.

        Returns:
            The unchanged filename when valid.

        Raises:
            ValueError: If the filename contains ``..``, ``/``, or ``\\``.
        """
        if ".." in value or "/" in value or "\\" in value:
            raise ValueError(
                "Filename cannot contain path traversal characters (.., /, \\)"
            )
        return value
