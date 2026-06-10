'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Camera, Search, Upload, Trash2 } from "react-feather";
import Gallery from "../../components/sections/Gallery";
import { usePhotos } from "../../lib/usePhotos";
import { getSession, onAuthStateChange } from "../../lib/auth";
import type { Photo } from "../../types";
import { GITHUB_USERNAME } from "../../constants/config";

export default function GalleryPage() {
  const { photos, total, page, totalPages, loading, uploading, uploadProgress, deletingIds, fileInputRef, goToPage, upload, remove } = usePhotos();

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadCategory, setUploadCategory] = useState("nature");
  const [actionStatus, setActionStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [deleteMode, setDeleteMode] = useState(false);

  useEffect(() => {
    const checkAdmin = (user: { user_metadata?: { user_name?: string } } | null) =>
      setIsAdmin(user?.user_metadata?.user_name === GITHUB_USERNAME);
    getSession().then(({ data }) => checkAdmin(data.session?.user ?? null));
    const { data: { subscription } } = onAuthStateChange((_e, s) => checkAdmin(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadFiles.length || !isAdmin) return;
    setActionStatus(null);
    const result = await upload(uploadFiles, uploadCategory);
    setUploadFiles([]);
    setActionStatus(result);
  }

  async function handleDelete(photo: Photo) {
    if (!isAdmin) return;
    setActionStatus(null);
    const result = await remove(photo);
    setActionStatus(result);
  }

  const categories = [...new Set(photos.map(p => p.category).filter(Boolean))];
  const filteredPhotos = photos.filter(p =>
    (!query || p.title?.toLowerCase().includes(query.toLowerCase()) || p.category?.toLowerCase().includes(query.toLowerCase())) &&
    (!activeCategory || p.category === activeCategory)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="px-6 py-5 max-w-6xl mx-auto">
        <Link href="/" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
          ← Prasad Jawale
        </Link>
      </header>

      <main className="px-6 pb-12 max-w-6xl mx-auto">
        {/* Title */}
        <div className="mb-16 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 opacity-5 rotate-12 pointer-events-none">
            <Camera size={500} />
          </div>
          <Camera size={20} className="text-rose-500 mb-6" />
          <h1 className="text-4xl font-bold uppercase tracking-tight text-white mb-2">Gallery</h1>
          <div className="h-2 w-20 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full" />
        </div>

        {/* Admin controls */}
        {isAdmin && (
          <div className="mb-6 flex flex-wrap gap-3">
            <div>
              <button
                onClick={() => { setShowUpload(v => !v); setActionStatus(null); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:border-rose-500 hover:text-rose-400 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <Upload size={14} />
                {showUpload ? "Close" : "Upload Photo"}
              </button>

              {showUpload && (
                <form onSubmit={handleUpload} className="mt-4 p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col gap-4 max-w-md">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">JPEG files</label>
                    <input
                      ref={fileInputRef}
                      type="file" accept=".jpg,.jpeg" multiple required
                      onChange={e => setUploadFiles(Array.from(e.target.files ?? []))}
                      className="w-full text-sm text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 cursor-pointer"
                    />
                    {uploadFiles.length > 1 && <p className="mt-1 text-xs text-slate-500">{uploadFiles.length} files selected</p>}
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Category</label>
                    <input
                      type="text" value={uploadCategory} onChange={e => setUploadCategory(e.target.value)} placeholder="nature"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>
                  {uploadProgress && <p className="text-xs text-slate-400">Uploading {uploadProgress.done} / {uploadProgress.total}…</p>}
                  {actionStatus && !uploadProgress && (
                    <p className={`text-xs ${actionStatus.ok ? "text-emerald-400" : "text-rose-400"}`}>{actionStatus.msg}</p>
                  )}
                  <button
                    type="submit" disabled={uploading || !uploadFiles.length}
                    className="self-start flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    <Upload size={13} />
                    {uploading ? "Uploading…" : uploadFiles.length > 1 ? `Upload ${uploadFiles.length} photos` : "Upload"}
                  </button>
                </form>
              )}
            </div>

            <div>
              <button
                onClick={() => { setDeleteMode(v => !v); setActionStatus(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-semibold uppercase tracking-wider transition-colors ${deleteMode ? "border-rose-500 text-rose-400 bg-rose-500/10" : "border-slate-700 text-slate-400 hover:border-rose-500 hover:text-rose-400"}`}
              >
                <Trash2 size={14} />
                {deleteMode ? "Done" : "Delete Photos"}
              </button>
              {deleteMode && (
                <div className="mt-4 p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col gap-4 max-w-md">
                  <p className="text-xs text-slate-400">Click the <span className="text-rose-400">✕</span> on any photo to delete it.</p>
                  {actionStatus && <p className={`text-xs ${actionStatus.ok ? "text-emerald-400" : "text-rose-400"}`}>{actionStatus.msg}</p>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search photos…"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>

        {/* Category chips */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border transition-colors ${activeCategory === cat ? "border-rose-500 text-rose-400 bg-rose-500/10" : "border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {(query || activeCategory) && (
          <p className="text-sm text-slate-500 mb-6">Showing {filteredPhotos.length} of {photos.length} photos</p>
        )}
      </main>

      {/* Gallery */}
      <section className="px-6 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <span className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-rose-500 animate-spin" />
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-slate-600">
            <Camera size={48} className="mb-4" />
            <p className="text-sm uppercase tracking-widest">No photos match your search</p>
          </div>
        ) : (
          <>
            <Gallery photos={filteredPhotos} deleteMode={deleteMode} deletingIds={deletingIds} onDelete={handleDelete} />
            {totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center gap-3">
                <p className="text-xs text-slate-600">Page {page} of {totalPages} · {total} photos</p>
                <div className="flex items-center gap-1">
                  <button onClick={() => goToPage(page - 1)} disabled={page === 1} className="px-3 py-1.5 rounded border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors">←</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => goToPage(p)} className={`px-3 py-1.5 rounded border text-xs transition-colors ${p === page ? "border-rose-500 text-rose-400 bg-rose-500/10" : "border-slate-700 text-slate-500 hover:border-slate-500 hover:text-white"}`}>{p}</button>
                  ))}
                  <button onClick={() => goToPage(page + 1)} disabled={page === totalPages} className="px-3 py-1.5 rounded border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors">→</button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
