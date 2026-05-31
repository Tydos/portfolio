import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchPhotos } from "./api";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => mockFetch.mockReset());

describe("fetchPhotos", () => {
  it("transforms cloudinary URL and maps fields correctly", async () => {
    const raw = [
      { url: "https://res.cloudinary.com/demo/image/upload/sample.jpg", width: 1920, height: 1080, filename: "sample", category: "travel" },
    ];
    mockFetch.mockResolvedValue({ ok: true, json: async () => raw });
    const photos = await fetchPhotos();
    expect(photos[0].src).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_1200/sample.jpg"
    );
    expect(photos[0].width).toBe(1920);
    expect(photos[0].height).toBe(1080);
    expect(photos[0].title).toBe("sample");
    expect(photos[0].category).toBe("travel");
  });

  it("defaults width and height to 2000 when missing", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [{ url: "/upload/x.jpg", filename: "x", category: "c" }],
    });
    const [photo] = await fetchPhotos();
    expect(photo.width).toBe(2000);
    expect(photo.height).toBe(2000);
  });

  it("passes limit and offset as query params", async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => [] });
    await fetchPhotos(12, 24);
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining("limit=12&offset=24"));
  });

  it("throws on non-ok response", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 });
    await expect(fetchPhotos()).rejects.toThrow("HTTP error! Status: 404");
  });
});
