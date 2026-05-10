const prisma = require('../config/prisma');

const findMany = ({ where = {}, skip = 0, take = 20, orderBy = {} } = {}) =>
  prisma.activity.findMany({ where, skip, take, orderBy });

const count = (where = {}) => prisma.activity.count({ where });

module.exports = { findMany, count };
