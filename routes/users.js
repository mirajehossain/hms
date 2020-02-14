const express = require('express');
const { authentication, joiValidator } = require('../middleware/index');
const { JOI } = require('../config/constants');
const UserController = require('../controllers/users');
const userSchema = require('../schema/user.schema');

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ message: 'User route' });
});

// get all doctors
router.get('/doctor', authentication.isAdmin, UserController.getDoctors);

// create doctor
router.post('/doctor', authentication.isAdmin,
  joiValidator(userSchema.createUser, JOI.property.body),
  UserController.createDoctor);

// update doctor
router.patch('/doctor/:doctorId', authentication.isDoctor,
  joiValidator(userSchema.updateUser, JOI.property.body),
  UserController.updateDoctor);

// get doctor profile
router.get('/doctor/:doctorId', authentication.isDoctor, UserController.getDoctor);


// get all patient
router.get('/patient', authentication.isAdmin, UserController.getPatients);

// create patient
router.post('/patient', authentication.isAdmin,
  joiValidator(userSchema.createUser, JOI.property.body),
  UserController.createPatient);

// update patient
router.patch('/patient/:patientId', authentication.isPatient,
  joiValidator(userSchema.updateUser, JOI.property.body),
  UserController.updatePatient);

// get patient profile
router.get('/patient/:patientId', authentication.isPatient, UserController.getPatient);

module.exports = router;
