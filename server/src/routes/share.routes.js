const express = require('express');
const router = express.Router();
const { getSharedTrip } = require('../controllers/share.controller');
const { getSavedDestinations, saveDestination, unsaveDestination } = require('../controllers/share.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

// Public
router.get('/public/:token', getSharedTrip);

// Protected
router.get('/saved', authMiddleware, getSavedDestinations);
router.post('/saved', authMiddleware, saveDestination);
router.delete('/saved/:cityId', authMiddleware, unsaveDestination);

module.exports = router;
