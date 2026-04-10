import api from './api';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me'
};

export const auth = {
  // Login user
  login: async (email, password) => {
    const response = await api.post(AUTH_ENDPOINTS.LOGIN, { email, password });
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Register user
  register: async (username, email, password) => {
    const response = await api.post(AUTH_ENDPOINTS.REGISTER, { username, email, password });
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    // Optional: panggil API logout
    // api.post(AUTH_ENDPOINTS.LOGOUT);
  },

  // Get current logged in user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  // Fetch fresh user data from server
  fetchMe: async () => {
    const response = await api.get(AUTH_ENDPOINTS.ME);
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  }
};