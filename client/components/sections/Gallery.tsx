'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { PhotoAlbum } from "react-photo-album";
import { X } from "react-feather";
import type { Photo } from "../../types";

interface GalleryProps {
  photos: Photo[];
}

function Lightbox({ photo, onClose }: { photo: Photo; onClose: () => void }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
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

      <Image
        src={photo.src}
        alt={photo.title}
        width={photo.width}
        height={photo.height}
        className={`max-h-[90vh] max-w-[90vw] object-contain rounded-xl shadow-2xl transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        style={{ width: "auto", height: "auto" }}
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

export default function Gallery({ photos }: GalleryProps) {
  const [selected, setSelected] = useState<Photo | null>(null);

  return (
    <>
      {selected && (
        <Lightbox photo={selected} onClose={() => setSelected(null)} />
      )}

      <PhotoAlbum
        layout="masonry"
        photos={photos}
        padding={0}
        spacing={12}
        columns={(containerWidth) => {
          if (containerWidth < 500) return 1;
          if (containerWidth < 900) return 2;
          return 3;
        }}
        breakpoints={[500, 900, 1200]}
        componentsProps={() => ({ imageProps: { loading: "lazy" } })}
        renderPhoto={({ photo, layout, imageProps: { alt, style, src } }) => (
          <div
            style={{ width: style?.width, padding: "6px" }}
            className="cursor-pointer"
            onClick={() => setSelected(photo as Photo)}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <Image
                src={src as string}
                alt={alt}
                width={layout.width}
                height={layout.height}
                unoptimized
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          </div>
        )}
      />
    </>
  );
}
