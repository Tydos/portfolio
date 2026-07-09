from pydantic import BaseModel


class User(BaseModel):
    id: int
    github_username: str
    role: str


class Photo(BaseModel):
    id: int
    filename: str
    category: str
    width: int
    height: int
    size_bytes_input: int | None = None
    size_bytes_optimized: int | None = None
    cdn_url_thumb: str
    cdn_url_medium: str
    cdn_url_original: str
    created_at: str | None = None


class PaginatedPhotos(BaseModel):
    data: list[Photo]
    total: int
    limit: int
    offset: int
    cached: bool = False


class AuthTokenResponse(BaseModel):
    token: str
    user: User


class UploadResponse(Photo):
    compression_ratio: float
