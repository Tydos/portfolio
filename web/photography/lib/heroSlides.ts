import type { Photo } from "../types";

/** Curated title paired with a hero photograph. */
export interface HeroSlideTitle {
  title: string;
}

/** A hero carousel slide: a photograph plus its editorial title. */
export interface HeroSlide extends Photo {
  title: string;
}

/**
 * Pair hero photographs with curated slide titles in order.
 *
 * The number of slides is limited by both the title list and the available
 * photographs, so the carousel gracefully degrades when fewer images load.
 *
 * @param photos - Candidate hero photographs.
 * @param titles - Curated titles in desired slide order.
 * @returns Slides ready for the hero carousel.
 */
export function buildHeroSlides(
  photos: Photo[],
  titles: HeroSlideTitle[],
): HeroSlide[] {
  return photos.slice(0, titles.length).map((photo, i) => ({
    ...photo,
    title: titles[i].title,
  }));
}

/**
 * Advance to the next slide index, wrapping around to the first slide.
 *
 * @param current - Current slide index.
 * @param length - Total number of slides.
 * @returns Next index, or `current` when there is one or zero slides.
 */
export function getNextIndex(current: number, length: number): number {
  return length <= 1 ? current : (current + 1) % length;
}

/**
 * Step back to the previous slide index, wrapping around to the last slide.
 *
 * @param current - Current slide index.
 * @param length - Total number of slides.
 * @returns Previous index, or `current` when there is one or zero slides.
 */
export function getPrevIndex(current: number, length: number): number {
  return length <= 1 ? current : (current - 1 + length) % length;
}
