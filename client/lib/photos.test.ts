import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchPhotos } from "./photos";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("fetchPhotos", () => {
  it("returns photos and total from the API route", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        photos: [
          {
            id: 1,
            filename: "sunset.jpg",
            url: "https://example.com/sunset.jpg",
            category: "landscape",
            width: 1920,
            height: 1080,
          },
        ],
        total: 1,
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { photos, total } = await fetchPhotos();

    expect(fetchMock).toHaveBeenCalledWith("/api/images?limit=50&offset=0");
    expect(photos).toEqual([
      {
        id: 1,
        src: "https://example.com/sunset.jpg",
        width: 1920,
        height: 1080,
        title: "sunset.jpg",
        category: "landscape",
      },
    ]);
    expect(total).toBe(1);
  });

  it("returns empty result on API failure", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
    });
    vi.stubGlobal("fetch", fetchMock);

    const { photos, total } = await fetchPhotos();

    expect(photos).toEqual([]);
    expect(total).toBe(0);
  });
});
