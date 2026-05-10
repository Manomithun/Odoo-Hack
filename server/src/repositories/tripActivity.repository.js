const prisma = require('../config/prisma');

const findByIdWithStop = (id) =>
  prisma.tripActivity.findFirst({
    where: { id },
    include: { tripStop: { include: { trip: true } } },
  });

const create = (data) =>
  prisma.tripActivity.create({ data, include: { activity: true } });

const remove = (id) => prisma.tripActivity.delete({ where: { id } });

module.exports = { findByIdWithStop, create, remove };
