import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "";

/** True when public Supabase env vars are set (safe for browser + SSR). */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

function createSupabaseClient(): SupabaseClient {
  if (isSupabaseConfigured) {
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  // Unused stub — callers must guard with isSupabaseConfigured first.
  return createClient("http://127.0.0.1", "public-anon-key");
}

export const supabase = createSupabaseClient();
