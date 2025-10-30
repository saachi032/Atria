import mongoose from 'mongoose';

const hospitalUserSchema = new mongoose.Schema({
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
});

const HospitalUser = mongoose.model('HospitalUser', hospitalUserSchema);
export default HospitalUser;
