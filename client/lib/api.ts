import { API_CONFIG, API_ENDPOINTS } from "../constants/config";
import type { Photo } from "../types";

const BASE_URL = API_CONFIG.BASE_URL;

export const fetchPhotos = async (limit = 100, offset = 0): Promise<Photo[]> => {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PHOTOS}?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  const data = await res.json();
  return data.map((item: { url: string; width?: number; height?: number; filename: string; category: string }) => ({
    src: item.url.replace("/upload/", "/upload/f_auto,q_auto,w_1200/"),
    width: item.width || 2000,
    height: item.height || 2000,
    title: item.filename,
    category: item.category,
  }));
};

export interface UploadResult {
  uploaded: { filename: string; url: string; category: string }[];
  skipped: { filename: string; reason: string }[];
  failed: { filename: string; error: string }[];
}

export const uploadPhotos = async (files: File[], category?: string): Promise<UploadResult> => {
  const form = new FormData();
  // Backend expects the field name "files" (FastAPI list[UploadFile]).
  files.forEach((file) => form.append("files", file));
  if (category) form.append("category", category);

  // Let the browser set the multipart Content-Type (with boundary) automatically.
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.UPLOAD}`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`Upload failed! Status: ${res.status}`);
  return res.json();
};
