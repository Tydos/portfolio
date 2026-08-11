import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const parsePhotographPaginationMock = vi.fn();
const queryPhotographsFromSupabaseMock = vi.fn();
const isSupabaseReadConfiguredMock = vi.fn();

vi.mock("../../../lib/photographsQuery", () => ({
  parsePhotographPagination: (...args: unknown[]) =>
    parsePhotographPaginationMock(...args),
  queryPhotographsFromSupabase: (...args: unknown[]) =>
    queryPhotographsFromSupabaseMock(...args),
}));

vi.mock("../../../lib/supabaseRead", () => ({
  isSupabaseReadConfigured: () => isSupabaseReadConfiguredMock(),
}));

import { GET } from "./route";

beforeEach(() => {
  vi.clearAllMocks();
  parsePhotographPaginationMock.mockReturnValue({ limit: 25, offset: 0 });
});

describe("GET /api/images", () => {
  it("returns 503 when Supabase is not configured", async () => {
    isSupabaseReadConfiguredMock.mockReturnValue(false);
    const request = new NextRequest("http://localhost/api/images");

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual({ error: "Supabase is not configured." });
    expect(queryPhotographsFromSupabaseMock).not.toHaveBeenCalled();
  });

  it("returns paginated photos when the query succeeds", async () => {
    isSupabaseReadConfiguredMock.mockReturnValue(true);
    parsePhotographPaginationMock.mockReturnValue({ limit: 10, offset: 20 });
    queryPhotographsFromSupabaseMock.mockResolvedValue({
      photos: [
        {
          id: 1,
          filename: "a.jpg",
          url: "https://example.com/a.jpg",
          category: "nature",
          width: 100,
          height: 200,
        },
      ],
      total: 1,
    });

    const request = new NextRequest(
      "http://localhost/api/images?limit=10&offset=20",
    );
    const response = await GET(request);
    const body = await response.json();

    expect(parsePhotographPaginationMock).toHaveBeenCalledWith("10", "20");
    expect(queryPhotographsFromSupabaseMock).toHaveBeenCalledWith(10, 20);
    expect(response.status).toBe(200);
    expect(body.total).toBe(1);
    expect(body.photos).toHaveLength(1);
  });

  it("returns 503 when the Supabase query fails", async () => {
    isSupabaseReadConfiguredMock.mockReturnValue(true);
    queryPhotographsFromSupabaseMock.mockResolvedValue(null);

    const request = new NextRequest("http://localhost/api/images");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual({
      error: "Failed to read photographs from Supabase.",
    });
  });
});
