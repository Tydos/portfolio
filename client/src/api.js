const BASE_URL = "https://portfolio-backend-server-phi.vercel.app";

export const fetchSkills = async () => {
  const res = await fetch(`${BASE_URL}/api/skills`);
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  return res.json();
};

export const fetchProjects = async () => {
  const res = await fetch(`${BASE_URL}/api/projects`);
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  return res.json();
};

export const fetchPhotographs = async (limit = 10, offset = 0) => {
  const res = await fetch(`${BASE_URL}/getphotographs?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  return res.json();
};

export const fetchPhotos = async (limit = 100, offset = 0) => {
  const res = await fetch(`${BASE_URL}/fetch?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  const data = await res.json();
  return data.map((item) => ({
    src: item.url,
    width: item.width || 2000,
    height: item.height || 2000,
  }));
};
