"""Photo schema validation tests."""

import pytest
from pydantic import ValidationError

from schemas.photo import Photo


def _valid(**overrides):
    data = {
        "filename": "shot.jpg",
        "url": "https://example.com/shot.jpg",
        "width": 800,
        "height": 600,
        "category": "nature",
    }
    data.update(overrides)
    return Photo(**data)


def test_photo_valid():
    photo = _valid()
    assert photo.filename == "shot.jpg"
    assert photo.category == "nature"


def test_photo_rejects_path_traversal():
    with pytest.raises(ValidationError):
        _valid(filename="../evil.jpg")
    with pytest.raises(ValidationError):
        _valid(filename="dir/shot.jpg")
    with pytest.raises(ValidationError):
        _valid(filename="dir\\shot.jpg")


def test_photo_rejects_invalid_category():
    with pytest.raises(ValidationError):
        _valid(category="not-a-real-category")


def test_photo_rejects_non_positive_dimensions():
    with pytest.raises(ValidationError):
        _valid(width=0)
    with pytest.raises(ValidationError):
        _valid(height=-1)
