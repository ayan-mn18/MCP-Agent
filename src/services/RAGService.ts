import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import config from '@/config';
import logger from '@/utils/logger';
import { AppError } from '@/types';

export interface RAGQueryRequest {
  query: string;
  namespace: string;
  topK?: number;
  includeMetadata?: boolean;
  filter?: Record<string, any>;
}

export interface RAGSearchRequest {
  query: string;
  namespace: string;
  topK?: number;
  includeMetadata?: boolean;
  filter?: Record<string, any>;
}

export interface RAGMatch {
  id: string;
  score: number;
  metadata?: {
    content: string;
    title?: string;
    url?: string;
    section?: string;
    source?: string;
    [key: string]: any;
  };
}

export interface RAGQueryResponse {
  answer: string;
  sources: RAGMatch[];
  query: string;
  namespace: string;
  confidence: number;
  processingTime: number;
}

export interface RAGSearchResponse {
  matches: RAGMatch[];
  query: string;
  namespace: string;
  totalMatches: number;
  processingTime: number;
}

export class RAGService {
  private static pinecone: Pinecone;
  private static openai: OpenAI;

  /**
   * Initialize Pinecone and OpenAI clients
   */
  private static async initializeClients() {
    if (!this.pinecone) {
      this.pinecone = new Pinecone({
        apiKey: config.pinecone.apiKey,
      });
    }

    if (!this.openai) {
      this.openai = new OpenAI({
        apiKey: config.openai.apiKey,
      });
    }
  }

  /**
   * Generate embeddings for the query
   */
  private static async generateQueryEmbedding(query: string): Promise<number[]> {
    try {
      logger.info('Generating query embedding', { queryLength: query.length });

      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: query,
        encoding_format: 'float',
        dimensions: 512,
      });

      if (!response.data?.[0]?.embedding) {
        throw new Error('Failed to generate embedding');
      }

