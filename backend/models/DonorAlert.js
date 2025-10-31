import mongoose from 'mongoose';

const donorAlertSchema = new mongoose.Schema({
  bloodType: { type: String, enum: ['A+','A-','B+','B-','O+','O-','AB+','AB-'], required: true },
  urgency: { type: String, enum: ['Low','Medium','High','Critical'], default: 'High' },
  unitsNeeded: { type: Number, min: 1, required: true },
  message: { type: String, required: true },
  recipientGroup: { type: String, required: true },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'HospitalUser' },
  createdAt: { type: Date, default: Date.now },
});

const DonorAlert = mongoose.model('DonorAlert', donorAlertSchema);
export default DonorAlert;


