import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import config from '@/config';
import logger from '@/utils/logger';
import { 
  CrawledPage, 
  TextChunk, 
  VectorEmbedding, 
  VectorStoreResult,
  VectorCrawlRequest,
  VectorServiceConfig,
  AppError
} from '@/types';

export class VectorService {
  private static pinecone: Pinecone | null = null;
  private static openai: OpenAI | null = null;
  
  private static readonly defaultConfig: VectorServiceConfig = {
    chunkSize: 1000,
    chunkOverlap: 200,
    embeddingModel: 'text-embedding-3-small',
    embeddingDimensions: 512, // Match Pinecone index dimension
    maxRetries: 3,
    batchSize: 100
  };

  /**
   * Initialize Pinecone client
   */
  private static async initializePinecone(): Promise<Pinecone> {
    if (!this.pinecone) {
      if (!config.pinecone.apiKey) {
        throw new AppError('Pinecone API key is required', 500);
      }

      this.pinecone = new Pinecone({
        apiKey: config.pinecone.apiKey
      });

      logger.info('Pinecone client initialized');
    }
    return this.pinecone;
  }

  /**
   * Initialize OpenAI client
   */
  private static async initializeOpenAI(): Promise<OpenAI> {
    if (!this.openai) {
      if (!config.openai.apiKey) {
        throw new AppError('OpenAI API key is required', 500);
      }

      this.openai = new OpenAI({
        apiKey: config.openai.apiKey
      });

      logger.info('OpenAI client initialized');
    }
    return this.openai;
  }

