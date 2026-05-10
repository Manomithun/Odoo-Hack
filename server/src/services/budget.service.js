const budgetRepo = require('../repositories/budget.repository');
const tripRepo = require('../repositories/trip.repository');

const getBudget = async (tripId, userId) => {
  const trip = await tripRepo.findByIdAndUser(tripId, userId);
  if (!trip) { const err = new Error('Trip not found.'); err.statusCode = 404; throw err; }

  const budgets = await budgetRepo.findByTrip(tripId);
  const total = budgets.reduce((sum, b) => sum + parseFloat(b.amount), 0);
  const byCategory = budgets.reduce((acc, b) => {
    if (!acc[b.category]) acc[b.category] = 0;
    acc[b.category] += parseFloat(b.amount);
    return acc;
  }, {});

  return { budgets, total, byCategory };
};

const addBudgetEntry = async (tripId, userId, data) => {
  const trip = await tripRepo.findByIdAndUser(tripId, userId);
  if (!trip) { const err = new Error('Trip not found.'); err.statusCode = 404; throw err; }

  const entry = await budgetRepo.create({ tripId, ...data });

  // Recalculate and persist total
  const all = await budgetRepo.findByTrip(tripId);
  const newTotal = all.reduce((sum, b) => sum + parseFloat(b.amount), 0);
  await tripRepo.update(tripId, { totalEstimatedBudget: newTotal });

  return entry;
};

const deleteBudgetEntry = async (budgetId, userId) => {
  const entry = await budgetRepo.findByIdWithTrip(budgetId);
  if (!entry || entry.trip.userId !== userId) {
    const err = new Error('Budget entry not found.'); err.statusCode = 404; throw err;
  }
  await budgetRepo.remove(budgetId);

  // Recalculate and persist total
  const all = await budgetRepo.findByTrip(entry.tripId);
  const newTotal = all.reduce((sum, b) => sum + parseFloat(b.amount), 0);
  await tripRepo.update(entry.tripId, { totalEstimatedBudget: newTotal });
};

module.exports = { getBudget, addBudgetEntry, deleteBudgetEntry };
