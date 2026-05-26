import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}

/**
 * Verify JWT token from Authorization header
 * @param {string} authHeader - Authorization header value (Bearer <token>)
 * @returns {object|null} Decoded token payload or null if invalid
 */
export function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Middleware to verify JWT token in request
 * Returns 401 if token is missing or invalid
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const decoded = verifyToken(authHeader);

  if (!decoded) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing token' });
  }

  req.user = decoded;
  next();
}

/**
 * Middleware to restrict access based on user roles
 * @param {string[]} allowedRoles - Array of allowed roles
 */
export function authorize(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: No user context' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden: Insufficient permissions',
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
    }

    next();
  };
}

/**
 * Helper to check if user has specific permission based on role
 * Matches the RoleService permission definitions
 */
export function hasPermission(userRole, permission) {
  const rolePermissions = {
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
  };

  const permissions = rolePermissions[userRole] || [];
  return permissions.includes(permission);
}

/**
 * Middleware to check specific permission
 */
export function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: No user context' });
    }

    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({ 
        error: 'Forbidden: Insufficient permissions',
        requiredPermission: permission,
        userRole: req.user.role
      });
    }

    next();
  };
}
