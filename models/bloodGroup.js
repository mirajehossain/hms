const mongoose = require('mongoose');

const { Schema } = mongoose;

const bloodBankSchema = new Schema({
  name: { type: String, trim: true, required: true },
  bloodGroup: { type: String, trim: true, required: true },
  lastDonate: { type: Date, required: false },
  mobile: { type: String, trim: true, required: true },
}, { versionKey: false, timestamps: true });

module.exports = {
  BloodBankModel: mongoose.model('BloodBank', bloodBankSchema),
};
