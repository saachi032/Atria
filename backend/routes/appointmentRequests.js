import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import AppointmentRequest from '../models/AppointmentRequest.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import HospitalUser from '../models/HospitalUser.js';
import Notification from '../models/Notification.js';
dotenv.config();

const router = express.Router();

// Middleware for donor authentication
const requireDonorAuth = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, msg: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    if (!req.userId) {
      return res.status(401).json({ success: false, msg: 'Invalid token - donors only' });
    }
    return next();
  } catch (e) {
    return res.status(401).json({ success: false, msg: 'Invalid token' });
  }
};

// Middleware for hospital authentication
const requireHospitalAuth = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, msg: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.hospitalUserId = decoded.hospitalUserId;
    if (!req.hospitalUserId) {
      return res.status(401).json({ success: false, msg: 'Invalid token - hospitals only' });
    }
    return next();
  } catch (e) {
    return res.status(401).json({ success: false, msg: 'Invalid token' });
  }
};

// Create appointment request (donor)
router.post('/', requireDonorAuth, async (req, res) => {
  try {
    const { hospitalId, bloodBankId, bloodType, preferredDate, preferredTime, donationType, message, notificationId } = req.body;
    
    if (!bloodType) {
      return res.status(400).json({ success: false, msg: 'Blood type is required' });
    }

    // Must have either hospitalId or bloodBankId
    if (!hospitalId && !bloodBankId) {
      return res.status(400).json({ success: false, msg: 'Hospital or Blood Bank ID is required' });
    }

    const appointmentRequest = new AppointmentRequest({
      donorId: req.userId,
      hospitalId: hospitalId || null,
      bloodBankId: bloodBankId || null,
      bloodType,
      preferredDate,
      preferredTime,
      donationType: donationType || 'whole-blood',
      message,
      notificationId,
      status: 'Pending',
    });

    await appointmentRequest.save();

    // Populate donor and hospital details for response
    await appointmentRequest.populate('donorId', 'name email phone bloodGroup');
    if (hospitalId) {
      await appointmentRequest.populate('hospitalId', 'hospitalName name address city');
    }

    console.log(`✅ Created appointment request ${appointmentRequest._id} from donor ${req.userId} to ${hospitalId ? 'hospital' : 'blood bank'}`);

    return res.status(201).json({ success: true, appointmentRequest });
  } catch (e) {
    console.error('Error creating appointment request:', e);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Get appointment requests for a hospital (pending requests)
router.get('/hospital/pending', requireHospitalAuth, async (req, res) => {
  try {
    const requests = await AppointmentRequest.find({ 
      hospitalId: req.hospitalUserId, 
      status: 'Pending' 
    })
      .populate('donorId', 'name email phone bloodGroup')
      .sort({ createdAt: -1 });

    return res.json({ success: true, requests });
  } catch (e) {
    console.error('Error fetching pending appointment requests:', e);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Get all appointment requests for a hospital
router.get('/hospital/all', requireHospitalAuth, async (req, res) => {
  try {
    const { status } = req.query; // Optional filter by status
    const query = { hospitalId: req.hospitalUserId };
    if (status && ['Pending', 'Approved', 'Denied'].includes(status)) {
      query.status = status;
    }

    const requests = await AppointmentRequest.find(query)
      .populate('donorId', 'name email phone bloodGroup')
      .sort({ createdAt: -1 });

    return res.json({ success: true, requests });
  } catch (e) {
    console.error('Error fetching appointment requests:', e);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Approve appointment request (hospital)
router.patch('/:id/approve', requireHospitalAuth, async (req, res) => {
  try {
    const { date, time, locationName, locationCity, donationType, hospitalResponse } = req.body;

    const appointmentRequest = await AppointmentRequest.findOne({
      _id: req.params.id,
      hospitalId: req.hospitalUserId,
      status: 'Pending',
    }).populate('donorId', 'name email phone bloodGroup');

    if (!appointmentRequest) {
      return res.status(404).json({ success: false, msg: 'Appointment request not found or already processed' });
    }

    // Update request status
    appointmentRequest.status = 'Approved';
    appointmentRequest.hospitalResponse = hospitalResponse;
    appointmentRequest.updatedAt = Date.now();
    await appointmentRequest.save();

    // Create actual appointment
    const appointmentDate = date || appointmentRequest.preferredDate || new Date().toISOString().split('T')[0];
    const appointmentTime = time || appointmentRequest.preferredTime || '10:00';

    // Get hospital details for location
    const hospital = await HospitalUser.findById(req.hospitalUserId);
    const finalLocationName = locationName || hospital?.hospitalName || 'Hospital';
    const finalLocationCity = locationCity || hospital?.city || '';
    const finalDonationType = donationType || appointmentRequest.donationType || 'whole-blood';

    const appointment = new Appointment({
      userId: appointmentRequest.donorId._id,
      locationName: finalLocationName,
      locationCity: finalLocationCity,
      donationType: finalDonationType,
      date: appointmentDate,
      time: appointmentTime,
      status: 'Scheduled',
    });

    await appointment.save();

    console.log(`✅ Approved appointment request ${appointmentRequest._id} and created appointment ${appointment._id}`);

    return res.json({ 
      success: true, 
      appointmentRequest,
      appointment,
      message: 'Appointment request approved and scheduled' 
    });
  } catch (e) {
    console.error('Error approving appointment request:', e);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Deny appointment request (hospital)
router.patch('/:id/deny', requireHospitalAuth, async (req, res) => {
  try {
    const { hospitalResponse } = req.body;

    const appointmentRequest = await AppointmentRequest.findOne({
      _id: req.params.id,
      hospitalId: req.hospitalUserId,
      status: 'Pending',
    });

    if (!appointmentRequest) {
      return res.status(404).json({ success: false, msg: 'Appointment request not found or already processed' });
    }

    appointmentRequest.status = 'Denied';
    appointmentRequest.hospitalResponse = hospitalResponse;
    appointmentRequest.updatedAt = Date.now();
    await appointmentRequest.save();

    console.log(`✅ Denied appointment request ${appointmentRequest._id}`);

    return res.json({ 
      success: true, 
      appointmentRequest,
      message: 'Appointment request denied' 
    });
  } catch (e) {
    console.error('Error denying appointment request:', e);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Get appointment requests for a donor
router.get('/donor', requireDonorAuth, async (req, res) => {
  try {
    const requests = await AppointmentRequest.find({ donorId: req.userId })
      .populate('hospitalId', 'hospitalName name address city')
      .populate('bloodBankId', 'name address')
      .sort({ createdAt: -1 });

    return res.json({ success: true, requests });
  } catch (e) {
    console.error('Error fetching donor appointment requests:', e);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
});

export default router;








