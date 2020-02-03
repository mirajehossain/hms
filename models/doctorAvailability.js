const mongoose = require('mongoose');

const { Schema } = mongoose;

const doctorAvailabilitySchema = new Schema({
  doctorId: { type: Schema.ObjectId, required: true },
  timeSlot: {
    type: String, trim: true, required: true,
  },
}, { versionKey: false, timestamps: true });

module.exports = {
  DoctorAvailabilityModel: mongoose.model('DoctorAvailability', doctorAvailabilitySchema),
};
