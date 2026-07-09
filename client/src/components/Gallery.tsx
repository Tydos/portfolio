import { useState, useEffect } from "react";
import { X } from "react-feather";
import type { GalleryPhoto } from "../lib/photos";

interface GalleryProps {
  photos: GalleryPhoto[];
  deleteMode?: boolean;
  deletingIds?: Set<number>;
  onDelete?: (photo: GalleryPhoto) => void;
}

function Lightbox({
  photo,
  onClose,
}: {
  photo: GalleryPhoto;
  onClose: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, photo]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={24} />
      </button>

      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      <img
        src={photo.cdn_url_original}
        alt={photo.title}
        className={`max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
        onLoad={() => setLoaded(true)}
      />
      {photo.category && (
        <p className="absolute bottom-6 text-xs font-semibold uppercase tracking-widest text-white/40">
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
  const [selected, setSelected] = useState<GalleryPhoto | null>(null);

  return (
    <>
      {selected && (
        <Lightbox photo={selected} onClose={() => setSelected(null)} />
      )}

      <div className="columns-1 sm:columns-3 xl:columns-4 gap-3 max-w-6xl mx-auto">
        {photos.map((photo) => {
          const isDeleting = deletingIds?.has(photo.id);
          return (
            <div
              key={photo.id}
              className={`mb-3 break-inside-avoid ${deleteMode ? "cursor-default" : "cursor-pointer"}`}
              onClick={() => {
                if (!deleteMode) setSelected(photo);
              }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <img
                  src={photo.src}
                  alt={photo.title}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  className="w-full h-auto block"
                />
                {deleteMode && (
                  <div className="absolute inset-0 bg-black/40 flex items-start justify-end p-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(photo);
                      }}
                      disabled={isDeleting}
                      className="w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 flex items-center justify-center transition-colors"
                      aria-label="Delete photo"
                    >
                      {isDeleting ? (
                        <div className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        <X size={14} className="text-white" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
