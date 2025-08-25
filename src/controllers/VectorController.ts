import { Request, Response } from 'express';
import { WebCrawlerService } from '@/services/WebCrawlerService';
import { VectorService } from '@/services/VectorService';
import { successResponse } from '@/utils/helpers';
import { VectorCrawlRequest } from '@/types';
import logger from '@/utils/logger';

export class VectorController {
  /**
   * Crawl documentation and store as vector embeddings in Pinecone
   */
  static async crawlAndVectorize(req: Request, res: Response): Promise<Response> {
    try {
      const vectorCrawlRequest: VectorCrawlRequest = req.body;
      
      logger.info('Starting crawl and vectorization process', {
        url: vectorCrawlRequest.url,
        maxDepth: vectorCrawlRequest.maxDepth,
        maxPages: vectorCrawlRequest.maxPages,
        indexName: vectorCrawlRequest.indexName,
        namespace: vectorCrawlRequest.namespace
      });

      // Step 1: Crawl the documentation
      const crawlResult = await WebCrawlerService.crawlDocumentation(vectorCrawlRequest);
      
      if (!crawlResult.success || !crawlResult.data?.pages?.length) {
        return res.status(400).json({
          success: false,
          message: 'Failed to crawl pages or no pages found',
          data: crawlResult.data
        });
      }

      logger.info('Crawling completed, starting vectorization', {
        pagesFound: crawlResult.data.pages.length,
        totalWords: crawlResult.data.summary.totalWords
      });

      // Step 2: Process and store as vectors
      const vectorResult = await VectorService.crawlAndStore(
        crawlResult.data.pages,
        vectorCrawlRequest
      );

      // Combine the results
      const combinedResult = {
        ...vectorResult.data,
        crawlSummary: crawlResult.data.summary
      };

      return successResponse(
        res, 
        `Successfully crawled ${crawlResult.data.pages.length} pages and stored ${vectorResult.data.vectorsStored} vectors`, 
        combinedResult, 
        200
      );

    } catch (error) {
      logger.error('Error in crawl and vectorization process', error);
      
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        data: null
      });
    }
  }

  /**
   * Get statistics about a Pinecone index
   */
  static async getIndexStats(req: Request, res: Response): Promise<Response> {
    try {
      const { indexName } = req.params;
      
      if (!indexName) {
        return res.status(400).json({
          success: false,
          message: 'Index name is required',
          data: null
        });
      }

      const stats = await VectorService.getIndexStats(indexName);
      
      return successResponse(
        res,
        'Index statistics retrieved successfully',
        stats,
        200
      );

    } catch (error) {
      logger.error('Error getting index stats', error);
      
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get index statistics',
        data: null
      });
    }
  }

  /**
   * Preview what would be crawled and vectorized
   */
  static async previewCrawlAndVectorize(req: Request, res: Response): Promise<Response> {
    try {
      const vectorCrawlRequest: VectorCrawlRequest = req.body;
      
      // Get crawl preview
      const crawlPreview = await WebCrawlerService.previewCrawl(vectorCrawlRequest);
      
      // Estimate vector requirements
      const estimatedChunks = Math.ceil(crawlPreview.estimatedPages * 2000 / (vectorCrawlRequest.chunkSize || 1000));
      const estimatedTokens = estimatedChunks * (vectorCrawlRequest.chunkSize || 1000);
      const estimatedCost = (estimatedTokens / 1000) * 0.0001; // Rough OpenAI pricing estimate
      
      const preview = {
        crawl: crawlPreview,
        vectorization: {
          estimatedChunks,
          estimatedTokens,
          estimatedCost: Math.round(estimatedCost * 10000) / 10000, // Round to 4 decimal places
          chunkSize: vectorCrawlRequest.chunkSize || 1000,
          chunkOverlap: vectorCrawlRequest.chunkOverlap || 200,
          indexName: vectorCrawlRequest.indexName || 'default',
          namespace: vectorCrawlRequest.namespace || 'default'
        }
      };

      return successResponse(
        res,
        'Crawl and vectorization preview generated successfully',
        preview,
        200
      );

    } catch (error) {
      logger.error('Error generating preview', error);
      
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to generate preview',
        data: null
      });
    }
  }

  /**
   * Test vector processing with a small sample
   */
  static async testVectorization(req: Request, res: Response): Promise<Response> {
    try {
      const { url, indexName, namespace } = req.body;
      
      if (!url) {
        return res.status(400).json({
          success: false,
          message: 'URL is required for testing',
          data: null
        });
      }

      // Crawl just one page for testing
      const testCrawlRequest: VectorCrawlRequest = {
        url,
        maxDepth: 1,
        maxPages: 1,
        delay: 500,
        indexName,
        namespace,
        chunkSize: 500, // Smaller chunks for testing
        chunkOverlap: 50
      };

      const crawlResult = await WebCrawlerService.crawlDocumentation(testCrawlRequest);
      
      if (!crawlResult.success || !crawlResult.data?.pages?.length) {
        return res.status(400).json({
          success: false,
          message: 'Failed to crawl test page',
          data: crawlResult.data
        });
      }

      // Process just the chunks without storing (for testing)
      const chunks = VectorService.processIntoChunks(
        crawlResult.data.pages,
        testCrawlRequest.chunkSize,
        testCrawlRequest.chunkOverlap
      );

      const testResult = {
        page: {
          url: crawlResult.data.pages[0]?.url || '',
          title: crawlResult.data.pages[0]?.title || '',
          wordCount: crawlResult.data.pages[0]?.metadata?.wordCount || 0
        },
        chunks: {
          totalChunks: chunks.length,
          sampleChunk: chunks[0] ? {
            content: chunks[0].content.substring(0, 200) + '...',
            wordCount: chunks[0].metadata.wordCount,
            metadata: {
              chunkIndex: chunks[0].metadata.chunkIndex,
              totalChunks: chunks[0].metadata.totalChunks,
              section: chunks[0].metadata.section
            }
          } : null
        },
        estimatedVectors: chunks.length,
        estimatedTokens: chunks.reduce((sum, chunk) => sum + chunk.metadata.wordCount, 0)
      };

      return successResponse(
        res,
        'Vector processing test completed successfully',
        testResult,
        200
      );

    } catch (error) {
      logger.error('Error in vector test', error);
      
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Vector test failed',
        data: null
      });
    }
  }
}

export default VectorController;
