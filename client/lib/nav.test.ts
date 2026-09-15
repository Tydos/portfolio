import { describe, expect, it } from "vitest";
import { isNavItemActive, navItemHref } from "./nav";

describe("navItemHref", () => {
  it("returns explicit href for route-based items", () => {
    expect(
      navItemHref({ id: "portfolio", label: "Portfolio", href: "/portfolio" }, "/"),
    ).toBe("/portfolio");
  });

  it("returns null on home for section items", () => {
    expect(navItemHref({ id: "projects", label: "Projects" }, "/")).toBeNull();
  });

  it("returns hash links to home sections from other routes", () => {
    expect(navItemHref({ id: "resume", label: "Experience" }, "/portfolio")).toBe(
      "/#resume",
    );
  });
});

describe("isNavItemActive", () => {
  it("highlights portfolio on the portfolio route", () => {
    expect(
      isNavItemActive(
        { id: "portfolio", label: "Portfolio", href: "/portfolio" },
        "/portfolio",
        "resume",
      ),
    ).toBe(true);
  });

  it("uses scroll spy on home for section items", () => {
    expect(
      isNavItemActive({ id: "projects", label: "Projects" }, "/", "projects"),
    ).toBe(true);
  });

  it("does not highlight home sections when on portfolio", () => {
    expect(
      isNavItemActive({ id: "projects", label: "Projects" }, "/portfolio", "projects"),
    ).toBe(false);
  });
});
