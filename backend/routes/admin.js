const express = require('express');
const ctrl = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate, requireAdmin);

router.get('/stats',                ctrl.stats);
router.get('/users',                ctrl.users);
router.put('/users/:id',            ctrl.updateUser);
router.get('/shelters',             ctrl.shelters);
router.put('/shelters/:id/approve', ctrl.approveShelter);
router.put('/shelters/:id/reject',  ctrl.rejectShelter);
router.get('/listings',             ctrl.listings);
router.put('/listings/:id',         ctrl.updateListing);
router.delete('/listings/:id',      ctrl.deleteListing);
module.exports = router;
