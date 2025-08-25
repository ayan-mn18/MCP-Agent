# MCP Agent - AI## 🚀 Key Features

### Core RAG Engine
- **🕷️ Intelligent Web Crawler** - Smart recursive crawling with content filtering and depth control
- **⚡ Vector Database Integration** - Pinecone-powered semantic search with 512-dimensional embeddings
- **🤖 OpenAI GPT-4o Integration** - Advanced language model for intelligent response generation
- **🔎 Advanced RAG Implementation** - Context-aware retrieval with confidence scoring and source citation
- **🎯 Multi-Namespace Support** - Organize knowledge bases by project, language, or domain

### Smart Query Processing
- **📝 Natural Language Queries** - Ask questions in plain English and get detailed, technical responses
- **📊 Similarity Search** - Find relevant documentation sections with semantic similarity scoring
- **🔗 Source Attribution** - Every response includes source citations with URLs and confidence scores
- **⚙️ Configurable Results** - Control result count, metadata inclusion, and filtering options
- **📈 Performance Metrics** - Response times, confidence scores, and processing statisticsmentation RAG System

🤖 **Intelligent Documentation Processing & Retrieval-Augmented Generation**

Transform any documentation into a searchable, intelligent knowledge base using advanced vector embeddings and RAG (Retrieval-Augmented Generation). Crawl documentation sites, create semantic embeddings, and query them with natural language for detailed, context-aware responses.

## 🌟 What is MCP Agent?

MCP Agent is an intelligent documentation processing system that:

1. **📖 Crawls Documentation** - Recursively crawls any documentation website with configurable depth and filtering
2. **🧠 Creates Vector Embeddings** - Converts content into searchable 512-dimensional vectors using OpenAI's latest embedding models
3. **🔍 Implements Advanced RAG** - Provides intelligent Retrieval-Augmented Generation with context-aware responses
4. **⚡ Semantic Search** - Fast similarity search across large documentation corpora
5. **📦 Namespace Management** - Organize multiple knowledge bases by project, domain, or topic

## 🚀 Key Features

### Core Engine
- **🕷️ Intelligent Web Crawler** - Recursive documentation crawling with depth control
- **⚡ Vector Database** - Pinecone integration for semantic search
- **🤖 OpenAI Embeddings** - High-quality text vectorization (512-dimensional)
- **🔎 RAG Implementation** - Context-aware retrieval for accurate responses

### MCP Integration
- **📋 Auto-Generated MCP Servers** - Creates complete MCP agents from documentation
- **🔌 VS Code Compatible** - Direct integration with VS Code and Claude Desktop
- **� REST API** - Programmatic access to all functionality
- **🎯 Namespace Support** - Organize agents by project or domain

### Technical Foundation
- **TypeScript** with strict mode enabled
- **Express.js** web framework with professional API design
- **Environment Configuration** with validation using Joi
- **Error Handling** with centralized error middleware and detailed logging
- **Request Validation** using comprehensive Joi schemas
- **Security** with Helmet and CORS
- **Testing** with Jest and Supertest
- **Code Quality** with ESLint and Prettier
- **Docker Support** for containerization
- **Production Ready** with comprehensive monitoring

## 📂 Project Architecture

