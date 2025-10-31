import mongoose from 'mongoose';

const hospitalUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  hospitalName: {
    type: String,
  },
  licenseNumber: { type: String },
  hospitalType: { type: String, enum: ['govt','pvt','trust',''], default: '' },
  address: { type: String },
  contactNumber1: { type: String },
  website: { type: String },
  state: { type: String },
  city: { type: String },
  district: { type: String },
  pincode: { type: String },
  pocName: { type: String },
  pocDesignation: { type: String },
  pocMobile: { type: String },
  pocEmail: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const HospitalUser = mongoose.model('HospitalUser', hospitalUserSchema);
export default HospitalUser;
