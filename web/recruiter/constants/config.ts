import type { NavItem } from "../types";

/** GitHub username used for profile links and calendars. */
export const GITHUB_USERNAME = "Tydos";

/** External profile links shown in the footer and about section. */
export const SOCIAL_LINKS = [
  { href: "https://github.com/Tydos", label: "GitHub" },
  { href: "https://linkedin.com/in/prasadjawale", label: "LinkedIn" },
] as const;

/** Public photography site (separate Vercel project). */
export const PHOTOGRAPHY_SITE_URL =
  process.env.NEXT_PUBLIC_PHOTOGRAPHY_URL ?? "http://localhost:3001";

/** Recruiter nav: identity → experience → projects → photography site. */
export const NAV_ITEMS: NavItem[] = [
  { id: "about", label: "About" },
  { id: "resume", label: "Experience" },
  { id: "technical-eye", label: "Projects" },
  {
    id: "photography",
    label: "Photography",
    href: PHOTOGRAPHY_SITE_URL,
    external: true,
  },
];

/** Primary contact destinations. */
export const CONTACT = {
  linkedin: "https://linkedin.com/in/prasadjawale",
} as const;

/** Hero identity copy on the home page. */
export const HERO = {
  name: "Prasad Jawale",
  role: "Software Engineer / AIML",
  proof:
    "Building production NLP pipelines at UW–Madison; published ML research with Springer.",
} as const;

/** Site-wide metadata used by the root layout. */
export const SITE = {
  title: "Prasad Jawale — Portfolio",
  description:
    "M.S. Data Science student building production NLP pipelines and ML systems. Software engineering and machine learning research.",
  ogImage:
    "https://res.cloudinary.com/duws62b88/image/upload/v1737421606/myimg_x0kuyo.jpg",
} as const;
