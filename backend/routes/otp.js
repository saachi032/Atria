// OTP Routes for sending and verifying OTP via Twilio
import express from 'express';
import { sendOTP, verifyOTP } from '../services/otpService.js';

const router = express.Router();

// POST /api/otp/send - Send OTP to phone number
router.post('/send', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const result = await sendOTP(phoneNumber);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in send OTP route:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to send OTP'
    });
  }
});

// POST /api/otp/verify - Verify OTP
router.post('/verify', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }

    const result = verifyOTP(phoneNumber, otp);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in verify OTP route:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify OTP'
    });
  }
});

export default router;

