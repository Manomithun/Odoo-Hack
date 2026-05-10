const { z } = require('zod');

const createPackingItemSchema = z.object({
  itemName: z.string().min(1, 'Item name is required').max(150),
  category: z.string().max(50).optional(),
  isPacked: z.boolean().optional().default(false),
});

const updatePackingItemSchema = z.object({
  itemName: z.string().max(150).optional(),
  category: z.string().max(50).optional(),
  isPacked: z.boolean().optional(),
});

module.exports = { createPackingItemSchema, updatePackingItemSchema };
