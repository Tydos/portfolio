// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://portfolio-backend-server-phi.vercel.app",
};

// API Endpoints
export const API_ENDPOINTS = {
  PROJECTS: "/api/projects",
  PHOTOS: "/api/images",
};

// Section ids must match elements in Home.js / section components (scroll + highlight).
export const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "resume", label: "Resume" },
  { id: "technical-eye", label: "Projects" },
  { id: "creative-eye", label: "Photography" },
  { id: "contact", label: "Contact" },
];
