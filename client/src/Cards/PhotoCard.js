import React from "react";

function PhotoCard({ photo }) {
  return (
    <>
      <div className="break-inside-avoid group cursor-pointer">
        <div className="relative overflow-hidden rounded-2xl bg-neutral-900">
          <img
            src={photo.url}
            alt={photo.title}
            className="w-full h-auto object-cover transition duration-700 ease-out group-hover:scale-105"
          />

          {/* Cinematic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex items-end p-6">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition duration-500">
              <p className="text-[11px] tracking-[0.3em] uppercase text-rose-400 font-semibold mb-3">
                {photo.category}
              </p>

              <h3 className="text-white text-2xl font-serif leading-tight">
                {photo.title}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PhotoCard;
