const { sendError } = require('../utils/response.util');

/**
 * Factory function - takes a Zod schema and returns validation middleware
 * @param {import('zod').ZodSchema} schema
 * @param {'body'|'query'|'params'} target
 */
const validate = (schema, target = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return sendError(res, 'Validation failed', 422, errors);
    }
    req[target] = result.data;
    next();
  };
};

module.exports = { validate };
