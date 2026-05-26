import connectToDatabase from './utils/db.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import { authenticate, authorize, hasPermission } from './utils/authMiddleware.js';

export default async function handler(req, res) {
  await connectToDatabase();

  const { method } = req;

  // Authentication check for all methods except public endpoints
  if (method !== 'GET') {
    const authResult = await new Promise((resolve) => {
      authenticate(req, res, () => resolve({ success: true }));
    });
    
    if (!authResult.success && res.headersSent) {
      return;
    }
  }

  if (method === 'GET') {
    await handleGetUsers(req, res);
  } else if (method === 'POST') {
    await handleCreateUser(req, res);
  } else if (method === 'PUT') {
    await handleUpdateUser(req, res);
  } else if (method === 'DELETE') {
    await handleDeleteUser(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetUsers(req, res) {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    
    const users = await User.find(filter).select('-password');
    res.status(200).json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users', message: error.message });
  }
}

async function handleCreateUser(req, res) {
  try {
    // Authorization check - only admin can create users
    if (!hasPermission(req.user.role, 'manage_users')) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    const { username, email, password, role, fullName, phone } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields: username, email, password' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'staff',
      fullName: fullName || '',
      phone: phone || '',
      isActive: true,
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ success: true, user: userResponse });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user', message: error.message });
  }
}

async function handleUpdateUser(req, res) {
  try {
    const { userId } = req.query;
    const updates = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    // Authorization check
    if (!hasPermission(req.user.role, 'manage_users') && req.user.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user', message: error.message });
  }
}

async function handleDeleteUser(req, res) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    // Authorization check - only admin can delete users
    if (!hasPermission(req.user.role, 'manage_users')) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user', message: error.message });
  }
}
