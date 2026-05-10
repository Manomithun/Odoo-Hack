const packingRepo = require('../repositories/packing.repository');
const tripRepo = require('../repositories/trip.repository');

const getPackingList = async (tripId, userId) => {
  const trip = await tripRepo.findByIdAndUser(tripId, userId);
  if (!trip) { const err = new Error('Trip not found.'); err.statusCode = 404; throw err; }

  const items = await packingRepo.findByTrip(tripId);
  const packed = items.filter((i) => i.isPacked).length;

  return { items, stats: { total: items.length, packed, unpacked: items.length - packed } };
};

const addItem = async (tripId, userId, data) => {
  const trip = await tripRepo.findByIdAndUser(tripId, userId);
  if (!trip) { const err = new Error('Trip not found.'); err.statusCode = 404; throw err; }
  return packingRepo.create({ tripId, ...data });
};

const updateItem = async (itemId, userId, data) => {
  const item = await packingRepo.findByIdWithTrip(itemId);
  if (!item || item.trip.userId !== userId) {
    const err = new Error('Item not found.'); err.statusCode = 404; throw err;
  }
  return packingRepo.update(itemId, data);
};

const deleteItem = async (itemId, userId) => {
  const item = await packingRepo.findByIdWithTrip(itemId);
  if (!item || item.trip.userId !== userId) {
    const err = new Error('Item not found.'); err.statusCode = 404; throw err;
  }
  return packingRepo.remove(itemId);
};

module.exports = { getPackingList, addItem, updateItem, deleteItem };
