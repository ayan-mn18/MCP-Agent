# Vector Database Integration Guide

## Quick Start

The vector database functionality allows you to crawl documentation websites and automatically store content as embeddings in Pinecone for RAG (Retrieval-Augmented Generation) applications.

### Prerequisites

1. **OpenAI API Key** - For generating embeddings
2. **Pinecone Account** - For vector storage
3. **Environment Setup** - Configure required environment variables

### Environment Variables

Create a `.env` file with the following variables:

```bash
# OpenAI Configuration (required)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Pinecone Configuration (required)
PINECONE_API_KEY=your-pinecone-api-key-here
PINECONE_ENVIRONMENT=your-pinecone-environment  # e.g., "us-east-1-aws"
PINECONE_INDEX_NAME=documentation-embeddings

# Optional - Server Configuration
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
```

## API Endpoints

### 1. Crawl and Store (`POST /api/vector/crawl-and-store`)

Crawl a documentation site and store as vector embeddings:

```bash
curl -X POST http://localhost:3000/api/vector/crawl-and-store \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.example.com",
    "maxDepth": 2,
    "maxPages": 20,
    "chunkSize": 1000,
    "namespace": "example-docs-v1"
  }'
```

### 2. Preview (`POST /api/vector/preview`)

Preview what would be processed without actually storing:

```bash
curl -X POST http://localhost:3000/api/vector/preview \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.example.com",
    "maxDepth": 3,
    "maxPages": 50
  }'
```

### 3. Test (`POST /api/vector/test`)

Test processing with a single page:

```bash
curl -X POST http://localhost:3000/api/vector/test \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.example.com/getting-started"
  }'
```

### 4. Index Stats (`GET /api/vector/index/:indexName/stats`)

Get Pinecone index statistics:

```bash
curl http://localhost:3000/api/vector/index/documentation-embeddings/stats
```

## Configuration Options

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | string | required | Starting URL for crawling |
| `maxDepth` | number | 3 | Maximum crawling depth (1-10) |
| `maxPages` | number | 50 | Maximum pages to crawl (1-1000) |
| `chunkSize` | number | 1000 | Text chunk size in tokens (100-8000) |
| `chunkOverlap` | number | 200 | Overlap between chunks (0-500) |
| `indexName` | string | from config | Pinecone index name |
| `namespace` | string | optional | Pinecone namespace |
| `includePatterns` | array | optional | URL patterns to include |
| `excludePatterns` | array | optional | URL patterns to exclude |

## Example Usage Scenarios

### Documentation Migration

```javascript
// Step 1: Preview the scope
const preview = await fetch('/api/vector/preview', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://docs.yoursite.com',
    maxDepth: 3,
    maxPages: 100
  })
});

// Step 2: Process and store
const result = await fetch('/api/vector/crawl-and-store', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://docs.yoursite.com',
    maxDepth: 3,
    maxPages: 100,
    namespace: 'docs-v2024',
    chunkSize: 800
  })
});
```

### API Documentation Processing

```javascript
const apiDocs = await fetch('/api/vector/crawl-and-store', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://api.yoursite.com/docs',
    includePatterns: ['/api/', '/reference/'],
    excludePatterns: ['/changelog', '/blog'],
    namespace: 'api-reference',
    chunkSize: 600,
    maxDepth: 2
  })
});
```

## Best Practices

### 1. Start Small
- Use the preview endpoint to estimate scope and cost
- Test with a single page first
- Gradually increase `maxPages` and `maxDepth`

### 2. Optimize Chunking
- **Technical docs**: 500-800 tokens for precise retrieval
- **General content**: 1000-1500 tokens for context
- **Code docs**: Minimal overlap (50-100 tokens)

### 3. Organize with Namespaces
```bash
# By product version
namespace: "product-v1.2"

# By content type  
namespace: "getting-started"
namespace: "api-reference"
namespace: "tutorials"

# By date
namespace: "docs-2024-q1"
```

### 4. Filter Content Effectively
```javascript
{
  "includePatterns": ["/docs/", "/api/", "/guide/"],
  "excludePatterns": ["/search", "/login", "/admin", "?", "#"]
}
```

## Error Handling

The API includes comprehensive error handling:

- **Rate limiting**: Automatic delays between requests
- **Retries**: Automatic retry for transient failures  
- **Validation**: Input validation with clear error messages
- **Logging**: Detailed logs for debugging

Common error scenarios:

1. **Missing API keys**: Configure OPENAI_API_KEY and PINECONE_API_KEY
2. **Invalid URLs**: Ensure URLs are accessible and return HTML
3. **Index not found**: Create the Pinecone index first
4. **Rate limits**: The API handles rate limiting automatically

## Monitoring and Optimization

### Check Index Statistics
```bash
curl http://localhost:3000/api/vector/index/your-index-name/stats
```

### Monitor Costs
- Use preview endpoint to estimate OpenAI costs
- OpenAI pricing: ~$0.0001 per 1K tokens
- Optimize with appropriate chunk sizes

### Performance Tips
- Use specific `includePatterns` to focus crawling
- Set appropriate `delay` values for rate limiting
- Consider `chunkSize` based on your use case
- Use namespaces to organize different content types

## Integration with RAG Applications

The stored vectors include rich metadata for sophisticated retrieval:

```python
# Example: Query with metadata filtering
results = index.query(
    vector=query_embedding,
    top_k=5,
    include_metadata=True,
    filter={
        "namespace": "api-docs",
        "domain": "docs.example.com",
        "section": "Getting Started"
    }
)
```

Available metadata fields:
- `url`, `title`, `content`
- `domain`, `section`, `headingLevel`
- `chunkIndex`, `totalChunks`, `wordCount`
- `pageDepth`, `crawledAt`
- `description`, `author`, `language`, `canonical`

This comprehensive vector database integration enables powerful RAG applications with minimal setup and maximum flexibility.
