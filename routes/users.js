const express = require('express');

const { authentication, joiValidator } = require('../middleware/index');
const { JOI } = require('../config/constants');
const UserController = require('../controllers/users');
const userSchema = require('../schema/user.schema');
const uploadImage = require('../utils/utils');

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ message: 'User route' });
});

router.get('/get-profile/:userId', UserController.getUser);
router.patch('/update-profile/:userId', UserController.updateProfile);

router.post('/upload-image/:userId',
  authentication.isDoctorOrPatient,
  uploadImage.single('image'),
  UserController.uploadImage);

router.get('/prescription', (req, res) => {});

module.exports = router;
