import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Notification from '../models/Notification.js';
import Request from '../models/Request.js';
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

// Get all notifications for logged-in user
router.get('/', requireAuth, async (req, res) => {
  try {
    const { urgency } = req.query; // Optional filter by urgency
    const query = { recipientId: req.userId };
    if (urgency && ['Low', 'Medium', 'High', 'Critical'].includes(urgency)) {
      query.urgency = urgency;
    }
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .populate('requestId', 'patientName bloodType units urgency status reason doctorName');
    
    return res.json({ success: true, notifications });
  } catch (e) {
    console.error('Error fetching notifications:', e);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Get unread count
router.get('/unread-count', requireAuth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      recipientId: req.userId, 
      isRead: false 
    });
    return res.json({ success: true, count });
  } catch (e) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Mark notification as read
router.patch('/:id/read', requireAuth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipientId: req.userId },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, msg: 'Notification not found' });
    }
    return res.json({ success: true, notification });
  } catch (e) {
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Get request details (for view request)
router.get('/request/:requestId', requireAuth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId)
      .populate('createdBy');
    
    if (!request) {
      return res.status(404).json({ success: false, msg: 'Request not found' });
    }

    // Get hospital/blood bank details
    let hospitalDetails = null;
    let bloodBankDetails = null;
    
    if (request.createdBy) {
      const hospitalUser = await HospitalUser.findById(request.createdBy);
      const bloodBankUser = await BloodBankUser.findById(request.createdBy);
      
      if (hospitalUser) {
        hospitalDetails = {
          name: hospitalUser.hospitalName || hospitalUser.name,
          address: hospitalUser.address,
          city: hospitalUser.city,
          state: hospitalUser.state,
          contactNumber: hospitalUser.contactNumber1 || hospitalUser.pocMobile,
          email: hospitalUser.pocEmail || hospitalUser.email,
          pocName: hospitalUser.pocName,
        };
      } else if (bloodBankUser) {
        bloodBankDetails = {
          name: bloodBankUser.name,
          email: bloodBankUser.email,
        };
      }
    }

    return res.json({ 
      success: true, 
      request, 
      hospitalDetails,
      bloodBankDetails 
    });
  } catch (e) {
    console.error('Error fetching request details:', e);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

export default router;

