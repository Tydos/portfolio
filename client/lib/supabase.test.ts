import { describe, it, expect, vi, beforeEach } from "vitest";

const createClientMock = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: (...args: unknown[]) => createClientMock(...args),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("supabase browser client", () => {
  it("exports isSupabaseConfigured false and a stub client without env", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    createClientMock.mockReturnValue({ auth: {} });

    const { isSupabaseConfigured, supabase } = await import("./supabase");

    expect(isSupabaseConfigured).toBe(false);
    expect(supabase).toEqual({ auth: {} });
    expect(createClientMock).toHaveBeenCalledWith(
      "http://127.0.0.1",
      "public-anon-key",
    );
  });

  it("creates a real client when public env vars are set", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-key");
    createClientMock.mockReturnValue({ auth: { getSession: vi.fn() } });

    const { isSupabaseConfigured, supabase } = await import("./supabase");

    expect(isSupabaseConfigured).toBe(true);
    expect(supabase).toEqual({ auth: { getSession: expect.any(Function) } });
    expect(createClientMock).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "anon-key",
    );
  });
});
