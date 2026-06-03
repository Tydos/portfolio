import { API_CONFIG, API_ENDPOINTS } from "../constants/config";
import type { Photo } from "../types";

const BASE_URL = API_CONFIG.BASE_URL;

export const fetchPhotos = async (limit = 100, offset = 0): Promise<Photo[]> => {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PHOTOS}?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  const data = await res.json();
  return data.map((item: { id?: number; url: string; width?: number; height?: number; filename: string; category: string }) => ({
    id: item.id,
    src: item.url.replace("/upload/", "/upload/f_auto,q_auto,w_1200/"),
    width: item.width || 2000,
    height: item.height || 2000,
    title: item.filename,
    category: item.category,
  }));
};

export const deletePhoto = async (id: number, token: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.DELETE}/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Delete failed");
  }
};

export const uploadPhoto = async (
  file: File,
  category: string,
  token: string
): Promise<void> => {
  const form = new FormData();
  form.append("file", file);
  form.append("category", category);

  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.UPLOAD}`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Upload failed");
  }
};
