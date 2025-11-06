import mongoose from 'mongoose';

const appointmentRequestSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'HospitalUser', required: true },
  bloodBankId: { type: mongoose.Schema.Types.ObjectId, ref: 'BloodBankUser' },
  bloodType: { type: String, enum: ['A+','A-','B+','B-','O+','O-','AB+','AB-'], required: true },
  preferredDate: { type: String }, // yyyy-mm-dd (optional, donor can suggest)
  preferredTime: { type: String }, // HH:mm (optional)
  donationType: { type: String, enum: ['whole-blood','platelets','power-red'], default: 'whole-blood' },
  status: { type: String, enum: ['Pending','Approved','Denied'], default: 'Pending' },
  notificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }, // Link to the notification that triggered this request
  message: { type: String }, // Optional message from donor
  hospitalResponse: { type: String }, // Response message from hospital
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

appointmentRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const AppointmentRequest = mongoose.model('AppointmentRequest', appointmentRequestSchema);
export default AppointmentRequest;







