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

// Hospital auth for organization views
const requireHospitalAuth = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, msg: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.hospitalUserId = decoded.hospitalUserId;
    if (!req.hospitalUserId) return res.status(401).json({ success: false, msg: 'Invalid token - hospitals only' });
    return next();
  } catch (e) {
    return res.status(401).json({ success: false, msg: 'Invalid token' });
  }
};

// Blood bank auth for organization views
const requireBloodBankAuth = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, msg: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.bloodBankUserId = decoded.bloodBankUserId;
    if (!req.bloodBankUserId) return res.status(401).json({ success: false, msg: 'Invalid token - blood banks only' });
    return next();
  } catch (e) {
    return res.status(401).json({ success: false, msg: 'Invalid token' });
  }
};

// Create appointment
router.post('/', requireAuth, async (req, res) => {
  try {
    const { locationName, locationCity, donationType, date, time, hospitalId, bloodBankId } = req.body;
    if (!locationName || !locationCity || !donationType || !date || !time) {
      return res.status(400).json({ success: false, msg: 'All fields are required' });
    }
    const appt = new Appointment({
      userId: req.userId,
      hospitalId: hospitalId || null,
      bloodBankId: bloodBankId || null,
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

// Org-specific upcoming/past for Hospital
router.get('/hospital/upcoming', requireHospitalAuth, async (req, res) => {
  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    const list = await Appointment.find({ hospitalId: req.hospitalUserId, status: 'Scheduled', date: { $gte: todayStr } })
      .sort({ date: 1 })
      .populate('userId', 'name email phone bloodGroup');
    return res.json({ success: true, appointments: list });
  } catch (e) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

router.get('/hospital/past', requireHospitalAuth, async (req, res) => {
  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    const list = await Appointment.find({ hospitalId: req.hospitalUserId, $or: [ { status: { $ne: 'Scheduled' } }, { date: { $lt: todayStr } } ] })
      .sort({ date: -1 })
      .populate('userId', 'name email phone bloodGroup');
    return res.json({ success: true, appointments: list });
  } catch (e) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Org-specific upcoming/past for Blood Bank
router.get('/bloodbank/upcoming', requireBloodBankAuth, async (req, res) => {
  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    const list = await Appointment.find({ bloodBankId: req.bloodBankUserId, status: 'Scheduled', date: { $gte: todayStr } })
      .sort({ date: 1 })
      .populate('userId', 'name email phone bloodGroup');
    return res.json({ success: true, appointments: list });
  } catch (e) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

router.get('/bloodbank/past', requireBloodBankAuth, async (req, res) => {
  try {
    const todayStr = new Date().toISOString().slice(0, 10);
    const list = await Appointment.find({ bloodBankId: req.bloodBankUserId, $or: [ { status: { $ne: 'Scheduled' } }, { date: { $lt: todayStr } } ] })
      .sort({ date: -1 })
      .populate('userId', 'name email phone bloodGroup');
    return res.json({ success: true, appointments: list });
  } catch (e) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

export default router;




