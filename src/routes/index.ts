import { Router } from 'express';
import { successResponse } from '@/utils/helpers';
import { Request, Response } from 'express';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', (_req: Request, res: Response) => {
  const healthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env['NODE_ENV'],
    version: process.env['npm_package_version'] || '1.0.0',
    memory: {
      used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
    },
  };

  return successResponse(res, 'Service is healthy', healthData);
});

/**
 * @route   GET /api
 * @desc    API info endpoint
 * @access  Public
 */
router.get('/', (_req: Request, res: Response) => {
  const apiInfo = {
    name: 'Express TypeScript Boilerplate API',
    version: '1.0.0',
    description: 'Production-ready Express.js + TypeScript API boilerplate with Web Crawler & Vector DB',
    endpoints: {
      health: '/api/health',
      users: '/api/users',
      crawler: {
        crawl: '/api/crawler/crawl',
        preview: '/api/crawler/preview',
        analyze: '/api/crawler/analyze'
      },
      vector: {
        crawlAndStore: '/api/vector/crawl-and-store',
        preview: '/api/vector/preview',
        test: '/api/vector/test',
        indexStats: '/api/vector/index/:indexName/stats'
      }
    },
    documentation: 'Professional web crawler with vector database storage for RAG applications',
  };

  return successResponse(res, 'API information', apiInfo);
});

export default router;
