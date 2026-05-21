const express = require('express');
const { list, add, remove, check } = require('../controllers/favoritesController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
router.get('/',              authenticate, list);
router.post('/:petId',       authenticate, add);
router.delete('/:petId',     authenticate, remove);
router.get('/check/:petId',  authenticate, check);
module.exports = router;
