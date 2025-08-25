import { Request, Response } from 'express';
import { RAGService, RAGQueryRequest, RAGSearchRequest } from '@/services/RAGService';
import { successResponse } from '@/utils/helpers';
import logger from '@/utils/logger';

export class RAGController {
  /**
   * Query documentation using RAG
   * POST /api/rag/query
   */
  static async queryRAG(req: Request, res: Response): Promise<Response> {
    try {
      logger.info('RAG query request received', { 
        query: req.body.query?.substring(0, 100) + '...', 
        namespace: req.body.namespace 
      });

      const request: RAGQueryRequest = {
        query: req.body.query,
        namespace: req.body.namespace,
        topK: req.body.topK || 5,
        includeMetadata: req.body.includeMetadata !== false,
        filter: req.body.filter,
      };

      const result = await RAGService.generateRAGAnswer(request);

      logger.info('RAG query completed successfully', {
        namespace: request.namespace,
        confidence: result.confidence,
        sourceCount: result.sources.length,
        processingTime: result.processingTime,
      });

      return successResponse(res, 'Query processed successfully', result);
    } catch (error) {
      logger.error('Error processing RAG query', error);
      throw error;
    }
  }

  /**
   * Perform semantic search across vectors
   * POST /api/rag/search
   */
  static async searchVectors(req: Request, res: Response): Promise<Response> {
    try {
      logger.info('Vector search request received', { 
        query: req.body.query?.substring(0, 100) + '...', 
        namespace: req.body.namespace 
      });

      const request: RAGSearchRequest = {
        query: req.body.query,
        namespace: req.body.namespace,
        topK: req.body.topK || 5,
        includeMetadata: req.body.includeMetadata !== false,
        filter: req.body.filter,
      };

      const result = await RAGService.performVectorSearch(request);

      logger.info('Vector search completed successfully', {
        namespace: request.namespace,
        matchCount: result.totalMatches,
        processingTime: result.processingTime,
      });

      return successResponse(res, 'Search completed successfully', result);
    } catch (error) {
      logger.error('Error performing vector search', error);
      throw error;
    }
  }

  /**
   * Get available namespaces
   * GET /api/rag/namespaces
   */
  static async getNamespaces(req: Request, res: Response): Promise<Response> {
    try {
      logger.info('Fetching available namespaces');

      const namespaces = await RAGService.getAvailableNamespaces();
      const includeStats = req.query['includeStats'] === 'true';

      let result: any = {
        namespaces,
        count: namespaces.length,
      };

      if (includeStats && namespaces.length > 0) {
        logger.info('Fetching namespace statistics');
        
        // Fetch stats for each namespace (limit to prevent timeouts)
        const limit = Math.min(parseInt(req.query['limit'] as string) || 10, namespaces.length);
        const namespacesToCheck = namespaces.slice(0, limit);
        
        const stats = await Promise.allSettled(
          namespacesToCheck.map(async (namespace) => {
            try {
              const stat = await RAGService.getNamespaceStats(namespace);
              return { namespace, ...stat };
            } catch (error) {
              logger.warn(`Failed to get stats for namespace ${namespace}`, error);
              return { namespace, error: 'Failed to fetch stats' };
            }
          })
        );

        result.namespaceStats = stats.map(stat => 
          stat.status === 'fulfilled' ? stat.value : stat.reason
        );
      }

      logger.info('Namespaces fetched successfully', { count: namespaces.length });

      return successResponse(res, 'Namespaces fetched successfully', result);
    } catch (error) {
      logger.error('Error fetching namespaces', error);
      throw error;
    }
  }

  /**
   * Get namespace statistics
   * GET /api/rag/namespaces/:namespace/stats
   */
  static async getNamespaceStats(req: Request, res: Response): Promise<Response> {
    try {
      const { namespace } = req.params;

      if (!namespace) {
        return res.status(400).json({
          success: false,
          message: 'Namespace parameter is required',
        });
      }

      logger.info('Fetching namespace statistics', { namespace });

      const stats = await RAGService.getNamespaceStats(namespace);

      logger.info('Namespace statistics fetched successfully', { 
        namespace, 
        vectorCount: stats.vectorCount 
      });

      return successResponse(res, 'Namespace statistics fetched successfully', stats);
    } catch (error) {
      logger.error('Error fetching namespace statistics', error);
      throw error;
    }
  }

  /**
   * Health check for RAG system
   * GET /api/rag/health
   */
  static async checkHealth(_req: Request, res: Response): Promise<Response> {
    try {
      logger.info('Performing RAG system health check');

      // Perform a simple test to check if services are working
      const startTime = Date.now();
      
      try {
        const namespaces = await RAGService.getAvailableNamespaces();
        const processingTime = Date.now() - startTime;

        const healthData = {
          status: 'healthy',
          services: {
            pinecone: 'operational',
            openai: 'operational',
          },
          namespaceCount: namespaces.length,
          processingTime,
          timestamp: new Date().toISOString(),
        };

        logger.info('RAG system health check passed', healthData);

        return successResponse(res, 'RAG system is healthy', healthData);
      } catch (error) {
        const healthData = {
          status: 'unhealthy',
          services: {
            pinecone: 'error',
            openai: 'unknown',
          },
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        };

        logger.error('RAG system health check failed', healthData);

        return res.status(503).json({
          success: false,
          message: 'RAG system is unhealthy',
          data: healthData,
        });
      }
    } catch (error) {
      logger.error('Error performing RAG health check', error);
      throw error;
    }
  }
}

export default RAGController;
