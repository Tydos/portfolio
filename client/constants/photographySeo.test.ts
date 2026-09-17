import { describe, expect, it } from "vitest";
import {
  PHOTOGRAPHY_CANONICAL_URL,
  PHOTOGRAPHY_PAGE_DESCRIPTION,
  PHOTOGRAPHY_PAGE_TITLE,
  photographyCanonicalUrl,
} from "./photographySeo";

describe("photography SEO constants", () => {
  it("avoids the word Portfolio in title and description", () => {
    expect(PHOTOGRAPHY_PAGE_TITLE.toLowerCase()).not.toContain("portfolio");
    expect(PHOTOGRAPHY_PAGE_DESCRIPTION.toLowerCase()).not.toContain(
      "portfolio",
    );
  });

  it("uses the production canonical on the live domain", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.prasadjawale.live";
    expect(photographyCanonicalUrl()).toBe(PHOTOGRAPHY_CANONICAL_URL);
  });
});
