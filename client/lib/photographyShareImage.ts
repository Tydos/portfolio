import {
  PHOTOGRAPHY_OG_FALLBACK,
  PHOTOGRAPHY_PAGE_DESCRIPTION,
} from "../constants/photographySeo";
import { PORTFOLIO_HERO_NATURE } from "../constants/portfolioHero";
import { queryHeroFeaturedPhotographs } from "./photographsQuery";

/** Open Graph / Twitter preview image with dimensions and alt text. */
export interface ShareImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

/**
 * Resolves a photography-specific social preview image from hero nature frames.
 *
 * Falls back to {@link PHOTOGRAPHY_OG_FALLBACK} when Supabase is unavailable.
 *
 * @returns Share image metadata for Open Graph and Twitter cards.
 */
export async function resolvePhotographyShareImage(): Promise<ShareImage> {
  const rows = await queryHeroFeaturedPhotographs({
    categories: PORTFOLIO_HERO_NATURE.categories,
    photoIds: PORTFOLIO_HERO_NATURE.photoIds,
    limit: 1,
  });

  const photo = rows?.[0];
  if (!photo?.url) {
    return { ...PHOTOGRAPHY_OG_FALLBACK };
  }

  const label = photo.filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");

  return {
    url: photo.url,
    width: photo.width > 0 ? photo.width : PHOTOGRAPHY_OG_FALLBACK.width,
    height: photo.height > 0 ? photo.height : PHOTOGRAPHY_OG_FALLBACK.height,
    alt: `Nature and travel photograph by Prasad Jawale — ${label}`,
  };
}

/** Alt text for the static photography OG fallback (tests and metadata). */
export function photographyFallbackShareAlt(): string {
  return PHOTOGRAPHY_OG_FALLBACK.alt;
}

/** Description reused when the dynamic hero image is missing. */
export function photographyShareDescription(): string {
  return PHOTOGRAPHY_PAGE_DESCRIPTION;
}
