import { supabase } from "./supabase";
import type { Photo } from "../types";

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET!;
export const PHOTOS_PAGE_SIZE = 50;

const toRow = (item: Record<string, unknown>): Photo => ({
  id: item.id as number,
  src: item.url as string,
  width: (item.width as number) || 2000,
  height: (item.height as number) || 2000,
  title: item.filename as string,
  category: item.category as string,
});

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
  return { photos: (data ?? []).map(toRow), total: count ?? 0 };
};

const getImageDimensions = (file: File): Promise<{ width: number; height: number }> =>
  new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { resolve({ width: img.naturalWidth, height: img.naturalHeight }); URL.revokeObjectURL(url); };
    img.onerror = () => { resolve({ width: 2000, height: 2000 }); URL.revokeObjectURL(url); };
    img.src = url;
  });

export const uploadPhoto = async (file: File, category: string): Promise<void> => {
  const filename = `${Date.now()}_${file.name.toLowerCase()}`;
  const { width, height } = await getImageDimensions(file);

  const { error: storageError } = await supabase.storage
    .from(BUCKET).upload(filename, file, { contentType: "image/jpeg" });
  if (storageError) throw new Error(storageError.message);

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filename);

  const { error: dbError } = await supabase
    .from("photographs")
    .insert({ filename, url: urlData.publicUrl, category, width, height });

  if (dbError) {
    await supabase.storage.from(BUCKET).remove([filename]);
    throw new Error(dbError.message);
  }
};

export const deletePhoto = async (id: number): Promise<void> => {
  const { data, error: fetchError } = await supabase
    .from("photographs").select("filename").eq("id", id).single();
  if (fetchError) throw new Error(fetchError.message);

  const { error: deleteError } = await supabase
    .from("photographs").delete().eq("id", id);
  if (deleteError) throw new Error(deleteError.message);

  await supabase.storage.from(BUCKET).remove([data.filename]);
};
