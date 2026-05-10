const shareService = require('../services/share.service');
const { sendSuccess } = require('../utils/response.util');

const shareTrip = async (req, res, next) => {
  try {
    const shared = await shareService.shareTrip(req.params.tripId, req.user.id);
    return sendSuccess(res, shared, 'Trip shared');
  } catch (err) { next(err); }
};

const getSharedTrip = async (req, res, next) => {
  try {
    const data = await shareService.getSharedTrip(req.params.token);
    return sendSuccess(res, data, 'Shared trip retrieved');
  } catch (err) { next(err); }
};

const getSavedDestinations = async (req, res, next) => {
  try {
    const saved = await shareService.getSavedDestinations(req.user.id);
    return sendSuccess(res, saved, 'Saved destinations retrieved');
  } catch (err) { next(err); }
};

const saveDestination = async (req, res, next) => {
  try {
    const saved = await shareService.saveDestination(req.user.id, req.body.cityId);
    return sendSuccess(res, saved, 'Destination saved', 201);
  } catch (err) { next(err); }
};

const unsaveDestination = async (req, res, next) => {
  try {
    await shareService.unsaveDestination(req.user.id, req.params.cityId);
    return sendSuccess(res, null, 'Destination removed from saved');
  } catch (err) { next(err); }
};

module.exports = { shareTrip, getSharedTrip, getSavedDestinations, saveDestination, unsaveDestination };
