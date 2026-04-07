// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "https://portfolio-backend-server-phi.vercel.app",
};

// API Endpoints
export const API_ENDPOINTS = {
  SKILLS: "/api/skills",
  PROJECTS: "/api/projects",
  // PHOTOGRAPHS: "/getphotographs",
  PHOTOS: "/api/images",
};

// Navigation items
export const NAV_ITEMS = [
  { id: "splash", label: "Home", href: "#splash" },
  { id: "about", label: "About", href: "#about" },
  { id: "skills", label: "Skills", href: "#skills" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "photography", label: "Photography", href: "#photography" },
  { id: "contact", label: "Contact", href: "#contact" },
];
