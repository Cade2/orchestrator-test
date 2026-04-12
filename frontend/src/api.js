const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:3001'
).replace(/\/$/, '');

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const hasBody = options.body !== undefined;
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  if (hasBody && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: hasBody && !isFormData && typeof options.body !== 'string'
      ? JSON.stringify(options.body)
      : options.body,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(payload?.error || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function getHealth() {
  return request('/health');
}

export function listLinks() {
  return request('/links');
}

export function createLink(link) {
  return request('/links', {
    method: 'POST',
    body: link,
  });
}

export function getLink(codeOrId) {
  return request(`/links/${encodeURIComponent(codeOrId)}`);
}

export function updateLink(linkId, updates) {
  return request(`/links/${encodeURIComponent(linkId)}`, {
    method: 'PATCH',
    body: updates,
  });
}

export function deleteLink(linkId) {
  return request(`/links/${encodeURIComponent(linkId)}`, {
    method: 'DELETE',
  });
}

export function listLinkClicks(linkId) {
  return request(`/links/${encodeURIComponent(linkId)}/clicks`);
}

export function listClicks() {
  return request('/clicks');
}

export function getRedirectUrl(code) {
  return `${API_BASE_URL}/r/${encodeURIComponent(code)}`;
}

const api = {
  request,
  getApiBaseUrl,
  getHealth,
  listLinks,
  createLink,
  getLink,
  updateLink,
  deleteLink,
  listLinkClicks,
  listClicks,
  getRedirectUrl,
};

export default api;
