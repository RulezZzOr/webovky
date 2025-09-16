const API_BASE_URL = '/api';
const TOKEN_KEY = 'cloudpeakify_token';

function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function storeToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request(path, options = {}) {
  const { method = 'GET', body } = options;
  const headers = options.headers ? { ...options.headers } : {};

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getStoredToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return null;
  }

  let data;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      throw new Error('Neplatná odpověď serveru.');
    }
  }

  if (!response.ok) {
    const message = data?.message || 'Došlo k chybě při komunikaci se serverem.';
    if (response.status === 401) {
      storeToken(null);
    }
    throw new Error(message);
  }

  return data;
}

export async function login(email, password) {
  const result = await request('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  storeToken(result?.token);
  return result;
}

export function logout() {
  storeToken(null);
}

export async function getCurrentUser() {
  try {
    const result = await request('/auth/me');
    return result?.user || null;
  } catch (error) {
    return null;
  }
}

export function getToken() {
  return getStoredToken();
}

export async function getPosts(options = {}) {
  const params = new URLSearchParams();
  if (options.includeDrafts) {
    params.set('includeDrafts', 'true');
  }
  const query = params.toString();
  const result = await request(`/posts${query ? `?${query}` : ''}`);
  return result?.posts || [];
}

export async function getPost(id) {
  if (!id) throw new Error('Chybí ID příspěvku.');
  const result = await request(`/posts/${id}`);
  return result?.post || null;
}

export async function createPost(post) {
  const result = await request('/posts', {
    method: 'POST',
    body: post,
  });
  return result?.post;
}

export async function updatePost(id, post) {
  const result = await request(`/posts/${id}`, {
    method: 'PUT',
    body: post,
  });
  return result?.post;
}

export async function deletePost(id) {
  await request(`/posts/${id}`, { method: 'DELETE' });
}
