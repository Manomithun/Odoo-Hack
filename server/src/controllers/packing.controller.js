const packingService = require('../services/packing.service');
const { sendSuccess } = require('../utils/response.util');

const getPackingList = async (req, res, next) => {
  try {
    const data = await packingService.getPackingList(req.params.tripId, req.user.id);
    return sendSuccess(res, data, 'Packing list retrieved');
  } catch (err) { next(err); }
};

const addItem = async (req, res, next) => {
  try {
    const item = await packingService.addItem(req.params.tripId, req.user.id, req.body);
    return sendSuccess(res, item, 'Packing item added', 201);
  } catch (err) { next(err); }
};

const updateItem = async (req, res, next) => {
  try {
    const item = await packingService.updateItem(req.params.id, req.user.id, req.body);
    return sendSuccess(res, item, 'Packing item updated');
  } catch (err) { next(err); }
};

const deleteItem = async (req, res, next) => {
  try {
    await packingService.deleteItem(req.params.id, req.user.id);
    return sendSuccess(res, null, 'Packing item deleted');
  } catch (err) { next(err); }
};

module.exports = { getPackingList, addItem, updateItem, deleteItem };
