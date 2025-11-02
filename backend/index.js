import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import hospitalAuthRoutes from './routes/hospitalAuth.js';
import bloodBankAuthRoutes from './routes/bloodBankAuth.js';
import appointmentsRoutes from './routes/appointments.js';
import appointmentRequestsRoutes from './routes/appointmentRequests.js';
import requestsRoutes from './routes/requests.js';
import donationsRoutes from './routes/donations.js';
import alertsRoutes from './routes/alerts.js';
import notificationsRoutes from './routes/notifications.js';
import insightsRoutes from './routes/insights.js';
import otpRoutes from './routes/otp.js';

// Load .env
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hospital', hospitalAuthRoutes);
app.use('/api/bloodbank', bloodBankAuthRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/appointment-requests', appointmentRequestsRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/donations', donationsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/otp', otpRoutes);

// Start server (insights API doesn't require MongoDB)
const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on port ${PORT}`);
});

// MongoDB connection (optional for insights API, but needed for other features)
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('✅ MongoDB connected');
    })
    .catch((err) => {
      console.warn('⚠️ MongoDB connection failed (insights API still works):', err.message);
    });
} else {
  console.warn('⚠️ MONGO_URI not set - MongoDB features disabled (insights API still works)');
}
