import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('accessToken');

        if (storedUser && token) {
          // Verify token is still valid
          const currentUser = await authService.me();
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  const isAuthenticated = !!user;
  const isManager = user?.role === 'manager' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff';

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    isManager,
    isAdmin,
    isStaff,
  };
};
