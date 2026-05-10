const prisma = require('../config/prisma');

const findByTrip = (tripId) =>
  prisma.budget.findMany({ where: { tripId }, orderBy: { createdAt: 'asc' } });

const findByIdWithTrip = (id) =>
  prisma.budget.findFirst({ where: { id }, include: { trip: true } });

const create = (data) => prisma.budget.create({ data });

const remove = (id) => prisma.budget.delete({ where: { id } });

module.exports = { findByTrip, findByIdWithTrip, create, remove };
