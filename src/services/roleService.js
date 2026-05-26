// Role-based Access Control Service

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

  createUser: (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const newUser = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      password: userData.password, // In production, hash this
      role: userData.role || 'staff',
      fullName: userData.fullName,
      phone: userData.phone,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Remove password before returning
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  getUsers: () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  },

  getUserById: (userId) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === userId);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  },

  updateUser: (userId, updates) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.id === userId);
    
    if (index !== -1) {
      users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem('users', JSON.stringify(users));
      
      const { password, ...userWithoutPassword } = users[index];
      return userWithoutPassword;
    }
    
    return null;
  },

  deleteUser: (userId) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filtered = users.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(filtered));
  },

  toggleUserStatus: (userId) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.id === userId);
    
    if (index !== -1) {
      users[index].isActive = !users[index].isActive;
      localStorage.setItem('users', JSON.stringify(users));
      
      const { password, ...userWithoutPassword } = users[index];
      return userWithoutPassword;
    }
    
    return null;
  },

  authenticateUser: (username, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user && user.isActive) {
      // Update last login
      const index = users.findIndex(u => u.id === user.id);
      users[index].lastLogin = new Date().toISOString();
      localStorage.setItem('users', JSON.stringify(users));
      
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    
    return null;
  },

  getUsersByRole: (role) => {
    const users = RoleService.getUsers();
    return users.filter(user => user.role === role);
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
