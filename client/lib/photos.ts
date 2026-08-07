import { supabase, isSupabaseConfigured } from "./supabase";
import type { Photo } from "../types";

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "";
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

async function fetchPhotosFromApi(
  page: number,
  pageSize: number,
): Promise<{ photos: Photo[]; total: number }> {
  const offset = (page - 1) * pageSize;
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
  const url = base
    ? `${base}/images?limit=${pageSize}&offset=${offset}`
    : `/api/images?limit=${pageSize}&offset=${offset}`;

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
 * Fetches paginated photos via `/api/images` (Supabase).
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

const getImageDimensions = (
  file: File,
): Promise<{ width: number; height: number }> =>
  new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      resolve({ width: 2000, height: 2000 });
      URL.revokeObjectURL(url);
    };

    img.src = url;
  });

export const uploadPhoto = async (
  file: File,
  category: string,
): Promise<void> => {
  if (!isSupabaseConfigured || !BUCKET) {
    throw new Error("Supabase is not configured.");
  }

  const filename = `${Date.now()}_${file.name.toLowerCase()}`;
  const { width, height } = await getImageDimensions(file);

  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file, { contentType: "image/jpeg" });

  if (storageError) throw new Error(storageError.message);

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filename);

  const { error: dbError } = await supabase.from("photographs").insert({
    filename,
    url: urlData.publicUrl,
    category,
    width,
    height,
  });

  if (dbError) {
    await supabase.storage.from(BUCKET).remove([filename]);
    throw new Error(dbError.message);
  }
};

export const deletePhoto = async (id: number): Promise<void> => {
  if (!isSupabaseConfigured || !BUCKET) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error: fetchError } = await supabase
    .from("photographs")
    .select("filename")
    .eq("id", id)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  const { error: deleteError } = await supabase
    .from("photographs")
    .delete()
    .eq("id", id);

  if (deleteError) throw new Error(deleteError.message);

  await supabase.storage.from(BUCKET).remove([data.filename]);
};
