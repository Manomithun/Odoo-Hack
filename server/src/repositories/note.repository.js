const prisma = require('../config/prisma');

const findByTrip = (tripId) =>
  prisma.tripNote.findMany({
    where: { tripId },
    include: { tripStop: { include: { city: { select: { cityName: true } } } } },
    orderBy: { createdAt: 'desc' },
  });

const findByIdWithTrip = (id) =>
  prisma.tripNote.findFirst({ where: { id }, include: { trip: true } });

const create = (data) =>
  prisma.tripNote.create({ data, include: { tripStop: { include: { city: true } } } });

const remove = (id) => prisma.tripNote.delete({ where: { id } });

module.exports = { findByTrip, findByIdWithTrip, create, remove };
