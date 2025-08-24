# Express TypeScript Boilerplate

A production-ready Node.js backend boilerplate with Express.js and TypeScript, following industry best practices.

## 🚀 Features

- **TypeScript** with strict mode enabled
- **Express.js** web framework
- **Environment Configuration** with validation using Joi
- **Error Handling** with centralized error middleware
- **Request Validation** using Joi
- **Logging** with Morgan and custom logger
- **Security** with Helmet and CORS
- **Testing** with Jest and Supertest
- **Code Quality** with ESLint and Prettier
- **Hot Reload** with ts-node-dev for development
- **Path Mapping** for clean imports
- **Docker Support** for containerization
- **Heroku Ready** with Procfile

## 📂 Project Structure

```
src/
├── app.ts                  # Express app configuration
├── server.ts              # Server entry point
├── config/
│   └── index.ts           # Environment configuration
├── controllers/
│   ├── UserController.ts  # User request handlers
│   └── validations/
│       └── userValidation.ts  # Joi validation schemas
├── middlewares/
│   ├── errorHandler.ts    # Global error handling
│   └── validation.ts      # Validation middleware
├── models/
│   └── User.ts            # User data model (mock)
├── routes/
│   ├── index.ts           # Health and info routes
│   └── userRoutes.ts      # User-related routes
├── services/
│   └── UserService.ts     # Business logic
├── types/
│   └── index.ts           # TypeScript type definitions
├── utils/
│   ├── helpers.ts         # Utility functions
│   └── logger.ts          # Custom logger
└── tests/
    ├── setup.ts           # Test configuration
    ├── health.test.ts     # Health endpoint tests
    └── user.test.ts       # User CRUD tests
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

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

### Users (Example CRUD)
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Example API Usage

**Create a user:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "password123"
  }'
```

**Get all users:**
```bash
curl http://localhost:3000/api/users?page=1&limit=10
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run with coverage:
```bash
npm run test:coverage
```

The project includes comprehensive tests for:
- Health check endpoints
- User CRUD operations
- Error handling
- Validation

## 🔧 Configuration

Environment variables can be configured in `.env`:

```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
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
2. Set environment variables
3. Deploy:
   ```bash
   git push heroku main
   ```

### Other Platforms

The application includes a `build.sh` script for deployment platforms that support it.

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

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
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
