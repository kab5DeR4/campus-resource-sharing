// clean api client - wraps fetch with cookie handling
const API_BASE = '/api';

async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // keep cookies in sync fr
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // auth endpoints
  auth: {
    login: (credentials) => apiFetch('/auth/login', { method: 'POST', body: credentials }),
    register: (userData) => apiFetch('/auth/register', { method: 'POST', body: userData }),
    logout: () => apiFetch('/auth/logout', { method: 'POST' }),
    me: () => apiFetch('/auth/me'),
  },

  // resources endpoints
  resources: {
    list: (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.append(key, value);
        }
      });
      const qs = query.toString();
      return apiFetch(`/resources${qs ? `?${qs}` : ''}`);
    },
    get: (id) => apiFetch(`/resources/${id}`),
    create: (data) => apiFetch('/resources', { method: 'POST', body: data }),
    update: (id, data) => apiFetch(`/resources/${id}`, { method: 'PATCH', body: data }),
    delete: (id) => apiFetch(`/resources/${id}`, { method: 'DELETE' }),
    requestBorrow: (id, data) => apiFetch(`/resources/${id}/request`, { method: 'POST', body: data }),
  },

  // request workflow endpoints
  requests: {
    myRequests: () => apiFetch('/requests'),
    incoming: () => apiFetch('/requests/incoming'),
    respond: (id, action) => apiFetch(`/requests/${id}/respond`, { method: 'PATCH', body: { action } }),
    cancel: (id) => apiFetch(`/requests/${id}/cancel`, { method: 'PATCH' }),
  },

  // borrowing endpoints
  borrowings: {
    list: () => apiFetch('/borrowings'),
    confirmReturn: (id) => apiFetch(`/borrowings/${id}/return`, { method: 'PATCH' }),
  },

  // dashboard endpoint
  dashboard: {
    get: () => apiFetch('/dashboard'),
  },

  // profile endpoints
  profile: {
    get: (id) => apiFetch(id ? `/profile/${id}` : '/profile'),
    update: (data) => apiFetch('/profile', { method: 'PATCH', body: data }),
  },
};
