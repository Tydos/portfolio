import { useState, useCallback, useEffect, useRef } from "react";
import {
  fetchPhotos,
  uploadPhoto,
  deletePhoto,
  PHOTOS_PAGE_SIZE,
} from "./photos";
import type { GalleryPhoto } from "./photos";

export function usePhotos(pageSize = PHOTOS_PAGE_SIZE) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const goToPage = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const { photos: data, total: t } = await fetchPhotos(p, pageSize);
        setPhotos(data);
        setTotal(t);
        setPage(p);
      } finally {
        setLoading(false);
      }
    },
    [pageSize],
  );

  useEffect(() => {
    goToPage(1);
  }, [goToPage]);

  const upload = useCallback(
    async (
      files: File[],
      category: string,
    ): Promise<{ ok: boolean; msg: string }> => {
      setUploading(true);
      const count = files.length;
      setUploadProgress({ done: 0, total: count });
      const errors: string[] = [];

      for (let i = 0; i < count; i++) {
        try {
          await uploadPhoto(files[i], category);
        } catch (err) {
          errors.push(
            `${files[i].name}: ${err instanceof Error ? err.message : "failed"}`,
          );
        }
        setUploadProgress({ done: i + 1, total: count });
      }

      if (fileInputRef.current) fileInputRef.current.value = "";
      setUploadProgress(null);
      setUploading(false);
      await goToPage(1);

      if (errors.length === 0) {
        return {
          ok: true,
          msg: `${count === 1 ? "Photo" : `All ${count} photos`} uploaded.`,
        };
      }
      if (errors.length < count) {
        return {
          ok: false,
          msg: `${count - errors.length} uploaded, ${errors.length} failed.`,
        };
      }
      return { ok: false, msg: "All uploads failed." };
    },
    [goToPage],
  );

  const remove = useCallback(
    async (photo: GalleryPhoto): Promise<{ ok: boolean; msg: string }> => {
      if (photo.id == null) return { ok: false, msg: "Invalid photo." };
      setDeletingIds((prev) => new Set(prev).add(photo.id));
      try {
        await deletePhoto(photo.id);
        await goToPage(page);
        return { ok: true, msg: `Deleted "${photo.title}".` };
      } catch (err) {
        return {
          ok: false,
          msg: err instanceof Error ? err.message : "Delete failed.",
        };
      } finally {
        setDeletingIds((prev) => {
          const s = new Set(prev);
          s.delete(photo.id);
          return s;
        });
      }
    },
    [goToPage, page],
  );

  const totalPages = Math.ceil(total / pageSize);

  return {
    photos,
    total,
    page,
    totalPages,
    loading,
    uploading,
    uploadProgress,
    deletingIds,
    fileInputRef,
    goToPage,
    upload,
    remove,
  };
}
