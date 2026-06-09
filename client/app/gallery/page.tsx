'use client';

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Camera, Search, Upload, Trash2, GitHub, LogOut } from "react-feather";
import type { Session } from "@supabase/supabase-js";
import Gallery from "../../components/sections/Gallery";
import { fetchPhotos, uploadPhoto, deletePhoto } from "../../lib/api";
import { getSession, onAuthStateChange, signInWithGithub, signOut as authSignOut } from "../../lib/auth";
import type { Photo } from "../../types";
import { GITHUB_USERNAME } from "../../constants/config";

function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [session, setSession] = useState<Session | null>(null);
  const isAdmin = session?.user?.user_metadata?.user_name === GITHUB_USERNAME;

  const [showUpload, setShowUpload] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState("nature");
  const [uploading, setUploading] = useState(false);
  const [actionStatus, setActionStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [deleteMode, setDeleteMode] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  function loadPhotos() {
    fetchPhotos(100, 0, true).then(setPhotos).catch(() => {});
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  useEffect(() => {
    getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = onAuthStateChange((_event, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignIn() {
    await signInWithGithub(`${window.location.origin}/gallery`);
  }

  async function handleSignOut() {
    await authSignOut();
    setShowUpload(false);
    setDeleteMode(false);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadFile || !isAdmin) return;
    setUploading(true);
    setActionStatus(null);
    try {
      await uploadPhoto(uploadFile, uploadCategory);
      setActionStatus({ ok: true, msg: "Uploaded successfully." });
      setUploadFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      loadPhotos();
    } catch (err) {
      setActionStatus({ ok: false, msg: err instanceof Error ? err.message : "Upload failed." });
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(photo: Photo) {
    if (photo.id == null || !isAdmin) return;
    setDeletingIds((prev) => new Set(prev).add(photo.id!));
    setActionStatus(null);
    try {
      await deletePhoto(photo.id);
      setActionStatus({ ok: true, msg: `Deleted "${photo.title}".` });
      loadPhotos();
    } catch (err) {
      setActionStatus({ ok: false, msg: err instanceof Error ? err.message : "Delete failed." });
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

      <main className="px-6 pb-12 max-w-6xl mx-auto">
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

        {/* Auth bar */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          {!session ? (
            <button
              onClick={handleSignIn}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:border-rose-500 hover:text-rose-400 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <GitHub size={14} />
              Sign in with GitHub
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">
                @{session.user.user_metadata?.user_name}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors"
              >
                <LogOut size={12} />
                Sign out
              </button>
            </div>
          )}
        </div>

        {/* Admin controls — only shown to the admin account */}
        {isAdmin && (
          <div className="mb-6 flex flex-wrap gap-3">
            {/* Upload */}
            <div>
              <button
                onClick={() => { setShowUpload((v) => !v); setActionStatus(null); }}
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

                  {actionStatus && (
                    <p className={`text-xs ${actionStatus.ok ? "text-emerald-400" : "text-rose-400"}`}>
                      {actionStatus.msg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={uploading || !uploadFile}
                    className="self-start flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    <Upload size={13} />
                    {uploading ? "Uploading…" : "Upload"}
                  </button>
                </form>
              )}
            </div>

            {/* Delete */}
            <div>
              <button
                onClick={() => { setDeleteMode((v) => !v); setActionStatus(null); }}
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
                    Click the <span className="text-rose-400">✕</span> on any photo to delete it.
                  </p>
                  {actionStatus && (
                    <p className={`text-xs ${actionStatus.ok ? "text-emerald-400" : "text-rose-400"}`}>
                      {actionStatus.msg}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

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
