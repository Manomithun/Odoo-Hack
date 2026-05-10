const activityService = require('../services/activity.service');
const { sendSuccess, sendPaginated } = require('../utils/response.util');

const getCityActivities = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    const { activities, total } = await activityService.getCitiesActivities(req.params.cityId, { category, page, limit });
    return sendPaginated(res, activities, total, page, limit, 'Activities retrieved');
  } catch (err) { next(err); }
};

const addActivityToStop = async (req, res, next) => {
  try {
    const ta = await activityService.addActivityToStop(req.params.stopId, req.user.id, req.body);
    return sendSuccess(res, ta, 'Activity added to stop', 201);
  } catch (err) { next(err); }
};

const removeTripActivity = async (req, res, next) => {
  try {
    await activityService.removeTripActivity(req.params.id, req.user.id);
    return sendSuccess(res, null, 'Activity removed');
  } catch (err) { next(err); }
};

module.exports = { getCityActivities, addActivityToStop, removeTripActivity };
