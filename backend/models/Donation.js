import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  donorId: { type: String },
  bloodType: { type: String, enum: ['A+','A-','B+','B-','O+','O-','AB+','AB-'], required: true },
  units: { type: Number, min: 1, required: true },
  donationDate: { type: String, required: true }, // yyyy-mm-dd
  donorPhone: { type: String },
  donorEmail: { type: String },
  healthStatus: { type: String, enum: ['Healthy','Minor Issues','Under Review'], default: 'Healthy' },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'HospitalUser' },
  createdAt: { type: Date, default: Date.now },
});

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;


