#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ErrorCode,
} from '@modelcontextprotocol/sdk/types.js';
import { RAGService } from '../services/RAGService';
import { config } from '../config';
import logger from '../utils/logger';

/**
 * Cartesia Documentation MCP Server
 * 
 * This MCP server provides AI assistants with access to Cartesia's documentation
 * through intelligent RAG (Retrieval-Augmented Generation) capabilities.
 * 
 * Namespace: cartesia-docs-2024
 */

// Server configuration
const SERVER_NAME = 'cartesia-docs-server';
const SERVER_VERSION = '1.0.0';
const NAMESPACE = 'cartesia-docs-2024';

class CartesiaMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: SERVER_NAME,
        version: SERVER_VERSION,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'query_cartesia_docs',
            description: 'Query Cartesia documentation using intelligent RAG. Returns detailed answers with source citations.',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'The question or topic you want to know about from Cartesia documentation',
                },
                topK: {
                  type: 'number',
                  description: 'Number of relevant sources to retrieve (default: 5)',
                  default: 5,
                },
                includeMetadata: {
                  type: 'boolean',
                  description: 'Whether to include metadata in results (default: true)',
                  default: true,
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'search_cartesia_docs',
            description: 'Perform semantic search across Cartesia documentation without generating an answer. Returns raw matching content.',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search terms or concepts to find in Cartesia documentation',
                },
                topK: {
                  type: 'number',
                  description: 'Number of search results to return (default: 10)',
                  default: 10,
                },
                includeMetadata: {
                  type: 'boolean',
                  description: 'Whether to include metadata in search results (default: true)',
                  default: true,
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'get_cartesia_namespace_stats',
            description: 'Get statistics about the Cartesia documentation knowledge base including vector count and coverage.',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'query_cartesia_docs':
            return await this.handleQueryTool(args);
          
          case 'search_cartesia_docs':
            return await this.handleSearchTool(args);
          
          case 'get_cartesia_namespace_stats':
            return await this.handleStatsTool();
          
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        logger.error('Tool execution error', { tool: name, error });
        
        if (error instanceof McpError) {
          throw error;
        }
        
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });
  }

  private async handleQueryTool(args: any) {
    const { query, topK = 5, includeMetadata = true } = args;

    if (!query || typeof query !== 'string') {
      throw new McpError(
        ErrorCode.InvalidParams,
        'Query parameter is required and must be a string'
      );
    }

    logger.info('Processing RAG query for Cartesia docs', { 
      query: query.substring(0, 100) + '...',
      topK,
      namespace: NAMESPACE 
    });

    try {
      const result = await RAGService.generateRAGAnswer({
        query,
        namespace: NAMESPACE,
        topK,
        includeMetadata,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              answer: result.answer,
              sources: result.sources.map(source => ({
                title: source.metadata?.title || 'Untitled',
                url: source.metadata?.url || 'Unknown URL',
                content: source.metadata?.content?.substring(0, 200) + '...',
                relevanceScore: Math.round(source.score * 100) / 100,
                section: source.metadata?.section || 'General',
              })),
              confidence: result.confidence,
              namespace: result.namespace,
              processingTime: result.processingTime,
              query: result.query,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      logger.error('RAG query failed', error);
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to query Cartesia documentation: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async handleSearchTool(args: any) {
    const { query, topK = 10, includeMetadata = true } = args;

    if (!query || typeof query !== 'string') {
      throw new McpError(
        ErrorCode.InvalidParams,
        'Query parameter is required and must be a string'
      );
    }

    logger.info('Processing semantic search for Cartesia docs', { 
      query: query.substring(0, 100) + '...',
      topK,
      namespace: NAMESPACE 
    });

    try {
      const result = await RAGService.performVectorSearch({
        query,
        namespace: NAMESPACE,
        topK,
        includeMetadata,
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              results: result.matches.map(match => ({
                title: match.metadata?.title || 'Untitled',
                url: match.metadata?.url || 'Unknown URL',
                content: match.metadata?.content || 'No content available',
                relevanceScore: Math.round(match.score * 100) / 100,
                section: match.metadata?.section || 'General',
                metadata: includeMetadata ? match.metadata : undefined,
              })),
              totalMatches: result.totalMatches,
              namespace: NAMESPACE,
              processingTime: result.processingTime,
              query: result.query,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      logger.error('Vector search failed', error);
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to search Cartesia documentation: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async handleStatsTool() {
    logger.info('Getting Cartesia namespace statistics');

    try {
      const stats = await RAGService.getNamespaceStats(NAMESPACE);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              namespace: NAMESPACE,
              statistics: stats,
              description: 'Statistics for Cartesia documentation knowledge base',
              capabilities: [
                'Intelligent Q&A with source citations',
                'Semantic search across documentation',
                'Context-aware responses',
                'Relevance scoring',
              ],
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      logger.error('Failed to get namespace stats', error);
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to get namespace statistics: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private setupErrorHandling() {
    this.server.onerror = (error) => {
      logger.error('MCP Server error', error);
    };

    process.on('SIGINT', async () => {
      logger.info('Shutting down Cartesia MCP server...');
      await this.server.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('Shutting down Cartesia MCP server...');
      await this.server.close();
      process.exit(0);
    });
  }

  async start() {
    try {
      // Validate that we have the required configuration
      if (!config.openai.apiKey) {
        throw new Error('OpenAI API key is required for MCP server');
      }

      if (!config.pinecone.apiKey) {
        throw new Error('Pinecone API key is required for MCP server');
      }

      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      
      logger.info('Cartesia MCP Server started successfully', {
        namespace: NAMESPACE,
        serverName: SERVER_NAME,
        version: SERVER_VERSION,
      });

    } catch (error) {
      logger.error('Failed to start Cartesia MCP server', error);
      process.exit(1);
    }
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  const server = new CartesiaMCPServer();
  server.start().catch((error) => {
    logger.error('Failed to start server', error);
    process.exit(1);
  });
}

export default CartesiaMCPServer;
