import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const createClientMock = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: (...args: unknown[]) => createClientMock(...args),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getSupabaseReadConfig", () => {
  it("prefers public URL and SUPABASE_ANON_KEY when set", async () => {
    vi.stubEnv("SUPABASE_URL", "https://server.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://public.supabase.co");
    vi.stubEnv("SUPABASE_ANON_KEY", "anon-server");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon-public");

    const { getSupabaseReadConfig } = await import("./supabaseRead");
    expect(getSupabaseReadConfig()).toEqual({
      url: "https://public.supabase.co",
      key: "anon-server",
    });
  });

  it("falls back through server URL and legacy key env vars", async () => {
    vi.stubEnv("SUPABASE_URL", "https://legacy.supabase.co");
    vi.stubEnv("SUPABASE_KEY", "legacy-key");
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    const { getSupabaseReadConfig } = await import("./supabaseRead");
    expect(getSupabaseReadConfig()).toEqual({
      url: "https://legacy.supabase.co",
      key: "legacy-key",
    });
  });
});

describe("isSupabaseReadConfigured", () => {
  it("is false when url or key is missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    delete process.env.SUPABASE_KEY;

    const { isSupabaseReadConfigured } = await import("./supabaseRead");
    expect(isSupabaseReadConfigured()).toBe(false);
  });

  it("is true when both url and key are present", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");

    const { isSupabaseReadConfigured } = await import("./supabaseRead");
    expect(isSupabaseReadConfigured()).toBe(true);
  });
});

describe("createSupabaseReadClient", () => {
  it("returns null when unconfigured", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    delete process.env.SUPABASE_KEY;

    const { createSupabaseReadClient } = await import("./supabaseRead");
    expect(createSupabaseReadClient()).toBeNull();
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it("creates a session-less client when configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");
    createClientMock.mockReturnValue({ from: vi.fn() });

    const { createSupabaseReadClient } = await import("./supabaseRead");
    const client = createSupabaseReadClient();

    expect(client).toEqual({ from: expect.any(Function) });
    expect(createClientMock).toHaveBeenCalledWith(
      "https://example.supabase.co",
      "anon",
      {
        auth: { persistSession: false, autoRefreshToken: false },
      },
    );
  });
});
