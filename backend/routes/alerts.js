import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import DonorAlert from '../models/DonorAlert.js';
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

// Send donor alert (store record)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { bloodType, urgency, unitsNeeded, message, recipientGroup } = req.body;
    if (!bloodType || !unitsNeeded || !message || !recipientGroup) {
      return res.status(400).json({ success: false, msg: 'Missing required fields' });
    }
    const doc = new DonorAlert({
      bloodType,
      urgency,
      unitsNeeded,
      message,
      recipientGroup,
      sentBy: req.userId,
    });
    await doc.save();
    return res.status(201).json({ success: true, alert: doc });
  } catch (e) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// List alerts (latest first)
router.get('/', requireAuth, async (req, res) => {
  try {
    const list = await DonorAlert.find({ sentBy: req.userId }).sort({ createdAt: -1 });
    return res.json({ success: true, alerts: list });
  } catch (e) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

export default router;


