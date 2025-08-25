import Joi from 'joi';

export const ragQuerySchema = Joi.object({
  query: Joi.string().min(1).max(1000).required().messages({
    'string.min': 'Query cannot be empty',
    'string.max': 'Query cannot exceed 1000 characters',
    'any.required': 'Query is required'
  }),
  namespace: Joi.string().min(1).max(50).required().messages({
    'string.min': 'Namespace cannot be empty',
    'string.max': 'Namespace cannot exceed 50 characters',
    'any.required': 'Namespace is required'
  }),
  topK: Joi.number().integer().min(1).max(20).default(5).messages({
    'number.min': 'topK must be at least 1',
    'number.max': 'topK cannot exceed 20',
    'number.integer': 'topK must be an integer'
  }),
  includeMetadata: Joi.boolean().default(true),
  filter: Joi.object().unknown(true).optional().messages({
    'object.base': 'Filter must be a valid object'
  })
});

export const ragSearchSchema = Joi.object({
  query: Joi.string().min(1).max(1000).required().messages({
    'string.min': 'Query cannot be empty',
    'string.max': 'Query cannot exceed 1000 characters',
    'any.required': 'Query is required'
  }),
  namespace: Joi.string().min(1).max(50).required().messages({
    'string.min': 'Namespace cannot be empty',
    'string.max': 'Namespace cannot exceed 50 characters',
    'any.required': 'Namespace is required'
  }),
  topK: Joi.number().integer().min(1).max(20).default(5).messages({
    'number.min': 'topK must be at least 1',
    'number.max': 'topK cannot exceed 20',
    'number.integer': 'topK must be an integer'
  }),
  includeMetadata: Joi.boolean().default(true),
  filter: Joi.object().unknown(true).optional().messages({
    'object.base': 'Filter must be a valid object'
  })
});

export const namespaceParamsSchema = Joi.object({
  namespace: Joi.string().min(1).max(50).required().messages({
    'string.min': 'Namespace cannot be empty',
    'string.max': 'Namespace cannot exceed 50 characters',
    'any.required': 'Namespace is required'
  })
});

export const ragNamespacesQuerySchema = Joi.object({
  includeStats: Joi.boolean().default(false),
  limit: Joi.number().integer().min(1).max(100).default(50).messages({
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit cannot exceed 100',
    'number.integer': 'Limit must be an integer'
  })
});
