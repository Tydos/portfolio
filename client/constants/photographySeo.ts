import { absoluteSiteUrl, getSiteUrl } from "../lib/siteUrl";

/** Production canonical path for the photography gallery route. */
export const PHOTOGRAPHY_CANONICAL_PATH = "/portfolio" as const;

/** Page title for the photography gallery (absolute in metadata). */
export const PHOTOGRAPHY_PAGE_TITLE = "Photography — Prasad Jawale" as const;

/** Meta description for the photography gallery and social cards. */
export const PHOTOGRAPHY_PAGE_DESCRIPTION =
  "Nature, travel, and urban photography by Prasad Jawale." as const;

/**
 * Fallback Open Graph image when hero photographs are unavailable at build time.
 * Used in production when Supabase is configured; dynamic hero frames take precedence.
 */
export const PHOTOGRAPHY_OG_FALLBACK = {
  url: "https://res.cloudinary.com/duws62b88/image/upload/v1719500441/acf91f47-97c8-42ed-b66a-a98844e1a0ad_ki38x1.jpg",
  width: 1200,
  height: 800,
  alt: "Nature and travel photograph by Prasad Jawale",
} as const;

/** Canonical photography gallery URL for the production domain. */
export const PHOTOGRAPHY_CANONICAL_URL =
  "https://www.prasadjawale.live/portfolio" as const;

/**
 * Canonical URL for the photography page (production host when configured).
 *
 * @returns Absolute canonical URL for `/portfolio`.
 */
export function photographyCanonicalUrl(): string {
  if (getSiteUrl() === "https://www.prasadjawale.live") {
    return PHOTOGRAPHY_CANONICAL_URL;
  }
  return absoluteSiteUrl(PHOTOGRAPHY_CANONICAL_PATH);
}
