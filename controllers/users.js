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
        return res.status(200).send(response.success('Author already create with this email', {}, false));
      }

      const patient = await UserModel.create(payload);
      return res.status(200).send(response.success('New patient created', patient, true));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },
};
