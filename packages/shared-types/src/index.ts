export type UserRole = "viewer" | "admin";

export interface User {
  id: number;
  github_username: string;
  role: UserRole;
}

export interface Photo {
  id: number;
  filename: string;
  category: string;
  width: number;
  height: number;
  size_bytes_input?: number;
  size_bytes_optimized?: number;
  cdn_url_thumb: string;
  cdn_url_medium: string;
  cdn_url_original: string;
  created_at?: string;
}

export interface PaginatedPhotos {
  data: Photo[];
  total: number;
  limit: number;
  offset: number;
}

export interface AuthTokenResponse {
  token: string;
  user: User;
}

export interface UploadResponse extends Photo {
  compression_ratio: number;
}
