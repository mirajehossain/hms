const bcrypt = require('bcryptjs');

const response = require('../helpers/response');
const middleware = require('../middleware/index');
const { userType } = require('../config/constants');
const { UserModel } = require('../models/users');

module.exports = {
  async login(req, res) {
    try {
      const payload = req.body;
      const { password, ...user } = await UserModel
        .findOne({ email: payload.email })
        .lean()
        .exec();

      if (user) {
        const matched = bcrypt.compareSync(payload.password, password);

        if (matched) {
          const tokenObject = {
            id: user.id,
            email: user.email,
            userType: user.userType,
          };

          const accessToken = middleware.authentication.generateToken(tokenObject);
          return res.status(200)
            .send(response.success('Successfully logged-in', { accessToken, ...user }));
        }
        return res.status(200)
          .send(response.error(false, 'Incorrect email or password', 'Incorrect email or password '));
      }
      return res.status(200)
        .send(response.success('User not exist', {}, false));
    } catch (e) {
      console.log(e);
      return res.status(500)
        .send(response.error('An error occur', `${e.message}`));
    }
  },


  async registerAdmin(req, res) {
    try {
      const payload = req.body; // email, password, name,

      console.log(payload);

      payload.password = bcrypt.hashSync(payload.password, Number(process.env.SALT_ROUND));
      payload.userType = userType.admin; // admin, member

      const isEmailExist = await UserModel.findOne({ email: payload.email });
      if (!isEmailExist) {
        const user = await UserModel.create(payload);
        console.log(user);
        const tokenObject = {
          _id: user._id,
          name: user.name,
          email: user.email,
          userType: user.userType,
        };

        const accessToken = middleware.authentication.generateToken(tokenObject);
        return res.status(200).send(response.success('Successfully registered new admin', { user, accessToken }));
      }
      return res.status(200).json(response.error('Email already used', 'Email already used'));
    } catch (e) {
      console.log(e);
      return res.status(500).send(response.error('An error occur', `${e.message}`));
    }
  },

};
