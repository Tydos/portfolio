import { supabase } from "./supabase";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

/**
 * Retrieve the current authentication session from Supabase.
 *
 * @returns Promise resolving to the current session state.
 */
export const getSession = () => supabase.auth.getSession();

/**
 * Subscribe to authentication state changes (login, logout, token refresh).
 *
 * Caller is responsible for unsubscribing using the returned subscription.
 *
 * @param cb - Callback invoked on auth state transitions.
 * @returns Subscription object for cleanup/unsubscription.
 */
export const onAuthStateChange = (
  cb: (event: AuthChangeEvent, session: Session | null) => void,
) => supabase.auth.onAuthStateChange(cb);

/**
 * Initiate OAuth sign-in with GitHub as the identity provider.
 *
 * Redirects the user to GitHub authentication, then back to `redirectTo`.
 *
 * @param redirectTo - URL to redirect to after successful authentication.
 * @returns Promise resolving to the OAuth sign-in response.
 */
export const signInWithGithub = (redirectTo: string) =>
  supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo },
  });

/**
 * Sign the current user out of the application.
 *
 * Clears the local session and invalidates authentication state.
 *
 * @returns Promise resolving when sign-out completes.
 */
export const signOut = () => supabase.auth.signOut();
