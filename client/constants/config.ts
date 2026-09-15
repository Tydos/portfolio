import type { NavItem } from "../types";
import { includesPhotographySection } from "../lib/siteFeatures";

/** When false, home omits the photography section (recruiter-only site). */
export const INCLUDE_PHOTOGRAPHY = includesPhotographySection();

/** GitHub username used for profile links and calendars. */
export const GITHUB_USERNAME = "Tydos";

/** LeetCode username for public profile links. */
export const LEETCODE_USERNAME = "prsdjwl";

/** CodeChef username for public profile links. */
export const CODECHEF_USERNAME = "tydos";

/** Kaggle username for public profile links. */
export const KAGGLE_USERNAME = "prasadjawale";

/** External profile links shown in the footer and hero strip. */
export const SOCIAL_LINKS = [
  { href: "https://github.com/Tydos", label: "GitHub" },
  { href: "https://linkedin.com/in/prasadjawale", label: "LinkedIn" },
  {
    href: `https://leetcode.com/u/${LEETCODE_USERNAME}/`,
    label: "LeetCode",
  },
  {
    href: `https://www.codechef.com/users/${CODECHEF_USERNAME}`,
    label: "CodeChef",
  },
  {
    href: `https://www.kaggle.com/${KAGGLE_USERNAME}`,
    label: "Kaggle",
  },
] as const;

const RECRUITER_NAV: NavItem[] = [
  { id: "resume", label: "Experience" },
  { id: "projects", label: "Projects" },
];

/** Recruiter-first nav; photography link omitted when {@link INCLUDE_PHOTOGRAPHY} is false. */
export const NAV_ITEMS: NavItem[] = INCLUDE_PHOTOGRAPHY
  ? [...RECRUITER_NAV, { id: "portfolio", label: "Portfolio", href: "/portfolio" }]
  : RECRUITER_NAV;

/** Photography gallery route (404 when {@link INCLUDE_PHOTOGRAPHY} is false). */
export const PORTFOLIO_PATH = "/portfolio" as const;

/** Primary contact destinations. */
export const CONTACT = {
  linkedin: "https://linkedin.com/in/prasadjawale",
} as const;

/** Résumé PDF URL for the header download button. */
export const RESUME_URL =
  "https://drive.google.com/file/d/1sX6zx-AvdziVt2S8KQr3YTWihDmtNShx/view?usp=sharing";

/** Hero identity copy on the home page. */
export const HERO = {
  name: "Prasad Jawale",
  role: "Software Engineer · Python backends & ML",
  proof:
    "New York, United States. Love photography and learning new things.",
} as const;

const SITE_DESCRIPTION_BASE =
  "M.S. Data Science student building production NLP pipelines and ML systems. Software engineering and machine learning research.";

/** Site-wide metadata used by the root layout. */
export const SITE = {
  title: "Prasad Jawale — Portfolio",
  description: INCLUDE_PHOTOGRAPHY
    ? `${SITE_DESCRIPTION_BASE} Photography portfolio.`
    : SITE_DESCRIPTION_BASE,
  ogImage:
    "https://res.cloudinary.com/duws62b88/image/upload/v1737421606/myimg_x0kuyo.jpg",
} as const;
