# Web Crawler API Documentation

## Overview

This professional web crawler API is designed to deep crawl documentation websites like Cartesia's docs and return comprehensive, structured data in JSON format. It's built with TypeScript, follows clean architecture principles, and includes advanced features like concurrent crawling, intelligent content extraction, and robust error handling.

## Features

- **Deep Crawling**: Recursively crawl documentation sites to any specified depth
- **Intelligent Content Extraction**: Extract titles, content, metadata, headings, links, and images
- **Concurrent Processing**: Multi-threaded crawling with configurable concurrency limits
- **Rate Limiting**: Respectful crawling with configurable delays between requests
- **Content Filtering**: Include/exclude patterns for targeted crawling
- **Comprehensive Metadata**: Extract SEO metadata, publish dates, authors, and more
- **Error Handling**: Robust error collection and reporting
- **Preview Mode**: Preview what would be crawled without actually crawling

## API Endpoints

### 1. Crawl Documentation

**Endpoint:** `POST /api/crawler/crawl`

**Description:** Crawl a documentation website and return all extracted data in structured JSON format.

**Request Body:**
```json
{
  "url": "https://docs.cartesia.ai/2024-11-13/get-started/overview",
  "maxDepth": 3,
  "maxPages": 50,
  "delay": 1000,
  "includePatterns": ["/docs/", "/api/"],
  "excludePatterns": ["/search", "/login"],
  "followExternalLinks": false
}
```

**Parameters:**
- `url` (required): Starting URL to crawl
- `maxDepth` (optional): Maximum crawl depth (1-5, default: 3)
- `maxPages` (optional): Maximum pages to crawl (1-200, default: 50)
- `delay` (optional): Delay between requests in ms (100-10000, default: 1000)
- `includePatterns` (optional): Array of URL patterns to include
- `excludePatterns` (optional): Array of URL patterns to exclude
- `followExternalLinks` (optional): Whether to follow external links (default: false)

**Response:**
```json
{
  "success": true,
  "message": "Successfully crawled 25 pages",
  "data": {
    "pages": [
      {
        "url": "https://docs.cartesia.ai/2024-11-13/get-started/overview",
        "title": "Welcome to Cartesia",
        "content": "Our API enables developers to build real-time, multimodal AI experiences...",
        "metadata": {
          "description": "Cartesia API documentation and getting started guide",
          "keywords": ["cartesia", "api", "voice", "ai"],
          "author": "Cartesia",
          "publishDate": "2024-11-13",
          "contentType": "text/html",
          "wordCount": 450,
          "links": {
            "internal": ["https://docs.cartesia.ai/api/reference"],
            "external": ["https://github.com/cartesia-ai"]
          },
          "images": [
            {
              "src": "https://docs.cartesia.ai/images/logo.png",
              "alt": "Cartesia Logo"
            }
          ],
          "headings": [
            {
              "level": 1,
              "text": "Welcome to Cartesia",
              "id": "welcome"
            }
          ]
        },
        "crawledAt": "2024-01-15T10:30:00.000Z",
        "status": 200,
        "depth": 0
      }
    ],
    "summary": {
      "totalPages": 25,
      "totalWords": 12500,
      "crawlDepth": 2,
      "crawlDuration": 45000,
      "uniqueDomains": ["docs.cartesia.ai"],
      "errors": []
    }
  }
}
```

### 2. Preview Crawl

**Endpoint:** `POST /api/crawler/preview`

**Description:** Preview what would be crawled without actually performing the crawl.

**Request Body:**
```json
{
  "url": "https://docs.cartesia.ai/2024-11-13/get-started/overview",
  "maxDepth": 3,
  "maxPages": 50,
  "followExternalLinks": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Crawl preview generated successfully",
  "data": {
    "estimatedPages": 50,
    "allowedDomains": ["docs.cartesia.ai"],
    "startingUrl": "https://docs.cartesia.ai/2024-11-13/get-started/overview",
    "config": {
      "maxDepth": 3,
      "maxPages": 50,
      "delay": 1000,
      "timeout": 30000,
      "userAgent": "ProfessionalWebCrawler/1.0",
      "followExternalLinks": false
    }
  }
}
```

## Usage Examples

### Example 1: Basic Cartesia Documentation Crawl

```bash
curl -X POST http://localhost:3000/api/crawler/crawl \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.cartesia.ai/2024-11-13/get-started/overview",
    "maxDepth": 2,
    "maxPages": 30
  }'
```

### Example 2: Targeted API Documentation Crawl

```bash
curl -X POST http://localhost:3000/api/crawler/crawl \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.cartesia.ai/api",
    "maxDepth": 3,
    "maxPages": 50,
    "includePatterns": ["/api/", "/reference/"],
    "excludePatterns": ["/examples/", "/tutorials/"],
    "delay": 500
  }'
```

### Example 3: Preview Before Crawling

```bash
curl -X POST http://localhost:3000/api/crawler/preview \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.cartesia.ai",
    "maxDepth": 4,
    "maxPages": 100
  }'
```

## Data Structure

### CrawledPage Object

Each crawled page returns a comprehensive data structure:

- **url**: The page URL
- **title**: Page title (from `<title>` tag or first `<h1>`)
- **content**: Main text content (cleaned of navigation, scripts, etc.)
- **metadata**: Rich metadata object including:
  - SEO metadata (description, keywords, author)
  - Content statistics (word count, content type)
  - Structured data (headings hierarchy)
  - Link analysis (internal/external links)
  - Media inventory (images with alt text)
- **crawledAt**: Timestamp of when the page was crawled
- **status**: HTTP status code
- **depth**: Crawl depth level

### Summary Statistics

- **totalPages**: Number of pages successfully crawled
- **totalWords**: Total word count across all pages
- **crawlDepth**: Maximum depth reached
- **crawlDuration**: Total crawl time in milliseconds
- **uniqueDomains**: List of domains encountered
- **errors**: Array of any errors encountered

## Configuration

The crawler uses intelligent defaults but can be customized:

- **Rate Limiting**: Default 1-second delay between requests
- **Timeouts**: 30-second timeout per request
- **Concurrency**: Up to 3 concurrent requests
- **Content Filtering**: Automatically excludes binary files, search pages, etc.
- **Respect Robots.txt**: Configurable (default: true)

## Error Handling

The API provides comprehensive error reporting:

1. **Validation Errors**: Invalid URLs or parameters
2. **Network Errors**: Timeouts, connection failures
3. **Content Errors**: Pages that can't be parsed
4. **Rate Limiting**: Automatic retry with backoff

## Best Practices

1. **Start Small**: Use preview mode for large sites
2. **Respect Rate Limits**: Use appropriate delays (1000ms recommended)
3. **Filter Content**: Use include/exclude patterns for targeted crawling
4. **Monitor Progress**: Check summary statistics for crawl effectiveness
5. **Handle Errors**: Review error reports for failed pages

## Technical Implementation

- **Built with TypeScript** for type safety and maintainability
- **Cheerio** for HTML parsing and content extraction
- **Axios** for HTTP requests with retry logic
- **Concurrent Processing** with configurable limits
- **Memory Efficient** streaming and batch processing
- **Clean Architecture** following SOLID principles

## Getting Started

1. Start the server: `npm run dev`
2. Test the health endpoint: `GET /api/health`
3. Preview a crawl: `POST /api/crawler/preview`
4. Run your first crawl: `POST /api/crawler/crawl`

The Web Crawler API is production-ready and designed for professional documentation processing and analysis.