```
src/
├── app.ts                     # Express app configuration
├── server.ts                  # Server entry point
├── config/
│   └── index.ts              # Environment configuration & API keys
├── controllers/
│   ├── UserController.ts         # User management
│   ├── RAGController.ts          # RAG query handling & intelligent responses
│   ├── VectorController.ts       # Vector database operations
│   └── WebCrawlerController.ts   # Documentation crawling
│   └── validations/
│       ├── userValidation.ts         # User validation schemas
│       ├── ragValidation.ts          # RAG query validation
│       ├── vectorValidation.ts       # Vector operation validation
│       └── webCrawlerValidation.ts   # Crawler validation schemas
├── middlewares/
│   ├── errorHandler.ts       # Global error handling
│   └── validation.ts         # Request validation middleware
├── models/
│   └── User.ts               # User data model
├── routes/
│   ├── index.ts              # Health and info routes
│   ├── userRoutes.ts         # User management routes
│   ├── ragRoutes.ts          # RAG query & search routes
│   ├── vectorRoutes.ts       # Vector database routes
│   └── webCrawlerRoutes.ts   # Documentation crawling routes
├── services/
│   ├── UserService.ts        # User business logic
│   ├── RAGService.ts         # RAG implementation & intelligent response generation
│   ├── VectorService.ts      # Vector database operations & embeddings
│   └── WebCrawlerService.ts  # Smart documentation crawling
├── types/
│   └── index.ts              # TypeScript definitions
├── utils/
│   ├── helpers.ts            # Utility functions
│   └── logger.ts             # Custom logger
└── tests/
    ├── setup.ts              # Test configuration
    ├── health.test.ts        # Health endpoint tests
    └── user.test.ts          # User endpoint tests
```

## 🚀 Quick Start

### 1. Setup & Installation

```bash
# Clone the repository
git clone <repository-url>
cd mcp-agent

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Add your OpenAI API key and Pinecone credentials to .env

# Start the development server
npm run dev
```

### 2. Create Your First Knowledge Base

```bash
# Crawl documentation and create vector embeddings
curl -X POST http://localhost:3000/api/vector/crawl-and-store \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.your-favorite-tool.com",
    "maxDepth": 3,
    "maxPages": 50,
    "namespace": "your-tool-docs",
    "indexName": "documentation-embeddings"
  }'
```

### 3. Query Your Knowledge Base with RAG

```bash
# Ask intelligent questions and get detailed responses
curl -X POST http://localhost:3000/api/rag/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How do I get started with this tool?",
    "namespace": "your-tool-docs",
    "topK": 5
  }'
```

### 4. Perform Semantic Search

```bash
# Search for specific information without generating an answer
curl -X POST http://localhost:3000/api/rag/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "installation steps",
    "namespace": "your-tool-docs",
    "topK": 3,
    "includeMetadata": true
  }'
```

### 5. Manage Your Knowledge Bases

```bash
# List all available namespaces
curl http://localhost:3000/api/rag/namespaces

# Get detailed statistics for a namespace
curl http://localhost:3000/api/rag/namespaces/your-tool-docs/stats
```
## 📋 API Endpoints

### Documentation Crawling & Vectorization

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/vector/crawl-and-store` | POST | Crawl documentation and store as vector embeddings |
| `/api/vector/preview` | POST | Preview what will be crawled (no storage) |
| `/api/vector/test` | POST | Test vectorization pipeline with sample content |
| `/api/vector/index/:indexName/stats` | GET | Get Pinecone index statistics |

### RAG Query & Search Interface

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/rag/query` | POST | Query documentation using RAG with intelligent, detailed responses |
| `/api/rag/search` | POST | Semantic search across vectors without answer generation |
| `/api/rag/namespaces` | GET | List all available namespaces with optional statistics |
| `/api/rag/namespaces/:namespace/stats` | GET | Get detailed statistics for a specific namespace |
| `/api/rag/health` | GET | Health check for RAG system components |

### Web Crawler Operations

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/crawler/crawl` | POST | Crawl documentation websites with smart content extraction |
| `/api/crawler/preview` | POST | Preview crawl results without actual crawling |
| `/api/crawler/analyze` | POST | Analyze a single page for content extraction |

### System Health & Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | System health check with detailed metrics |
| `/api` | GET | API information and available endpoints |
| `/api/users` | GET/POST | User management (example CRUD operations) |

## 🔌 API Usage Examples

### Documentation Crawling

```bash
# Preview documentation before crawling
curl -X POST http://localhost:3000/api/vector/preview \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.example.com",
    "namespace": "my-docs",
    "maxPages": 50,
    "includeSubpages": true
  }'

# Crawl and store documentation as vectors
curl -X POST http://localhost:3000/api/vector/crawl-and-store \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.example.com",
    "namespace": "my-docs",
    "maxPages": 50,
    "maxDepth": 3,
    "includeSubpages": true,
    "indexName": "documentation-embeddings"
  }'

