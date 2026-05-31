import type { NavItem } from "../types";

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://portfolio-backend-server-phi.vercel.app",
};

export const API_ENDPOINTS: Record<string, string> = {
  PROJECTS: "/api/projects",
  PHOTOS: "/api/images",
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
