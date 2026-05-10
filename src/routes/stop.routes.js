const express = require('express');
const router = express.Router();
const { updateStop, deleteStop } = require('../controllers/stop.controller');
const { addActivityToStop } = require('../controllers/activity.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { updateStopSchema } = require('../validations/stop.validation');
const { addTripActivitySchema } = require('../validations/activity.validation');

router.use(authMiddleware);
router.put('/:id', validate(updateStopSchema), updateStop);
router.delete('/:id', deleteStop);
router.post('/:stopId/activities', validate(addTripActivitySchema), addActivityToStop);

module.exports = router;
