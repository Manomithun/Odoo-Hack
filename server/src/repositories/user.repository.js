const prisma = require('../config/prisma');

const findByEmail = (email) => prisma.user.findUnique({ where: { email } });

const findById = (id, select) =>
  prisma.user.findUnique({ where: { id }, ...(select && { select }) });

const create = (data, select) =>
  prisma.user.create({ data, ...(select && { select }) });

const update = (id, data, select) =>
  prisma.user.update({ where: { id }, data, ...(select && { select }) });

const count = (where = {}) => prisma.user.count({ where });

const findMany = ({ where = {}, skip = 0, take = 20, orderBy = {}, select } = {}) =>
  prisma.user.findMany({ where, skip, take, orderBy, ...(select && { select }) });

const findActivityLogs = ({ skip = 0, take = 20 } = {}) =>
  prisma.userActivityLog.findMany({
    orderBy: { createdAt: 'desc' },
    skip,
    take,
    include: { user: { select: { fullName: true, email: true } } },
  });

const createActivityLog = (data) =>
  prisma.userActivityLog.create({ data });

module.exports = {
  findByEmail,
  findById,
  create,
  update,
  count,
  findMany,
  findActivityLogs,
  createActivityLog,
};
