import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },
  bloodType: { type: String, enum: ['A+','A-','B+','B-','O+','O-','AB+','AB-'], required: true },
  urgency: { type: String, enum: ['Low','Medium','High','Critical'], default: 'Medium' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  hospitalName: { type: String },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'HospitalUser' },
  bloodBankName: { type: String },
  bloodBankId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodBankUser' },
  unitsNeeded: { type: Number, min: 1 },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;

