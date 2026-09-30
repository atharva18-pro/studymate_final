// The app server serves both the frontend and API, keeping session cookies same-origin.
const API_BASE = '';

// Thin fetch wrapper: JSON API, errors carry status/code/data.
export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(API_BASE + path, {
    method,
    credentials: 'include',
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch (_) { data = null; }
  if (!res.ok) {
    const err = new Error((data && data.message) || ('Request failed (' + res.status + ')'));
    err.status = res.status;
    err.code = data && data.error;
    err.data = data;
    throw err;
  }
  return data;
}
