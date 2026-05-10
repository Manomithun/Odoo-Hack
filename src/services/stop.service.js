const tripStopRepo = require('../repositories/tripStop.repository');
const tripRepo = require('../repositories/trip.repository');

const createStop = async (tripId, userId, data) => {
  const trip = await tripRepo.findByIdAndUser(tripId, userId);
  if (!trip) { const err = new Error('Trip not found.'); err.statusCode = 404; throw err; }

  return tripStopRepo.create({
    tripId,
    cityId: data.cityId,
    arrivalDate: new Date(data.arrivalDate),
    departureDate: new Date(data.departureDate),
    stopOrder: data.stopOrder,
    notes: data.notes,
  });
};

const updateStop = async (stopId, userId, data) => {
  const stop = await tripStopRepo.findByIdWithTrip(stopId);
  if (!stop || stop.trip.userId !== userId) {
    const err = new Error('Stop not found.'); err.statusCode = 404; throw err;
  }

  const updateData = { ...data };
  if (data.arrivalDate) updateData.arrivalDate = new Date(data.arrivalDate);
  if (data.departureDate) updateData.departureDate = new Date(data.departureDate);

  return tripStopRepo.update(stopId, updateData);
};

const deleteStop = async (stopId, userId) => {
  const stop = await tripStopRepo.findByIdWithTrip(stopId);
  if (!stop || stop.trip.userId !== userId) {
    const err = new Error('Stop not found.'); err.statusCode = 404; throw err;
  }
  return tripStopRepo.remove(stopId);
};

const reorderStops = async (tripId, userId, stops) => {
  const trip = await tripRepo.findByIdAndUser(tripId, userId);
  if (!trip) { const err = new Error('Trip not found.'); err.statusCode = 404; throw err; }

  await Promise.all(stops.map(({ id, stopOrder }) => tripStopRepo.updateOrder(id, stopOrder)));
  return tripStopRepo.findManyByTrip(tripId);
};

module.exports = { createStop, updateStop, deleteStop, reorderStops };
