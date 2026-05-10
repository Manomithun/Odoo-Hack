const express = require('express');
const router = express.Router();
const { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip } = require('../controllers/trip.controller');
const { createStop, updateStop, deleteStop, reorderStops } = require('../controllers/stop.controller');
const { addActivityToStop } = require('../controllers/activity.controller');
const { getBudget, addBudgetEntry } = require('../controllers/budget.controller');
const { getPackingList, addItem } = require('../controllers/packing.controller');
const { getNotes, createNote } = require('../controllers/note.controller');
const { shareTrip } = require('../controllers/share.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createTripSchema, updateTripSchema } = require('../validations/trip.validation');
const { createStopSchema, updateStopSchema, reorderStopsSchema } = require('../validations/stop.validation');
const { addTripActivitySchema } = require('../validations/activity.validation');
const { createBudgetSchema } = require('../validations/budget.validation');
const { createPackingItemSchema } = require('../validations/packing.validation');
const { createNoteSchema } = require('../validations/note.validation');

// Trip routes
router.use(authMiddleware);
router.get('/', getAllTrips);
router.post('/', validate(createTripSchema), createTrip);
router.get('/:id', getTripById);
router.put('/:id', validate(updateTripSchema), updateTrip);
router.delete('/:id', deleteTrip);

// Nested stop routes
router.post('/:tripId/stops', validate(createStopSchema), createStop);
router.put('/:tripId/stops/reorder', validate(reorderStopsSchema), reorderStops);

// Nested budget routes
router.get('/:tripId/budget', getBudget);
router.post('/:tripId/budget', validate(createBudgetSchema), addBudgetEntry);

// Nested packing routes
router.get('/:tripId/packing', getPackingList);
router.post('/:tripId/packing', validate(createPackingItemSchema), addItem);

// Nested notes routes
router.get('/:tripId/notes', getNotes);
router.post('/:tripId/notes', validate(createNoteSchema), createNote);

// Share
router.post('/:tripId/share', shareTrip);

module.exports = router;
