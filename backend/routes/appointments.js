import express from 'express';
import jwt from 'jsonwebtoken';
import Appointment from '../models/Appointment.js';
import dotenv from 'dotenv';
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

// Create appointment
router.post('/', requireAuth, async (req, res) => {
  try {
    const { locationName, locationCity, donationType, date, time } = req.body;
    if (!locationName || !locationCity || !donationType || !date || !time) {
      return res.status(400).json({ success: false, msg: 'All fields are required' });
    }
    const appt = new Appointment({
      userId: req.userId,
      locationName,
      locationCity,
      donationType,
      date,
      time,
      status: 'Scheduled',
    });
    await appt.save();
    return res.status(201).json({ success: true, appointment: appt });
  } catch (e) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Get upcoming appointments
router.get('/upcoming', requireAuth, async (req, res) => {
  try {
    const list = await Appointment.find({ userId: req.userId, status: 'Scheduled' }).sort({ date: 1 });
    return res.json({ success: true, appointments: list });
  } catch (e) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

export default router;




