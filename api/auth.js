import connectToDatabase from './utils/db.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticate, authorize } from './utils/authMiddleware.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'POST') {
    const { action } = req.body;

    if (action === 'register') {
      return handleRegister(req, res);
    } else if (action === 'login') {
      return handleLogin(req, res);
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
  } else if (req.method === 'GET') {
    const { action } = req.query;

    if (action === 'verify') {
      return handleVerify(req, res);
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleRegister(req, res) {
  try {
    const { username, email, password, role, fullName, phone } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields: username, email, password' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'staff',
      fullName: fullName || '',
      phone: phone || '',
      isActive: true,
    });

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Registration failed', message: error.message });
  }
}

async function handleLogin(req, res) {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing required fields: username, password' });
    }

    // Find user by username or email
    const user = await User.findOne({ 
      $or: [{ username }, { email: username }] 
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({ 
      success: true, 
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed', message: error.message });
  }
}

async function handleVerify(req, res) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch fresh user data from database
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({ 
      success: true, 
      user: userResponse 
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
