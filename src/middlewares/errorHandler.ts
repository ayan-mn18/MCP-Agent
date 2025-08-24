import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/types';
import { errorResponse } from '@/utils/helpers';
import logger from '@/utils/logger';
import config from '@/config';

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Handle known operational errors
  if (err instanceof AppError) {
    return errorResponse(res, err.message, err.statusCode, err.message);
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return errorResponse(res, 'Validation Error', 400, err.message);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401, 'Authentication failed');
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 401, 'Authentication failed');
  }

  // Handle MongoDB/Database errors
  if (err.name === 'MongoError' || err.name === 'CastError') {
    return errorResponse(res, 'Database Error', 400, 'Invalid data format');
  }

  // Default error response
  const message = config.isDevelopment ? err.message : 'Internal Server Error';
  const statusCode = 500;

  return res.status(statusCode).json({
    success: false,
    message,
    error: config.isDevelopment ? err.stack : undefined,
  });
};

/**
 * Handle 404 not found
 */
export const notFoundHandler = (req: Request, res: Response): Response => {
  return errorResponse(
    res,
    `Route ${req.originalUrl} not found`,
    404,
    'Not Found'
  );
};
