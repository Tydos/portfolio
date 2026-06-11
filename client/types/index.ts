export interface NavItem {
  id: string;
  label: string;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  details: string[];
}

export interface Education {
  school: string;
  degree: string;
  period: string;
}

export interface Publication {
  title: string;
  publisher: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  tags: string[];
  image?: string;
  description?: string;
  github?: string;
  link?: string;
}

export interface Photo {
  id?: number;
  src: string;
  width: number;
  height: number;
  title: string;
  category: string;
}

export interface GithubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  fork: boolean;
  language: string | null;
}
