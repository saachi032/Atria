import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Request from '../models/Request.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import HospitalUser from '../models/HospitalUser.js';
import BloodBankUser from '../models/BloodBankUser.js';
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

// Create new request
router.post('/', requireAuth, async (req, res) => {
  try {
    const { patientName, patientId, bloodType, units, urgency, reason, doctorName } = req.body;
    if (!patientName || !bloodType || !units) {
      return res.status(400).json({ success: false, msg: 'Missing required fields' });
    }
    const doc = new Request({
      patientName,
      patientId,
      bloodType,
      units,
      urgency,
      reason,
      doctorName,
      createdBy: req.userId,
    });
    await doc.save();

    // Get hospital/blood bank info
    let hospitalName = '';
    let bloodBankName = '';
    const hospitalUser = await HospitalUser.findById(req.userId);
    const bloodBankUser = await BloodBankUser.findById(req.userId);
    
    if (hospitalUser) {
      hospitalName = hospitalUser.hospitalName || hospitalUser.name || 'Hospital';
    } else if (bloodBankUser) {
      bloodBankName = bloodBankUser.name || 'Blood Bank';
    }

    // Find all users with matching blood type
    const matchingUsers = await User.find({ bloodGroup: bloodType });
    
    // Create notifications for all matching users
    const notifications = matchingUsers.map(user => ({
      recipientId: user._id,
      requestId: doc._id,
      bloodType: bloodType,
      urgency: urgency || 'Medium',
      title: `${bloodType} Blood Request`,
      message: `${hospitalName || bloodBankName} needs ${units} unit(s) of ${bloodType} blood${reason ? ` for ${reason}` : ''}.`,
      hospitalName: hospitalName || null,
      hospitalId: hospitalUser ? req.userId : null,
      bloodBankName: bloodBankName || null,
      bloodBankId: bloodBankUser ? req.userId : null,
      unitsNeeded: units,
      isRead: false,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    return res.status(201).json({ success: true, request: doc, notificationsSent: notifications.length });
  } catch (e) {
    console.error('Error creating request:', e);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// List requests (latest first)
router.get('/', requireAuth, async (req, res) => {
  try {
    const list = await Request.find({ createdBy: req.userId }).sort({ createdAt: -1 });
    return res.json({ success: true, requests: list });
  } catch (e) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

export default router;


