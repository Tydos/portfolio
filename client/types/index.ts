/** Single top-nav destination (section id + label). */
export interface NavItem {
  id: string;
  label: string;
}

/** Named skill group for the resume Skills subsection. */
export interface SkillGroup {
  title: string;
  items: string[];
}

/** One work experience entry. */
export interface Experience {
  role: string;
  company: string;
  period: string;
  details: string[];
}

/** One education entry. */
export interface Education {
  school: string;
  degree: string;
  period: string;
}

/** Linked publication shown on the resume. */
export interface Publication {
  title: string;
  publisher: string;
  url: string;
}

/** Featured project shown on home and project detail routes. */
export interface Project {
  slug: string;
  title: string;
  tags: string[];
  image?: string;
  description?: string;
  github?: string;
  link?: string;
}

/** Gallery photograph in the shape expected by `react-photo-album`. */
export interface Photo {
  id?: number;
  src: string;
  width: number;
  height: number;
  title: string;
  category: string;
}

/** Subset of the GitHub repository API used by project helpers. */
export interface GithubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  fork: boolean;
  language: string | null;
  stargazers_count: number;
}
