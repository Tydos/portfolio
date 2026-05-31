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
  title: string;
  tags: string[];
  image?: string;
  description?: string;
  github?: string;
}

export interface Photo {
  src: string;
  width: number;
  height: number;
  title: string;
  category: string;
}
