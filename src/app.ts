import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import config from './config';
import logger from './utils/logger';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

// Import routes
import indexRoutes from './routes';
import userRoutes from './routes/userRoutes';
import webCrawlerRoutes from './routes/webCrawlerRoutes';
import vectorRoutes from './routes/vectorRoutes';
import ragRoutes from './routes/ragRoutes';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS middleware
    this.app.use(cors({
      origin: config.corsOrigin,
      credentials: true,
    }));

    // Compression middleware
    this.app.use(compression());

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging middleware
    if (!config.isTest) {
      const morganFormat = config.isDevelopment ? 'dev' : 'combined';
      this.app.use(morgan(morganFormat, {
        stream: {
          write: (message: string) => {
            logger.info(message.trim());
          },
        },
      }));
    }

    // Trust proxy for accurate IP addresses
    this.app.set('trust proxy', 1);
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api', indexRoutes);
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/crawler', webCrawlerRoutes);
    this.app.use('/api/vector', vectorRoutes);
    this.app.use('/api/rag', ragRoutes);

    // Welcome route
    this.app.get('/', (_req, res) => {
      res.json({
        message: 'Welcome to Express TypeScript Boilerplate API!',
        version: '1.0.0',
        environment: config.env,
        timestamp: new Date().toISOString(),
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);
    
    // Global error handler
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(config.port, () => {
      logger.info(`🚀 Server is running on port ${config.port} in ${config.env} mode`);
      logger.info(`📚 API documentation available at: http://localhost:${config.port}/api`);
      logger.info(`🏥 Health check available at: http://localhost:${config.port}/api/health`);
    });
  }
}

export default App;
