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
