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
  {
    id: 4,
    src: "/d.jpg",
    width: 1000,
    height: 600,
    title: "D",
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
    expect(slides[2].src).toBe("/c.jpg");
  });

  it("limits slides to the number of available photos", () => {
    const slides = buildHeroSlides(photos.slice(0, 2), titles);

    expect(slides).toHaveLength(2);
    expect(slides.map((s) => s.title)).toEqual(["One", "Two"]);
  });

  it("returns an empty list when no photos are available", () => {
    expect(buildHeroSlides([], titles)).toEqual([]);
  });
});

describe("getNextIndex", () => {
  it("wraps forward from the last slide to the first", () => {
    expect(getNextIndex(2, 3)).toBe(0);
  });

  it("advances one step otherwise", () => {
    expect(getNextIndex(0, 3)).toBe(1);
  });

  it("does not change when there is one or zero slides", () => {
    expect(getNextIndex(0, 1)).toBe(0);
    expect(getNextIndex(0, 0)).toBe(0);
  });
});

describe("getPrevIndex", () => {
  it("wraps backward from the first slide to the last", () => {
    expect(getPrevIndex(0, 3)).toBe(2);
  });

  it("steps back one otherwise", () => {
    expect(getPrevIndex(1, 3)).toBe(0);
  });

  it("does not change when there is one or zero slides", () => {
    expect(getPrevIndex(0, 1)).toBe(0);
    expect(getPrevIndex(0, 0)).toBe(0);
  });
});
