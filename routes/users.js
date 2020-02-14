const express = require('express');

const { authentication, joiValidator } = require('../middleware/index');
const { JOI } = require('../config/constants');
const UserController = require('../controllers/users');
const userSchema = require('../schema/user.schema');

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ message: 'User route' });
});

router.get('/prescription', (req, res) => {});

module.exports = router;
