# Vector Database API Documentation

## Overview

This professional vector database API enables you to crawl documentation websites and automatically store the content as vector embeddings in Pinecone for RAG (Retrieval-Augmented Generation) applications. It combines the power of web crawling with advanced text processing and vector storage.

## Features

- **Intelligent Web Crawling**: Deep crawl documentation sites with configurable depth and concurrency
- **Smart Text Chunking**: Automatically splits content into optimal chunks for embeddings
- **OpenAI Embeddings**: Generate high-quality vector embeddings using OpenAI's latest models
- **Pinecone Storage**: Store vectors in Pinecone with rich metadata for efficient retrieval
- **Batch Processing**: Efficient batch processing with rate limiting and error handling
- **Comprehensive Metadata**: Extract and preserve document structure, headings, and metadata

## API Endpoints

### 1. Crawl and Store Documentation

**Endpoint:** `POST /api/vector/crawl-and-store`

**Description:** Crawls a documentation website and stores all content as vector embeddings in Pinecone.

**Request Body:**
```json
{
  "url": "https://docs.example.com/getting-started",
  "maxDepth": 3,
  "maxPages": 50,
  "delay": 1000,
  "chunkSize": 1000,
  "chunkOverlap": 200,
  "indexName": "documentation-embeddings",
  "namespace": "example-docs",
  "includePatterns": ["/docs/", "/api/", "/guide/"],
  "excludePatterns": ["/search", "/login"],
  "metadataFields": ["description", "author", "section"]
}
```

**Parameters:**
- `url` (required): Starting URL for crawling
- `maxDepth` (optional): Maximum crawling depth (1-10, default: 3)
- `maxPages` (optional): Maximum pages to crawl (1-1000, default: 50)
- `delay` (optional): Delay between requests in ms (100-10000, default: 1000)
- `chunkSize` (optional): Text chunk size in tokens (100-8000, default: 1000)
- `chunkOverlap` (optional): Overlap between chunks (0-500, default: 200)
- `indexName` (optional): Pinecone index name (default: from config)
- `namespace` (optional): Pinecone namespace for organization
- `includePatterns` (optional): URL patterns to include
- `excludePatterns` (optional): URL patterns to exclude
- `metadataFields` (optional): Additional metadata fields to include

**Response:**
```json
{
  "success": true,
  "message": "Successfully crawled 25 pages and stored 347 vectors",
  "data": {
    "indexName": "documentation-embeddings",
    "namespace": "example-docs",
    "vectorsStored": 347,
    "totalChunks": 347,
    "crawlSummary": {
      "totalPages": 25,
      "totalWords": 45623,
      "crawlDepth": 2,
      "crawlDuration": 15420,
      "uniqueDomains": ["docs.example.com"],
      "errors": []
    },
    "processingDuration": 18750,
    "embeddings": {
      "model": "text-embedding-3-small",
      "dimensions": 1536,
      "totalTokens": 45623
    }
  }
}
```

**Example Usage:**
```bash
curl -X POST http://localhost:3000/api/vector/crawl-and-store \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.cartesia.ai/2024-11-13/get-started/overview",
    "maxDepth": 2,
    "maxPages": 20,
    "chunkSize": 800,
    "indexName": "cartesia-docs",
    "namespace": "v2024-11"
  }'
```

### 2. Preview Crawl and Vectorization

**Endpoint:** `POST /api/vector/preview`

**Description:** Preview what would be crawled and vectorized without actually processing or storing anything.

**Request Body:**
```json
{
  "url": "https://docs.example.com/getting-started",
  "maxDepth": 3,
  "maxPages": 50,
  "chunkSize": 1000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Crawl and vectorization preview generated successfully",
  "data": {
    "crawl": {
      "estimatedPages": 25,
      "allowedDomains": ["docs.example.com"],
      "startingUrl": "https://docs.example.com/getting-started",
      "config": {
        "maxDepth": 3,
        "maxPages": 50,
        "delay": 1000
      }
    },
    "vectorization": {
      "estimatedChunks": 50,
      "estimatedTokens": 50000,
      "estimatedCost": 0.005,
      "chunkSize": 1000,
      "chunkOverlap": 200,
      "indexName": "documentation-embeddings",
      "namespace": "default"
    }
  }
}
```

### 3. Test Vectorization

**Endpoint:** `POST /api/vector/test`

**Description:** Test the vectorization process with a single page to verify configuration and see sample output.

