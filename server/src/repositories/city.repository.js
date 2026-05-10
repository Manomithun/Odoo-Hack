const prisma = require('../config/prisma');

const findMany = ({ where = {}, skip = 0, take = 20, orderBy = {} } = {}) =>
  prisma.city.findMany({ where, skip, take, orderBy });

const count = (where = {}) => prisma.city.count({ where });

const findById = (id) =>
  prisma.city.findUnique({
    where: { id },
    include: {
      activities: { orderBy: { rating: 'desc' }, take: 10 },
      _count: { select: { activities: true } },
    },
  });

const findTopByPopularity = (take = 10) =>
  prisma.city.findMany({
    orderBy: { popularityScore: 'desc' },
    take,
    include: { _count: { select: { tripStops: true, savedDestinations: true } } },
  });

module.exports = { findMany, count, findById, findTopByPopularity };
