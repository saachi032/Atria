import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  locationName: { type: String, required: true },
  locationCity: { type: String, required: true },
  donationType: { type: String, enum: ['whole-blood','platelets','power-red'], required: true },
  date: { type: String, required: true }, // yyyy-mm-dd
  time: { type: String, required: true }, // e.g., "09:00 AM - 10:00 AM"
  status: { type: String, enum: ['Scheduled','Completed','Cancelled'], default: 'Scheduled' },
  createdAt: { type: Date, default: Date.now },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
