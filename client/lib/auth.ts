import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export function getSession() {
  return supabase.auth.getSession();
}

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}

export function signInWithGithub(redirectTo: string) {
  return supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo },
  });
}

export function signOut() {
  return supabase.auth.signOut();
}
