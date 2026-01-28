import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Prefer sessionStorage so users must log in again
    // when the browser/tab (or app WebView) is fully closed.
    let token = sessionStorage.getItem('token');

    // One‑time migration if an older token was stored in localStorage
    if (!token) {
      const legacyToken = localStorage.getItem('token');
      if (legacyToken) {
        sessionStorage.setItem('token', legacyToken);
        localStorage.removeItem('token');
        token = legacyToken;
      }
    }

    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/api/me');
      setUser(response.data);
    } catch (error) {
      // Clear any invalid/expired tokens
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password, pin) => {
    try {
      const response = await api.post('/api/login', { username, password, pin });
      const { token, user } = response.data;
      // Store token only for current session
      sessionStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    // Clean up any legacy token that might still exist
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

