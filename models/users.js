const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  userType: { type: String, required: true }, // admin, doctor, patient
  name: {
    type: String, trim: true, required: true, index: true,
  },
  email: {
    type: String, trim: true, required: true, index: true,
  },
  password: {
    type: String, required: true,
  },
  mobile: {
    type: String, trim: true,
  },
  image: { type: String, required: false },
  address: { type: String, required: false },
  bloodGroup: { type: String, required: false },
  isDonor: { type: Boolean, default: false },
  designation: { type: String, required: false },
}, { versionKey: false, timestamps: true });

module.exports = {
  UserModel: mongoose.model('User', userSchema),
};
