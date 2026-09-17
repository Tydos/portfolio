import { describe, expect, it } from "vitest";
import { CONTACT, HERO, SOCIAL_LINKS } from "../constants/config";
import {
  PHOTOGRAPHY_PAGE_DESCRIPTION,
  PHOTOGRAPHY_CANONICAL_URL,
} from "../constants/photographySeo";
import {
  buildPersonStructuredData,
  confirmedSameAsUrls,
} from "./structuredData";

describe("confirmedSameAsUrls", () => {
  it("includes only configured social and contact links", () => {
    const urls = confirmedSameAsUrls();
    for (const link of SOCIAL_LINKS) {
      expect(urls).toContain(link.href);
    }
    expect(urls).toContain(CONTACT.linkedin);
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe("buildPersonStructuredData", () => {
  it("describes photography on the gallery page without invented fields", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.prasadjawale.live";
    const data = buildPersonStructuredData("photography");

    expect(data["@type"]).toBe("Person");
    expect(data.name).toBe(HERO.name);
    expect(data.description).toBe(PHOTOGRAPHY_PAGE_DESCRIPTION);
    expect(data.url).toBe(PHOTOGRAPHY_CANONICAL_URL);
    expect(data.sameAs).toEqual(confirmedSameAsUrls());
  });

  it("uses recruiter copy on the home page", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.prasadjawale.live";
    const data = buildPersonStructuredData("home");

    expect(data.description).toContain(HERO.role);
    expect(data.url).toBe("https://www.prasadjawale.live/");
  });
});
