"use client";

import { Camera } from "react-feather";
import Link from "next/link";
import Gallery from "./Gallery";
import { usePhotos } from "../../lib/usePhotos";

function Photography() {
  const { photos, loading } = usePhotos(12);

  return (
    <>
      {/* Background Icon */}
      <div className="absolute -top-24 -right-24 opacity-5 rotate-12 pointer-events-none">
        <Camera size={500} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-16">
          <Camera size={20} className="text-rose-500 mb-6" />

          <h2 className="text-4xl font-bold uppercase tracking-tight text-white mb-2">
            Photography
          </h2>

          <div className="h-2 w-20 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <span className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-rose-500 animate-spin" />
            </div>
          ) : (
            <>
              <Gallery photos={photos} />
              <div className="mt-10 text-center">
                <Link
                  href="/gallery"
                  className="inline-block text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white border border-slate-700 hover:border-slate-400 px-6 py-3 rounded transition-all"
                >
                  View Full Gallery →
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Photography;
