'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Camera, Search, Upload } from "react-feather";
import Gallery from "../../components/sections/Gallery";
import { fetchPhotos, uploadPhotos } from "../../lib/api";
import type { Photo } from "../../types";

function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPhotos = () => fetchPhotos().then(setPhotos).catch(console.error);

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // allow re-selecting the same file later
    if (files.length === 0) return;

    setUploadError(null);
    setUploadMessage(null);
    setUploading(true);
    try {
      const result = await uploadPhotos(files, activeCategory ?? undefined);
      const parts = [`${result.uploaded.length} uploaded`];
      if (result.skipped.length) parts.push(`${result.skipped.length} skipped`);
      if (result.failed.length) parts.push(`${result.failed.length} failed`);
      setUploadMessage(parts.join(" · "));
      if (result.uploaded.length) await loadPhotos();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const categories: string[] = [...new Set(photos.map((p) => p.category).filter(Boolean))];

  const filteredPhotos = photos.filter((p) => {
    const matchesQuery =
      !query ||
      p.title?.toLowerCase().includes(query.toLowerCase()) ||
      p.category?.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !activeCategory || p.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  const isFiltered = query || activeCategory;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="px-6 py-5 max-w-6xl mx-auto">
        <Link
          href="/"
          className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
        >
          ← Prasad Jawale
        </Link>
      </header>

      <main className="px-6 pb-32 max-w-6xl mx-auto">
        <div className="mb-16 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 opacity-5 rotate-12 pointer-events-none">
            <Camera size={500} />
          </div>
          <Camera size={20} className="text-rose-500 mb-6" />
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-4xl font-bold uppercase tracking-tight text-white mb-2">
                Gallery
              </h1>
              <div className="h-2 w-20 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full" />
            </div>

            <div className="flex flex-col items-end gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,image/jpeg"
                multiple
                onChange={handleFilesSelected}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider bg-rose-500 text-white hover:bg-rose-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                <Upload size={16} />
                {uploading ? "Uploading…" : "Upload Pictures"}
              </button>
              <p className="text-[10px] text-slate-500">JPEG only</p>
              {uploadMessage && (
                <p className="text-xs text-emerald-400 max-w-[16rem] text-right">{uploadMessage}</p>
              )}
              {uploadError && (
                <p className="text-xs text-rose-400 max-w-[16rem] text-right">{uploadError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-6 relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search photos…"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>

        {/* Category chips */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border transition-colors ${
                  activeCategory === cat
                    ? "border-rose-500 text-rose-400 bg-rose-500/10"
                    : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Result count */}
        {isFiltered && (
          <p className="text-sm text-slate-500 mb-6">
            Showing {filteredPhotos.length} of {photos.length} photos
          </p>
        )}

        {/* Empty state */}
        {filteredPhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-600">
            <Camera size={48} className="mb-4" />
            <p className="text-sm uppercase tracking-widest">No photos match your search</p>
          </div>
        ) : (
          <Gallery photos={filteredPhotos} />
        )}
      </main>
    </div>
  );
}

export default GalleryPage;
