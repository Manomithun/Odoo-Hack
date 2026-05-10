const express = require('express');
const router = express.Router();
const { getCities, getCityById } = require('../controllers/city.controller');
const { getCityActivities } = require('../controllers/activity.controller');

router.get('/', getCities);
router.get('/:id', getCityById);
router.get('/:cityId/activities', getCityActivities);

module.exports = router;
