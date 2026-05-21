const express = require('express');
const { list, getOne, myListings, create, update, remove } = require('../controllers/petsController');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();
router.get('/',                    optionalAuth, list);
router.get('/user/my-listings',    authenticate, myListings);
router.get('/:id',                 optionalAuth, getOne);
router.post('/',                   authenticate, create);
router.put('/:id',                 authenticate, update);
router.delete('/:id',              authenticate, remove);
module.exports = router;
