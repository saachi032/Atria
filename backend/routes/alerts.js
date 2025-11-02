import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import DonorAlert from '../models/DonorAlert.js';
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
    // Support userId (donors), hospitalUserId (hospitals), and bloodBankUserId (blood banks)
    req.userId = decoded.userId || decoded.hospitalUserId || decoded.bloodBankUserId;
    if (!req.userId) {
      return res.status(401).json({ success: false, msg: 'Invalid token' });
    }
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

    // Get hospital/blood bank info for notification
    let hospitalName = '';
    let bloodBankName = '';
    const hospitalUser = await HospitalUser.findById(req.userId);
    const bloodBankUser = await BloodBankUser.findById(req.userId);
    
    if (hospitalUser) {
      hospitalName = hospitalUser.hospitalName || hospitalUser.name || 'Hospital';
    } else if (bloodBankUser) {
      bloodBankName = bloodBankUser.name || 'Blood Bank';
    }

    // Find matching donors based on recipient group and blood type
    let matchingUsers = [];
    if (recipientGroup === 'All Donors' || recipientGroup === 'Matching Blood Type' || recipientGroup === 'Matching Blood Type Only') {
      // Find all users with matching blood type
      matchingUsers = await User.find({ bloodGroup: bloodType });
    } else {
      // For other groups (Active Donors, Recent Donors, VIP Donors), find matching blood type
      // This can be refined later based on specific business logic
      matchingUsers = await User.find({ bloodGroup: bloodType });
    }

    // Create notifications for all matching donors
    // Note: Donor alerts don't have a requestId, so we'll leave it undefined
    const notifications = matchingUsers.map(user => ({
      recipientId: user._id,
      // No requestId for alerts - alerts are general notifications
      bloodType: bloodType,
      urgency: urgency || 'High',
      title: `🚨 URGENT: ${bloodType} Blood Alert`,
      message: message || `${hospitalName || bloodBankName} urgently needs ${unitsNeeded} unit(s) of ${bloodType} blood. This is a ${urgency || 'High'} priority alert.`,
      hospitalName: hospitalName || null,
      hospitalId: hospitalUser ? req.userId : null,
      bloodBankName: bloodBankName || null,
      bloodBankId: bloodBankUser ? req.userId : null,
      unitsNeeded: unitsNeeded,
      isRead: false,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
      console.log(`✅ Created ${notifications.length} alert notifications for blood type ${bloodType}`);
    } else {
      console.log(`⚠️ No matching donors found for blood type ${bloodType}`);
    }

    return res.status(201).json({ success: true, alert: doc, notificationsSent: notifications.length });
  } catch (e) {
    console.error('Error creating donor alert:', e);
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


