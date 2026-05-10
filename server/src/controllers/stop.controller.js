const stopService = require('../services/stop.service');
const { sendSuccess } = require('../utils/response.util');

const createStop = async (req, res, next) => {
  try {
    const stop = await stopService.createStop(req.params.tripId, req.user.id, req.body);
    return sendSuccess(res, stop, 'Stop created', 201);
  } catch (err) { next(err); }
};

const updateStop = async (req, res, next) => {
  try {
    const stop = await stopService.updateStop(req.params.id, req.user.id, req.body);
    return sendSuccess(res, stop, 'Stop updated');
  } catch (err) { next(err); }
};

const deleteStop = async (req, res, next) => {
  try {
    await stopService.deleteStop(req.params.id, req.user.id);
    return sendSuccess(res, null, 'Stop deleted');
  } catch (err) { next(err); }
};

const reorderStops = async (req, res, next) => {
  try {
    const stops = await stopService.reorderStops(req.params.tripId, req.user.id, req.body.stops);
    return sendSuccess(res, stops, 'Stops reordered');
  } catch (err) { next(err); }
};

module.exports = { createStop, updateStop, deleteStop, reorderStops };
