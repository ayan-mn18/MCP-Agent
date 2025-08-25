# MCP Agent - AI-Powered MCP Agent Generator

🤖 **Automated Model Context Protocol (MCP) Agent Creation**

Transform any documentation into intelligent MCP agents that can be used in VS Code, Claude Desktop, and other MCP-compatible applications. Simply provide a documentation URL, and MCP Agent will crawl, vectorize, and package it into a production-ready MCP server.

## 🌟 What is MCP Agent?

MCP Agent is an intelligent system that creates **Model Context Protocol (MCP) agents on the fly** by:

1. **📖 Crawling Documentation** - Recursively crawls any documentation site
2. **🧠 Creating Embeddings** - Converts content into searchable vector embeddings using OpenAI
3. **🔍 Implementing RAG** - Provides intelligent Retrieval-Augmented Generation capabilities
4. **📦 Publishing MCP Servers** - Automatically packages and publishes ready-to-use MCP agents

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
│   ├── UserController.ts     # User management
│   ├── RAGController.ts      # RAG query handling
│   ├── VectorController.ts   # Vector database operations
│   └── validations/
│       ├── userValidation.ts     # User validation schemas
│       ├── ragValidation.ts      # RAG query validation
│       └── vectorValidation.ts   # Vector operation validation
├── middlewares/
│   ├── errorHandler.ts       # Global error handling
│   └── validation.ts         # Request validation middleware
├── models/
│   └── User.ts               # User data model
├── routes/
│   ├── index.ts              # Health and info routes
│   ├── userRoutes.ts         # User-related routes
│   └── vectorRoutes.ts       # Vector database routes
├── services/
│   ├── UserService.ts        # User business logic
│   ├── RAGService.ts         # RAG implementation
│   ├── VectorService.ts      # Vector database operations
│   └── WebCrawlerService.ts  # Documentation crawling
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

### 1. Create Your First MCP Agent

```bash
# Clone the repository
git clone <repository-url>
cd mcp-agent

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Add your OpenAI API key and Pinecone credentials

# Start the server
npm run dev
```

### 2. Generate an MCP Agent from Documentation

```bash
# Crawl documentation and create vector embeddings
curl -X POST http://localhost:3000/api/vector/crawl-and-store \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://docs.your-favorite-tool.com",
    "maxDepth": 3,
    "maxPages": 50,
    "namespace": "your-tool-docs"
  }'
```

### 3. Query Your New Agent

```bash
# Ask questions about the documentation
curl -X POST http://localhost:3000/api/rag/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How do I get started with this tool?",
    "namespace": "your-tool-docs",
    "topK": 5
  }'
```
## 📋 API Endpoints

### Vector Database Operations

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/vector/crawl-and-store` | POST | Crawl documentation and store as vectors |
| `/api/vector/preview` | POST | Preview what will be crawled (no storage) |
| `/api/vector/test` | POST | Test vectorization pipeline |
| `/api/vector/stats` | GET | Get Pinecone index statistics |

### RAG Query Interface

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/rag/query` | POST | Query documentation using RAG |
| `/api/rag/search` | POST | Semantic search across vectors |

### System Health

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check endpoint |
| `/api` | GET | API information and documentation |

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

# Security
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v18 or later)
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))
- Pinecone Account ([Sign up here](https://www.pinecone.io/))

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mcp-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Pinecone Index**
   - Create a Pinecone account and project
   - Create an index with:
     - **Dimensions**: 512
     - **Metric**: cosine
     - **Cloud & Region**: Choose your preferred option

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:3000`

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle |
| `npm start` | Start production server |
| `npm test` | Run test suite |
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
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## � Acknowledgments

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

## 🗺️ Roadmap

### Phase 1: Core Infrastructure ✅
- [x] Web crawler for documentation sites
- [x] Vector embedding generation with OpenAI
- [x] Pinecone vector storage integration
- [x] RESTful API with comprehensive validation

### Phase 2: MCP Server Generation (Planned)
- [ ] RAG query implementation for semantic search
- [ ] MCP server template generation
- [ ] Automated MCP server deployment
- [ ] Custom knowledge base management

### Phase 3: Advanced Features (Future)
- [ ] Multi-source documentation aggregation
- [ ] Custom embedding model support
- [ ] Real-time documentation updates
- [ ] MCP server marketplace integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Report issues on [GitHub Issues](https://github.com/yourusername/mcp-agent/issues)
- 💬 Join our community discussions
- 📖 Check the documentation for detailed guides

---

**Made with ❤️ for the AI community**
npm run test:coverage
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
CORS_ORIGIN=https://yourdomain.com
```

### Docker (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3000

CMD [\"node\", \"dist/server.js\"]
```

### Deploy to Cloud Platforms

This boilerplate is ready to deploy to:
- **Heroku**: Add `Procfile` with `web: npm start`
- **Railway**: Configure build command `npm run build`
- **Render**: Set build command to `npm run build` and start command to `npm start`
- **AWS/GCP/Azure**: Use Docker or serverless deployment

## 🔒 Security Features

- **Helmet**: Sets various HTTP headers
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Request validation with Joi
- **Error Handling**: No sensitive information leakage
- **Rate Limiting**: Ready to implement (example in env)

## 📚 Code Quality

- **TypeScript**: Strict mode enabled with comprehensive type checking
- **ESLint**: Linting with TypeScript-specific rules
- **Prettier**: Code formatting
- **Path Mapping**: Clean imports with `@/` alias
- **Error Classes**: Custom error handling with proper HTTP status codes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- TypeScript team for type safety
- All the open-source contributors who made this possible

---

**Happy Coding! 🎉**
