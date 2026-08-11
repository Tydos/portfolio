import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const getSessionMock = vi.fn();

vi.mock("./auth", () => ({
  getSession: () => getSessionMock(),
}));

import { deletePhoto, fetchPhotos, uploadPhoto } from "./photos";

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchPhotos", () => {
  it("always reads from the Next.js /api/images route", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:8000");

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

    expect(fetchMock).toHaveBeenCalledWith("/api/images?limit=25&offset=0");
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

  it("returns empty result on network error or unexpected payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("offline")),
    );
    await expect(fetchPhotos()).resolves.toEqual({ photos: [], total: 0 });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ unexpected: true }),
      }),
    );
    await expect(fetchPhotos(2, 10)).resolves.toEqual({
      photos: [],
      total: 0,
    });
    expect(fetch).toHaveBeenCalledWith("/api/images?limit=10&offset=10");
  });
});

describe("uploadPhoto", () => {
  it("posts FormData to FastAPI with Bearer token", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:8000/");
    getSessionMock.mockResolvedValue({
      data: { session: { access_token: "tok-123" } },
    });

    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201 });
    vi.stubGlobal("fetch", fetchMock);

    const file = new File(["jpeg-bytes"], "Trail.JPG", { type: "image/jpeg" });
    await uploadPhoto(file, "nature");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("http://localhost:8000/upload");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ Authorization: "Bearer tok-123" });

    const body = init.body as FormData;
    expect(body.get("category")).toBe("nature");
    const uploaded = body.get("file") as File;
    expect(uploaded).toBeInstanceOf(File);
    expect(uploaded.name).toMatch(/^\d+_trail\.jpg$/);
  });

  it("rejects non-jpeg files", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:8000");
    const file = new File(["x"], "shot.png", { type: "image/png" });
    await expect(uploadPhoto(file, "nature")).rejects.toThrow(
      "Only .jpg/.jpeg files are accepted.",
    );
  });

  it("requires NEXT_PUBLIC_API_URL", async () => {
    const file = new File(["x"], "shot.jpg", { type: "image/jpeg" });
    await expect(uploadPhoto(file, "nature")).rejects.toThrow(
      "NEXT_PUBLIC_API_URL is not set",
    );
  });

  it("requires a signed-in session", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:8000");
    getSessionMock.mockResolvedValue({ data: { session: null } });

    const file = new File(["x"], "shot.jpg", { type: "image/jpeg" });
    await expect(uploadPhoto(file, "nature")).rejects.toThrow(
      "Sign in required",
    );
  });
});

describe("deletePhoto", () => {
  it("deletes via FastAPI with Bearer token", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:8000");
    getSessionMock.mockResolvedValue({
      data: { session: { access_token: "tok-del" } },
    });

    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 204 });
    vi.stubGlobal("fetch", fetchMock);

    await deletePhoto(42);

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:8000/delete/42", {
      method: "DELETE",
      headers: { Authorization: "Bearer tok-del" },
    });
  });

  it("surfaces API error detail", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:8000");
    getSessionMock.mockResolvedValue({
      data: { session: { access_token: "tok-del" } },
    });

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: async () => ({ detail: "Photo 42 not found" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(deletePhoto(42)).rejects.toThrow("Photo 42 not found");
  });
});
