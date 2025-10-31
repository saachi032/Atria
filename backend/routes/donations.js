import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Donation from '../models/Donation.js';
dotenv.config();

const router = express.Router();

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

// Record new donation
router.post('/', requireAuth, async (req, res) => {
  try {
    const { donorName, donorId, bloodType, units, donationDate, donorPhone, donorEmail, healthStatus } = req.body;
    if (!donorName || !bloodType || !units || !donationDate) {
      return res.status(400).json({ success: false, msg: 'Missing required fields' });
    }
    const doc = new Donation({
      donorName,
      donorId,
      bloodType,
      units,
      donationDate,
      donorPhone,
      donorEmail,
      healthStatus,
      recordedBy: req.userId,
    });
    await doc.save();
    return res.status(201).json({ success: true, donation: doc });
  } catch (e) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// List donations (latest first)
router.get('/', requireAuth, async (req, res) => {
  try {
    const list = await Donation.find({ recordedBy: req.userId }).sort({ createdAt: -1 });
    return res.json({ success: true, donations: list });
  } catch (e) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

export default router;


