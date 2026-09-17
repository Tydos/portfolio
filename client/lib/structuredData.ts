import { CONTACT, HERO, SOCIAL_LINKS } from "../constants/config";
import {
  PHOTOGRAPHY_PAGE_DESCRIPTION,
  photographyCanonicalUrl,
} from "../constants/photographySeo";
import { absoluteSiteUrl, getSiteUrl } from "./siteUrl";

/** JSON-LD `@type` values supported for this site. */
export type StructuredDataPage = "home" | "photography";

/**
 * Confirmed external profile URLs for `sameAs` (from site constants only).
 *
 * @returns Deduplicated HTTPS profile URLs.
 */
export function confirmedSameAsUrls(): string[] {
  const urls = new Set<string>();
  for (const link of SOCIAL_LINKS) {
    urls.add(link.href);
  }
  urls.add(CONTACT.linkedin);
  return [...urls];
}

/**
 * Builds Schema.org Person JSON-LD for the home or photography page.
 *
 * Uses only confirmed profile links and copy already present in the repo.
 *
 * @param page - Page variant (`home` recruiter focus or `photography`).
 * @returns Serializable Person object for JSON-LD.
 */
export function buildPersonStructuredData(page: StructuredDataPage): Record<string, unknown> {
  const sameAs = confirmedSameAsUrls();
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: HERO.name,
    url: getSiteUrl(),
    sameAs,
  };

  if (page === "photography") {
    return {
      ...base,
      description: PHOTOGRAPHY_PAGE_DESCRIPTION,
      url: photographyCanonicalUrl(),
    };
  }

  return {
    ...base,
    description: `${HERO.role} ${HERO.proof}`.trim(),
    url: absoluteSiteUrl("/"),
  };
}

/**
 * Serializes Person JSON-LD for a `<script type="application/ld+json">` tag.
 *
 * @param page - Page variant.
 * @returns JSON string safe to embed in HTML.
 */
export function personJsonLd(page: StructuredDataPage): string {
  return JSON.stringify(buildPersonStructuredData(page));
}
