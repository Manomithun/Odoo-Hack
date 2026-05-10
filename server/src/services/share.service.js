const shareRepo = require('../repositories/share.repository');
const tripRepo = require('../repositories/trip.repository');
const cityRepo = require('../repositories/city.repository');
const { generateShareToken } = require('../utils/helpers.util');

const shareTrip = async (tripId, userId) => {
  const trip = await tripRepo.findByIdAndUser(tripId, userId);
  if (!trip) { const err = new Error('Trip not found.'); err.statusCode = 404; throw err; }

  // Return existing share if already shared
  const existing = await shareRepo.findSharedByTripId(tripId);
  if (existing) return existing;

  const shareToken = generateShareToken();
  const shared = await shareRepo.createShared({ tripId, shareToken });

  // Update trip visibility to public
  await tripRepo.update(tripId, { visibility: 'public' });

  return shared;
};

const getSharedTrip = async (shareToken) => {
  const sharedTrip = await shareRepo.findSharedByToken(shareToken);
  if (!sharedTrip) { const err = new Error('Shared trip not found.'); err.statusCode = 404; throw err; }

  // Increment view count
  await shareRepo.incrementViewCount(shareToken);

  return sharedTrip;
};

const getSavedDestinations = async (userId) => {
  return shareRepo.findSavedByUser(userId);
};

const saveDestination = async (userId, cityId) => {
  const city = await cityRepo.findById(cityId);
  if (!city) { const err = new Error('City not found.'); err.statusCode = 404; throw err; }
  return shareRepo.createSaved({ userId, cityId });
};

const unsaveDestination = async (userId, cityId) => {
  const saved = await shareRepo.findSavedByUserAndCity(userId, cityId);
  if (!saved) { const err = new Error('Saved destination not found.'); err.statusCode = 404; throw err; }
  return shareRepo.removeSaved(userId, cityId);
};

module.exports = { shareTrip, getSharedTrip, getSavedDestinations, saveDestination, unsaveDestination };
