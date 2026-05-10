const activityRepo = require('../repositories/activity.repository');
const tripStopRepo = require('../repositories/tripStop.repository');
const tripActivityRepo = require('../repositories/tripActivity.repository');

const getCitiesActivities = async (cityId, { category, page = 1, limit = 20 }) => {
  const where = { cityId, ...(category && { category }) };
  const skip = (page - 1) * limit;

  const [activities, total] = await Promise.all([
    activityRepo.findMany({ where, skip, take: parseInt(limit), orderBy: { rating: 'desc' } }),
    activityRepo.count(where),
  ]);

  return { activities, total };
};

const addActivityToStop = async (stopId, userId, data) => {
  const stop = await tripStopRepo.findByIdWithTrip(stopId);
  if (!stop || stop.trip.userId !== userId) {
    const err = new Error('Stop not found.'); err.statusCode = 404; throw err;
  }

  return tripActivityRepo.create({
    tripStopId: stopId,
    activityId: data.activityId,
    activityDate: data.activityDate ? new Date(data.activityDate) : null,
    startTime: data.startTime,
    endTime: data.endTime,
    estimatedCost: data.estimatedCost,
    customNotes: data.customNotes,
  });
};

const removeTripActivity = async (tripActivityId, userId) => {
  const ta = await tripActivityRepo.findByIdWithStop(tripActivityId);
  if (!ta || ta.tripStop.trip.userId !== userId) {
    const err = new Error('Activity not found.'); err.statusCode = 404; throw err;
  }
  return tripActivityRepo.remove(tripActivityId);
};

module.exports = { getCitiesActivities, addActivityToStop, removeTripActivity };