      return response.data[0].embedding;
    } catch (error) {
      logger.error('Error generating query embedding', error);
      throw new AppError('Failed to generate query embedding', 500);
    }
  }

  /**
   * Perform semantic search in vector database
   */
  static async performVectorSearch(request: RAGSearchRequest): Promise<RAGSearchResponse> {
    const startTime = Date.now();

    try {
      await this.initializeClients();

      logger.info('Performing vector search', {
        query: request.query,
        namespace: request.namespace,
        topK: request.topK,
      });

      // Generate embedding for the query
      const queryEmbedding = await this.generateQueryEmbedding(request.query);

      // Get Pinecone index
      const index = this.pinecone.index(config.pinecone.indexName);

            // Perform the search
      const queryParams: any = {
        vector: queryEmbedding,
        topK: request.topK || 5,
        includeMetadata: request.includeMetadata !== false,
      };

      // Only add filter if it's provided and not empty
      if (request.filter && Object.keys(request.filter).length > 0) {
        queryParams.filter = request.filter;
      }

      logger.info('Executing Pinecone query', {
        namespace: queryParams.namespace,
        topK: queryParams.topK,
        vectorLength: queryEmbedding.length,
        includeMetadata: queryParams.includeMetadata,
        hasFilter: !!queryParams.filter,
        queryParamsKeys: Object.keys(queryParams),
        indexName: config.pinecone.indexName,
        fullQueryParams: JSON.stringify(queryParams, null, 2)
      });

      logger.info('About to call index.query with params', queryParams);
      
      // Use namespace-specific query if namespace is provided
      let searchResponse;
      if (request.namespace) {
        searchResponse = await index.namespace(request.namespace).query(queryParams);
      } else {
        searchResponse = await index.query(queryParams);
      }
      
      logger.info('Pinecone query response', { 
        responseType: typeof searchResponse,
        hasMatches: !!searchResponse.matches,
        matchesLength: searchResponse.matches?.length || 0,
        matchesPreview: searchResponse.matches?.slice(0, 3).map(m => ({
          id: m.id,
          score: m.score,
          hasMetadata: !!m.metadata
        })) || [],
        fullResponse: searchResponse
      });

      if (!searchResponse.matches) {
        logger.warn('No matches returned from vector search', {
          namespace: request.namespace,
          query: request.query.substring(0, 100)
        });
        throw new Error('No matches returned from vector search');
      }

      // Process matches
      const matches: RAGMatch[] = searchResponse.matches.map((match: any) => ({
        id: match.id,
        score: match.score || 0,
        metadata: match.metadata,
      }));

      const processingTime = Date.now() - startTime;

      logger.info('Vector search completed', {
        matchCount: matches.length,
        processingTime,
        namespace: request.namespace,
      });

      return {
        matches,
        query: request.query,
        namespace: request.namespace,
        totalMatches: matches.length,
        processingTime,
      };
    } catch (error) {
      logger.error('Error performing vector search', {
        error: error instanceof Error ? error.message : 'Unknown error',
        errorName: error instanceof Error ? error.name : 'Unknown',
        errorStack: error instanceof Error ? error.stack : 'No stack trace',
        namespace: request.namespace,
        query: request.query.substring(0, 100),
        topK: request.topK
      });
      throw new AppError('Failed to perform vector search', 500);
    }
  }

  /**
   * Generate intelligent answer using RAG
   */
  static async generateRAGAnswer(request: RAGQueryRequest): Promise<RAGQueryResponse> {
    const startTime = Date.now();

    try {
      await this.initializeClients();

      logger.info('Generating RAG answer', {
        query: request.query,
        namespace: request.namespace,
        topK: request.topK,
      });

      // First, perform vector search to get relevant context
      const searchRequest: RAGSearchRequest = {
        query: request.query,
        namespace: request.namespace,
        topK: request.topK || 5,
        includeMetadata: true,
      };

      if (request.filter) {
        searchRequest.filter = request.filter;
      }

      const searchResponse = await this.performVectorSearch(searchRequest);

      if (searchResponse.matches.length === 0) {
        throw new AppError('No relevant information found in the knowledge base', 404);
      }

      // Extract and prepare context from search results
      const contextParts = searchResponse.matches
        .filter(match => match.metadata?.content)
        .map((match, index) => {
          const metadata = match.metadata!; // We've already filtered for metadata existence
          const source = metadata.url || metadata.source || 'Unknown source';
          const title = metadata.title || 'Untitled';
          const section = metadata.section || '';
          
          return `[Source ${index + 1}] ${title}${section ? ` - ${section}` : ''}\nURL: ${source}\nContent: ${metadata.content}`;
        });

      if (contextParts.length === 0) {
        throw new AppError('No usable content found in search results', 404);
      }

      const context = contextParts.join('\n\n---\n\n');

      // Calculate confidence based on search scores
      const avgScore = searchResponse.matches.reduce((sum, match) => sum + match.score, 0) / searchResponse.matches.length;
      const confidence = Math.min(Math.max(avgScore * 100, 0), 100);

      // Generate response using OpenAI with the context
      const systemPrompt = `You are an intelligent AI assistant that provides comprehensive, accurate, and helpful answers based on the provided documentation context. Your role is to:

1. Analyze the user's question thoroughly
2. Use the provided context to generate detailed, accurate responses
3. Cite specific sources when referencing information
4. Provide structured, well-organized answers
5. Include relevant code examples, steps, or explanations when appropriate
6. If the context doesn't fully answer the question, clearly state what information is missing
7. Be conversational but professional in tone

Always structure your responses with:
- A clear, direct answer to the question
- Supporting details with source citations
- Practical examples or steps when relevant
- Additional context or related information that might be helpful

When citing sources, use the format: (Source X) where X is the source number provided in the context.`;

      const userPrompt = `Based on the following documentation context, please provide a comprehensive and detailed answer to this question: "${request.query}"

Context from documentation:
${context}

Please provide a thorough, well-structured answer that addresses the user's question using the information from the provided sources. Include specific details, examples, and step-by-step instructions where appropriate. Cite your sources using (Source X) format.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 2000,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const answer = completion.choices[0]?.message?.content;

      if (!answer) {
        throw new Error('Failed to generate answer from OpenAI');
      }

      const processingTime = Date.now() - startTime;

      logger.info('RAG answer generated successfully', {
        answerLength: answer.length,
        sourceCount: searchResponse.matches.length,
        confidence,
        processingTime,
        namespace: request.namespace,
      });

      return {
        answer,
        sources: searchResponse.matches,
        query: request.query,
        namespace: request.namespace,
        confidence,
        processingTime,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Error generating RAG answer', error);
      throw new AppError('Failed to generate intelligent response', 500);
    }
  }

  /**
   * Get available namespaces in the index
   */
  static async getAvailableNamespaces(): Promise<string[]> {
    try {
      await this.initializeClients();

      logger.info('Fetching available namespaces');

      const index = this.pinecone.index(config.pinecone.indexName);
      const stats = await index.describeIndexStats();

      const namespaces = Object.keys(stats.namespaces || {});
      
      logger.info('Available namespaces fetched', { count: namespaces.length, namespaces });

      return namespaces;
    } catch (error) {
      logger.error('Error fetching available namespaces', error);
      throw new AppError('Failed to fetch available namespaces', 500);
    }
  }

  /**
   * Get namespace statistics
   */
  static async getNamespaceStats(namespace: string): Promise<any> {
    try {
      await this.initializeClients();

      logger.info('Fetching namespace statistics', { namespace });

      const index = this.pinecone.index(config.pinecone.indexName);
      const stats = await index.describeIndexStats();

      const namespaceStats = stats.namespaces?.[namespace];

      if (!namespaceStats) {
        throw new AppError(`Namespace '${namespace}' not found`, 404);
      }

      logger.info('Namespace statistics fetched', { namespace, recordCount: namespaceStats.recordCount });

      return {
        namespace,
        vectorCount: namespaceStats.recordCount,
        indexFullness: stats.indexFullness,
        totalVectorCount: stats.totalRecordCount,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Error fetching namespace statistics', error);
      throw new AppError('Failed to fetch namespace statistics', 500);
    }
  }
}

export default RAGService;
