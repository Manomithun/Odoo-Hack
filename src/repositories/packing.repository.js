const prisma = require('../config/prisma');

const findByTrip = (tripId) =>
  prisma.packingItem.findMany({
    where: { tripId },
    orderBy: [{ category: 'asc' }, { itemName: 'asc' }],
  });

const findByIdWithTrip = (id) =>
  prisma.packingItem.findFirst({ where: { id }, include: { trip: true } });

const create = (data) => prisma.packingItem.create({ data });

const update = (id, data) => prisma.packingItem.update({ where: { id }, data });

const remove = (id) => prisma.packingItem.delete({ where: { id } });

module.exports = { findByTrip, findByIdWithTrip, create, update, remove };
