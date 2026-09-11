/** GitHub username used for admin auth metadata checks. */
export const GITHUB_USERNAME = "Tydos";

/** Engineering / recruiter portfolio (separate Vercel project). */
export const RECRUITER_SITE_URL =
  process.env.NEXT_PUBLIC_RECRUITER_URL ?? "http://localhost:3000";

/** External profile links shared by the photography footer. */
export const SOCIAL_LINKS = [
  { href: "https://github.com/Tydos", label: "GitHub" },
  { href: "https://linkedin.com/in/prasadjawale", label: "LinkedIn" },
] as const;

/** Hero copy on the photography home page. */
export const HERO = {
  name: "Prasad Jawale",
  role: "Photography",
  title: "Nature",
} as const;

/** Curated titles for the hero image carousel, in slide order. */
export const HERO_SLIDES = [
  { title: "Nature" },
  { title: "Horizon" },
  { title: "Wild" },
  { title: "Depth" },
] as const;

/** Nature frames in the hero (above the main gallery). */
export const HERO_NATURE = {
  categories: ["nature"] as const,
  /** Optional fixed ids (in order). When set, categories are ignored. */
  photoIds: [] as number[],
  limit: 4,
} as const;

/** Site-wide metadata used by the root layout. */
export const SITE = {
  title: "Prasad Jawale — Photography",
  description:
    "Photography portfolio by Prasad Jawale — landscapes, travel, and visual work.",
  ogImage:
    "https://res.cloudinary.com/duws62b88/image/upload/v1737421606/myimg_x0kuyo.jpg",
} as const;
