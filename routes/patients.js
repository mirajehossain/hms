const express = require('express');
const { authentication, joiValidator } = require('../middleware/index');
const { JOI } = require('../config/constants');
const UserController = require('../controllers/users');
const userSchema = require('../schema/user.schema');

const router = express.Router();


// get all patient
router.get('/', authentication.isAdmin, UserController.getPatients);

// create patient
router.post('/', authentication.isAdmin,
  joiValidator(userSchema.createUser, JOI.property.body),
  UserController.createPatient);

// update patient
router.patch('/:patientId', authentication.isPatient,
  joiValidator(userSchema.updateUser, JOI.property.body),
  UserController.updatePatient);

// get patient profile
router.get('/:patientId', authentication.isPatient, UserController.getPatient);

module.exports = router;
