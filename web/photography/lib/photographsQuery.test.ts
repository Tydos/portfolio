import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  parsePhotographPagination,
  queryHeroFeaturedPhotographs,
  queryPhotographsFromSupabase,
} from "./photographsQuery";

const { mockRange, mockLimit, mockIn, mockSelect, mockFrom } = vi.hoisted(() => {
  const mockRange = vi.fn();
  const mockLimit = vi.fn();
  const mockIn = vi.fn();
  const mockSelect = vi.fn(() => ({
    order: () => ({ range: mockRange, limit: mockLimit }),
    in: mockIn,
  }));
  const mockFrom = vi.fn(() => ({ select: mockSelect }));
  return { mockRange, mockLimit, mockIn, mockSelect, mockFrom };
});

import { isSupabaseConfigured } from "./supabase";

vi.mock("./supabase", () => ({
  isSupabaseConfigured: vi.fn(() => true),
  supabase: { from: mockFrom },
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(isSupabaseConfigured).mockReturnValue(true);
  mockIn.mockImplementation(() => ({
    order: () => ({ limit: mockLimit }),
  }));
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

  it("defaults when params are null or non-numeric", () => {
    expect(parsePhotographPagination(null, null)).toEqual({
      limit: 25,
      offset: 0,
    });
    expect(parsePhotographPagination("abc", "xyz")).toEqual({
      limit: 25,
      offset: 0,
    });
  });
});

describe("queryPhotographsFromSupabase", () => {
  it("returns null when Supabase is not configured", async () => {
    vi.mocked(isSupabaseConfigured).mockReturnValue(false);
    expect(await queryPhotographsFromSupabase(25, 0)).toBeNull();
    expect(mockFrom).not.toHaveBeenCalled();
  });

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

describe("queryHeroFeaturedPhotographs", () => {
  it("filters by category and limit", async () => {
    mockLimit.mockResolvedValue({
      data: [
        {
          id: 9,
          filename: "forest.jpg",
          url: "https://example.com/forest.jpg",
          category: "nature",
          width: 4000,
          height: 3000,
        },
      ],
      error: null,
    });

    const result = await queryHeroFeaturedPhotographs({
      categories: ["nature"],
      photoIds: [],
      limit: 5,
    });

    expect(mockIn).toHaveBeenCalledWith("category", ["nature"]);
    expect(mockLimit).toHaveBeenCalledWith(5);
    expect(result).toHaveLength(1);
  });

  it("returns rows in id order when photoIds are set", async () => {
    mockIn.mockResolvedValueOnce({
      data: [
        {
          id: 2,
          filename: "b.jpg",
          url: "https://example.com/b.jpg",
          category: "nature",
          width: 100,
          height: 100,
        },
        {
          id: 1,
          filename: "a.jpg",
          url: "https://example.com/a.jpg",
          category: "nature",
          width: 100,
          height: 100,
        },
      ],
      error: null,
    });

    const result = await queryHeroFeaturedPhotographs({
      categories: [],
      photoIds: [1, 2],
      limit: 4,
    });

    expect(mockIn).toHaveBeenCalledWith("id", [1, 2]);
    expect(result?.map((r) => r.id)).toEqual([1, 2]);
  });
});
