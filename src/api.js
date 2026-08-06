// Set VITE_API_BASE_URL in your .env file to wherever the backend is deployed.
// Locally that's usually http://localhost:4000/api.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-api-domain.com/api';

async function apiGet(path) {
  const res = await fetch(API_BASE_URL + path);
  if (!res.ok) throw new Error('Request failed: ' + res.status);
  return res.json();
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
