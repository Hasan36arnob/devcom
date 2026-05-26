// JWT-based Authentication using API
import { useState, useEffect } from 'react';
import { api } from './apiHelper';

const STORAGE_KEY = 'admin_auth';

/**
 * Login function - validates credentials against API and stores JWT token
 */
export const login = async (username, password) => {
  try {
    const response = await api.post('/auth', {
      action: 'login',
      username,
      password,
    });
    
    if (response.success && response.token) {
      const authData = {
        isAuthenticated: true,
        token: response.token,
        user: response.user,
        loginTime: new Date().toISOString(),
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
      return { success: true, message: 'Login successful', user: response.user };
    }
    
    return { success: false, message: 'Invalid credentials' };
  } catch (error) {
    return { success: false, message: error.message || 'Login failed' };
  }
};

/**
 * Logout function - clears authentication from localStorage
 */
export const logout = () => {
  localStorage.removeItem(STORAGE_KEY);
  return { success: true, message: 'Logout successful' };
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  try {
    const authData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return authData && authData.isAuthenticated === true && authData.token;
  } catch (error) {
    return false;
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = () => {
  try {
    const authData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (authData && authData.isAuthenticated && authData.user) {
      return authData.user;
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Get JWT token
 */
export const getToken = () => {
  try {
    const authData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return authData?.token || null;
  } catch (error) {
    return null;
  }
};

/**
 * Verify token validity with API
 */
export const verifyToken = async () => {
  try {
    const response = await api.get('/auth?action=verify');
    return response.success ? response.user : null;
  } catch (error) {
    // Token is invalid, clear it
    logout();
    return null;
  }
};

/**
 * Check if session is valid (optional: add session timeout)
 */
export const isSessionValid = (sessionTimeoutHours = 24) => {
  try {
    const authData = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!authData || !authData.isAuthenticated) {
      return false;
    }
    
    // Check session timeout
    const loginTime = new Date(authData.loginTime);
    const now = new Date();
    const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
    
    if (hoursSinceLogin > sessionTimeoutHours) {
      logout(); // Auto-logout if session expired
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Protected route check - can be used in route guards
 */
export const requireAuth = () => {
  if (!isAuthenticated()) {
    return false;
  }
  
  if (!isSessionValid()) {
    return false;
  }
  
  return true;
};

/**
 * Hook for React components to use authentication
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        // Verify token with API
        const verifiedUser = await verifyToken();
        setUser(verifiedUser);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async (username, password) => {
    const result = await login(username, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return {
    user,
    loading,
    isAuthenticated: isAuthenticated(),
    login: handleLogin,
    logout: handleLogout,
  };
};
