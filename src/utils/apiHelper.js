// Helper utility for making authenticated API requests

const API_URL = process.env.REACT_APP_API_URL || '/api';

/**
 * Get the JWT token from localStorage
 */
export const getToken = () => {
  try {
    const authData = JSON.parse(localStorage.getItem('admin_auth'));
    return authData?.token || null;
  } catch (error) {
    return null;
  }
};

/**
 * Set the JWT token in localStorage
 */
export const setToken = (token) => {
  try {
    const authData = JSON.parse(localStorage.getItem('admin_auth') || '{}');
    authData.token = token;
    localStorage.setItem('admin_auth', JSON.stringify(authData));
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

/**
 * Clear the JWT token from localStorage
 */
export const clearToken = () => {
  try {
    const authData = JSON.parse(localStorage.getItem('admin_auth') || '{}');
    delete authData.token;
    localStorage.setItem('admin_auth', JSON.stringify(authData));
  } catch (error) {
    console.error('Error clearing token:', error);
  }
};

/**
 * Make an authenticated API request
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * Convenience methods for common HTTP methods
 */
export const api = {
  get: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, data, options = {}) => apiRequest(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data, options = {}) => apiRequest(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
