import { describe, expect, it } from "vitest";
import { filterProjectsByCategory } from "./projectFilters";
import type { Project } from "../types";

const sample: Project[] = [
  {
    slug: "a",
    title: "A",
    tags: [],
    categories: ["aiml"],
  },
  {
    slug: "b",
    title: "B",
    tags: [],
    categories: ["swe", "aiml"],
  },
  {
    slug: "c",
    title: "C",
    tags: [],
    categories: ["mlops"],
  },
];

describe("filterProjectsByCategory", () => {
  it("returns all projects for the all filter", () => {
    expect(filterProjectsByCategory(sample, "all")).toHaveLength(3);
  });

  it("filters by a single category", () => {
    expect(filterProjectsByCategory(sample, "aiml").map((p) => p.slug)).toEqual([
      "a",
      "b",
    ]);
    expect(filterProjectsByCategory(sample, "swe").map((p) => p.slug)).toEqual([
      "b",
    ]);
    expect(filterProjectsByCategory(sample, "mlops").map((p) => p.slug)).toEqual([
      "c",
    ]);
  });
});
