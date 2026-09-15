import { describe, expect, it } from "vitest";
import { includesPhotographySection } from "./siteFeatures";

describe("includesPhotographySection", () => {
  it("defaults to true when env is unset", () => {
    expect(includesPhotographySection(undefined)).toBe(true);
  });

  it("returns false when env is the string false", () => {
    expect(includesPhotographySection("false")).toBe(false);
  });

  it("returns true for other values", () => {
    expect(includesPhotographySection("true")).toBe(true);
    expect(includesPhotographySection("0")).toBe(true);
  });
});