# Test vectorization with sample content
curl -X POST http://localhost:3000/api/vector/test \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is a test document for vectorization",
    "namespace": "test-namespace",
    "metadata": {
      "title": "Test Document",
      "source": "manual"
    }
  }'
```

### RAG Queries & Search

```bash
# Query documentation with intelligent AI responses
curl -X POST http://localhost:3000/api/rag/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How do I implement authentication?",
    "namespace": "my-docs",
    "topK": 5,
    "includeMetadata": true,
    "includeSources": true,
    "temperature": 0.7
  }'

# Simple semantic search without AI generation
curl -X POST http://localhost:3000/api/rag/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "user authentication",
    "namespace": "my-docs",
    "topK": 10,
    "includeMetadata": true,
    "scoreThreshold": 0.7
  }'

# Get namespace statistics and vector counts
curl -X GET http://localhost:3000/api/rag/namespaces/my-docs/stats

# List all available namespaces
curl -X GET http://localhost:3000/api/rag/namespaces?includeStats=true
```

### System Monitoring

```bash
# Check overall system health
curl -X GET http://localhost:3000/api/health

# Check RAG system components
curl -X GET http://localhost:3000/api/rag/health

# Get Pinecone index statistics
curl -X GET http://localhost:3000/api/vector/index/documentation-embeddings/stats
```

### Expected Response Formats

#### RAG Query Response
```json
{
  "success": true,
  "data": {
    "answer": "To implement authentication, you need to follow these steps: 1. Set up your authentication provider... 2. Configure middleware... 3. Protect your routes...",
    "sources": [
      {
        "id": "auth-guide-001", 
        "url": "https://docs.example.com/auth",
        "title": "Authentication Guide",
        "score": 0.95,
        "snippet": "Authentication implementation requires...",
        "metadata": {
          "section": "Getting Started",
          "lastUpdated": "2024-01-20"
        }
      }
    ],
    "confidence": 0.92,
    "namespace": "my-docs",
    "queryId": "unique-query-id",
    "processingTime": "245ms"
  }
}
```

#### Namespace Statistics Response
```json
{
  "success": true,
  "data": {
    "namespace": "my-docs",
    "vectorCount": 1250,
    "totalSize": "15.2MB",
    "lastUpdated": "2024-01-20T10:30:00Z",
    "indexName": "documentation-embeddings",
    "dimensions": 512,
    "averageScore": 0.87,
    "sourceUrls": [
      "https://docs.example.com",
      "https://api.example.com/docs"
    ]
  }
}
```

#### Error Response Format
```json
{
  "success": false,
  "error": {
    "message": "Invalid namespace specified",
    "code": "INVALID_NAMESPACE",
    "details": {
      "namespace": "invalid-name",
      "availableNamespaces": ["my-docs", "test-namespace"]
    }
  }
}
```

## ⚙️ Environment Configuration

Create a `.env` file with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
LOG_LEVEL=info

# OpenAI Configuration (Required)
OPENAI_API_KEY=your_openai_api_key_here

# Pinecone Configuration (Required)
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=documentation-embeddings

# Vector Database Settings
EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DIMENSIONS=512
VECTOR_ENCODING_FORMAT=float

# RAG Configuration
RAG_MODEL=gpt-4o-mini
DEFAULT_TOP_K=5
MAX_CONTEXT_LENGTH=16000
RESPONSE_TEMPERATURE=0.7

# Web Crawler Settings
MAX_PAGES_PER_CRAWL=100
MAX_CRAWL_DEPTH=5
CRAWLER_DELAY_MS=1000

# Security & Rate Limiting
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
API_TIMEOUT_MS=30000
```

## 🔧 Installation & Setup

### Prerequisites

