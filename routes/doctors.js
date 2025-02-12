const express = require('express');
const { authentication, joiValidator } = require('../middleware/index');
const { JOI } = require('../config/constants');
const UserController = require('../controllers/users');
const userSchema = require('../schema/user.schema');
const doctorSchema = require('../schema/doctor.schema');

const router = express.Router();

// get all doctors
router.get('/', authentication.isAdmin, UserController.getDoctors);

// get consultation lists
router.get('/consult/:doctorId', authentication.isDoctor, UserController.getConsultationHistory);
router.get('/get-patients/:doctorId', authentication.isDoctor, UserController.getDoctorWisePatients);
router.get('/get-patient-report/:doctorId/:patientId', authentication.isDoctorOrPatient, UserController.getPatientReportByDoctor);
router.get('/get-doctor-report/:doctorId', authentication.isDoctor, UserController.getDoctorReport);

router.post('/consult',
  authentication.isDoctor,
  joiValidator(doctorSchema.consultPatient, JOI.property.body),
  UserController.consultPatient);

router.patch('/consult/:consultId',
  authentication.isDoctor,
  joiValidator(doctorSchema.consultPatient, JOI.property.body),
  UserController.updateConsultation);

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
