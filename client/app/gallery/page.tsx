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
    <div className="min-h-screen bg-white text-ink">
      <header className="px-6 py-5 max-w-6xl mx-auto">
        <Link href="/#creative-eye" className="text-sm font-medium text-ink-muted hover:text-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rounded">
          ← Back to portfolio
        </Link>
      </header>

      <main className="px-6 pb-12 max-w-6xl mx-auto">
        <h1 className="text-section font-bold text-ink mb-10 pb-3 border-b-2 border-accent">Gallery</h1>

        {/* Admin controls */}
        {isAdmin && (
          <div className="mb-6 flex flex-wrap gap-3">
            <div>
              <button
                onClick={() => { setShowUpload(v => !v); setActionStatus(null); }}
                className="flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-lg border border-slate-200 text-ink-muted hover:border-accent hover:text-accent text-sm font-medium transition-colors"
              >
                <Upload size={14} />
                {showUpload ? "Close upload" : "Upload photos"}
              </button>

              {showUpload && (
                <form onSubmit={handleUpload} className="mt-4 p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-4 max-w-md">
                  <div>
                    <label htmlFor="gallery-upload" className="block text-sm text-ink-muted mb-1">JPEG files</label>
                    <input
                      id="gallery-upload"
                      ref={fileInputRef}
                      type="file" accept=".jpg,.jpeg" multiple required
                      onChange={e => setUploadFiles(Array.from(e.target.files ?? []))}
                      className="w-full text-sm text-ink file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-white file:text-ink file:border file:border-slate-200 cursor-pointer"
                    />
                    {uploadFiles.length > 1 && <p className="mt-1 text-xs text-ink-muted">{uploadFiles.length} files selected</p>}
                  </div>
                  <div>
                    <label htmlFor="gallery-category" className="block text-sm text-ink-muted mb-1">Category</label>
                    <input
                      id="gallery-category"
                      type="text" value={uploadCategory} onChange={e => setUploadCategory(e.target.value)} placeholder="nature"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-ink placeholder-ink-muted/60 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  {uploadProgress && <p className="text-xs text-ink-muted">Uploading {uploadProgress.done} of {uploadProgress.total}…</p>}
                  {actionStatus && !uploadProgress && (
                    <p className={`text-xs ${actionStatus.ok ? "text-emerald-700" : "text-red-600"}`} role="status">{actionStatus.msg}</p>
                  )}
                  <button
                    type="submit" disabled={uploading || !uploadFiles.length}
                    className="self-start flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
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
                className={`flex items-center gap-2 px-4 py-2 min-h-[44px] rounded-lg border text-sm font-medium transition-colors ${deleteMode ? "border-red-500 text-red-600 bg-red-50" : "border-slate-200 text-ink-muted hover:border-red-400 hover:text-red-600"}`}
              >
                <Trash2 size={14} />
                {deleteMode ? "Done deleting" : "Delete photos"}
              </button>
              {deleteMode && (
                <div className="mt-4 p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-4 max-w-md">
                  <p className="text-sm text-ink-muted">Select the ✕ on a photo to delete it.</p>
                  {actionStatus && <p className={`text-xs ${actionStatus.ok ? "text-emerald-700" : "text-red-600"}`} role="status">{actionStatus.msg}</p>}
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
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm text-ink placeholder-ink-muted/60 focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Category chips */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`px-3 py-1.5 min-h-[44px] rounded-full text-xs font-medium border transition-colors ${activeCategory === cat ? "border-accent text-accent bg-accent-subtle" : "border-slate-200 text-ink-muted hover:border-slate-300 hover:text-ink"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {(query || activeCategory) && (
            <p className="text-sm text-ink-muted mb-6">Showing {filteredPhotos.length} of {photos.length} photos</p>
        )}
      </main>

      {/* Gallery */}
      <section className="px-6 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <span className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-accent animate-spin" role="status" aria-label="Loading photos" />
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-ink-muted">
            <Camera size={40} className="mb-4" aria-hidden="true" />
            <p className="text-sm">No photos match your search.</p>
            <p className="text-sm mt-1">Try a different keyword or clear the filters.</p>
          </div>
        ) : (
          <>
            <Gallery photos={filteredPhotos} deleteMode={deleteMode} deletingIds={deletingIds} onDelete={handleDelete} />
            {totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center gap-3">
                <p className="text-xs text-ink-muted">Page {page} of {totalPages} · {total} photos</p>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => goToPage(page - 1)} disabled={page === 1} aria-label="Previous page" className="px-3 py-1.5 min-h-[44px] min-w-[44px] rounded border border-slate-200 text-ink-muted hover:border-slate-300 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors">←</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button type="button" key={p} onClick={() => goToPage(p)} aria-current={p === page ? "page" : undefined} className={`px-3 py-1.5 min-h-[44px] min-w-[44px] rounded border text-xs transition-colors ${p === page ? "border-accent text-accent bg-accent-subtle" : "border-slate-200 text-ink-muted hover:border-slate-300 hover:text-ink"}`}>{p}</button>
                  ))}
                  <button type="button" onClick={() => goToPage(page + 1)} disabled={page === totalPages} aria-label="Next page" className="px-3 py-1.5 min-h-[44px] min-w-[44px] rounded border border-slate-200 text-ink-muted hover:border-slate-300 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors">→</button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
