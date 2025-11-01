import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import os from 'os';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Simple auth middleware
const requireAuth = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, msg: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    return next();
  } catch (e) {
    return res.status(401).json({ success: false, msg: 'Invalid token' });
  }
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, state, city, district, pincode, gender, bloodGroup, dob } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, msg: 'Name, email, and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, msg: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: hashedPassword, phone, address, state, city, district, pincode, gender, bloodGroup, dob });
    await user.save();

    return res.status(201).json({
      success: true,
      msg: 'Registered successfully',
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, msg: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Get current user profile
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });
    return res.json({ success: true, user });
  } catch (e) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Update current user profile
router.put('/me', requireAuth, async (req, res) => {
  try {
    const allowed = ['name','phone','address','state','city','district','pincode','gender','bloodGroup','dob'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select('-password');
    return res.json({ success: true, user });
  } catch (e) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Get donor by ID (public endpoint for health card)
router.get('/donor/:donorId', async (req, res) => {
  try {
    const { donorId } = req.params;
    const user = await User.findById(donorId).select('-password');
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });
    return res.json({ success: true, donor: user });
  } catch (e) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Generate Donor QR (returns a QR URL and payload)
router.get('/qr', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });
    
    // Create URL pointing to the health card page
    let baseUrl = process.env.FRONTEND_URL;
    
    // If FRONTEND_URL is localhost or not set, detect network IP for mobile access in development
    if (!baseUrl || baseUrl.includes('localhost')) {
      if (process.env.NODE_ENV !== 'production') {
        // In development, detect network IP for mobile access
        const networkInterfaces = os.networkInterfaces();
        let networkIp = 'localhost';
        
        // Find the first non-internal IPv4 address
        if (networkInterfaces) {
          for (const interfaceName of Object.keys(networkInterfaces)) {
            const addresses = networkInterfaces[interfaceName];
            if (addresses) {
              for (const addr of addresses) {
                if (addr.family === 'IPv4' && !addr.internal) {
                  networkIp = addr.address;
                  break;
                }
              }
              if (networkIp !== 'localhost') break;
            }
          }
        }
        
        baseUrl = `http://${networkIp}:5173`;
      } else {
        // In production, use the provided FRONTEND_URL or default to localhost
        baseUrl = baseUrl || 'http://localhost:5173';
      }
    }
    
    const healthCardUrl = `${baseUrl}/donor-card/${user._id}`;
    
    // Generate QR code using the health card URL
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(healthCardUrl)}`;
    
    const payload = {
      donorId: String(user._id),
      name: user.name || '',
      bloodGroup: user.bloodGroup || '',
      city: user.city || '',
      state: user.state || '',
    };
    
    return res.json({ success: true, qrUrl, payload, healthCardUrl });
  } catch (e) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

export default router;
