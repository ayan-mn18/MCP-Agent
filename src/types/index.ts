export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
}

// Error types
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintain proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  stack?: string;
}

// Web Crawler types
export interface CrawlRequest {
  url: string;
  maxDepth?: number;
  maxPages?: number;
  delay?: number;
  includePatterns?: string[];
  excludePatterns?: string[];
  followExternalLinks?: boolean;
}

export interface CrawledPage {
  url: string;
  title: string;
  content: string;
  metadata: {
    description?: string;
    keywords?: string[];
    author?: string;
    publishDate?: string;
    lastModified?: string;
    canonical?: string;
    language?: string;
    contentType: string;
    wordCount: number;
    links: {
      internal: string[];
      external: string[];
    };
    images: Array<{
      src: string;
      alt?: string;
      title?: string;
    }>;
    headings: Array<{
      level: number;
      text: string;
      id?: string;
    }>;
  };
  crawledAt: Date;
  status: number;
  depth: number;
}

export interface CrawlResult {
  success: boolean;
  message: string;
  data: {
    pages: CrawledPage[];
    summary: {
      totalPages: number;
      totalWords: number;
      crawlDepth: number;
      crawlDuration: number;
      uniqueDomains: string[];
      errors: Array<{
        url: string;
        error: string;
        status?: number;
      }>;
    };
  };
}

export interface WebCrawlerConfig {
  maxDepth: number;
  maxPages: number;
  delay: number;
  timeout: number;
  userAgent: string;
  allowedDomains: string[];
  excludePatterns: string[];
  includePatterns: string[];
  followExternalLinks: boolean;
  respectRobotsTxt: boolean;
  maxConcurrent: number;
}

// Vector Database types
export interface VectorCrawlRequest extends CrawlRequest {
  indexName?: string;
  namespace?: string;
  chunkSize?: number;
  chunkOverlap?: number;
  metadataFields?: string[];
}

export interface TextChunk {
  content: string;
  metadata: {
    url: string;
    title: string;
    chunkIndex: number;
    totalChunks: number;
    wordCount: number;
    section?: string;
    headingLevel?: number;
    pageDepth: number;
    domain: string;
    crawledAt: string;
    description?: string;
    language?: string;
    author?: string;
    canonical?: string;
  };
}

export interface VectorEmbedding {
  id: string;
  values: number[];
  metadata: {
    url: string;
    title: string;
    content: string;
    chunkIndex: number;
    totalChunks: number;
    wordCount: number;
    section?: string;
    headingLevel?: number;
    pageDepth: number;
    domain: string;
    crawledAt: string;
    description?: string;
    language?: string;
    author?: string;
    canonical?: string;
  };
}

export interface VectorStoreResult {
  success: boolean;
  message: string;
  data: {
    indexName: string;
    namespace?: string;
    vectorsStored: number;
    totalChunks: number;
    crawlSummary: CrawlResult['data']['summary'];
    processingDuration: number;
    embeddings: {
      model: string;
      dimensions: number;
      totalTokens: number;
    };
  };
}

export interface VectorServiceConfig {
  chunkSize: number;
  chunkOverlap: number;
  embeddingModel: string;
  embeddingDimensions: number;
  maxRetries: number;
  batchSize: number;
}
