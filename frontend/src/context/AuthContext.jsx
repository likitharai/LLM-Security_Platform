import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token with backend (assuming you have a /auth/me endpoint)
          // const response = await api.get('/auth/me');
          // setUser(response.data.user);
          
          // Mock verification for now
          setUser({ id: 1, name: 'Admin', role: 'admin' });
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Session expired or invalid token');
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      // Real API call would look like this:
      // const response = await api.post('/auth/login', credentials);
      // const { token, userData } = response.data;
      
      // Mock login process
      const token = "mock_jwt_token_12345";
      const userData = { id: 1, name: 'Admin', role: 'admin' };
      
      localStorage.setItem('token', token);
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Invalid credentials' 
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};