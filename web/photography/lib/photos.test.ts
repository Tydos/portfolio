import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const getSessionMock = vi.fn();
const queryPhotographsFromSupabaseMock = vi.fn();

vi.mock("./auth", () => ({
  getSession: () => getSessionMock(),
}));

vi.mock("./photographsQuery", () => ({
  queryPhotographsFromSupabase: (...args: unknown[]) =>
    queryPhotographsFromSupabaseMock(...args),
}));

const isSupabaseConfiguredMock = vi.fn(() => true);

vi.mock("./supabase", () => ({
  isSupabaseConfigured: () => isSupabaseConfiguredMock(),
}));

import { deletePhoto, fetchPhotos, uploadPhoto } from "./photos";

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  isSupabaseConfiguredMock.mockReturnValue(true);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchPhotos", () => {
  it("reads paginated rows from Supabase", async () => {
    queryPhotographsFromSupabaseMock.mockResolvedValue({
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
    });

    const { photos, total } = await fetchPhotos();

    expect(queryPhotographsFromSupabaseMock).toHaveBeenCalledWith(25, 0);
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

  it("returns empty result when Supabase query fails", async () => {
    queryPhotographsFromSupabaseMock.mockResolvedValue(null);

    const result = await fetchPhotos();

    expect(result.photos).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.error).toBe("query_failed");
  });

  it("returns not_configured when public Supabase env is missing", async () => {
    isSupabaseConfiguredMock.mockReturnValue(false);
    const result = await fetchPhotos();
    expect(result.error).toBe("not_configured");
    expect(queryPhotographsFromSupabaseMock).not.toHaveBeenCalled();
  });

  it("passes page offset to Supabase", async () => {
    queryPhotographsFromSupabaseMock.mockResolvedValue({
      photos: [],
      total: 0,
    });

    await fetchPhotos(2, 10);

    expect(queryPhotographsFromSupabaseMock).toHaveBeenCalledWith(10, 10);
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

  it("requires NEXT_PUBLIC_API_URL when window is unavailable", async () => {
    const file = new File(["x"], "shot.jpg", { type: "image/jpeg" });
    await expect(uploadPhoto(file, "nature")).rejects.toThrow(
      "NEXT_PUBLIC_API_URL is not set",
    );
  });

  it("uses same-origin /api when NEXT_PUBLIC_API_URL is unset in the browser", async () => {
    vi.stubGlobal("window", {
      location: { origin: "https://photos.example.com" },
    });
    getSessionMock.mockResolvedValue({
      data: { session: { access_token: "tok-123" } },
    });

    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201 });
    vi.stubGlobal("fetch", fetchMock);

    const file = new File(["jpeg-bytes"], "shot.jpg", { type: "image/jpeg" });
    await uploadPhoto(file, "nature");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://photos.example.com/api/upload",
      expect.objectContaining({ method: "POST" }),
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
