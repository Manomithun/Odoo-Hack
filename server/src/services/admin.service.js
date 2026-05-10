const userRepo = require('../repositories/user.repository');
const cityRepo = require('../repositories/city.repository');

const getPlatformStats = async () => {
  const [totalUsers, totalTrips, totalCities, totalActivities] = await Promise.all([
    userRepo.count(),
    require('../repositories/trip.repository').count(),
    cityRepo.count(),
    require('../repositories/activity.repository').count(),
  ]);

  const topCities = await cityRepo.findTopByPopularity(10);
  const recentUsers = await userRepo.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: { id: true, fullName: true, email: true, createdAt: true, isVerified: true, isAdmin: true },
  });
  const recentActivity = await userRepo.findActivityLogs({ take: 20 });

  return { totalUsers, totalTrips, totalCities, totalActivities, topCities, recentUsers, recentActivity };
};

const getAllUsers = async ({ page = 1, limit = 20, search = '' }) => {
  const where = search
    ? { OR: [{ fullName: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }] }
    : {};
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    userRepo.findMany({
      where, skip, take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      select: { id: true, fullName: true, email: true, isAdmin: true, isVerified: true, createdAt: true, _count: { select: { trips: true } } },
    }),
    userRepo.count(where),
  ]);

  return { users, total };
};

const logActivity = async (userId, action, metadata = {}) => {
  return userRepo.createActivityLog({ userId, action, metadata });
};

module.exports = { getPlatformStats, getAllUsers, logActivity };
