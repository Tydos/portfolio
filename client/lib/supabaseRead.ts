import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function getSupabaseReadConfig(): { url: string; key: string } {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
  const key =
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_KEY ??
    "";

  return { url, key };
}

export function isSupabaseReadConfigured(): boolean {
  const { url, key } = getSupabaseReadConfig();
  return Boolean(url && key);
}

/** Server/API read client. Never import this from client components. */
export function createSupabaseReadClient(): SupabaseClient | null {
  const { url, key } = getSupabaseReadConfig();
  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
