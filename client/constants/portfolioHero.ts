/** Fallback hero title when slides have not loaded yet. */
export const PORTFOLIO_HERO = {
  role: "Photography",
  title: "Nature",
} as const;

/** Link from the photography header back to the engineering home page. */
export const ENGINEERING_HOME_URL = "/" as const;

/** Curated titles for the portfolio splash carousel, in slide order. */
export const PORTFOLIO_HERO_SLIDES = [
  { title: "Nature" },
  { title: "Horizon" },
  { title: "Wild" },
  { title: "Depth" },
] as const;

/** Nature frames in the splash hero (above the main gallery). */
export const PORTFOLIO_HERO_NATURE = {
  categories: ["nature"] as const,
  /** Optional fixed ids (in order). When set, categories are ignored. */
  photoIds: [] as number[],
  limit: 4,
} as const;
