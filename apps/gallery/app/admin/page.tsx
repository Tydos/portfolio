'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { GitHub, LogOut } from "react-feather";
import {
  getGithubAuthUrl,
  exchangeCodeForToken,
  fetchCurrentUser,
  signOut,
  getToken,
} from "../../lib/auth";
import { GITHUB_USERNAME } from "../../constants/config";

export default function AdminPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    async function init() {
      if (code) {
        try {
          const result = await exchangeCodeForToken(code);
          setUsername(result.github_username);
          setRole(result.role);
          window.history.replaceState({}, "", "/admin");
        } catch (err) {
          setError(err instanceof Error ? err.message : "Auth failed");
        }
      } else if (getToken()) {
        const user = await fetchCurrentUser();
        if (user) {
          setUsername(user.github_username);
          setRole(user.role);
        }
      }
      setLoading(false);
    }

    init();
  }, []);

  const isAdmin = role === "admin" && username === GITHUB_USERNAME;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-500 flex items-center justify-center text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-lg font-bold uppercase tracking-widest text-slate-300">Admin</h1>

      {error && <p className="text-rose-400 text-sm">{error}</p>}

      {!username ? (
        <button
          onClick={() => {
            const url = getGithubAuthUrl(`${window.location.origin}/admin`);
            window.location.href = url;
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:border-rose-500 hover:text-rose-400 text-sm font-semibold transition-colors"
        >
          <GitHub size={14} />
          Sign in with GitHub
        </button>
      ) : !isAdmin ? (
        <div className="flex flex-col items-center gap-4 text-sm text-slate-400">
          <p>@{username} is not the admin.</p>
          <button onClick={() => { signOut(); setUsername(null); setRole(null); }} className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors">
            <LogOut size={13} /> Sign out
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-sm">
          <p className="text-emerald-400">Signed in as @{username}</p>
          <Link href="/" className="text-slate-400 hover:text-white transition-colors underline underline-offset-4">
            Go to Gallery
          </Link>
          <button onClick={() => { signOut(); setUsername(null); setRole(null); }} className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors">
            <LogOut size={13} /> Sign out
          </button>
        </div>
      )}

      <Link href="/" className="absolute top-5 left-6 text-xs text-slate-600 hover:text-slate-400 transition-colors">
        ← Gallery
      </Link>
    </div>
  );
}
