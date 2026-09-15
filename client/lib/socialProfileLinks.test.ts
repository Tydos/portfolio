import { describe, expect, it } from "vitest";
import { SOCIAL_LINKS } from "../constants/config";
import { getOrderedSocialLinks } from "../components/ui/socialLinkIcons";

describe("getOrderedSocialLinks", () => {
  it("returns links in the requested label order", () => {
    const ordered = getOrderedSocialLinks(["Kaggle", "GitHub"]);
    expect(ordered.map((item) => item.label)).toEqual(["Kaggle", "GitHub"]);
    expect(ordered[0]?.href).toBe("https://www.kaggle.com/prasadjawale");
  });

  it("skips labels that are not in SOCIAL_LINKS", () => {
    const ordered = getOrderedSocialLinks([
      "GitHub",
      "NotAPlatform" as (typeof SOCIAL_LINKS)[number]["label"],
    ]);
    expect(ordered).toHaveLength(1);
    expect(ordered[0]?.label).toBe("GitHub");
  });
});
