import type { NavItem } from "../types";

export const GITHUB_USERNAME = "Tydos";

export const SOCIAL_LINKS = [
  { href: "https://github.com/Tydos", label: "GitHub" },
  { href: "https://linkedin.com/in/prasadjawale", label: "LinkedIn" },
] as const;

/** Recruiter-first nav: identity → work → creative portfolio */
export const NAV_ITEMS: NavItem[] = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "creative-eye", label: "Portfolio" },
];

export const CONTACT = {
  linkedin: "https://linkedin.com/in/prasadjawale",
} as const;

export const HERO = {
  name: "Prasad Jawale",
  role: "Software Engineer / AIML",
  proof:
    "Building production NLP pipelines at UW–Madison; published ML research with Springer.",
} as const;

export const SITE = {
  title: "Prasad Jawale — Portfolio",
  description:
    "M.S. Data Science student building production NLP pipelines and ML systems. Software engineering, machine learning research, and photography.",
  ogImage:
    "https://res.cloudinary.com/duws62b88/image/upload/v1737421606/myimg_x0kuyo.jpg",
} as const;
