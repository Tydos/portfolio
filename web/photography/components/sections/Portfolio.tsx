"use client";

import { useState, useEffect } from "react";
import { Camera, ChevronLeft, ChevronRight } from "react-feather";
import Gallery from "./Gallery";
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
    <div className="mt-12 flex items-center justify-center gap-6 px-6">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="flex items-center justify-center min-h-[44px] min-w-[44px] text-wired-black hover:text-wired-yellow disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>

      <p className="text-sm font-bold tabular-nums tracking-wide text-wired-black">
        <span className="inline-block bg-wired-yellow px-1.5 py-0.5">
          {String(page).padStart(2, "0")}
        </span>
        {" / "}
        {String(totalPages).padStart(2, "0")}
      </p>

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="flex items-center justify-center min-h-[44px] min-w-[44px] text-wired-black hover:text-wired-yellow disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <ChevronRight size={20} aria-hidden="true" />
      </button>
    </div>
  );
}

/**
 * Photography portfolio section with paginated gallery and admin controls.
 */
function Portfolio() {
  const { photos, total, page, totalPages, loading, readError, uploading, uploadProgress, deletingIds, fileInputRef, goToPage, upload, remove } = usePhotos();

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
      <div className="max-w-6xl mx-auto px-6">
        {/* Admin controls */}
        {isAdmin && (
          <div className="mb-8 flex flex-col gap-3">
            <div className="flex items-center gap-4 text-xs uppercase tracking-wide">
              <button
                onClick={() => { setShowUpload((v) => !v); setActionStatus(null); }}
                className="text-ink-muted hover:text-ink underline-offset-4 hover:underline transition-colors min-h-[44px] flex items-center font-semibold uppercase tracking-wide"
              >
                {showUpload ? "Close upload" : "Upload photos"}
              </button>
              <span className="text-wired-gray">/</span>
              <button
                onClick={() => { setDeleteMode((v) => !v); setActionStatus(null); }}
                className={`underline-offset-4 hover:underline transition-colors min-h-[44px] flex items-center font-semibold uppercase tracking-wide ${deleteMode ? "text-red-600" : "text-ink-muted hover:text-ink"}`}
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
                    className="w-full text-sm text-ink file:mr-3 file:py-1.5 file:px-3 file:rounded-none file:border-0 file:text-xs file:font-medium file:bg-wired-paper file:text-ink file:border file:border-wired-gray/30 cursor-pointer"
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
                  className="self-start px-5 py-2.5 bg-wired-black text-wired-yellow text-xs uppercase tracking-wide font-semibold hover:bg-wired-gray disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[44px] flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mb-6">
            {categories.map((cat, i) => (
              <span key={cat} className="flex items-center gap-3">
                {i > 0 && <span className="text-wired-gray">/</span>}
                <button
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`text-xs font-semibold uppercase tracking-wider underline-offset-4 transition-colors min-h-[44px] flex items-center ${
                    activeCategory === cat
                      ? "text-wired-black underline"
                      : "text-wired-gray hover:text-wired-black"
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
        <div className="flex flex-col items-center justify-center py-24 px-6 text-ink-muted text-center max-w-lg mx-auto">
          <Camera size={40} className="mb-4" aria-hidden="true" />
          {readError === "not_configured" ? (
            <>
              <p className="text-base text-ink">Gallery cannot load without Supabase.</p>
              <p className="text-sm mt-2">
                Add <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                <code className="text-xs">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to{" "}
                <code className="text-xs">web/photography/.env.local</code> (local) or the photography Vercel project, then restart or redeploy.
              </p>
            </>
          ) : readError === "query_failed" ? (
            <>
              <p className="text-base text-ink">Could not read photos from Supabase.</p>
              <p className="text-sm mt-2">
                Check the browser console, confirm the project is awake, and that RLS allows public{" "}
                <code className="text-xs">SELECT</code> on <code className="text-xs">photographs</code>.
              </p>
            </>
          ) : (
            <>
              <p className="text-base">{photos.length === 0 ? "No photos to show yet." : "No photos in this category."}</p>
              <p className="text-sm mt-2">{photos.length === 0 ? "Check back soon for new work." : "Try selecting a different category."}</p>
            </>
          )}
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
