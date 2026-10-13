// Small fetch wrapper that attaches the login token and surfaces server messages.
const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export async function api(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(API_BASE + '/api' + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Something went wrong. Try again.');
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
