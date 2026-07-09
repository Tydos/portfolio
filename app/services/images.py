"""Image processing with Pillow, mirroring the sharp.ts pipeline.

Produces three variants per upload:
- original: max 2400px JPEG (q85)
- medium:   max 1200px WebP (q82)
- thumb:    max 400px  WebP (q80)
"""

import io
from dataclasses import dataclass

from PIL import Image, ImageOps


@dataclass
class ProcessedVariant:
    buffer: bytes
    bytes: int
    width: int
    height: int
    s3_key: str
    content_type: str


@dataclass
class ProcessedImage:
    input_bytes: int
    original: ProcessedVariant
    medium: ProcessedVariant
    thumb: ProcessedVariant
    compression_ratio: float


def _resize_within(img: Image.Image, max_size: int) -> Image.Image:
    copy = img.copy()
    copy.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
    return copy


def _encode(img: Image.Image, fmt: str, **params) -> bytes:
    out = io.BytesIO()
    img.save(out, format=fmt, **params)
    return out.getvalue()


def process_image(data: bytes, base_key: str) -> ProcessedImage:
    input_bytes = len(data)
    img = ImageOps.exif_transpose(Image.open(io.BytesIO(data))).convert("RGB")

    original_img = _resize_within(img, 2400)
    original_buf = _encode(original_img, "JPEG", quality=85, optimize=True)

    medium_img = _resize_within(img, 1200)
    medium_buf = _encode(medium_img, "WEBP", quality=82)

    thumb_img = _resize_within(img, 400)
    thumb_buf = _encode(thumb_img, "WEBP", quality=80)

    optimized_bytes = len(original_buf) + len(medium_buf) + len(thumb_buf)

    return ProcessedImage(
        input_bytes=input_bytes,
        original=ProcessedVariant(
            buffer=original_buf,
            bytes=len(original_buf),
            width=original_img.width,
            height=original_img.height,
            s3_key=f"{base_key}/original.jpg",
            content_type="image/jpeg",
        ),
        medium=ProcessedVariant(
            buffer=medium_buf,
            bytes=len(medium_buf),
            width=medium_img.width,
            height=medium_img.height,
            s3_key=f"{base_key}/medium.webp",
            content_type="image/webp",
        ),
        thumb=ProcessedVariant(
            buffer=thumb_buf,
            bytes=len(thumb_buf),
            width=thumb_img.width,
            height=thumb_img.height,
            s3_key=f"{base_key}/thumb.webp",
            content_type="image/webp",
        ),
        compression_ratio=1 - optimized_bytes / input_bytes,
    )
