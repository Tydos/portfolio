import type { NavItem } from "../types";

export const GITHUB_USERNAME = "Tydos";

export const GALLERY_URL =
  process.env.NEXT_PUBLIC_GALLERY_URL ?? "http://localhost:3001";

export const NAV_ITEMS: NavItem[] = [
  { id: "about", label: "About" },
  { id: "resume", label: "Resume" },
  { id: "technical-eye", label: "Projects" },
  { id: "creative-eye", label: "Photography" },
  { id: "contact", label: "Contact" },
];
