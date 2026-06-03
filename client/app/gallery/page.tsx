'use client';

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Camera, Search, Upload, Trash2 } from "react-feather";
import Gallery from "../../components/sections/Gallery";
import { fetchPhotos, uploadPhoto, deletePhoto } from "../../lib/api";
import type { Photo } from "../../types";

function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState("nature");
  const [adminKey, setAdminKey] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [deleteMode, setDeleteMode] = useState(false);
  const [deleteAdminKey, setDeleteAdminKey] = useState("");
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [deleteStatus, setDeleteStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    fetchPhotos().then(setPhotos).catch(console.error);
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadFile || !adminKey) return;
    setUploading(true);
    setUploadStatus(null);
    try {
      await uploadPhoto(uploadFile, uploadCategory, adminKey);
      setUploadStatus({ ok: true, msg: "Uploaded successfully." });
      setUploadFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchPhotos().then(setPhotos).catch(console.error);
    } catch (err) {
      setUploadStatus({ ok: false, msg: err instanceof Error ? err.message : "Upload failed." });
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(photo: Photo) {
    if (photo.id == null || !deleteAdminKey) return;
    setDeletingIds((prev) => new Set(prev).add(photo.id!));
    setDeleteStatus(null);
    try {
      await deletePhoto(photo.id, deleteAdminKey);
      setDeleteStatus({ ok: true, msg: `Deleted "${photo.title}".` });
      fetchPhotos().then(setPhotos).catch(console.error);
    } catch (err) {
      setDeleteStatus({ ok: false, msg: err instanceof Error ? err.message : "Delete failed." });
    } finally {
      setDeletingIds((prev) => { const s = new Set(prev); s.delete(photo.id!); return s; });
    }
  }

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
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-tight text-white mb-2">
              Gallery
            </h1>
            <div className="h-2 w-20 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full" />
          </div>
        </div>

        {/* Admin toolbar */}
        <div className="mb-6 flex flex-wrap gap-3">
          {/* Upload toggle */}
          <div>
          <button
            onClick={() => { setShowUpload((v) => !v); setUploadStatus(null); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:border-rose-500 hover:text-rose-400 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <Upload size={14} />
            {showUpload ? "Close" : "Upload Photo"}
          </button>

          {showUpload && (
            <form
              onSubmit={handleUpload}
              className="mt-4 p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col gap-4 max-w-md"
            >
              <div>
                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">
                  JPEG file
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg"
                  required
                  onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">
                  Category
                </label>
                <input
                  type="text"
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  placeholder="nature"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">
                  Admin key
                </label>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>

              {uploadStatus && (
                <p className={`text-xs ${uploadStatus.ok ? "text-emerald-400" : "text-rose-400"}`}>
                  {uploadStatus.msg}
                </p>
              )}

              <button
                type="submit"
                disabled={uploading || !uploadFile || !adminKey}
                className="self-start flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <Upload size={13} />
                {uploading ? "Uploading…" : "Upload"}
              </button>
            </form>
          )}
          </div>

          {/* Delete toggle */}
          <div>
            <button
              onClick={() => { setDeleteMode((v) => !v); setDeleteStatus(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-colors ${
                deleteMode
                  ? "border-rose-500 text-rose-400 bg-rose-500/10"
                  : "border-slate-700 text-slate-400 hover:border-rose-500 hover:text-rose-400"
              }`}
            >
              <Trash2 size={14} />
              {deleteMode ? "Done" : "Delete Photos"}
            </button>

            {deleteMode && (
              <div className="mt-4 p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col gap-4 max-w-md">
                <p className="text-xs text-slate-400">
                  Enter your admin key, then click the <span className="text-rose-400">✕</span> on any photo to delete it.
                </p>
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">
                    Admin key
                  </label>
                  <input
                    type="password"
                    value={deleteAdminKey}
                    onChange={(e) => setDeleteAdminKey(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
                {deleteStatus && (
                  <p className={`text-xs ${deleteStatus.ok ? "text-emerald-400" : "text-rose-400"}`}>
                    {deleteStatus.msg}
                  </p>
                )}
              </div>
            )}
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
          <Gallery
            photos={filteredPhotos}
            deleteMode={deleteMode}
            deletingIds={deletingIds}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}

export default GalleryPage;
