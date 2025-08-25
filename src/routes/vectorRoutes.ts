import { Router } from 'express';
import { VectorController } from '@/controllers/VectorController';
import { validate } from '@/middlewares/validation';
import { 
  crawlAndVectorizeSchema, 
  previewVectorizeSchema,
  testVectorizationSchema
} from '@/controllers/validations/vectorValidation';
import { asyncHandler } from '@/utils/helpers';

const router = Router();

/**
 * @route   POST /api/vector/crawl-and-store
 * @desc    Crawl documentation and store as vector embeddings in Pinecone
 * @access  Public
 */
router.post(
  '/crawl-and-store',
  validate(crawlAndVectorizeSchema),
  asyncHandler(VectorController.crawlAndVectorize)
);

/**
 * @route   POST /api/vector/preview
 * @desc    Preview what would be crawled and vectorized without actually processing
 * @access  Public
 */
router.post(
  '/preview',
  validate(previewVectorizeSchema),
  asyncHandler(VectorController.previewCrawlAndVectorize)
);

/**
 * @route   GET /api/vector/index/:indexName/stats
 * @desc    Get statistics about a Pinecone index
 * @access  Public
 */
router.get(
  '/index/:indexName/stats',
  asyncHandler(VectorController.getIndexStats)
);

/**
 * @route   POST /api/vector/test
 * @desc    Test vector processing with a single page (no actual storage)
 * @access  Public
 */
router.post(
  '/test',
  validate(testVectorizationSchema),
  asyncHandler(VectorController.testVectorization)
);

export default router;
