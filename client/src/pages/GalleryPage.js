import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Camera, Search } from "react-feather";
import Gallery from "../components/sections/Gallery";
import { fetchPhotos } from "../api/api";

function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    fetchPhotos().then(setPhotos).catch(console.error);
  }, []);

  const categories = [...new Set(photos.map((p) => p.category).filter(Boolean))];

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
          to="/"
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
          <h1 className="text-4xl font-bold uppercase tracking-tight text-white mb-2">
            Gallery
          </h1>
          <div className="h-2 w-20 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-full" />
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
