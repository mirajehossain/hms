const bcrypt = require('bcryptjs');

const { UserModel } = require('../models/users');
const { userType } = require('../config/constants');
const response = require('../helpers/response');

module.exports = {

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
};
