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

function Lightbox({ photo, onClose }: { photo: Photo; onClose: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setLoaded(false);
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, photo]);

  return (
    <div
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
        className={`max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
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
          if (containerWidth < 500) return 1;
          if (containerWidth < 900) return 2;
          if (containerWidth < 1400) return 3;
          return 4;
        }}
        breakpoints={[500, 900, 1400]}
        componentsProps={() => ({ imageProps: { loading: "lazy" } })}
        renderPhoto={({ photo, layout, imageProps: { alt, style, src } }) => {
          const p = photo as Photo;
          const isDeleting = p.id != null && deletingIds?.has(p.id);
          const label = alt || p.title || "View photo";

          if (deleteMode) {
            return (
              <div style={{ width: style?.width, padding: "6px" }}>
                <div className="relative rounded-xl overflow-hidden shadow-sm">
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
            <div style={{ width: style?.width, padding: "6px" }}>
              <button
                type="button"
                onClick={() => setSelected(p)}
                className="block w-full text-left rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                aria-label={`View ${label}`}
              >
                <Image
                  src={src as string}
                  alt={label}
                  width={layout.width}
                  height={layout.height}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </button>
            </div>
          );
        }}
      />
    </>
  );
}
