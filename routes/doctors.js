const express = require('express');
const { authentication, joiValidator } = require('../middleware/index');
const { JOI } = require('../config/constants');
const UserController = require('../controllers/users');
const userSchema = require('../schema/user.schema');

const router = express.Router();

// get all doctors
router.get('/', authentication.isAdmin, UserController.getDoctors);

// get consultation lists
router.get('/consult/:doctorId', authentication.isAdmin, UserController.getConsultationHistory);

router.get('/consult/:doctorId/:patientId', authentication.isAdmin, UserController.takeConsultations);

// create doctor
router.post('/', authentication.isAdmin,
  joiValidator(userSchema.createUser, JOI.property.body),
  UserController.createDoctor);

// update doctor
router.patch('/:doctorId', authentication.isDoctor,
  joiValidator(userSchema.updateUser, JOI.property.body),
  UserController.updateDoctor);

// get doctor profile
router.get('/:doctorId', authentication.isDoctor, UserController.getDoctor);

module.exports = router;
