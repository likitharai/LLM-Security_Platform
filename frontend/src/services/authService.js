import api from './api';

export const authService = {
  /**
   * Authenticate a user and retrieve a JWT token.
   * @param {Object} credentials - { email, password }
   */
  login: async (credentials) => {
    // Note: FastAPI OAuth2PasswordRequestForm typically expects URL-encoded data
    // rather than JSON. If your backend uses that, you'd use URLSearchParams here.
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Register a new user on the platform.
   * @param {Object} userData - { name, email, password }
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Fetch the currently authenticated user's profile data.
   */
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Handle server-side logout operations if necessary (e.g., token invalidation).
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn("Server logout failed, clearing local session anyway.");
    }
  }
};