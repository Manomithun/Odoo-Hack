const { z } = require('zod');

const createBudgetSchema = z.object({
  category: z.string().min(1, 'Category is required').max(50),
  amount: z.number().min(0, 'Amount must be positive'),
  description: z.string().optional(),
});

const updateBudgetSchema = createBudgetSchema.partial();

module.exports = { createBudgetSchema, updateBudgetSchema };
