import { useState, useCallback, useEffect, useRef } from "react";
import {
  fetchPhotos,
  uploadPhoto,
  deletePhoto,
  PHOTOS_PAGE_SIZE,
} from "./photos";
import type { Photo } from "../types";

/**
 * React hook providing paginated photo state and admin CRUD operations.
 *
 * Public reads go through Next `/api/images`; upload/delete call FastAPI with
 * the admin Bearer JWT. Handles pagination, upload progress, and optimistic
 * delete tracking.
 *
 * @param pageSize - Photos per page (default {@link PHOTOS_PAGE_SIZE}).
 * @returns Gallery state plus `goToPage`, `upload`, and `remove` actions.
 */
export function usePhotos(pageSize = PHOTOS_PAGE_SIZE) {
  const [photos, setPhotos] = useState<Photo[]>([]);
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

  /**
   * Load a specific page of photos from `/api/images`.
   *
   * @param p - Page number (1-based).
   */
  const goToPage = useCallback(
    async (p: number) => {
      setLoading(true);

      try {
        const { photos: data, total: t } = await fetchPhotos(p, pageSize);
        setPhotos(data);
        setTotal(t);
        setPage(p);
      } catch (err) {
        console.warn(
          "usePhotos:",
          err instanceof Error ? err.message : "load failed",
        );
        setPhotos([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [pageSize],
  );

  /** Initial load: fetch the first page once the hook is mounted. */
  useEffect(() => {
    goToPage(1);
  }, [goToPage]);

  /**
   * Upload multiple image files sequentially with progress tracking.
   *
   * Refreshes the gallery after completion and resets the file input.
   *
   * @param files - Image files to upload.
   * @param category - Category label assigned to each photo.
   * @returns Summary of success/failure for the batch.
   */
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
            `${files[i].name}: ${
              err instanceof Error ? err.message : "failed"
            }`,
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

      return {
        ok: false,
        msg: "All uploads failed.",
      };
    },
    [goToPage],
  );

  /**
   * Delete a photo and refresh the current page.
   *
   * Tracks deletion state per photo id for UI spinners/disabled states.
   *
   * @param photo - Photo entity to delete.
   * @returns Result message indicating success or failure.
   */
  const remove = useCallback(
    async (photo: Photo): Promise<{ ok: boolean; msg: string }> => {
      if (photo.id == null) {
        return { ok: false, msg: "Invalid photo." };
      }

      setDeletingIds((prev) => new Set(prev).add(photo.id!));

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
          s.delete(photo.id!);
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
