const express = require('express');

const router = express.Router();


router.route('/').get((req, res) => res.json({ title: ' Welcome to hospital management api' }));

module.exports = router;
