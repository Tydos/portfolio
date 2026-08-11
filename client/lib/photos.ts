import { getSession } from "./auth";
import type { Photo } from "../types";

export const PHOTOS_PAGE_SIZE = 25;

const emptyResult = { photos: [] as Photo[], total: 0 };

const toRow = (item: Record<string, unknown>): Photo => ({
  id: item.id as number,
  src: item.url as string,
  width: (item.width as number) || 2000,
  height: (item.height as number) || 2000,
  title: (item.filename as string) || (item.title as string) || "Photo",
  category: (item.category as string) || "",
});

type ApiPhotoRecord = Record<string, unknown>;

function normalizeApiPayload(data: unknown): { photos: Photo[]; total: number } {
  if (data && typeof data === "object" && "photos" in data && "total" in data) {
    const payload = data as { photos: ApiPhotoRecord[]; total: number };
    return {
      photos: payload.photos.map((row) => toRow(row)),
      total: payload.total,
    };
  }

  return emptyResult;
}

function getMutationApiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
  if (!base) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Admin upload/delete require the FastAPI base URL.",
    );
  }
  return base;
}

async function getAdminAccessToken(): Promise<string> {
  const { data } = await getSession();
  const token = data.session?.access_token;
  if (!token) {
    throw new Error("Sign in required for photo upload/delete.");
  }
  return token;
}

function isJpegFilename(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.endsWith(".jpg") || lower.endsWith(".jpeg");
}

async function readErrorDetail(res: Response): Promise<string> {
  try {
    const body: unknown = await res.json();
    if (body && typeof body === "object" && "detail" in body) {
      const detail = (body as { detail: unknown }).detail;
      if (typeof detail === "string") return detail;
    }
  } catch {
    /* ignore non-JSON */
  }
  return res.statusText || `HTTP ${res.status}`;
}

async function fetchPhotosFromApi(
  page: number,
  pageSize: number,
): Promise<{ photos: Photo[]; total: number }> {
  const offset = (page - 1) * pageSize;
  const url = `/api/images?limit=${pageSize}&offset=${offset}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn("fetchPhotosFromApi:", res.status, res.statusText);
      return emptyResult;
    }

    const data: unknown = await res.json();
    return normalizeApiPayload(data);
  } catch (err) {
    console.warn(
      "fetchPhotosFromApi:",
      err instanceof Error ? err.message : "network error",
    );
    return emptyResult;
  }
}

/**
 * Fetches paginated photos via Next.js `/api/images` (public read).
 * Never throws; returns an empty list on failure.
 */
export const fetchPhotos = async (
  page = 1,
  pageSize = PHOTOS_PAGE_SIZE,
): Promise<{ photos: Photo[]; total: number }> => {
  try {
    return await fetchPhotosFromApi(page, pageSize);
  } catch (err) {
    console.warn(
      "fetchPhotos:",
      err instanceof Error ? err.message : "unknown error",
    );
    return emptyResult;
  }
};

/**
 * Uploads a JPEG via FastAPI `POST /upload` with the admin Bearer JWT.
 */
export const uploadPhoto = async (
  file: File,
  category: string,
): Promise<void> => {
  if (!isJpegFilename(file.name)) {
    throw new Error("Only .jpg/.jpeg files are accepted.");
  }

  const base = getMutationApiBase();
  const token = await getAdminAccessToken();
  const filename = `${Date.now()}_${file.name.toLowerCase()}`;

  const body = new FormData();
  body.append("file", file, filename);
  body.append("category", category);

  const res = await fetch(`${base}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });

  if (!res.ok) {
    throw new Error(await readErrorDetail(res));
  }
};

/**
 * Deletes a photo via FastAPI `DELETE /delete/{id}` with the admin Bearer JWT.
 */
export const deletePhoto = async (id: number): Promise<void> => {
  const base = getMutationApiBase();
  const token = await getAdminAccessToken();

  const res = await fetch(`${base}/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(await readErrorDetail(res));
  }
};