- **Node.js** (v18 or later)
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))
- **Pinecone Account** ([Sign up here](https://www.pinecone.io/))

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd documentation-rag-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

4. **Set up Pinecone Index**
   - Create a new index in your Pinecone dashboard
   - Use dimensions: **512**
   - Metric: **cosine**
   - Name: **documentation-embeddings** (or update PINECONE_INDEX_NAME in .env)

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Verify installation**
   ```bash
   curl http://localhost:3000/api/health
   ```

### Production Deployment

```bash
# Build the application
npm run build

# Start production server
npm start

# Or use PM2 for process management
npm install -g pm2
pm2 start dist/app.js --name "rag-system"
```

## 🧪 Testing

Run the test suite to ensure everything is working correctly:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Test specific components
npm run test:unit
npm run test:integration
```

## 📊 Performance & Monitoring

### Health Check Endpoints

- **`GET /api/health`** - Overall system health
- **`GET /api/rag/health`** - RAG system components
- **`GET /api/vector/index/:indexName/stats`** - Vector database metrics

### Key Metrics Monitored

- **Vector Database**: Connection status, index statistics, query latency
- **OpenAI API**: Rate limits, response times, token usage
- **Memory Usage**: Embedding cache, active connections
- **Query Performance**: Average response time, success rates

### Logging

The system uses structured logging with different levels:

```bash
# View logs in development
npm run dev

# View logs in production
pm2 logs rag-system

# Log levels: error, warn, info, debug
LOG_LEVEL=debug npm run dev
## 🚀 Advanced Features

### Intelligent Document Processing

- **Smart Content Extraction**: Automatically identifies and extracts meaningful content from documentation pages
- **Hierarchical Chunking**: Breaks down content into semantic chunks while preserving document structure
- **Metadata Enrichment**: Automatically extracts titles, sections, and contextual information
- **Link Analysis**: Follows internal documentation links to build comprehensive knowledge bases

### Advanced RAG Capabilities

- **Context-Aware Responses**: Generates responses that understand the broader context of your documentation
- **Source Attribution**: Every answer includes detailed source citations with relevance scores
- **Confidence Scoring**: Provides confidence metrics for generated responses
- **Multi-Document Synthesis**: Combines information from multiple sources for comprehensive answers

### Production-Ready Features

- **Namespace Management**: Organize multiple documentation sets with isolated namespaces
- **Rate Limiting**: Built-in protection against API abuse
- **Comprehensive Logging**: Structured logging for monitoring and debugging
- **Health Monitoring**: Real-time health checks for all system components
- **Error Recovery**: Robust error handling with graceful degradation

## 🛠️ Architecture Deep Dive

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Crawler   │────│  Vector Store   │────│   RAG Engine    │
│                 │    │   (Pinecone)    │    │   (OpenAI)      │
│ • Content       │    │ • Embeddings    │    │ • Query         │
│   Extraction    │    │ • Metadata      │    │   Processing    │
│ • Link Analysis │    │ • Namespaces    │    │ • Response      │
│ • Rate Limiting │    │ • Search        │    │   Generation    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                    ┌─────────────────┐
                    │   Express API   │
                    │                 │
                    │ • Validation    │
                    │ • Authentication│
                    │ • Rate Limiting │
                    │ • Error Handling│
                    └─────────────────┘
```

### Data Flow

1. **Document Ingestion**: Web crawler extracts content and metadata from documentation
2. **Vectorization**: Content is embedded using OpenAI's text-embedding-3-small model
3. **Storage**: Vectors and metadata stored in Pinecone with namespace organization
4. **Query Processing**: User queries are embedded and matched against vector database
5. **Response Generation**: Retrieved context is processed by GPT-4o-mini for intelligent responses

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Start development server with hot reload |
| Production Build | `npm run build` | Build production bundle with TypeScript compilation |
| Production Start | `npm start` | Start production server |
| Testing | `npm test` | Run comprehensive test suite |
| Test Watch | `npm run test:watch` | Run tests in watch mode for development |
| Test Coverage | `npm run test:coverage` | Generate test coverage reports |
| Linting | `npm run lint` | Run ESLint for code quality checks |
| Type Checking | `npm run type-check` | Run TypeScript compiler for type validation |

## 🐳 Docker Deployment

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t documentation-rag-system .

# Run the container
docker run -p 3000:3000 --env-file .env documentation-rag-system

# Or use Docker Compose
docker-compose up -d
```

### Production Docker Setup

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  rag-system:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

## 🔗 API Endpoints

### Health & Info
- `GET /` - Welcome message
- `GET /api` - API information
- `GET /api/health` - Health check

### Vector Database Operations
- `POST /api/vector/crawl-and-vectorize` - Crawl URL and store embeddings
- `POST /api/vector/preview-crawl-and-vectorize` - Preview crawl without storing
- `POST /api/vector/test-vectorization` - Test vectorization on raw text
- `GET /api/vector/index-stats` - Get Pinecone index statistics

### Users (Example CRUD)
- `GET /api/users` - Get all users (with pagination)
- `POST /api/users` - Create new user

## 💡 Usage Examples

### 1. Create an MCP Agent from Documentation

**Crawl and vectorize documentation:**
```bash
curl -X POST http://localhost:3000/api/vector/crawl-and-vectorize \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.python.org/3/library/",
    "maxPages": 50,
    "namespace": "python-stdlib"
  }'
```

**Preview what will be crawled:**
```bash
curl -X POST http://localhost:3000/api/vector/preview-crawl-and-vectorize \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://fastapi.tiangolo.com/",
    "maxPages": 20
  }'
```

### 2. Test Vector Processing

**Test embeddings on custom text:**
```bash
curl -X POST http://localhost:3000/api/vector/test-vectorization \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your documentation or API reference text here",
    "metadata": {
      "source": "custom-docs",
      "section": "getting-started"
    }
  }'
```

### 3. Monitor Index Status

**Check Pinecone index statistics:**
```bash
curl http://localhost:3000/api/vector/index-stats
```

## 🤖 RAG Query Examples

### 1. Query Documentation with Intelligent Responses

**Ask questions and get detailed, agentic answers:**
```bash
curl -X POST http://localhost:3000/api/rag/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How do I install and configure this framework?",
    "namespace": "fastapi-docs",
    "topK": 5
  }'
```

**Example Response:**
```json
{
  "success": true,
  "message": "Query processed successfully",
  "data": {
    "answer": "To install and configure FastAPI, follow these steps:\n\n## Installation\n\n1. **Install FastAPI and Uvicorn** (Source 1):\n```bash\npip install fastapi uvicorn\n```\n\n2. **Create your first application** (Source 2):\n```python\nfrom fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get(\"/\")\ndef read_root():\n    return {\"Hello\": \"World\"}\n```\n\n3. **Run the development server** (Source 1):\n```bash\nuvicorn main:app --reload\n```\n\nThe application will be available at http://127.0.0.1:8000, with automatic API documentation at http://127.0.0.1:8000/docs.",
    "sources": [
      {
        "id": "doc_1",
        "score": 0.89,
        "metadata": {
          "content": "FastAPI installation guide...",
          "title": "Getting Started",
          "url": "https://fastapi.tiangolo.com/tutorial/",
          "section": "Installation"
        }
      }
    ],
    "query": "How do I install and configure this framework?",
    "namespace": "fastapi-docs",
    "confidence": 89,
    "processingTime": 1234
  }
}
```

### 2. Semantic Search Only

**Search without generating answers:**
```bash
curl -X POST http://localhost:3000/api/rag/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "authentication middleware",
    "namespace": "express-docs",
    "topK": 3,
    "includeMetadata": true
  }'
