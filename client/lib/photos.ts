import { getSession } from "./auth";
import type { Photo } from "../types";

/** Default page size for public gallery fetches. */
export const PHOTOS_PAGE_SIZE = 25;

const emptyResult = { photos: [] as Photo[], total: 0 };

/** Maps an API photograph row into the gallery `Photo` shape. */
const toRow = (item: Record<string, unknown>): Photo => ({
  id: item.id as number,
  src: item.url as string,
  width: (item.width as number) || 2000,
  height: (item.height as number) || 2000,
  title: (item.filename as string) || (item.title as string) || "Photo",
  category: (item.category as string) || "",
});

type ApiPhotoRecord = Record<string, unknown>;

/**
 * Normalizes a `/api/images` JSON body into gallery photos.
 *
 * @param data - Parsed JSON from the images API.
 * @returns Photos and total count, or an empty result for unexpected shapes.
 */
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

/**
 * Resolves the FastAPI base URL used for admin upload/delete.
 *
 * @returns Base URL without a trailing slash.
 * @throws If `NEXT_PUBLIC_API_URL` is unset.
 */
function getMutationApiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
  if (!base) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Admin upload/delete require the FastAPI base URL.",
    );
  }
  return base;
}

/**
 * Reads the admin Bearer token from the current Supabase session.
 *
 * @returns Access token for authorized mutation requests.
 * @throws If the user is not signed in.
 */
async function getAdminAccessToken(): Promise<string> {
  const { data } = await getSession();
  const token = data.session?.access_token;
  if (!token) {
    throw new Error("Sign in required for photo upload/delete.");
  }
  return token;
}

/** Returns true when `name` ends with `.jpg` or `.jpeg` (case-insensitive). */
function isJpegFilename(name: string): boolean {
  const lower = name.toLowerCase();
  return lower.endsWith(".jpg") || lower.endsWith(".jpeg");
}

/**
 * Extracts a human-readable error message from a failed API response.
 *
 * @param res - Failed `fetch` response.
 * @returns FastAPI `detail` string when present, otherwise status text.
 */
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

/**
 * Fetches one page of photos from the Next.js `/api/images` proxy.
 *
 * @param page - 1-based page index.
 * @param pageSize - Maximum number of photos to request.
 * @returns Photos plus total count; empty result on network or HTTP failure.
 */
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
 * Fetch a page of photographs for the public gallery via `/api/images`.
 *
 * Never throws; returns an empty list on failure.
 *
 * @param page - 1-based page index (default 1).
 * @param pageSize - Maximum number of photos to return (default
 *     {@link PHOTOS_PAGE_SIZE}).
 * @returns Photos plus total count for pagination.
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
 * Upload a JPEG photograph through FastAPI `POST /upload`.
 *
 * Requires `NEXT_PUBLIC_API_URL` and a signed-in Supabase session.
 *
 * @param file - Image file; must be `.jpg` or `.jpeg`.
 * @param category - Category label stored with the photograph.
 * @throws If the file type is invalid, env/session is missing, or the API
 *     rejects the upload.
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
 * Delete a photograph through FastAPI `DELETE /delete/{id}`.
 *
 * Requires `NEXT_PUBLIC_API_URL` and a signed-in Supabase session.
 *
 * @param id - Database id of the photograph to remove.
 * @throws If env/session is missing or the API rejects the delete.
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
