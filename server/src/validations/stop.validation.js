const { z } = require('zod');

const createStopSchema = z.object({
  cityId: z.string().uuid('Invalid city ID'),
  arrivalDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid arrival date'),
  departureDate: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid departure date'),
  stopOrder: z.number().int().min(0),
  notes: z.string().optional(),
});

const updateStopSchema = createStopSchema.partial();

const reorderStopsSchema = z.object({
  stops: z.array(z.object({ id: z.string().uuid(), stopOrder: z.number().int() })),
});

module.exports = { createStopSchema, updateStopSchema, reorderStopsSchema };
