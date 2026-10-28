import api from './axios';

/**
 * Log in with email or username and password
 */
export async function loginUser({ email, identifier, password }) {
  const payload = {
    email: email || identifier,
    identifier: identifier || email,
    password,
  };
  const response = await api.post('/auth/login', payload);
  return response.data;
}

/**
 * Register a new user or artist
 */
export async function registerUser({ name, email, password, role = 'user', userName, age = 18 }) {
  const payload = {
    name: name || userName,
    email,
    password,
    role,
    userName: userName || name || (email ? email.split('@')[0] : 'user'),
    age: Number(age) || 18,
  };
  const response = await api.post('/auth/register', payload);
  return response.data;
}

/**
 * Verifies HTTP-Only cookie session on initial mount
 */
export async function getMe() {
  const response = await api.get('/auth/me');
  return response.data;
}

/**
 * Log out user and clear HTTP-Only token cookie
 */
export async function logoutUser() {
  const response = await api.post('/auth/logout');
  return response.data;
}
