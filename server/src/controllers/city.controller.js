const cityService = require('../services/city.service');
const { sendSuccess, sendPaginated } = require('../utils/response.util');

const getCities = async (req, res, next) => {
  try {
    const { search, country, page = 1, limit = 20, sortBy } = req.query;
    const { cities, total } = await cityService.getCities({ search, country, page, limit, sortBy });
    return sendPaginated(res, cities, total, page, limit, 'Cities retrieved');
  } catch (err) { next(err); }
};

const getCityById = async (req, res, next) => {
  try {
    const city = await cityService.getCityById(req.params.id);
    return sendSuccess(res, city, 'City retrieved');
  } catch (err) { next(err); }
};

module.exports = { getCities, getCityById };
