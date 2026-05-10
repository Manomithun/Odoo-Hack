const { z } = require('zod');

const addTripActivitySchema = z.object({
  activityId: z.string().uuid('Invalid activity ID'),
  activityDate: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  estimatedCost: z.number().min(0).optional(),
  customNotes: z.string().optional(),
});

module.exports = { addTripActivitySchema };
