const mongoose = require('mongoose');

const { Schema } = mongoose;

const historySchema = new Schema({
  doctorId: { type: Schema.ObjectId, required: true },
  patientId: { type: Schema.ObjectId, required: true },
  date: {
    type: Date, default: new Date(),
  },
  historyType: {
    type: String, trim: true, required: true, index: true, // first_consultation, followup, ...
  },
  symptoms: {
    type: String, required: true,
  },
  note: {
    type: String, trim: true,
  },
  test: { type: String, required: false },
  report: { type: String, required: false },
  medicine: { type: String, required: false },
  advise: { type: String, required: false },
}, { versionKey: false, timestamps: true });

module.exports = {
  HistoryModel: mongoose.model('History', historySchema),
};
