import { describe, it, expect, vi, beforeEach } from "vitest";

const getSessionMock = vi.fn();
const onAuthStateChangeMock = vi.fn();
const signInWithOAuthMock = vi.fn();
const signOutMock = vi.fn();

vi.mock("./supabase", () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => getSessionMock(...args),
      onAuthStateChange: (...args: unknown[]) => onAuthStateChangeMock(...args),
      signInWithOAuth: (...args: unknown[]) => signInWithOAuthMock(...args),
      signOut: (...args: unknown[]) => signOutMock(...args),
    },
  },
}));

import {
  getSession,
  onAuthStateChange,
  signInWithGithub,
  signOut,
} from "./auth";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("auth helpers", () => {
  it("getSession delegates to supabase.auth.getSession", async () => {
    getSessionMock.mockResolvedValue({ data: { session: null } });
    await expect(getSession()).resolves.toEqual({ data: { session: null } });
    expect(getSessionMock).toHaveBeenCalledTimes(1);
  });

  it("onAuthStateChange forwards the callback", () => {
    const cb = vi.fn();
    onAuthStateChangeMock.mockReturnValue({ data: { subscription: {} } });
    onAuthStateChange(cb);
    expect(onAuthStateChangeMock).toHaveBeenCalledWith(cb);
  });

  it("signInWithGithub uses GitHub OAuth with redirectTo", async () => {
    signInWithOAuthMock.mockResolvedValue({ data: {}, error: null });
    await signInWithGithub("https://example.com/admin");
    expect(signInWithOAuthMock).toHaveBeenCalledWith({
      provider: "github",
      options: { redirectTo: "https://example.com/admin" },
    });
  });

  it("signOut delegates to supabase.auth.signOut", async () => {
    signOutMock.mockResolvedValue({ error: null });
    await signOut();
    expect(signOutMock).toHaveBeenCalledTimes(1);
  });
});
