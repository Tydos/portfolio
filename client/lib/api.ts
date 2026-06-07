import { supabase } from "./supabase";
import type { Photo } from "../types";

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET!;
const CACHE_TTL_MS = 5 * 60 * 1000;
let photosCache: { data: Photo[]; ts: number } | null = null;

export const clearPhotosCache = () => { photosCache = null; };

export const fetchPhotos = async (limit = 100, offset = 0, bust = false): Promise<Photo[]> => {
  const now = Date.now();
  if (!bust && photosCache && now - photosCache.ts < CACHE_TTL_MS) {
    return photosCache.data;
  }

  const { data, error } = await supabase
    .from("photographs")
    .select("id, filename, url, category, width, height")
    .order("id")
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message);

  const photos: Photo[] = (data ?? []).map((item) => ({
    id: item.id,
    src: item.url,
    width: item.width || 2000,
    height: item.height || 2000,
    title: item.filename,
    category: item.category,
  }));

  photosCache = { data: photos, ts: now };
  return photos;
};

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
      resolve({ width: 2000, height: 2000 });
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  });
}

export const uploadPhoto = async (file: File, category: string): Promise<void> => {
  const filename = `${Date.now()}_${file.name.toLowerCase()}`;
  const { width, height } = await getImageDimensions(file);

  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file, { contentType: "image/jpeg" });

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
