import type { NavItem } from "../types";

export const GITHUB_USERNAME = "Tydos";

export const SOCIAL_LINKS = [
  { href: "https://github.com/Tydos", label: "GitHub" },
  { href: "https://www.instagram.com/prasaadjawale/", label: "Instagram" },
  { href: "https://linkedin.com/in/prasadjawale", label: "LinkedIn" },
] as const;

/** Recruiter-first nav: identity → work → creative portfolio */
export const NAV_ITEMS: NavItem[] = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "creative-eye", label: "Portfolio" },
];

export const HERO = {
  name: "Prasad Jawale",
  role: "M.S. Data Science · Machine Learning",
  proof:
    "Building production NLP pipelines at UW–Madison; published ML research with Springer.",
} as const;
