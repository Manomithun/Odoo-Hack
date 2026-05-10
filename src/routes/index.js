const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/trips', require('./trip.routes'));
router.use('/stops', require('./stop.routes'));
router.use('/cities', require('./city.routes'));
router.use('/trip-activities', require('./activity.routes'));
router.use('/budget', require('./budget.routes'));
router.use('/packing', require('./packing.routes'));
router.use('/notes', require('./note.routes'));
router.use('/', require('./share.routes'));
router.use('/admin', require('./admin.routes'));

module.exports = router;
