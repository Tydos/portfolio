"use client";

import Link from "next/link";
import Gallery from "./Gallery";
import SectionTitle from "../ui/SectionTitle";
import { usePhotos } from "../../lib/usePhotos";

function Portfolio() {
  const { photos, loading } = usePhotos(12);

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <SectionTitle>Portfolio</SectionTitle>
      </div>

      {loading ? (
        <div
          className="flex items-center justify-center py-24 px-6"
          role="status"
          aria-live="polite"
        >
          <span className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-accent animate-spin" />
          <span className="sr-only">Loading photos</span>
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-ink-muted">
          <p className="text-base">No photos to show yet.</p>
          <p className="text-sm mt-2">Check back soon for new work.</p>
        </div>
      ) : (
        <>
          <div className="w-full px-3 sm:px-6 md:px-10">
            <Gallery photos={photos} />
          </div>
          <div className="mt-12 text-center px-6">
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 text-sm font-medium text-ink-muted hover:text-ink border border-slate-200 hover:border-slate-300 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Open full gallery
            </Link>
          </div>
        </>
      )}
    </>
  );
}

export default Portfolio;
