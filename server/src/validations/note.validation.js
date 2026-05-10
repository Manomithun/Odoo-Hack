const { z } = require('zod');

const createNoteSchema = z.object({
  tripStopId: z.string().uuid().optional(),
  title: z.string().max(150).optional(),
  content: z.string().min(1, 'Content is required'),
});

module.exports = { createNoteSchema };
