import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Resolve public Supabase URL and anon/publishable key from env.
 *
 * @returns URL and key strings (empty when unset).
 */
function getSupabasePublicConfig(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    "";
  return { url, key };
}

/**
 * Whether public Supabase credentials are present for browser reads and auth.
 *
 * @returns True when both URL and key resolve to non-empty strings.
 */
export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabasePublicConfig();
  return Boolean(url && key);
}

/**
 * Build the browser/SSR Supabase client used for auth and gallery reads.
 *
 * When env vars are missing, returns a stub client; callers must guard with
 * {@link isSupabaseConfigured} before using data APIs.
 *
 * @returns Supabase JS client instance.
 */
function createSupabaseClient(): SupabaseClient {
  const { url, key } = getSupabasePublicConfig();
  if (url && key) {
    return createClient(url, key);
  }
  // Unused stub — callers must guard with isSupabaseConfigured first.
  return createClient("http://127.0.0.1", "public-anon-key");
}

/** Shared Supabase client for browser auth and session helpers. */
export const supabase = createSupabaseClient();
