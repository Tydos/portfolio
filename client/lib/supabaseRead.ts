import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Resolve Supabase URL and anon/publishable key for server-side reads.
 *
 * Prefers public URL env vars, then server-only fallbacks. Key preference:
 * `SUPABASE_ANON_KEY`, then public anon/publishable keys, then `SUPABASE_KEY`.
 *
 * @returns URL and key strings (empty when unset).
 */
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

/**
 * Whether server-side Supabase read credentials are present.
 *
 * @returns True when both URL and key resolve to non-empty strings.
 */
export function isSupabaseReadConfigured(): boolean {
  const { url, key } = getSupabaseReadConfig();
  return Boolean(url && key);
}

/**
 * Create a Supabase client for server/API photograph reads.
 *
 * Never import this from client components — session persistence is disabled.
 *
 * @returns Configured client, or `null` when credentials are missing.
 */
export function createSupabaseReadClient(): SupabaseClient | null {
  const { url, key } = getSupabaseReadConfig();
  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
