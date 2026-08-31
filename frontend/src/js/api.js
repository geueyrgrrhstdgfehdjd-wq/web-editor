const BASE_URL = 'http://localhost:5000/api';

export const fetchProject = async (id = 1) => {
  const res = await fetch(`${BASE_URL}/projects/${id}`);
  return await res.json();
};

export const saveProject = async (id = 1, files) => {
  const res = await fetch(`${BASE_URL}/projects/${id}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ files })
  });
  return await res.json();
};

export const runPHP = async (code) => {
  const res = await fetch(`${BASE_URL}/run/php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  });
  return await res.json();
};
