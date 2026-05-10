const prisma = require('../config/prisma');

// ── Shared Trips ──────────────────────────────────────────────────────────────

const findSharedByTripId = (tripId) =>
  prisma.sharedTrip.findFirst({ where: { tripId } });

const findSharedByToken = (shareToken) =>
  prisma.sharedTrip.findUnique({
    where: { shareToken },
    include: {
      trip: {
        include: {
          user: { select: { fullName: true, profileImage: true } },
          tripStops: {
            orderBy: { stopOrder: 'asc' },
            include: {
              city: true,
              tripActivities: { include: { activity: true } },
            },
          },
          budgets: true,
        },
      },
    },
  });

const createShared = (data) => prisma.sharedTrip.create({ data });

const incrementViewCount = (shareToken) =>
  prisma.sharedTrip.update({
    where: { shareToken },
    data: { viewCount: { increment: 1 } },
  });

// ── Saved Destinations ────────────────────────────────────────────────────────

const findSavedByUser = (userId) =>
  prisma.savedDestination.findMany({
    where: { userId },
    include: { city: true },
    orderBy: { createdAt: 'desc' },
  });

const createSaved = (data) =>
  prisma.savedDestination.create({ data, include: { city: true } });

const findSavedByUserAndCity = (userId, cityId) =>
  prisma.savedDestination.findUnique({ where: { userId_cityId: { userId, cityId } } });

const removeSaved = (userId, cityId) =>
  prisma.savedDestination.delete({ where: { userId_cityId: { userId, cityId } } });

module.exports = {
  findSharedByTripId,
  findSharedByToken,
  createShared,
  incrementViewCount,
  findSavedByUser,
  createSaved,
  findSavedByUserAndCity,
  removeSaved,
};
