const tripRepo = require('../repositories/trip.repository');

const getAllTrips = async (userId, { page = 1, limit = 10, search = '', visibility }) => {
  const where = {
    userId,
    ...(search && { title: { contains: search, mode: 'insensitive' } }),
    ...(visibility && { visibility }),
  };
  const skip = (page - 1) * limit;

  const include = {
    _count: { select: { tripStops: true } },
    tripStops: {
      include: { city: { select: { cityName: true, countryName: true } } },
      orderBy: { stopOrder: 'asc' },
      take: 3,
    },
  };

  const [trips, total] = await Promise.all([
    tripRepo.findMany({ where, skip, take: parseInt(limit), orderBy: { createdAt: 'desc' }, include }),
    tripRepo.count(where),
  ]);

  return { trips, total };
};

const getTripById = async (tripId, userId) => {
  const trip = await tripRepo.findById(tripId, {
    tripStops: {
      orderBy: { stopOrder: 'asc' },
      include: {
        city: true,
        tripActivities: { include: { activity: true } },
        tripNotes: true,
      },
    },
    budgets: { orderBy: { createdAt: 'asc' } },
    packingItems: { orderBy: { category: 'asc' } },
    tripNotes: { orderBy: { createdAt: 'desc' } },
    sharedTrips: true,
  });

  if (!trip || trip.userId !== userId) {
    const err = new Error('Trip not found.'); err.statusCode = 404; throw err;
  }
  return trip;
};

const createTrip = async (userId, data) => {
  return tripRepo.create({
    userId,
    ...data,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
  });
};

const updateTrip = async (tripId, userId, data) => {
  const trip = await tripRepo.findByIdAndUser(tripId, userId);
  if (!trip) { const err = new Error('Trip not found.'); err.statusCode = 404; throw err; }

  const updateData = { ...data };
  if (data.startDate) updateData.startDate = new Date(data.startDate);
  if (data.endDate) updateData.endDate = new Date(data.endDate);

  return tripRepo.update(tripId, updateData);
};

const deleteTrip = async (tripId, userId) => {
  const trip = await tripRepo.findByIdAndUser(tripId, userId);
  if (!trip) { const err = new Error('Trip not found.'); err.statusCode = 404; throw err; }
  return tripRepo.remove(tripId);
};

module.exports = { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip };
