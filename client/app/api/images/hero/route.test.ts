import { describe, it, expect, vi, beforeEach } from "vitest";

const queryHeroFeaturedPhotographsMock = vi.fn();
const isSupabaseReadConfiguredMock = vi.fn();

vi.mock("../../../../lib/photographsQuery", () => ({
  queryHeroFeaturedPhotographs: (...args: unknown[]) =>
    queryHeroFeaturedPhotographsMock(...args),
}));

vi.mock("../../../../lib/supabaseRead", () => ({
  isSupabaseReadConfigured: () => isSupabaseReadConfiguredMock(),
}));

import { GET } from "./route";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/images/hero", () => {
  it("returns 503 when Supabase is not configured", async () => {
    isSupabaseReadConfiguredMock.mockReturnValue(false);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual({ error: "Supabase is not configured." });
  });

  it("returns hero photos when the query succeeds", async () => {
    isSupabaseReadConfiguredMock.mockReturnValue(true);
    queryHeroFeaturedPhotographsMock.mockResolvedValue([
      {
        id: 3,
        filename: "lake.jpg",
        url: "https://example.com/lake.jpg",
        category: "nature",
        width: 800,
        height: 600,
      },
    ]);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.photos).toHaveLength(1);
  });
});
