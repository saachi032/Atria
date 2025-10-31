import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientId: { type: String },
  bloodType: { type: String, enum: ['A+','A-','B+','B-','O+','O-','AB+','AB-'], required: true },
  units: { type: Number, min: 1, required: true },
  urgency: { type: String, enum: ['Low','Medium','High','Critical'], default: 'Medium' },
  reason: { type: String },
  doctorName: { type: String },
  status: { type: String, enum: ['Pending','Approved','Declined','Fulfilled'], default: 'Pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'HospitalUser' },
  createdAt: { type: Date, default: Date.now },
});

const Request = mongoose.model('Request', requestSchema);
export default Request;


