const prisma = require('../config/prisma');

const findByIdAndUser = (tripId, userId) =>
  prisma.trip.findFirst({ where: { id: tripId, userId } });

const findById = (tripId, include) =>
  prisma.trip.findFirst({ where: { id: tripId }, ...(include && { include }) });

const findMany = ({ where = {}, skip = 0, take = 10, orderBy = {}, include } = {}) =>
  prisma.trip.findMany({ where, skip, take, orderBy, ...(include && { include }) });

const count = (where = {}) => prisma.trip.count({ where });

const create = (data) => prisma.trip.create({ data });

const update = (id, data) => prisma.trip.update({ where: { id }, data });

const remove = (id) => prisma.trip.delete({ where: { id } });

module.exports = { findByIdAndUser, findById, findMany, count, create, update, remove };
