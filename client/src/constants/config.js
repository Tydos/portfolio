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

// Section ids must match elements in Home.js / section components (scroll + highlight).
export const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "technical-eye", label: "Projects" },
  { id: "creative-eye", label: "Photography" },
  { id: "skills", label: "Resume" },
  { id: "contact", label: "Contact" },
];
