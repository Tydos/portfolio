import type { GalleryPhoto, PaginatedPhotos, Photo } from "../types";
import { IMAGE_API_URL, PHOTOS_PAGE_SIZE } from "../constants/config";
import { getToken } from "./auth";

export { PHOTOS_PAGE_SIZE };
export type { GalleryPhoto };

function toGalleryPhoto(p: Photo): GalleryPhoto {
  return {
    ...p,
    src: p.cdn_url_medium,
    title: p.filename,
  };
}

export async function fetchPhotos(
  page = 1,
  pageSize = PHOTOS_PAGE_SIZE,
  category?: string | null,
): Promise<{ photos: GalleryPhoto[]; total: number }> {
  const offset = (page - 1) * pageSize;
  const params = new URLSearchParams({
    limit: String(pageSize),
    offset: String(offset),
  });
  if (category) params.set("category", category);

  const res = await fetch(`${IMAGE_API_URL}/api/images?${params}`);
  if (!res.ok) throw new Error("Failed to fetch photos");

  const data = (await res.json()) as PaginatedPhotos;
  return {
    photos: data.data.map(toGalleryPhoto),
    total: data.total,
  };
}

export async function uploadPhoto(
  file: File,
  category: string,
): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const form = new FormData();
  form.append("file", file);
  form.append("category", category);

  const res = await fetch(`${IMAGE_API_URL}/api/images/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? "Upload failed");
  }
}

export async function deletePhoto(id: number): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${IMAGE_API_URL}/api/images/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? "Delete failed");
  }
}
