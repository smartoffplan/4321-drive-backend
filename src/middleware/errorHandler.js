const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const env = require('../config/env');

/**
 * Global error handling middleware.
 * Handles ApiError, Mongoose errors, and unknown errors.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  let error = err;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ');
    error = ApiError.conflict(`Duplicate value for field: ${field}`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = ApiError.badRequest('Validation failed', errors);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  // Log server errors
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${message}`, { stack: err.stack });
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: error.errors || [],
    ...(env.isDev() && { stack: err.stack }),
  });
};

module.exports = errorHandler;
