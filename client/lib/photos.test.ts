import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchPhotos } from "./photos";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

describe("fetchPhotos", () => {
  it("returns photos and total", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: [], count: 0 }),
    });
    const { photos, total } = await fetchPhotos();
    expect(Array.isArray(photos)).toBe(true);
    expect(typeof total).toBe("number");
  });
});
