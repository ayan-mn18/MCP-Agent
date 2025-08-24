import { Request, Response } from 'express';
import { ApiResponse } from '@/types';

/**
 * Success response helper
 */
export const successResponse = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Error response helper
 */
export const errorResponse = (
  res: Response,
  message: string,
  statusCode = 500,
  error?: string
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response) => Promise<Response | void>
) => {
  return (req: Request, res: Response, next: (error?: Error) => void): void => {
    Promise.resolve(fn(req, res)).catch(next);
  };
};

/**
 * Generate pagination metadata
 */
export const getPaginationMeta = (
  currentPage: number,
  totalItems: number,
  itemsPerPage: number
) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

/**
 * Generate random string
 */
export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Sleep utility function
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize string for database queries
 */
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '');
};