```

### 3. Advanced Filtering

**Search with metadata filters:**
```bash
curl -X POST http://localhost:3000/api/rag/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "database connection",
    "namespace": "node-docs",
    "topK": 5,
    "filter": {
      "section": "configuration",
      "difficulty": "beginner"
    }
  }'
```

### 4. Check Available Namespaces

**List all available knowledge bases:**
```bash
curl http://localhost:3000/api/rag/namespaces?includeStats=true&limit=10
```

### 5. Get Namespace Statistics

**Check specific namespace details:**
```bash
curl http://localhost:3000/api/rag/namespaces/python-docs/stats
```

## � MCP Integration

This system can be extended to generate Model Context Protocol (MCP) servers that provide AI assistants with domain-specific knowledge. Here's how:

### 1. Crawl Documentation
Use the vector endpoints to ingest documentation from any source and create embeddings.

### 2. Implement RAG Queries
The stored vectors enable semantic search across the crawled documentation for accurate, context-aware responses.

### 3. Generate MCP Servers
Package the knowledge and RAG capabilities into MCP-compliant servers that can be consumed by AI assistants.

### Example MCP Server Structure
```typescript
// Future implementation for MCP server generation
interface MCPServer {
  name: string;
  version: string;
  capabilities: string[];
  knowledge_base: {
    namespace: string;
    vector_count: number;
    sources: string[];
  };
  endpoints: {
    search: string;
    answer: string;
  };
}
```

## �🧪 Testing

Run the test suite:
```bash
npm test
```

Run with coverage:
```bash
npm run test:coverage
```

The project includes comprehensive tests for:
- Vector database operations
- Web crawler functionality  
- Error handling and validation
- Health check endpoints

## 🔧 Configuration

Environment variables can be configured in `.env`:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
CORS_ORIGIN=*

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Pinecone Configuration  
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=your_pinecone_index_name

# Vector Processing
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
MAX_CONCURRENT_REQUESTS=5
```

