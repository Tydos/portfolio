import type { NavItem } from "../types";

// gets API base URL from environment variable, defaults to empty string if not set (assumes same origin)
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",
};

export const GITHUB_USERNAME = "Tydos";

export const API_ENDPOINTS: Record<string, string> = {
  PROJECTS: "/api/projects",
  PHOTOS: "/api/images",
  UPLOAD: "/api/upload-batch",
};

// Section ids must match elements in Home.js / section components (scroll + highlight).
export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "resume", label: "Resume" },
  { id: "technical-eye", label: "Projects" },
  { id: "creative-eye", label: "Photography" },
  { id: "contact", label: "Contact" },
];

