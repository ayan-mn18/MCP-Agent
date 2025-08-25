import Joi from 'joi';

/**
 * Validation schema for crawl and vectorize endpoint
 */
export const crawlAndVectorizeSchema = Joi.object({
  url: Joi.string().uri().required()
    .messages({
      'string.uri': 'Please provide a valid URL',
      'any.required': 'URL is required'
    }),
  
  maxDepth: Joi.number().integer().min(1).max(10).default(3)
    .messages({
      'number.min': 'maxDepth must be at least 1',
      'number.max': 'maxDepth cannot exceed 10'
    }),
  
  maxPages: Joi.number().integer().min(1).max(1000).default(50)
    .messages({
      'number.min': 'maxPages must be at least 1',
      'number.max': 'maxPages cannot exceed 1000'
    }),
  
  delay: Joi.number().integer().min(100).max(10000).default(1000)
    .messages({
      'number.min': 'Delay must be at least 100ms',
      'number.max': 'Delay cannot exceed 10 seconds'
    }),
  
  excludePatterns: Joi.array().items(Joi.string()).optional(),
  includePatterns: Joi.array().items(Joi.string()).optional(),
  followExternalLinks: Joi.boolean().default(false),
  
  // Vector-specific options
  indexName: Joi.string().pattern(/^[a-z0-9-]+$/).min(1).max(45).optional()
    .messages({
      'string.pattern.base': 'Index name must contain only lowercase letters, numbers, and hyphens',
      'string.min': 'Index name must be at least 1 character',
      'string.max': 'Index name cannot exceed 45 characters'
    }),
  
  namespace: Joi.string().pattern(/^[a-zA-Z0-9_-]+$/).min(1).max(100).optional()
    .messages({
      'string.pattern.base': 'Namespace must contain only letters, numbers, underscores, and hyphens',
      'string.min': 'Namespace must be at least 1 character',
      'string.max': 'Namespace cannot exceed 100 characters'
    }),
  
  chunkSize: Joi.number().integer().min(100).max(8000).default(1000)
    .messages({
      'number.min': 'Chunk size must be at least 100 tokens',
      'number.max': 'Chunk size cannot exceed 8000 tokens'
    }),
  
  chunkOverlap: Joi.number().integer().min(0).max(500).default(200)
    .messages({
      'number.min': 'Chunk overlap cannot be negative',
      'number.max': 'Chunk overlap cannot exceed 500 tokens'
    }),
  
  metadataFields: Joi.array().items(
    Joi.string().valid(
      'description', 'author', 'language', 'canonical', 
      'section', 'headingLevel', 'domain', 'pageDepth'
    )
  ).optional()
});

/**
 * Validation schema for preview endpoint
 */
export const previewVectorizeSchema = Joi.object({
  url: Joi.string().uri().required()
    .messages({
      'string.uri': 'Please provide a valid URL',
      'any.required': 'URL is required'
    }),
  
  maxDepth: Joi.number().integer().min(1).max(10).default(3),
  maxPages: Joi.number().integer().min(1).max(1000).default(50),
  chunkSize: Joi.number().integer().min(100).max(8000).default(1000),
  chunkOverlap: Joi.number().integer().min(0).max(500).default(200),
  indexName: Joi.string().pattern(/^[a-z0-9-]+$/).min(1).max(45).optional(),
  namespace: Joi.string().pattern(/^[a-zA-Z0-9_-]+$/).min(1).max(100).optional()
});

/**
 * Validation schema for index stats endpoint
 */
export const indexStatsSchema = Joi.object({
  indexName: Joi.string().pattern(/^[a-z0-9-]+$/).min(1).max(45).required()
    .messages({
      'string.pattern.base': 'Index name must contain only lowercase letters, numbers, and hyphens',
      'any.required': 'Index name is required'
    })
});

/**
 * Validation schema for test vectorization endpoint
 */
export const testVectorizationSchema = Joi.object({
  url: Joi.string().uri().required()
    .messages({
      'string.uri': 'Please provide a valid URL',
      'any.required': 'URL is required'
    }),
  
  indexName: Joi.string().pattern(/^[a-z0-9-]+$/).min(1).max(45).optional(),
  namespace: Joi.string().pattern(/^[a-zA-Z0-9_-]+$/).min(1).max(100).optional()
});
