const express = require('express');
const { list, getOne, update } = require('../controllers/sheltersController');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();
router.get('/',    optionalAuth, list);
router.get('/:id', optionalAuth, getOne);
router.put('/:id', authenticate, update);
module.exports = router;
