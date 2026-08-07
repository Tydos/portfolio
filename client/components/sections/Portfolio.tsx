"use client";

import { useState, useEffect } from "react";
import { Camera, ChevronLeft, ChevronRight } from "react-feather";
import Gallery from "./Gallery";
import SectionTitle from "../ui/SectionTitle";
import { usePhotos } from "../../lib/usePhotos";
import { getSession, onAuthStateChange } from "../../lib/auth";
import type { Photo } from "../../types";
import { GITHUB_USERNAME } from "../../constants/config";

function Scrubber({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  return (
    <div className="mt-12 flex flex-col items-center gap-4 px-6">
      <p className="text-sm tabular-nums tracking-wide text-ink-muted">
        <span className="text-ink font-medium">{String(page).padStart(2, "0")}</span>
        {" / "}
        {String(totalPages).padStart(2, "0")}
      </p>

      <div className="flex items-center gap-4 w-full max-w-sm">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className="flex items-center justify-center min-h-[44px] min-w-[44px] text-ink-muted hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="relative flex-1 h-px bg-slate-200">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const percent = totalPages > 1 ? ((p - 1) / (totalPages - 1)) * 100 : 0;
            const isActive = p === page;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onChange(p)}
                aria-label={`Go to page ${p}`}
                aria-current={isActive ? "true" : undefined}
                style={{ left: `${percent}%` }}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 group"
              >
                <span
                  className={`block w-px transition-all duration-300 ${
                    isActive ? "h-3 bg-ink" : "h-2 bg-slate-300 group-hover:bg-slate-500 group-hover:h-2.5"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
          className="flex items-center justify-center min-h-[44px] min-w-[44px] text-ink-muted hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function Portfolio() {
  const { photos, total, page, totalPages, loading, uploading, uploadProgress, deletingIds, fileInputRef, goToPage, upload, remove } = usePhotos();

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

  const categories = [...new Set(photos.map((p) => p.category).filter(Boolean))];
  const filteredPhotos = photos.filter(
    (p) => !activeCategory || p.category === activeCategory
  );

  return (
    <>
      <div className="max-w-3xl mx-auto px-6 mb-12 md:mb-16 text-center">
        <SectionTitle className="mb-3">Portfolio</SectionTitle>
        {total > 0 && (
          <p className="text-base text-ink-muted">
            {total} photograph{total === 1 ? "" : "s"}
          </p>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Admin controls */}
        {isAdmin && (
          <div className="mb-8 flex flex-col gap-3">
            <div className="flex items-center gap-4 text-xs uppercase tracking-wide">
              <button
                onClick={() => { setShowUpload((v) => !v); setActionStatus(null); }}
                className="text-ink-muted hover:text-ink underline-offset-4 hover:underline transition-colors min-h-[44px] flex items-center"
              >
                {showUpload ? "Close upload" : "Upload photos"}
              </button>
              <span className="text-slate-300">·</span>
              <button
                onClick={() => { setDeleteMode((v) => !v); setActionStatus(null); }}
                className={`underline-offset-4 hover:underline transition-colors min-h-[44px] flex items-center ${deleteMode ? "text-red-600" : "text-ink-muted hover:text-ink"}`}
              >
                {deleteMode ? "Done deleting" : "Delete photos"}
              </button>
            </div>

            {showUpload && (
              <form onSubmit={handleUpload} className="flex flex-col gap-4 max-w-md">
                <div>
                  <label htmlFor="portfolio-upload" className="block text-sm text-ink-muted mb-1">JPEG files</label>
                  <input
                    id="portfolio-upload"
                    ref={fileInputRef}
                    type="file" accept=".jpg,.jpeg" multiple required
                    onChange={(e) => setUploadFiles(Array.from(e.target.files ?? []))}
                    className="w-full text-sm text-ink file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-white file:text-ink file:border file:border-slate-200 cursor-pointer"
                  />
                  {uploadFiles.length > 1 && <p className="mt-1 text-xs text-ink-muted">{uploadFiles.length} files selected</p>}
                </div>
                <div>
                  <label htmlFor="portfolio-category" className="block text-sm text-ink-muted mb-1">Category</label>
                  <input
                    id="portfolio-category"
                    type="text" value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)} placeholder="nature"
                    className="w-full bg-transparent border-b border-slate-200 px-0 py-2 text-sm text-ink placeholder-ink-muted/60 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                {uploadProgress && <p className="text-xs text-ink-muted">Uploading {uploadProgress.done} of {uploadProgress.total}…</p>}
                {actionStatus && !uploadProgress && (
                  <p className={`text-xs ${actionStatus.ok ? "text-emerald-700" : "text-red-600"}`} role="status">{actionStatus.msg}</p>
                )}
                <button
                  type="submit" disabled={uploading || !uploadFiles.length}
                  className="self-start text-xs uppercase tracking-wide font-medium text-ink hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed underline-offset-4 hover:underline transition-colors min-h-[44px] flex items-center"
                >
                  {uploading ? "Uploading…" : uploadFiles.length > 1 ? `Upload ${uploadFiles.length} photos` : "Upload"}
                </button>
              </form>
            )}

            {deleteMode && (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-ink-muted">Select the ✕ on a photo to delete it.</p>
                {actionStatus && <p className={`text-xs ${actionStatus.ok ? "text-emerald-700" : "text-red-600"}`} role="status">{actionStatus.msg}</p>}
              </div>
            )}
          </div>
        )}

        {/* Category filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm mb-6">
            {categories.map((cat, i) => (
              <span key={cat} className="flex items-center gap-4">
                {i > 0 && <span className="text-slate-300">·</span>}
                <button
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`underline-offset-4 transition-colors min-h-[44px] flex items-center ${
                    activeCategory === cat ? "text-accent underline" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {cat}
                </button>
              </span>
            ))}
          </div>
        )}

        {activeCategory && (
          <p className="text-sm text-ink-muted mb-6 text-center">Showing {filteredPhotos.length} of {photos.length} photos</p>
        )}
      </div>

      {/* Gallery — full-bleed, breaks out of the narrow text column */}
      {loading ? (
        <div className="flex items-center justify-center py-24 px-6" role="status" aria-live="polite">
          <span className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-accent animate-spin" />
          <span className="sr-only">Loading photos</span>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-ink-muted">
          <Camera size={40} className="mb-4" aria-hidden="true" />
          <p className="text-base">{photos.length === 0 ? "No photos to show yet." : "No photos in this category."}</p>
          <p className="text-sm mt-2">{photos.length === 0 ? "Check back soon for new work." : "Try selecting a different category."}</p>
        </div>
      ) : (
        <>
          <div className="max-w-[1800px] mx-auto px-2 sm:px-4">
            <Gallery photos={filteredPhotos} deleteMode={deleteMode} deletingIds={deletingIds} onDelete={handleDelete} />
          </div>

          {totalPages > 1 && (
            <Scrubber page={page} totalPages={totalPages} onChange={goToPage} />
          )}
        </>
      )}
    </>
  );
}

export default Portfolio;
