const prisma = require('../config/prisma');

const findByIdWithTrip = (id) =>
  prisma.tripStop.findFirst({ where: { id }, include: { trip: true } });

const create = (data) =>
  prisma.tripStop.create({ data, include: { city: true } });

const update = (id, data) =>
  prisma.tripStop.update({ where: { id }, data, include: { city: true } });

const remove = (id) => prisma.tripStop.delete({ where: { id } });

const findManyByTrip = (tripId) =>
  prisma.tripStop.findMany({
    where: { tripId },
    orderBy: { stopOrder: 'asc' },
    include: { city: true },
  });

const updateOrder = (id, stopOrder) =>
  prisma.tripStop.update({ where: { id }, data: { stopOrder } });

module.exports = { findByIdWithTrip, create, update, remove, findManyByTrip, updateOrder };
