import { describe, it, expect } from "vitest";
import { buildHeroSlides, getNextIndex, getPrevIndex } from "./heroSlides";
import type { Photo } from "../types";

const photos: Photo[] = [
  {
    id: 1,
    src: "/a.jpg",
    width: 1000,
    height: 600,
    title: "A",
    category: "nature",
  },
  {
    id: 2,
    src: "/b.jpg",
    width: 1000,
    height: 600,
    title: "B",
    category: "nature",
  },
  {
    id: 3,
    src: "/c.jpg",
    width: 1000,
    height: 600,
    title: "C",
    category: "nature",
  },
];

const titles = [{ title: "One" }, { title: "Two" }, { title: "Three" }];

describe("buildHeroSlides", () => {
  it("maps each title to a photo in order", () => {
    const slides = buildHeroSlides(photos, titles);

    expect(slides).toHaveLength(3);
    expect(slides.map((s) => s.title)).toEqual(["One", "Two", "Three"]);
    expect(slides[0].src).toBe("/a.jpg");
  });

  it("limits slides to the number of available photos", () => {
    const slides = buildHeroSlides(photos.slice(0, 2), titles);

    expect(slides).toHaveLength(2);
  });

  it("returns an empty list when no photos are available", () => {
    expect(buildHeroSlides([], titles)).toEqual([]);
  });
});

describe("getNextIndex", () => {
  it("wraps forward from the last slide to the first", () => {
    expect(getNextIndex(2, 3)).toBe(0);
  });
});

describe("getPrevIndex", () => {
  it("wraps backward from the first slide to the last", () => {
    expect(getPrevIndex(0, 3)).toBe(2);
  });
});