  /**
   * Process crawled pages into text chunks
   */
  static processIntoChunks(
    pages: CrawledPage[], 
    chunkSize = this.defaultConfig.chunkSize,
    chunkOverlap = this.defaultConfig.chunkOverlap
  ): TextChunk[] {
    const chunks: TextChunk[] = [];

    for (const page of pages) {
      try {
        const url = new URL(page.url);
        const domain = url.hostname;
        
        // Combine title and content for chunking
        const fullText = `${page.title}\n\n${page.content}`;
        
        // Simple text chunking (can be enhanced with more sophisticated methods)
        const pageChunks = this.chunkText(fullText, chunkSize, chunkOverlap);
        
        pageChunks.forEach((chunkContent, index) => {
          // Find relevant heading for this chunk
          const chunkPosition = index * (chunkSize - chunkOverlap);
          const relevantHeading = this.findRelevantHeading(page, chunkPosition);
          
          const chunk: TextChunk = {
            content: chunkContent,
            metadata: {
              url: page.url,
              title: page.title,
              chunkIndex: index,
              totalChunks: pageChunks.length,
              wordCount: chunkContent.split(/\s+/).length,
              ...(relevantHeading?.text && { section: relevantHeading.text }),
              ...(relevantHeading?.level && { headingLevel: relevantHeading.level }),
              pageDepth: page.depth,
              domain,
              crawledAt: page.crawledAt.toISOString(),
              ...(page.metadata.description && { description: page.metadata.description }),
              ...(page.metadata.language && { language: page.metadata.language }),
              ...(page.metadata.author && { author: page.metadata.author }),
              ...(page.metadata.canonical && { canonical: page.metadata.canonical })
            }
          };
          
          chunks.push(chunk);
        });

        logger.debug('Processed page into chunks', {
          url: page.url,
          chunks: pageChunks.length,
          wordCount: page.metadata.wordCount
        });

      } catch (error) {
        logger.error('Error processing page into chunks', {
          url: page.url,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    logger.info('Text chunking completed', {
      totalPages: pages.length,
      totalChunks: chunks.length,
      avgChunksPerPage: Math.round((chunks.length / pages.length) * 100) / 100
    });

    return chunks;
  }

  /**
   * Simple text chunking with overlap
   */
  private static chunkText(text: string, chunkSize: number, overlap: number): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    
    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const chunk = words.slice(i, i + chunkSize).join(' ');
      if (chunk.trim()) {
        chunks.push(chunk.trim());
      }
    }
    
    return chunks.length > 0 ? chunks : [text]; // Fallback for very short texts
  }

  /**
   * Find the most relevant heading for a text chunk position
   */
  private static findRelevantHeading(page: CrawledPage, _position: number): { text: string; level: number } | undefined {
    // This is a simplified implementation
    // In practice, you'd want to track heading positions in the original text
    const { headings } = page.metadata;
    if (headings.length === 0) {
      return undefined;
    }
    
    // For now, return the first heading as a fallback
    // TODO: Implement proper heading-to-chunk mapping based on text positions
    return headings[0];
  }

  /**
   * Generate embeddings for text chunks
   */
  static async generateEmbeddings(
    chunks: TextChunk[],
    model = this.defaultConfig.embeddingModel
  ): Promise<VectorEmbedding[]> {
    const openai = await this.initializeOpenAI();
    const embeddings: VectorEmbedding[] = [];
    const { batchSize } = this.defaultConfig;
    
    logger.info('Starting embedding generation', {
      totalChunks: chunks.length,
      model,
      batchSize
    });

    try {
      // Process chunks in batches to avoid rate limits
      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const batchTexts = batch.map(chunk => chunk.content);

        logger.debug('Processing embedding batch', {
          batchNumber: Math.floor(i / batchSize) + 1,
          batchSize: batch.length,
          totalBatches: Math.ceil(chunks.length / batchSize)
        });

        const response = await openai.embeddings.create({
          model,
          input: batchTexts,
          encoding_format: 'float',
          dimensions: this.defaultConfig.embeddingDimensions // Truncate to match index
        });

        // Create vector embeddings
        batch.forEach((chunk, index) => {
          const embedding = response.data[index];
          if (embedding && embedding.embedding && Array.isArray(embedding.embedding)) {
            const vectorId = this.generateVectorId(chunk);
            
            // Validate vector ID format (Pinecone requirements)
            if (!vectorId || vectorId.length > 512) {
              logger.warn('Invalid vector ID generated', { vectorId, chunkUrl: chunk.metadata.url });
              return;
            }
            
            // Validate embedding dimensions
            if (embedding.embedding.length !== this.defaultConfig.embeddingDimensions) {
              logger.warn('Embedding dimension mismatch', {
                expected: this.defaultConfig.embeddingDimensions,
                actual: embedding.embedding.length,
                vectorId
              });
            }
            
            const vectorEmbedding: VectorEmbedding = {
              id: vectorId,
              values: embedding.embedding,
              metadata: {
                ...chunk.metadata,
                content: chunk.content.substring(0, 40000) // Pinecone metadata limit
              }
            };
            
            embeddings.push(vectorEmbedding);
            
            logger.debug('Created vector embedding', {
              id: vectorId,
              valuesLength: embedding.embedding.length,
              metadataSize: JSON.stringify(vectorEmbedding.metadata).length
            });
          } else {
            logger.warn('Invalid embedding response', { 
              embeddingExists: !!embedding,
              hasEmbedding: !!embedding?.embedding,
              isArray: Array.isArray(embedding?.embedding),
              chunkIndex: index 
            });
          }
        });

        // Rate limiting - wait between batches
        if (i + batchSize < chunks.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      logger.info('Embedding generation completed', {
        totalEmbeddings: embeddings.length,
        model,
        dimensions: embeddings[0]?.values.length || 0
      });

      return embeddings;

    } catch (error) {
      logger.error('Error generating embeddings', error);
      throw new AppError('Failed to generate embeddings', 500);
    }
  }

  /**
   * Generate a unique vector ID
   */
  private static generateVectorId(chunk: TextChunk): string {
    const url = new URL(chunk.metadata.url);
    const cleanHostname = url.hostname.replace(/[^a-zA-Z0-9]/g, '_');
    const cleanPath = url.pathname.replace(/[^a-zA-Z0-9]/g, '_');
    
    // Create a base ID
    const baseId = `${cleanHostname}${cleanPath}_chunk_${chunk.metadata.chunkIndex}`;
    
    // Add timestamp for uniqueness, but keep ID length reasonable
    const timestamp = Date.now().toString().slice(-8); // Last 8 digits
    const vectorId = `${baseId}_${timestamp}`;
    
    // Ensure ID meets Pinecone requirements (max 512 chars, alphanumeric + underscore/hyphen)
    return vectorId.substring(0, 512).replace(/[^a-zA-Z0-9_-]/g, '_');
  }

  /**
   * Store vectors in Pinecone
   */
  static async storeVectors(
    embeddings: VectorEmbedding[],
    indexName: string,
    namespace?: string
  ): Promise<void> {
    const pinecone = await this.initializePinecone();

    logger.info('embeddings', { embeddings: embeddings.length });
    
    try {
      const index = pinecone.index(indexName);
      const batchSize = 100; // Pinecone batch limit
      
      logger.info('Starting vector storage', {
        indexName,
        namespace,
        totalVectors: embeddings.length,
        batchSize
      });

      // Store vectors in batches
      for (let i = 0; i < embeddings.length; i += batchSize) {
        const batch = embeddings.slice(i, i + batchSize);

        // Debug: Log the batch structure before sending to Pinecone (safe logging)
        try {
          const sampleVector = batch[0];
          logger.debug('Preparing vector batch for Pinecone', {
            batchNumber: Math.floor(i / batchSize) + 1,
            batchSize: batch.length,
            totalBatches: Math.ceil(embeddings.length / batchSize),
            sampleVector: sampleVector ? {
              id: sampleVector.id?.substring(0, 50) + '...', // Truncate long IDs
              valuesLength: Array.isArray(sampleVector.values) ? sampleVector.values.length : 'invalid',
              metadataKeys: sampleVector.metadata ? Object.keys(sampleVector.metadata).slice(0, 10) : [], // Limit metadata keys
              hasValidId: !!sampleVector.id,
              hasValidValues: Array.isArray(sampleVector.values) && sampleVector.values.length > 0
            } : 'No sample vector'
          });
        } catch (logError) {
          logger.warn('Failed to log batch debug info', { error: logError instanceof Error ? logError.message : 'Unknown log error' });
        }

        // Validate batch before sending
        const validatedBatch = batch.map(vector => {
          if (!vector.id || !Array.isArray(vector.values) || vector.values.length === 0) {
            throw new AppError(`Invalid vector format: ${JSON.stringify({ id: vector.id, valuesLength: vector.values?.length })}`, 400);
          }
          return {
            id: vector.id,
            values: vector.values,
            metadata: vector.metadata || {}
          };
        });
        
        try {
          logger.info('Attempting Pinecone upsert', {
            batchNumber: Math.floor(i / batchSize) + 1,
            batchSize: validatedBatch.length,
            indexName,
            namespace,
            sampleVectorId: validatedBatch[0]?.id,
            vectorDimensions: validatedBatch[0]?.values?.length
          });
          
          if (namespace) {
            await index.namespace(namespace).upsert(validatedBatch);
          } else {
            await index.upsert(validatedBatch);
          }
          
          logger.debug('Successfully stored vector batch', {
            batchNumber: Math.floor(i / batchSize) + 1,
            batchSize: batch.length,
            totalBatches: Math.ceil(embeddings.length / batchSize)
          });
        } catch (batchError) {
          logger.error('Pinecone upsert failed with detailed error', {
            batchNumber: Math.floor(i / batchSize) + 1,
            batchSize: batch.length,
            errorName: batchError instanceof Error ? batchError.name : 'Unknown',
            errorMessage: batchError instanceof Error ? batchError.message : 'Unknown error',
            errorStack: batchError instanceof Error ? batchError.stack : undefined,
            indexName,
            namespace,
            sampleVectorStructure: validatedBatch[0] ? {
              id: validatedBatch[0].id,
              valuesType: typeof validatedBatch[0].values,
              valuesLength: validatedBatch[0].values?.length,
              metadataType: typeof validatedBatch[0].metadata,
              metadataSize: JSON.stringify(validatedBatch[0].metadata || {}).length
            } : 'No vectors in batch'
          });
          logger.error('Failed to store vector batch', {
            batchNumber: Math.floor(i / batchSize) + 1,
            batchSize: batch.length,
            error: batchError,
            sampleVectorStructure: validatedBatch[0] ? {
              id: validatedBatch[0].id,
              valuesType: typeof validatedBatch[0].values,
              valuesLength: validatedBatch[0].values?.length,
              metadataType: typeof validatedBatch[0].metadata,
              metadataSize: JSON.stringify(validatedBatch[0].metadata || {}).length
            } : 'No vectors in batch'
          });
          throw batchError;
        }

        // Rate limiting
        if (i + batchSize < embeddings.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      logger.info('Vector storage completed', {
        indexName,
        namespace,
        vectorsStored: embeddings.length
      });

    } catch (error) {
      logger.error('Error storing vectors', { indexName, namespace, error });
      throw new AppError('Failed to store vectors in Pinecone', 500);
    }
  }

  /**
   * Main method to crawl and store documentation as vectors
   */
  static async crawlAndStore(
    pages: CrawledPage[],
    request: VectorCrawlRequest
  ): Promise<VectorStoreResult> {
    const startTime = Date.now();
    
    try {
      logger.info('Starting crawl and store process', {
        totalPages: pages.length,
        indexName: request.indexName || config.pinecone.indexName,
        namespace: request.namespace
      });

      // Process pages into chunks
      const chunks = this.processIntoChunks(
        pages,
        request.chunkSize || this.defaultConfig.chunkSize,
        request.chunkOverlap || this.defaultConfig.chunkOverlap
      );

      if (chunks.length === 0) {
        throw new AppError('No text chunks generated from crawled pages', 400);
      }

      // Generate embeddings
      const embeddings = await this.generateEmbeddings(chunks);

      if (embeddings.length === 0) {
        throw new AppError('No embeddings generated', 500);
      }

      // Store in Pinecone
      const indexName = request.indexName || config.pinecone.indexName;
      await this.storeVectors(embeddings, indexName, request.namespace);

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Calculate summary
      const totalWords = pages.reduce((sum, page) => sum + page.metadata.wordCount, 0);
      const uniqueDomains = [...new Set(pages.map(page => new URL(page.url).hostname))];
      const maxDepthReached = Math.max(...pages.map(page => page.depth));

      const result: VectorStoreResult = {
        success: true,
        message: `Successfully processed and stored ${embeddings.length} vectors from ${pages.length} pages`,
        data: {
          indexName,
          ...(request.namespace && { namespace: request.namespace }),
          vectorsStored: embeddings.length,
          totalChunks: chunks.length,
          crawlSummary: {
            totalPages: pages.length,
            totalWords,
            crawlDepth: maxDepthReached,
            crawlDuration: duration,
            uniqueDomains,
            errors: []
          },
          processingDuration: duration,
          embeddings: {
            model: this.defaultConfig.embeddingModel,
            dimensions: embeddings[0]?.values.length || this.defaultConfig.embeddingDimensions,
            totalTokens: chunks.reduce((sum, chunk) => sum + chunk.metadata.wordCount, 0)
          }
        }
      };

      logger.info('Crawl and store process completed', {
        vectorsStored: embeddings.length,
        totalChunks: chunks.length,
        duration,
        indexName
      });

      return result;

    } catch (error) {
      logger.error('Error in crawl and store process', error);
      throw error instanceof AppError ? error : new AppError('Failed to process and store vectors', 500);
    }
  }

  /**
   * Check if Pinecone index exists and get stats
   */
  static async getIndexStats(indexName: string): Promise<{
    exists: boolean;
    stats?: {
      vectorCount: number;
      dimension: number;
      indexFullness: number;
    };
  }> {
    try {
      const pinecone = await this.initializePinecone();
      const index = pinecone.index(indexName);
      
      const stats = await index.describeIndexStats();
      
      return {
        exists: true,
        stats: {
          vectorCount: stats.totalRecordCount || 0,
          dimension: stats.dimension || 0,
          indexFullness: stats.indexFullness || 0
        }
      };
    } catch (error) {
      logger.warn('Could not get index stats', { indexName, error });
      return { exists: false };
    }
  }
}

export default VectorService;
