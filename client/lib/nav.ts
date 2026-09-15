import type { NavItem } from "../types";

/**
 * Resolves the href for a nav item (in-page scroll on home, hash links elsewhere).
 *
 * @param item - Nav destination.
 * @param pathname - Current App Router pathname.
 * @returns Route href, or null when the item scrolls on the home page.
 */
export function navItemHref(item: NavItem, pathname: string): string | null {
  if (item.href) return item.href;
  if (pathname !== "/") return `/#${item.id}`;
  return null;
}

/**
 * Whether the nav item should appear selected for the current route/scroll position.
 *
 * @param item - Nav destination.
 * @param pathname - Current App Router pathname.
 * @param activeSection - Section id highlighted by scroll spy on home.
 * @returns True when the item should use the active pill style.
 */
export function isNavItemActive(
  item: NavItem,
  pathname: string,
  activeSection: string,
): boolean {
  if (item.href) return pathname === item.href;
  if (pathname !== "/") return false;
  return activeSection === item.id;
}
