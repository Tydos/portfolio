import { API_CONFIG, API_ENDPOINTS } from "../constants/config";

const BASE_URL = API_CONFIG.BASE_URL;

export const fetchSkills = async () => {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.SKILLS}`);
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  return res.json();
};

export const fetchProjects = async () => {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PROJECTS}`);
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  return res.json();
};

// export const fetchPhotographs = async (limit = 10, offset = 0) => {
//   const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PHOTOGRAPHS}?limit=${limit}&offset=${offset}`);
//   if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
//   return res.json();
// };

export const fetchPhotos = async (limit = 100, offset = 0) => {
  const res = await fetch(`${BASE_URL}${API_ENDPOINTS.PHOTOS}?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  const data = await res.json();
  return data.map((item) => ({
    src: item.url,
    width: item.width || 2000,
    height: item.height || 2000,
    title: item.filename,
    category: item.category,
  }));
};
