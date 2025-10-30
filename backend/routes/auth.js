import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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

// Generate Donor QR (returns a QR URL and payload)
router.get('/qr', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, msg: 'User not found' });
    const payload = {
      donorId: String(user._id),
      name: user.name || '',
      bloodGroup: user.bloodGroup || '',
      city: user.city || '',
      state: user.state || '',
    };
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(JSON.stringify(payload))}`;
    return res.json({ success: true, qrUrl, payload });
  } catch (e) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

export default router;
