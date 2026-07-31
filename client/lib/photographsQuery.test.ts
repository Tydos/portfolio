import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  parsePhotographPagination,
  queryPhotographsFromSupabase,
} from "./photographsQuery";

const { mockRange, mockOrder, mockSelect, mockFrom, mockClient } = vi.hoisted(() => {
  const mockRange = vi.fn();
  const mockOrder = vi.fn(() => ({ range: mockRange }));
  const mockSelect = vi.fn(() => ({ order: mockOrder }));
  const mockFrom = vi.fn(() => ({ select: mockSelect }));
  const mockClient = { from: mockFrom };
  return { mockRange, mockOrder, mockSelect, mockFrom, mockClient };
});

vi.mock("./supabaseRead", () => ({
  isSupabaseReadConfigured: vi.fn(() => true),
  createSupabaseReadClient: vi.fn(() => mockClient),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("parsePhotographPagination", () => {
  it("clamps limit and parses offset", () => {
    expect(parsePhotographPagination("12", "24")).toEqual({
      limit: 12,
      offset: 24,
    });
    expect(parsePhotographPagination("500", "-5")).toEqual({
      limit: 100,
      offset: 0,
    });
  });
});

describe("queryPhotographsFromSupabase", () => {
  it("returns paginated rows and total count", async () => {
    mockRange.mockResolvedValue({
      data: [
        {
          id: 2,
          filename: "forest.jpg",
          url: "https://example.com/forest.jpg",
          category: "nature",
          width: 800,
          height: 600,
        },
      ],
      error: null,
      count: 10,
    });

    const result = await queryPhotographsFromSupabase(12, 12);

    expect(mockFrom).toHaveBeenCalledWith("photographs");
    expect(mockRange).toHaveBeenCalledWith(12, 23);
    expect(result).toEqual({
      photos: [
        {
          id: 2,
          filename: "forest.jpg",
          url: "https://example.com/forest.jpg",
          category: "nature",
          width: 800,
          height: 600,
        },
      ],
      total: 10,
    });
  });

  it("returns null on query error", async () => {
    mockRange.mockResolvedValue({
      data: null,
      error: { message: "connection failed" },
      count: null,
    });

    expect(await queryPhotographsFromSupabase(50, 0)).toBeNull();
  });
});
