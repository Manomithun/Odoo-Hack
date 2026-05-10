const { z } = require('zod');

const createTripSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  startDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid start date'),
  endDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid end date'),
  coverImage: z.string().optional(),
  totalEstimatedBudget: z.number().min(0).optional(),
  visibility: z.enum(['private', 'public']).default('private'),
});

const updateTripSchema = createTripSchema.partial();

module.exports = { createTripSchema, updateTripSchema };
