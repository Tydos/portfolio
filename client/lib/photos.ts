import { supabase } from "./supabase";
import type { Photo } from "../types";

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET!;
export const PHOTOS_PAGE_SIZE = 50;

/**
 * Converts a raw database row into a typed Photo object.
 *
 * @param item - Raw row returned from Supabase query
 * @returns Normalized Photo object
 */
const toRow = (item: Record<string, unknown>): Photo => ({
  id: item.id as number,
  src: item.url as string,
  width: (item.width as number) || 2000,
  height: (item.height as number) || 2000,
  title: item.filename as string,
  category: item.category as string,
});

/**
 * Fetches paginated photos from the Supabase "photographs" table.
 *
 * Uses offset-based pagination and returns total row count for UI pagination.
 *
 * @param page - Page number (1-based)
 * @param pageSize - Number of items per page
 * @returns Object containing photos array and total count
 */
export const fetchPhotos = async (
  page = 1,
  pageSize = PHOTOS_PAGE_SIZE,
): Promise<{ photos: Photo[]; total: number }> => {
  const from = (page - 1) * pageSize;

  const { data, error, count } = await supabase
    .from("photographs")
    .select("id, filename, url, category, width, height", { count: "exact" })
    .order("id")
    .range(from, from + pageSize - 1);

  if (error) throw new Error(error.message);

  return {
    photos: (data ?? []).map(toRow),
    total: count ?? 0,
  };
};

/**
 * Reads image dimensions from a File object before upload.
 *
 * Falls back to default dimensions if the image fails to load.
 *
 * @param file - Image file selected by the user
 * @returns Promise resolving to image width and height
 */
const getImageDimensions = (
  file: File,
): Promise<{ width: number; height: number }> =>
  new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      resolve({ width: 2000, height: 2000 });
      URL.revokeObjectURL(url);
    };

    img.src = url;
  });

/**
 * Uploads a photo to Supabase Storage and inserts metadata into the database.
 *
 * If the database insert fails, the uploaded file is removed to maintain consistency.
 *
 * @param file - Image file to upload
 * @param category - Photo category label
 */
export const uploadPhoto = async (
  file: File,
  category: string,
): Promise<void> => {
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

/**
 * Deletes a photo from both the database and Supabase Storage.
 *
 * Order matters:
 * 1. Fetch filename
 * 2. Delete DB row
 * 3. Remove file from storage
 *
 * @param id - Photo database ID
 */
export const deletePhoto = async (id: number): Promise<void> => {
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
