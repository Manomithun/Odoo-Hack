const express = require('express');
const router = express.Router();
const { removeTripActivity } = require('../controllers/activity.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.use(authMiddleware);
router.delete('/:id', removeTripActivity);

module.exports = router;
