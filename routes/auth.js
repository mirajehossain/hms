const express = require('express');
const middleware = require('../middleware/index');
const schema = require('../schema/index');
const { JOI } = require('../config/constants');

const AuthController = require('../controllers/auth');

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ message: 'Auth route' });
});


// admin/patient/doctor
router.post('/login',
  middleware.joiValidator(schema.authSchema.login, JOI.property.body),
  AuthController.login);


// register admin
router.post('/register-admin',
  middleware.joiValidator(schema.authSchema.register, JOI.property.body),
  AuthController.registerAdmin);

module.exports = router;
