"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { PhotoAlbum } from "react-photo-album";
import { X } from "react-feather";
import type { Photo } from "../../types";

interface GalleryProps {
  photos: Photo[];
  deleteMode?: boolean;
  deletingIds?: Set<number>;
  onDelete?: (photo: Photo) => void;
}

/** Collects keyboard-focusable descendants inside a lightbox container. */
function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
}

function Lightbox({ photo, onClose }: { photo: Photo; onClose: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [onClose, photo]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo: ${photo.title}`}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded min-h-[44px] min-w-[44px] flex items-center justify-center"
        onClick={onClose}
        aria-label="Close photo"
      >
        <X size={24} aria-hidden="true" />
      </button>

      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" role="status">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="sr-only">Loading photo</span>
        </div>
      )}

      <Image
        src={photo.src}
        alt={photo.title}
        width={photo.width}
        height={photo.height}
        className={`max-h-[90vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl transition-all duration-500 ease-out ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        style={{ width: "auto", height: "auto" }}
        onClick={(e) => e.stopPropagation()}
        onLoad={() => setLoaded(true)}
      />
      {photo.category && (
        <p className="absolute bottom-6 text-xs font-medium uppercase tracking-wide text-white/60">
          {photo.category}
        </p>
      )}
    </div>
  );
}

/**
 * Responsive photo album with lightbox; optional admin delete mode.
 *
 * @param props.photos - Photos to render in the album.
 * @param props.deleteMode - When true, shows per-photo delete controls.
 * @param props.deletingIds - Photo ids currently being deleted.
 * @param props.onDelete - Invoked when an admin confirms delete.
 */
export default function Gallery({
  photos,
  deleteMode,
  deletingIds,
  onDelete,
}: GalleryProps) {
  const [selected, setSelected] = useState<Photo | null>(null);
  const closeLightbox = useCallback(() => setSelected(null), []);

  return (
    <>
      {selected && (
        <Lightbox photo={selected} onClose={closeLightbox} />
      )}

      <PhotoAlbum
        layout="masonry"
        photos={photos}
        padding={0}
        spacing={0}
        columns={(containerWidth) => {
          if (containerWidth < 600) return 1;
          if (containerWidth < 1000) return 2;
          if (containerWidth < 1600) return 3;
          return 4;
        }}
        breakpoints={[600, 1000, 1600]}
        componentsProps={() => ({ imageProps: { loading: "lazy" } })}
        renderPhoto={({ photo, layout, imageProps: { alt, style, src } }) => {
          const p = photo as Photo;
          const isDeleting = p.id != null && deletingIds?.has(p.id);
          const label = alt || p.title || "View photo";

          if (deleteMode) {
            return (
              <div style={{ width: style?.width, padding: "10px" }}>
                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src={src as string}
                    alt={label}
                    width={layout.width}
                    height={layout.height}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-start justify-end p-2">
                    <button
                      type="button"
                      onClick={() => onDelete?.(p)}
                      disabled={isDeleting}
                      className="w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      aria-label={`Delete ${label}`}
                    >
                      {isDeleting ? (
                        <div className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        <X size={14} className="text-white" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div style={{ width: style?.width, padding: "10px" }}>
              <button
                type="button"
                onClick={() => setSelected(p)}
                className="group block w-full text-left rounded-2xl overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-label={`View ${label}`}
              >
                <Image
                  src={src as string}
                  alt={label}
                  width={layout.width}
                  height={layout.height}
                  style={{ width: "100%", height: "auto", display: "block" }}
                  className="transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
                />
              </button>
            </div>
          );
        }}
      />
    </>
  );
}
