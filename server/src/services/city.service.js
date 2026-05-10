const cityRepo = require('../repositories/city.repository');

const getCities = async ({ search = '', country = '', page = 1, limit = 20, sortBy = 'popularity' }) => {
  const where = {
    ...(search && { cityName: { contains: search, mode: 'insensitive' } }),
    ...(country && { countryName: { contains: country, mode: 'insensitive' } }),
  };
  const orderBy =
    sortBy === 'popularity' ? { popularityScore: 'desc' }
    : sortBy === 'cost'     ? { costIndex: 'asc' }
    :                         { cityName: 'asc' };
  const skip = (page - 1) * limit;

  const [cities, total] = await Promise.all([
    cityRepo.findMany({ where, skip, take: parseInt(limit), orderBy }),
    cityRepo.count(where),
  ]);

  return { cities, total };
};

const getCityById = async (cityId) => {
  const city = await cityRepo.findById(cityId);
  if (!city) { const err = new Error('City not found.'); err.statusCode = 404; throw err; }
  return city;
};

module.exports = { getCities, getCityById };
