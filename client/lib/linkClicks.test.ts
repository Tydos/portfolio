import { describe, expect, it } from "vitest";
import { shouldInterceptLinkClick, type LinkClickLike } from "./linkClicks";

const plainClick: LinkClickLike = {
  button: 0,
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
};

describe("shouldInterceptLinkClick", () => {
  it("intercepts a plain primary-button click", () => {
    expect(shouldInterceptLinkClick(plainClick)).toBe(true);
  });

  it.each(["metaKey", "ctrlKey", "shiftKey", "altKey"] as const)(
    "defers to the browser when %s is held",
    (modifier) => {
      expect(
        shouldInterceptLinkClick({ ...plainClick, [modifier]: true }),
      ).toBe(false);
    },
  );

  it("defers to the browser for non-primary buttons", () => {
    expect(shouldInterceptLinkClick({ ...plainClick, button: 1 })).toBe(false);
    expect(shouldInterceptLinkClick({ ...plainClick, button: 2 })).toBe(false);
  });
});
