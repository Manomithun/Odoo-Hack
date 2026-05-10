const budgetService = require('../services/budget.service');
const { sendSuccess } = require('../utils/response.util');

const getBudget = async (req, res, next) => {
  try {
    const data = await budgetService.getBudget(req.params.tripId, req.user.id);
    return sendSuccess(res, data, 'Budget retrieved');
  } catch (err) { next(err); }
};

const addBudgetEntry = async (req, res, next) => {
  try {
    const entry = await budgetService.addBudgetEntry(req.params.tripId, req.user.id, req.body);
    return sendSuccess(res, entry, 'Budget entry added', 201);
  } catch (err) { next(err); }
};

const deleteBudgetEntry = async (req, res, next) => {
  try {
    await budgetService.deleteBudgetEntry(req.params.id, req.user.id);
    return sendSuccess(res, null, 'Budget entry deleted');
  } catch (err) { next(err); }
};

module.exports = { getBudget, addBudgetEntry, deleteBudgetEntry };
