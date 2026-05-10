const { sendError } = require('../utils/response.util');

const errorMiddleware = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);

  // Prisma errors
  if (err.code === 'P2002') {
    return sendError(res, 'A record with this data already exists.', 409);
  }
  if (err.code === 'P2025') {
    return sendError(res, 'Record not found.', 404);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token expired.', 401);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(res, message, statusCode);
};

const notFoundMiddleware = (req, res) => {
  return sendError(res, `Route ${req.originalUrl} not found.`, 404);
};

module.exports = { errorMiddleware, notFoundMiddleware };
