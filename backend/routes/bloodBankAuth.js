import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import BloodBankUser from '../models/BloodBankUser.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Blood Bank Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, msg: 'Name, email, and password are required' });
    }
    const existing = await BloodBankUser.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, msg: 'Email already registered' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const bloodBankUser = new BloodBankUser({ name, email, password: hashedPassword });
    await bloodBankUser.save();
    return res.status(201).json({
      success: true,
      msg: 'Blood Bank registered successfully',
      user: { id: bloodBankUser._id, name: bloodBankUser.name, email: bloodBankUser.email },
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Blood Bank Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, msg: 'Email and password are required' });
    }
    const bloodBankUser = await BloodBankUser.findOne({ email });
    if (!bloodBankUser) {
      return res.status(401).json({ success: false, msg: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, bloodBankUser.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, msg: 'Invalid credentials' });
    }
    const token = jwt.sign({ bloodBankUserId: bloodBankUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({
      success: true,
      token,
      user: { id: bloodBankUser._id, name: bloodBankUser.name, email: bloodBankUser.email },
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

export default router;




