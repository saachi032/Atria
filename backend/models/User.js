import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: { type: String },
  address: { type: String },
  state: { type: String },
  city: { type: String },
  district: { type: String },
  pincode: { type: String },
  gender: { type: String },
  bloodGroup: { type: String },
  dob: { type: String }, // yyyy-mm-dd
});

const User = mongoose.model('User', userSchema);
export default User;
