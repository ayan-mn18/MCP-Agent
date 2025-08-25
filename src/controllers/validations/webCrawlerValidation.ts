import Joi from 'joi';

export const crawlDocumentationSchema = Joi.object({
  url: Joi.string().uri().required().messages({
    'string.uri': 'URL must be a valid URI',
    'any.required': 'URL is required'
  }),
  maxDepth: Joi.number().integer().min(1).max(5).default(3).messages({
    'number.min': 'Maximum depth must be at least 1',
    'number.max': 'Maximum depth cannot exceed 5'
  }),
  maxPages: Joi.number().integer().min(1).max(200).default(50).messages({
    'number.min': 'Maximum pages must be at least 1',
    'number.max': 'Maximum pages cannot exceed 200'
  }),
  delay: Joi.number().integer().min(100).max(10000).default(1000).messages({
    'number.min': 'Delay must be at least 100ms',
    'number.max': 'Delay cannot exceed 10 seconds'
  }),
  includePatterns: Joi.array().items(Joi.string()).optional().messages({
    'array.base': 'Include patterns must be an array of strings'
  }),
  excludePatterns: Joi.array().items(Joi.string()).optional().messages({
    'array.base': 'Exclude patterns must be an array of strings'
  }),
  followExternalLinks: Joi.boolean().default(false).messages({
    'boolean.base': 'Follow external links must be a boolean'
  })
});

export const previewCrawlSchema = Joi.object({
  url: Joi.string().uri().required().messages({
    'string.uri': 'URL must be a valid URI',
    'any.required': 'URL is required'
  }),
  maxDepth: Joi.number().integer().min(1).max(5).default(3).messages({
    'number.min': 'Maximum depth must be at least 1',
    'number.max': 'Maximum depth cannot exceed 5'
  }),
  maxPages: Joi.number().integer().min(1).max(200).default(50).messages({
    'number.min': 'Maximum pages must be at least 1',
    'number.max': 'Maximum pages cannot exceed 200'
  }),
  followExternalLinks: Joi.boolean().default(false).messages({
    'boolean.base': 'Follow external links must be a boolean'
  })
});

export const analyzePageSchema = Joi.object({
  url: Joi.string().uri().required().messages({
    'string.uri': 'URL must be a valid URI',
    'any.required': 'URL is required'
  })
});

export const crawlCartesiaSchema = Joi.object({
  url: Joi.string().uri().default('https://docs.cartesia.ai/2024-11-13/get-started/overview').messages({
    'string.uri': 'URL must be a valid URI'
  }),
  maxDepth: Joi.number().integer().min(1).max(5).default(4).messages({
    'number.min': 'Maximum depth must be at least 1',
    'number.max': 'Maximum depth cannot exceed 5'
  }),
  maxPages: Joi.number().integer().min(1).max(200).default(100).messages({
    'number.min': 'Maximum pages must be at least 1',
    'number.max': 'Maximum pages cannot exceed 200'
  })
});
