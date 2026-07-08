"use client";

import { Camera } from "react-feather";
import { GALLERY_URL } from "../../constants/config";

function PhotographyTeaser() {
  return (
    <>
      <div className="absolute -top-24 -right-24 opacity-5 rotate-12 pointer-events-none">
        <Camera size={500} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-10">
          <Camera size={20} className="text-rose-500 mb-6" />
          <h2 className="text-4xl font-bold uppercase tracking-tight text-white mb-2">
            Photography
          </h2>
          <div className="h-2 w-20 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full" />
        </div>

        <p className="text-slate-400 max-w-xl mb-8 text-sm leading-relaxed">
          A full-stack image hosting gallery — lazy-loaded masonry grid, CDN delivery,
          and admin upload pipeline powered by Express, Sharp, and AWS S3.
        </p>

        <a
          href={GALLERY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white border border-slate-700 hover:border-rose-500 px-6 py-3 rounded transition-all"
        >
          View Full Gallery →
        </a>
      </div>
    </>
  );
}

export default PhotographyTeaser;
