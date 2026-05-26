// Role-based Access Control Service
import { api } from '../utils/apiHelper';

export const RoleService = {
  ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager',
    ACCOUNTANT: 'accountant',
    STAFF: 'staff',
  },

  PERMISSIONS: {
    // Product Management
    VIEW_PRODUCTS: 'view_products',
    ADD_PRODUCTS: 'add_products',
    EDIT_PRODUCTS: 'edit_products',
    DELETE_PRODUCTS: 'delete_products',
    
    // Order Management
    VIEW_ORDERS: 'view_orders',
    PROCESS_ORDERS: 'process_orders',
    CANCEL_ORDERS: 'cancel_orders',
    REFUND_ORDERS: 'refund_orders',
    
    // Customer Management
    VIEW_CUSTOMERS: 'view_customers',
    ADD_CUSTOMERS: 'add_customers',
    EDIT_CUSTOMERS: 'edit_customers',
    DELETE_CUSTOMERS: 'delete_customers',
    BLACKLIST_CUSTOMERS: 'blacklist_customers',
    
    // Analytics & Reports
    VIEW_ANALYTICS: 'view_analytics',
    VIEW_SALES_REPORTS: 'view_sales_reports',
    VIEW_REVENUE_REPORTS: 'view_revenue_reports',
    VIEW_EXPENSE_REPORTS: 'view_expense_reports',
    EXPORT_REPORTS: 'export_reports',
    
    // Settings
    VIEW_SETTINGS: 'view_settings',
    EDIT_SETTINGS: 'edit_settings',
    MANAGE_USERS: 'manage_users',
    MANAGE_ROLES: 'manage_roles',
    
    // Inventory
    VIEW_INVENTORY: 'view_inventory',
    MANAGE_INVENTORY: 'manage_inventory',
    
    // Coupons & Discounts
    VIEW_COUPONS: 'view_coupons',
    CREATE_COUPONS: 'create_coupons',
    EDIT_COUPONS: 'edit_coupons',
    DELETE_COUPONS: 'delete_coupons',
    
    // Categories
    VIEW_CATEGORIES: 'view_categories',
    MANAGE_CATEGORIES: 'manage_categories',
  },

  ROLE_PERMISSIONS: {
    admin: [
      'view_products', 'add_products', 'edit_products', 'delete_products',
      'view_orders', 'process_orders', 'cancel_orders', 'refund_orders',
      'view_customers', 'add_customers', 'edit_customers', 'delete_customers', 'blacklist_customers',
      'view_analytics', 'view_sales_reports', 'view_revenue_reports', 'view_expense_reports', 'export_reports',
      'view_settings', 'edit_settings', 'manage_users', 'manage_roles',
      'view_inventory', 'manage_inventory',
      'view_coupons', 'create_coupons', 'edit_coupons', 'delete_coupons',
      'view_categories', 'manage_categories',
    ],
    manager: [
      'view_products', 'add_products', 'edit_products',
      'view_orders', 'process_orders', 'cancel_orders',
      'view_customers', 'edit_customers',
      'view_analytics', 'view_sales_reports', 'view_revenue_reports',
      'view_inventory', 'manage_inventory',
      'view_coupons', 'create_coupons', 'edit_coupons',
      'view_categories', 'manage_categories',
    ],
    accountant: [
      'view_orders',
      'view_customers',
      'view_analytics', 'view_sales_reports', 'view_revenue_reports', 'view_expense_reports', 'export_reports',
      'view_settings',
    ],
    staff: [
      'view_products',
      'view_orders', 'process_orders',
      'view_customers',
      'view_inventory',
    ],
  },

  hasPermission: (role, permission) => {
    const rolePermissions = RoleService.ROLE_PERMISSIONS[role] || [];
    return rolePermissions.includes(permission);
  },

  hasAnyPermission: (role, permissions) => {
    return permissions.some(permission => RoleService.hasPermission(role, permission));
  },

  hasAllPermissions: (role, permissions) => {
    return permissions.every(permission => RoleService.hasPermission(role, permission));
  },

  // Authentication - now uses API
  authenticateUser: async (username, password) => {
    try {
      const response = await api.post('/auth', {
        action: 'login',
        username,
        password,
      });
      
      if (response.success && response.token) {
        // Store token in localStorage
        const authData = JSON.parse(localStorage.getItem('admin_auth') || '{}');
        authData.token = response.token;
        authData.user = response.user;
        authData.isAuthenticated = true;
        authData.loginTime = new Date().toISOString();
        localStorage.setItem('admin_auth', JSON.stringify(authData));
        
        return response.user;
      }
      
      return null;
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  },

  // User management - now uses API
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.user;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  },

  getUsers: async (role = null) => {
    try {
      const params = role ? { role } : {};
      const response = await api.get(`/users?${new URLSearchParams(params)}`);
      return response.users;
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users?userId=${userId}`);
      const user = response.users.find(u => u._id === userId);
      return user || null;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  updateUser: async (userId, updates) => {
    try {
      const response = await api.put(`/users?userId=${userId}`, updates);
      return response.user;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      await api.delete(`/users?userId=${userId}`);
      return true;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  },

  toggleUserStatus: async (userId) => {
    try {
      const users = await RoleService.getUsers();
      const user = users.find(u => u._id === userId);
      if (user) {
        const response = await api.put(`/users?userId=${userId}`, {
          isActive: !user.isActive,
        });
        return response.user;
      }
      return null;
    } catch (error) {
      console.error('Toggle user status error:', error);
      throw error;
    }
  },

  getUsersByRole: async (role) => {
    try {
      const response = await api.get(`/users?role=${role}`);
      return response.users;
    } catch (error) {
      console.error('Get users by role error:', error);
      throw error;
    }
  },

  getRoleDisplayName: (role) => {
    const displayNames = {
      admin: 'Administrator',
      manager: 'Manager',
      accountant: 'Accountant',
      staff: 'Staff',
    };
    return displayNames[role] || role;
  },
};
