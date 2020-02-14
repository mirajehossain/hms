const bcrypt = require('bcryptjs');

const { UserModel } = require('../models/users');
const { HistoryModel } = require('../models/history');
const { userType } = require('../config/constants');
const response = require('../helpers/response');

module.exports = {


  async createDoctor(req, res) {
    try {
      const payload = req.body;
      const user = await UserModel.findOne({ email: payload.email }).lean();
      payload.userType = userType.doctor;
      payload.password = bcrypt.hashSync(payload.password, Number(process.env.SALT_ROUND));

      if (user) {
        return res.status(200).send(response.success('Doctor already create with this email', {}, false));
      }

      const doctor = await UserModel.create(payload);
      return res.status(200).send(response.success('New doctor created', doctor));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async updateDoctor(req, res) {
    try {
      const payload = req.body;
      const { doctorId } = req.params;
      const user = await UserModel
        .findOneAndUpdate({ _id: doctorId }, payload, { new: true }).lean();
      return res.status(200).send(response.success('doctor profile updated', user));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async getDoctors(req, res) {
    try {
      const user = await UserModel.find({ userType: userType.doctor }, { password: 0 });
      return res.status(200).send(response.success('doctor lists', user));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async getDoctor(req, res) {
    try {
      const { doctorId } = req.params;
      const user = await UserModel
        .findOne({ _id: doctorId, userType: userType.doctor }, { password: 0 }).lean();
      return res.status(200).send(response.success('doctor profile', user));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async createPatient(req, res) {
    try {
      const payload = req.body;
      const user = await UserModel.findOne({ email: payload.email }).lean();
      payload.userType = userType.patient;
      payload.password = bcrypt.hashSync(payload.password, Number(process.env.SALT_ROUND));

      if (user) {
        return res.status(200).send(response.success('Patient already create with this email', {}, false));
      }

      const patient = await UserModel.create(payload);
      return res.status(200).send(response.success('New patient created', patient, true));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async updatePatient(req, res) {
    try {
      const payload = req.body;
      const { patientId } = req.params;
      const user = await UserModel
        .findOneAndUpdate({ _id: patientId }, payload, { new: true }).lean();
      return res.status(200).send(response.success('patient profile updated', user));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async getPatients(req, res) {
    try {
      const user = await UserModel.find({ userType: userType.patient }, { password: 0 });
      return res.status(200).send(response.success('Patient lists', user));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async getPatient(req, res) {
    try {
      const { patientId } = req.params;
      const user = await UserModel
        .findOne({ _id: patientId, userType: userType.patient }, { password: 0 }).lean();
      return res.status(200).send(response.success('patient profile', user));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async getPrescription(req, res) {
    try {
      const { patientId } = req.params;
      const user = await HistoryModel
        .find({ patientId }).lean();
      return res.status(200).send(response.success('patient prescription', user));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

  async getConsultationHistory(req, res) {
    try {
      const { doctorId } = req.params;
      const user = await HistoryModel
        .find({ doctorId }).lean();
      return res.status(200).send(response.success('doctor consultations history', user));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },
};
