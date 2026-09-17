import { afterEach, describe, expect, it } from "vitest";
import { absoluteSiteUrl, getSiteUrl } from "./siteUrl";

describe("getSiteUrl", () => {
  const env = process.env;

  afterEach(() => {
    process.env = { ...env };
  });

  it("prefers NEXT_PUBLIC_SITE_URL and strips trailing slash", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.prasadjawale.live/";
    delete process.env.VERCEL_URL;
    expect(getSiteUrl()).toBe("https://www.prasadjawale.live");
  });

  it("builds absolute paths from the site origin", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.prasadjawale.live";
    expect(absoluteSiteUrl("/portfolio")).toBe(
      "https://www.prasadjawale.live/portfolio",
    );
  });
});
