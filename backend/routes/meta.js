const express = require('express');
const { options, stats } = require('../controllers/metaController');

const router = express.Router();

router.get('/options', options);
router.get('/stats', stats);

module.exports = router;
