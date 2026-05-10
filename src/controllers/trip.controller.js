const tripService = require('../services/trip.service');
const { sendSuccess, sendPaginated } = require('../utils/response.util');

const getAllTrips = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', visibility } = req.query;
    const { trips, total } = await tripService.getAllTrips(req.user.id, { page, limit, search, visibility });
    return sendPaginated(res, trips, total, page, limit, 'Trips retrieved');
  } catch (err) { next(err); }
};

const getTripById = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.params.id, req.user.id);
    return sendSuccess(res, trip, 'Trip retrieved');
  } catch (err) { next(err); }
};

const createTrip = async (req, res, next) => {
  try {
    const trip = await tripService.createTrip(req.user.id, req.body);
    return sendSuccess(res, trip, 'Trip created', 201);
  } catch (err) { next(err); }
};

const updateTrip = async (req, res, next) => {
  try {
    const trip = await tripService.updateTrip(req.params.id, req.user.id, req.body);
    return sendSuccess(res, trip, 'Trip updated');
  } catch (err) { next(err); }
};

const deleteTrip = async (req, res, next) => {
  try {
    await tripService.deleteTrip(req.params.id, req.user.id);
    return sendSuccess(res, null, 'Trip deleted');
  } catch (err) { next(err); }
};

module.exports = { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip };
