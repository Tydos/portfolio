import { supabase } from "./supabase";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

export const getSession = () => supabase.auth.getSession();

export const onAuthStateChange = (
  cb: (event: AuthChangeEvent, session: Session | null) => void
) => supabase.auth.onAuthStateChange(cb);

export const signInWithGithub = (redirectTo: string) =>
  supabase.auth.signInWithOAuth({ provider: "github", options: { redirectTo } });

export const signOut = () => supabase.auth.signOut();