## 🐳 Docker Support

Build and run with Docker:

```bash
# Build the application first
npm run build

# Build Docker image
docker build -t express-typescript-api .

# Run container
docker run -p 3000:3000 express-typescript-api
```

## 🚀 Deployment

### Heroku

1. Create a Heroku app
2. Set environment variables in Heroku dashboard:
   - `OPENAI_API_KEY`
   - `PINECONE_API_KEY` 
   - `PINECONE_ENVIRONMENT`
   - `PINECONE_INDEX_NAME`
3. Deploy:
   ```bash
   git push heroku main
   ```

### Other Platforms

The application includes a `build.sh` script for deployment platforms that support it.

**Environment Variables Required:**
- OpenAI API key for embeddings
- Pinecone credentials for vector storage
- Standard Node.js/Express configuration

## 🎨 Code Style

This project uses ESLint and Prettier for code formatting:

- **ESLint** for linting with TypeScript support
- **Prettier** for consistent code formatting
- **Pre-commit hooks** (can be added with husky)

## 🔐 Security

Security features included:

- **Helmet.js** for security headers
- **CORS** configuration
- **Input validation** with Joi
- **Error sanitization** in production

## 📈 Monitoring & Logging

- **Morgan** for HTTP request logging
- **Custom logger** with different levels
- **Health check endpoint** for monitoring
- **Memory usage** reporting in health check

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- TypeScript team for type safety
- Jest team for the testing framework
- All other open-source contributors

---

## 📚 Next Steps

This boilerplate provides a solid foundation. Consider adding:

- **Database integration** (PostgreSQL, MongoDB, etc.)
- **Authentication & Authorization** (JWT, Passport.js)
- **Rate limiting**
- **API documentation** (Swagger/OpenAPI)
- **Caching** (Redis)
- **Message queues** (Bull, AWS SQS)
- **File uploads** (multer, AWS S3)
- **Email service** integration
- **WebSocket support**
- **GraphQL** API option

Happy coding! 🎉

- **TypeScript** with strict mode enabled for type safety
- **Express.js** for robust web framework
- **Structured Architecture** with clean separation of concerns
- **Input Validation** using Joi
- **Error Handling** with centralized error middleware
- **Security** with Helmet and CORS
- **Logging** with Morgan and custom logger
- **Testing** setup with Jest and Supertest
- **Code Quality** with ESLint and Prettier
- **Environment Configuration** with dotenv
- **Development Tools** with Nodemon and ts-node-dev

## 📁 Project Structure

