'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GitHub, LogOut } from "react-feather";
import type { Session } from "@supabase/supabase-js";
import { getSession, onAuthStateChange, signInWithGithub, signOut as authSignOut } from "../../lib/auth";
import { GITHUB_USERNAME } from "../../constants/config";

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = session?.user?.user_metadata?.user_name === GITHUB_USERNAME;

  useEffect(() => {
    getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: { subscription } } = onAuthStateChange((_event, s) => {
      setSession(s);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 text-slate-500 flex items-center justify-center text-sm">
      Loading…
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-lg font-bold uppercase tracking-widest text-slate-300">Admin</h1>

      {!session ? (
        <button
          onClick={() => signInWithGithub(`${window.location.origin}/admin`)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:border-rose-500 hover:text-rose-400 text-sm font-semibold transition-colors"
        >
          <GitHub size={14} />
          Sign in with GitHub
        </button>
      ) : !isAdmin ? (
        <div className="flex flex-col items-center gap-4 text-sm text-slate-400">
          <p>@{session.user.user_metadata?.user_name} is not the admin.</p>
          <button onClick={() => authSignOut()} className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors">
            <LogOut size={13} /> Sign out
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-sm">
          <p className="text-emerald-400">Signed in as @{session.user.user_metadata?.user_name}</p>
          <Link href="/#creative-eye" className="text-slate-400 hover:text-white transition-colors underline underline-offset-4">
            Go to Gallery
          </Link>
          <button onClick={() => authSignOut()} className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors">
            <LogOut size={13} /> Sign out
          </button>
        </div>
      )}

      <Link href="/" className="absolute top-5 left-6 text-xs text-slate-600 hover:text-slate-400 transition-colors">
        ← Back
      </Link>
    </div>
  );
}
