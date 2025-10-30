import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import hospitalAuthRoutes from './routes/hospitalAuth.js';
import bloodBankAuthRoutes from './routes/bloodBankAuth.js';
import appointmentsRoutes from './routes/appointments.js';

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

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB connected');
    // Start server only after DB is up
    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
  });
