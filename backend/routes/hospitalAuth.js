import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import HospitalUser from '../models/HospitalUser.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Hospital Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, msg: 'Name, email, and password are required' });
    }
    const existing = await HospitalUser.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, msg: 'Email already registered' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hospitalUser = new HospitalUser({ name, email, password: hashedPassword });
    await hospitalUser.save();
    return res.status(201).json({
      success: true,
      msg: 'Hospital registered successfully',
      user: { id: hospitalUser._id, name: hospitalUser.name, email: hospitalUser.email },
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Hospital Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, msg: 'Email and password are required' });
    }
    const hospitalUser = await HospitalUser.findOne({ email });
    if (!hospitalUser) {
      return res.status(401).json({ success: false, msg: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, hospitalUser.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, msg: 'Invalid credentials' });
    }
    const token = jwt.sign({ hospitalUserId: hospitalUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({
      success: true,
      token,
      user: { id: hospitalUser._id, name: hospitalUser.name, email: hospitalUser.email },
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

export default router;
