import mongoose from 'mongoose';

const bloodBankUserSchema = new mongoose.Schema({
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

const BloodBankUser = mongoose.model('BloodBankUser', bloodBankUserSchema);
export default BloodBankUser;
