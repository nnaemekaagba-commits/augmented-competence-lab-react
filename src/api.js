import { fallbackContent } from './fallbackContent';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
export const HAS_REMOTE_API = Boolean(import.meta.env.VITE_API_BASE_URL);
const PUBLIC_BASE = import.meta.env.BASE_URL;

async function apiGet(path) {
  if (!HAS_REMOTE_API) return fallbackContent[path.slice(1)] || [];
  try {
    const res = await fetch(API_BASE_URL + path, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });
    if (!res.ok) throw new Error('Request failed: ' + res.status);
    return await res.json();
  } catch (error) {
    const fallback = fallbackContent[path.slice(1)];
    if (fallback) return fallback;
    throw error;
  }
}

export function publicationFileUrl(id) {
  if (fallbackContent.publications.some((item) => item.id === id)) {
    return `${PUBLIC_BASE}content/publications/${id}.pdf`;
  }
  return HAS_REMOTE_API ? `${API_BASE_URL}/publications/${id}/file` : `${PUBLIC_BASE}content/publications/${id}.pdf`;
}

export function teamPhotoUrl(id) {
  if (fallbackContent.team.some((item) => item.id === id)) {
    return `${PUBLIC_BASE}content/team/${id}.jpg`;
  }
  return HAS_REMOTE_API ? `${API_BASE_URL}/team/${id}/photo` : `${PUBLIC_BASE}content/team/${id}.jpg`;
}

async function apiPostJson(path, body, token) {
  const res = await fetch(API_BASE_URL + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed: ' + res.status);
  return data;
}

async function apiPostForm(path, formData, token) {
  const res = await fetch(API_BASE_URL + path, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed: ' + res.status);
  return data;
}

async function apiPutJson(path, body, token) {
  const res = await fetch(API_BASE_URL + path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed: ' + res.status);
  return data;
}

async function apiDelete(path, token) {
  const res = await fetch(API_BASE_URL + path, {
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + token },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Request failed: ' + res.status);
  }
  return true;
}

export const api = {
  getPublications: () => apiGet('/publications'),
  getNews: () => apiGet('/news'),
  getBlogs: () => apiGet('/blogs'),
  getTeam: () => apiGet('/team'),

  login: async (email, password) => {
    const res = await fetch(API_BASE_URL + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Sign-in failed');
    return data.token;
  },

  addPublication: (formData, token) => apiPostForm('/publications', formData, token),
  updatePublication: (id, payload, token) => apiPutJson('/publications/' + id, payload, token),
  deletePublication: (id, token) => apiDelete('/publications/' + id, token),

  addNews: (payload, token) => apiPostJson('/news', payload, token),
  updateNews: (id, payload, token) => apiPutJson('/news/' + id, payload, token),
  deleteNews: (id, token) => apiDelete('/news/' + id, token),

  addBlog: (payload, token) => apiPostJson('/blogs', payload, token),
  updateBlog: (id, payload, token) => apiPutJson('/blogs/' + id, payload, token),
  deleteBlog: (id, token) => apiDelete('/blogs/' + id, token),

  addMember: (formData, token) => apiPostForm('/team', formData, token),
  updateMember: (id, payload, token) => apiPutJson('/team/' + id, payload, token),
  deleteMember: (id, token) => apiDelete('/team/' + id, token),
};

export function monthYear(ts) {
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}
