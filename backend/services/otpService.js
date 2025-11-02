// OTP Service using Twilio for SMS verification
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// In-memory OTP storage (use Redis in production)
const otpStorage = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via Twilio SMS
export const sendOTP = async (phoneNumber) => {
  try {
    // Validate phone number format
    const cleanPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digits
    if (cleanPhone.length !== 10) {
      throw new Error('Invalid phone number. Must be 10 digits.');
    }

    // Format phone number for Twilio (add country code for India)
    const formattedPhone = `+91${cleanPhone}`;

    // Generate OTP
    const otp = generateOTP();

    // Store OTP with expiration (5 minutes)
    const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes
    otpStorage.set(cleanPhone, {
      otp,
      expirationTime,
      attempts: 0
    });

    // Send SMS via Twilio
    const message = await twilioClient.messages.create({
      body: `Your Atria verification code is: ${otp}. Valid for 5 minutes. Do not share this code.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });

    console.log(`OTP sent to ${formattedPhone}. Message SID: ${message.sid}`);

    return {
      success: true,
      message: 'OTP sent successfully',
      phone: cleanPhone // Return clean phone for verification
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    
    // Handle Twilio-specific errors
    if (error.code === 21211) {
      throw new Error('Invalid phone number format');
    } else if (error.code === 21610) {
      throw new Error('Phone number is unverified (Twilio trial account limitation)');
    } else if (error.code === 21212) {
      throw new Error('Invalid phone number');
    }
    
    throw new Error(`Failed to send OTP: ${error.message}`);
  }
};

// Verify OTP
export const verifyOTP = (phoneNumber, providedOTP) => {
  try {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Get stored OTP data
    const storedData = otpStorage.get(cleanPhone);

    if (!storedData) {
      return {
        success: false,
        message: 'OTP not found. Please request a new OTP.'
      };
    }

    // Check if OTP has expired
    if (Date.now() > storedData.expirationTime) {
      otpStorage.delete(cleanPhone);
      return {
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      };
    }

    // Check if too many attempts (max 5 attempts)
    if (storedData.attempts >= 5) {
      otpStorage.delete(cleanPhone);
      return {
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      };
    }

    // Verify OTP
    if (storedData.otp === providedOTP) {
      // OTP verified successfully - remove it from storage
      otpStorage.delete(cleanPhone);
      return {
        success: true,
        message: 'Phone number verified successfully'
      };
    } else {
      // Increment attempts
      storedData.attempts += 1;
      otpStorage.set(cleanPhone, storedData);
      
      const remainingAttempts = 5 - storedData.attempts;
      return {
        success: false,
        message: `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`
      };
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return {
      success: false,
      message: `Failed to verify OTP: ${error.message}`
    };
  }
};

// Check if phone is verified (for registration validation)
export const isPhoneVerified = (phoneNumber, providedOTP) => {
  const verification = verifyOTP(phoneNumber, providedOTP);
  return verification.success;
};

// Clean up expired OTPs (run periodically)
export const cleanupExpiredOTPs = () => {
  const now = Date.now();
  for (const [phone, data] of otpStorage.entries()) {
    if (now > data.expirationTime) {
      otpStorage.delete(phone);
    }
  }
};

// Run cleanup every 10 minutes
setInterval(cleanupExpiredOTPs, 10 * 60 * 1000);

