const express = require('express');
const { authentication, joiValidator } = require('../middleware/index');
const { JOI } = require('../config/constants');
const UserController = require('../controllers/users');
const userSchema = require('../schema/user.schema');

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ message: 'User route' });
});

// get all patient
router.get('/patient', authentication.isAdmin, UserController.getPatients);

// create patient
router.post('/patient', authentication.isAdmin,
  joiValidator(userSchema.createPatient, JOI.property.body),
  UserController.createPatient);

// update patient
router.patch('/patient/:patientId', authentication.isPatient,
  joiValidator(userSchema.updatePatient, JOI.property.body),
  UserController.updatePatient);

// get patient proile
router.get('/patient/:patientId', authentication.isPatient, UserController.getPatient);

module.exports = router;
