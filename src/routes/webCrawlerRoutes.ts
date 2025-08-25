import { Router } from 'express';
import { WebCrawlerController } from '@/controllers/WebCrawlerController';
import { validate } from '@/middlewares/validation';
import { crawlDocumentationSchema, previewCrawlSchema } from '@/controllers/validations/webCrawlerValidation';
import { asyncHandler } from '@/utils/helpers';

const router = Router();

/**
 * @route   POST /api/crawler/crawl
 * @desc    Crawl a documentation website and return formatted JSON data
 * @access  Public
 */
router.post(
  '/crawl',
  validate(crawlDocumentationSchema),
  asyncHandler(WebCrawlerController.crawlDocumentation)
);

/**
 * @route   POST /api/crawler/preview
 * @desc    Preview what would be crawled without actually crawling
 * @access  Public
 */
router.post(
  '/preview',
  validate(previewCrawlSchema),
  asyncHandler(WebCrawlerController.previewCrawl)
);

/**
 * @route   POST /api/crawler/analyze
 * @desc    Analyze a single page and return its data
 * @access  Public
 */
router.post(
  '/analyze',
  asyncHandler(WebCrawlerController.analyzePage)
);



export default router;