```
src/
├── config/           # Environment variables and configuration
├── controllers/      # Request handlers and validation schemas
├── middlewares/      # Custom middleware functions
├── models/           # Data models (mock database)
├── routes/           # Express route definitions
├── services/         # Business logic layer
├── types/            # TypeScript type definitions
├── utils/            # Helper functions and utilities
├── tests/            # Test files
├── app.ts            # Express app configuration
└── server.ts         # Server entry point
```

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Validation:** Joi
- **Testing:** Jest + Supertest
- **Linting:** ESLint + Prettier
- **Security:** Helmet, CORS
- **Logging:** Morgan
- **Development:** Nodemon, ts-node-dev

## 🚦 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd express-typescript-boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration.

4. **Start development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000` (or your configured PORT).

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run clean` - Remove build directory

## 🔧 API Endpoints

### Health Check
- `GET /api/health` - Service health status
- `GET /api` - API information

### Users (Example CRUD)
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 📝 API Response Format

### Success Response
```json
{
  \"success\": true,
  \"message\": \"Operation successful\",
  \"data\": { ... }
}
```

### Error Response
```json
{
  \"success\": false,
  \"message\": \"Error message\",
  \"error\": \"Detailed error information\"
}
```

### Paginated Response
```json
{
  \"success\": true,
  \"message\": \"Data fetched successfully\",
  \"data\": [...],
  \"pagination\": {
    \"currentPage\": 1,
    \"totalPages\": 5,
    \"totalItems\": 50,
    \"itemsPerPage\": 10,
    \"hasNextPage\": true,
    \"hasPrevPage\": false
  }
}
```

## 🔍 Troubleshooting

### Common Issues

#### Vector Database Connection Issues
```bash
# Check Pinecone connection
curl -X GET http://localhost:3000/api/rag/health

# Verify environment variables
echo $PINECONE_API_KEY
echo $PINECONE_INDEX_NAME
```

**Solutions:**
- Verify Pinecone API key and index name in `.env`
- Ensure index dimensions match (512)
- Check Pinecone service status

#### OpenAI API Errors
```bash
# Test OpenAI connectivity
curl -X POST http://localhost:3000/api/vector/test \
  -H "Content-Type: application/json" \
  -d '{"content": "test", "namespace": "test"}'
```

**Solutions:**
- Verify OpenAI API key has sufficient credits
- Check rate limits and quotas
- Ensure API key has embedding permissions

#### Memory Issues with Large Documents
**Solutions:**
- Reduce `maxPages` in crawl requests
- Increase Node.js memory: `node --max-old-space-size=4096`
- Process documents in smaller batches

#### Slow Query Performance
**Solutions:**
- Reduce `topK` parameter for faster searches
- Use more specific queries
- Check Pinecone index performance metrics

### Debug Mode

Enable detailed logging for troubleshooting:

```bash
LOG_LEVEL=debug npm run dev
```

### Getting Help

- **Documentation Issues**: Check the API endpoints and examples above
- **Performance Issues**: Monitor health endpoints and logs
- **Integration Issues**: Review environment configuration
- **Bug Reports**: Please include logs and reproduction steps

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/documentation-rag-system.git
   cd documentation-rag-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.development
   # Add your development API keys
   ```

4. **Run tests**
   ```bash
   npm test
   ```

### Contribution Guidelines

- **Code Style**: Follow the existing TypeScript/ESLint configuration
- **Testing**: Add tests for new features and bug fixes
- **Documentation**: Update README and API documentation
- **Commits**: Use conventional commit messages
- **Pull Requests**: Include description, testing notes, and screenshots if applicable

### Areas for Contribution

- **New Data Sources**: Support for additional documentation formats
- **Enhanced Crawling**: Better content extraction and link following
- **Vector Databases**: Support for additional vector database providers
- **LLM Providers**: Integration with additional language models
- **Performance**: Optimization and caching improvements
- **Monitoring**: Enhanced metrics and alerting

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing powerful embeddings and language models
- **Pinecone** for the scalable vector database platform
- **The open-source community** for the amazing tools and libraries that make this possible

---

**Made with ❤️ for documentation-driven development**

> Transform any documentation into an intelligent, searchable knowledge base with our production-ready RAG system.
