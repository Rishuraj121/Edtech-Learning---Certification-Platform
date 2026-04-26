import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('skillhub_token'));
  const [loading, setLoading] = useState(true);

  // Use explicit backend URL in production, or empty string to use Vite proxy locally
  const API = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? 'https://edtech-learning-certification-platform.onrender.com' : '');

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Auth error', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('skillhub_token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('skillhub_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, API }}>
      {children}
    </AuthContext.Provider>
  );
};
