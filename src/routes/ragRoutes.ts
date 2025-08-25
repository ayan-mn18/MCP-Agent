import { Router } from 'express';
import { RAGController } from '@/controllers/RAGController';
import { validate, validateParams, validateQuery } from '@/middlewares/validation';
import { 
  ragQuerySchema, 
  ragSearchSchema, 
  namespaceParamsSchema,
  ragNamespacesQuerySchema 
} from '@/controllers/validations/ragValidation';
import { asyncHandler } from '@/utils/helpers';

const router = Router();

/**
 * @route   POST /api/rag/query
 * @desc    Query documentation using RAG (Retrieval-Augmented Generation)
 * @access  Public
 * @body    { query: string, namespace: string, topK?: number, includeMetadata?: boolean, filter?: object }
 */
router.post(
  '/query',
  validate(ragQuerySchema),
  asyncHandler(RAGController.queryRAG)
);

/**
 * @route   POST /api/rag/search
 * @desc    Perform semantic search across vectors
 * @access  Public
 * @body    { query: string, namespace: string, topK?: number, includeMetadata?: boolean, filter?: object }
 */
router.post(
  '/search',
  validate(ragSearchSchema),
  asyncHandler(RAGController.searchVectors)
);

/**
 * @route   GET /api/rag/namespaces
 * @desc    Get available namespaces
 * @access  Public
 * @query   { includeStats?: boolean, limit?: number }
 */
router.get(
  '/namespaces',
  validateQuery(ragNamespacesQuerySchema),
  asyncHandler(RAGController.getNamespaces)
);

/**
 * @route   GET /api/rag/namespaces/:namespace/stats
 * @desc    Get statistics for a specific namespace
 * @access  Public
 * @param   namespace - The namespace to get stats for
 */
router.get(
  '/namespaces/:namespace/stats',
  validateParams(namespaceParamsSchema),
  asyncHandler(RAGController.getNamespaceStats)
);

/**
 * @route   GET /api/rag/health
 * @desc    Health check for RAG system
 * @access  Public
 */
router.get(
  '/health',
  asyncHandler(RAGController.checkHealth)
);

export default router;