**Request Body:**
```json
{
  "url": "https://docs.example.com/single-page",
  "indexName": "test-index",
  "namespace": "test"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vector processing test completed successfully",
  "data": {
    "page": {
      "url": "https://docs.example.com/single-page",
      "title": "Getting Started Guide",
      "wordCount": 1250
    },
    "chunks": {
      "totalChunks": 3,
      "sampleChunk": {
        "content": "Getting Started Guide\n\nWelcome to our comprehensive documentation. This guide will walk you through the essential steps to get up and running with our platform...",
        "wordCount": 180,
        "metadata": {
          "chunkIndex": 0,
          "totalChunks": 3,
          "section": "Getting Started Guide"
        }
      }
    },
    "estimatedVectors": 3,
    "estimatedTokens": 540
  }
}
```

### 4. Get Index Statistics

**Endpoint:** `GET /api/vector/index/:indexName/stats`

**Description:** Get statistics about a Pinecone index including vector count and dimensions.

**Response:**
```json
{
  "success": true,
  "message": "Index statistics retrieved successfully",
  "data": {
    "exists": true,
    "stats": {
      "vectorCount": 15420,
      "dimension": 1536,
      "indexFullness": 0.23
    }
  }
}
```

## Configuration

### Environment Variables

Required environment variables for vector functionality:

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key

# Pinecone Configuration
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=your-pinecone-environment
PINECONE_INDEX_NAME=documentation-embeddings
```

### Default Settings

The API uses intelligent defaults optimized for documentation processing:

- **Chunk Size**: 1000 tokens (optimal for most documentation)
- **Chunk Overlap**: 200 tokens (maintains context between chunks)
- **Embedding Model**: `text-embedding-3-small` (cost-effective, high-quality)
- **Embedding Dimensions**: 1536
- **Batch Size**: 100 vectors per batch
- **Rate Limiting**: 1 second between batches

## Best Practices

### 1. Planning Your Crawl

- Use the **preview endpoint** to estimate costs and scope
- Start with smaller `maxPages` values for testing
- Use `includePatterns` to focus on relevant documentation sections

### 2. Chunking Strategy

- **Technical docs**: Use smaller chunks (500-800 tokens) for precise retrieval
- **General content**: Use larger chunks (1000-1500 tokens) for context
- **Code documentation**: Use minimal overlap (50-100 tokens)

### 3. Namespace Organization

```bash
# Organize by product/version
namespace: "product-v1.2"
namespace: "api-docs-2024"
namespace: "user-guides"

# Organize by content type
namespace: "getting-started"
namespace: "api-reference"
namespace: "tutorials"
```

### 4. Error Handling

The API includes comprehensive error handling:
- Rate limiting protection
- Automatic retries for transient failures
- Detailed error reporting with context
- Graceful degradation for partial failures

### 5. Cost Optimization

- Use preview endpoint to estimate costs
- Filter content with `includePatterns` and `excludePatterns`
- Consider `text-embedding-3-small` for cost-effectiveness
- Batch operations are automatically optimized

## Example Workflows

### Documentation Site Migration
```bash
# 1. Preview the crawl
curl -X POST http://localhost:3000/api/vector/preview \
  -H "Content-Type: application/json" \
  -d '{"url": "https://docs.example.com", "maxDepth": 3}'

# 2. Test with a single page
curl -X POST http://localhost:3000/api/vector/test \
  -H "Content-Type: application/json" \
  -d '{"url": "https://docs.example.com/getting-started"}'

# 3. Full crawl and storage
curl -X POST http://localhost:3000/api/vector/crawl-and-store \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.example.com",
    "maxDepth": 3,
    "maxPages": 100,
    "namespace": "docs-v2024"
  }'
```

### API Documentation Processing
```bash
curl -X POST http://localhost:3000/api/vector/crawl-and-store \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://api.example.com/docs",
    "includePatterns": ["/api/", "/reference/"],
    "excludePatterns": ["/changelog", "/blog"],
    "chunkSize": 600,
    "namespace": "api-reference"
  }'
```

## Integration with RAG Applications

The stored vectors are optimized for RAG applications with rich metadata:

```python
# Example: Query stored vectors in your RAG application
import pinecone

# Initialize Pinecone
pinecone.init(api_key="your-key")
index = pinecone.Index("documentation-embeddings")

# Query with metadata filtering
results = index.query(
    vector=query_embedding,
    top_k=5,
    include_metadata=True,
    filter={
        "namespace": "api-docs",
        "domain": "docs.example.com"
    }
)
```

## Support

For issues or questions:
- Check the logs for detailed error information
- Use the test endpoint to verify your configuration
- Monitor Pinecone index statistics for performance insights

The Vector Database API provides enterprise-grade reliability and performance for your RAG applications.
