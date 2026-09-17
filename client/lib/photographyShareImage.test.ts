import { describe, expect, it, vi } from "vitest";
import { PHOTOGRAPHY_OG_FALLBACK } from "../constants/photographySeo";
import { resolvePhotographyShareImage } from "./photographyShareImage";
import * as photographsQuery from "./photographsQuery";

describe("resolvePhotographyShareImage", () => {
  it("returns fallback when hero query is unavailable", async () => {
    vi.spyOn(photographsQuery, "queryHeroFeaturedPhotographs").mockResolvedValue(
      null,
    );

    const image = await resolvePhotographyShareImage();
    expect(image).toEqual({ ...PHOTOGRAPHY_OG_FALLBACK });
  });

  it("uses the first hero photograph when present", async () => {
    vi.spyOn(photographsQuery, "queryHeroFeaturedPhotographs").mockResolvedValue(
      [
        {
          id: 1,
          filename: "sunset-trail.jpg",
          url: "https://cdn.example/photos/sunset-trail.jpg",
          category: "nature",
          width: 2400,
          height: 1600,
        },
      ],
    );

    const image = await resolvePhotographyShareImage();
    expect(image.url).toBe("https://cdn.example/photos/sunset-trail.jpg");
    expect(image.width).toBe(2400);
    expect(image.height).toBe(1600);
    expect(image.alt).toContain("Prasad Jawale");
    expect(image.alt).toContain("sunset trail");
  });
});
