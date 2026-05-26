// Simple Admin Authentication using localStorage
// No database required - uses environment variables for credentials

const ADMIN_USERNAME = process.env.REACT_APP_ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'admin';

const STORAGE_KEY = 'admin_auth';

/**
 * Login function - validates credentials against environment variables
 */
export const login = (username, password) => {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const authData = {
      isAuthenticated: true,
      username: username,
      loginTime: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    return { success: true, message: 'Login successful' };
  }
  
  return { success: false, message: 'Invalid credentials' };
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
    return authData && authData.isAuthenticated === true;
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
    if (authData && authData.isAuthenticated) {
      return {
        username: authData.username,
        loginTime: authData.loginTime,
      };
    }
    return null;
  } catch (error) {
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
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (username, password) => {
    const result = login(username, password);
    if (result.success) {
      setUser(getCurrentUser());
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

/**
 * Example usage in React components:
 * 
 * // In a login component:
 * import { login } from '../utils/auth';
 * 
 * const handleLogin = (e) => {
 *   e.preventDefault();
 *   const result = login(username, password);
 *   if (result.success) {
 *     navigate('/admin/dashboard');
 *   } else {
 *     setError(result.message);
 *   }
 * };
 * 
 * // In a protected route:
 * import { requireAuth } from '../utils/auth';
 * 
 * const ProtectedRoute = ({ children }) => {
 *   if (!requireAuth()) {
 *     return <Navigate to="/admin/login" />;
 *   }
 *   return children;
 * };
 * 
 * // Using the hook:
 * import { useAuth } from '../utils/auth';
 * 
 * const MyComponent = () => {
 *   const { user, isAuthenticated, logout } = useAuth();
 *   
 *   if (!isAuthenticated) {
 *     return <Login />;
 *   }
 *   
 *   return (
 *     <div>
 *       <p>Welcome, {user.username}</p>
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   );
 * };
 */
