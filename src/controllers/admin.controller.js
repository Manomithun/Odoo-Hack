const adminService = require('../services/admin.service');
const { sendSuccess, sendPaginated } = require('../utils/response.util');

const getPlatformStats = async (req, res, next) => {
  try {
    const stats = await adminService.getPlatformStats();
    return sendSuccess(res, stats, 'Platform stats retrieved');
  } catch (err) { next(err); }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const { users, total } = await adminService.getAllUsers({ page, limit, search });
    return sendPaginated(res, users, total, page, limit, 'Users retrieved');
  } catch (err) { next(err); }
};

module.exports = { getPlatformStats, getAllUsers };
