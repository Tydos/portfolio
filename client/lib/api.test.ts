import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchProjects, fetchPhotos } from "./api";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => mockFetch.mockReset());

describe("fetchProjects", () => {
  it("returns empty object when projects is null", async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ projects: null }) });
    expect(await fetchProjects()).toEqual({});
  });

  it("normalizes array response to indexed object", async () => {
    const arr = [{ name: "proj-a" }, { name: "proj-b" }];
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ projects: arr }) });
    expect(await fetchProjects()).toEqual({ "0": { name: "proj-a" }, "1": { name: "proj-b" } });
  });

  it("returns object response as-is when no projects key", async () => {
    const obj = { a: { name: "proj" } };
    mockFetch.mockResolvedValue({ ok: true, json: async () => obj });
    expect(await fetchProjects()).toEqual(obj);
  });

  it("returns object when projects key is an object", async () => {
    const obj = { a: { name: "proj" } };
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ projects: obj }) });
    expect(await fetchProjects()).toEqual(obj);
  });

  it("throws on non-ok response", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 });
    await expect(fetchProjects()).rejects.toThrow("HTTP error! Status: 500");
  });
});

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
