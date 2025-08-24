import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { errorResponse } from '@/utils/helpers';

/**
 * Validation middleware factory
 */
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details[0]?.message || 'Validation failed';
      return errorResponse(res, errorMessage, 400, 'Validation Error');
    }
    
    next();
  };
};

/**
 * Query validation middleware factory
 */
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    const { error } = schema.validate(req.query);
    
    if (error) {
      const errorMessage = error.details[0]?.message || 'Query validation failed';
      return errorResponse(res, errorMessage, 400, 'Validation Error');
    }
    
    next();
  };
};

/**
 * Params validation middleware factory
 */
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    const { error } = schema.validate(req.params);
    
    if (error) {
      const errorMessage = error.details[0]?.message || 'Params validation failed';
      return errorResponse(res, errorMessage, 400, 'Validation Error');
    }
    
    next();
  };
};
