const express = require('express');
const { submit } = require('../controllers/contactController');

const router = express.Router();
router.post('/', submit);
module.exports = router;
