# LLM Development Rules for Express TypeScript Boilerplate

## 🎯 Core Principles

1. **Always follow TypeScript strict mode** - No `any` types, explicit return types for functions
2. **Consistent error handling** - Use AppError class for operational errors, proper try-catch blocks
3. **Structured logging** - Use the custom logger with appropriate levels (info, error, warn, debug)
4. **Input validation** - Always validate requests using Joi schemas
5. **Clean architecture** - Maintain separation between controllers, services, and models
6. **Path mapping** - Use `@/` aliases for imports instead of relative paths

## 📁 File Structure Rules

### Controllers (`src/controllers/`)
- Handle HTTP requests/responses only
- Validate request data using middleware
- Delegate business logic to services
- Return standardized API responses using `successResponse` helper
- Use `asyncHandler` wrapper for async functions

**Template:**
```typescript
import { Request, Response } from 'express';
import { ServiceName } from '@/services/ServiceName';
import { successResponse } from '@/utils/helpers';
import { CreateRequestType } from '@/types';

export class EntityController {
  static async createEntity(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Entity ID is required',
      });
    }
    
    const entityData: CreateRequestType = req.body;
    const newEntity = await ServiceName.createEntity(entityData);
    
    return successResponse(res, 'Entity created successfully', newEntity, 201);
  }
}
```

### Services (`src/services/`)
- Contains business logic only
- Always log operations with appropriate context
- Use AppError for operational errors
- Handle all error scenarios (not found, validation, etc.)
- Return typed data, never HTTP responses

**Template:**
```typescript
import { EntityType, CreateRequestType, AppError } from '@/types';
import { EntityModel } from '@/models/Entity';
import logger from '@/utils/logger';

export class EntityService {
  static async createEntity(entityData: CreateRequestType): Promise<EntityType> {
    try {
      logger.info('Creating new entity', { data: entityData });

      // Business logic validations
      const existingEntity = await EntityModel.findByField(entityData.field);
      if (existingEntity) {
        throw new AppError('Entity already exists', 409);
      }

      const newEntity = await EntityModel.create(entityData);
      
      logger.info('Entity created successfully', { id: newEntity.id });
      return newEntity;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Error creating entity', error);
      throw new AppError('Failed to create entity', 500);
    }
  }
}
```

### Models (`src/models/`)
- Data access layer only
- Simulate database operations with appropriate delays
- Return typed data or null
- Handle database-specific errors

**Template:**
```typescript
import { EntityType, CreateRequestType } from '@/types';

// Mock database storage
let entities: EntityType[] = [];

export class EntityModel {
  static async findById(id: string): Promise<EntityType | null> {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return entities.find(entity => entity.id === id) || null;
  }

  static async create(entityData: CreateRequestType): Promise<EntityType> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const newEntity: EntityType = {
      id: generateRandomString(12),
      ...entityData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    entities.push(newEntity);
    return newEntity;
  }
}
```

### Routes (`src/routes/`)
- Define endpoints with proper HTTP methods
- Apply validation middleware
- Use asyncHandler for async controllers
- Document routes with JSDoc comments

**Template:**
```typescript
import { Router } from 'express';
import { EntityController } from '@/controllers/EntityController';
import { validate, validateParams } from '@/middlewares/validation';
import { createEntitySchema, entityParamsSchema } from '@/controllers/validations/entityValidation';
import { asyncHandler } from '@/utils/helpers';

const router = Router();

/**
 * @route   POST /api/entities
 * @desc    Create new entity
 * @access  Public (add auth middleware as needed)
 */
router.post(
  '/',
  validate(createEntitySchema),
  asyncHandler(EntityController.createEntity)
);

/**
 * @route   GET /api/entities/:id
 * @desc    Get entity by ID
 * @access  Public
 */
router.get(
  '/:id',
  validateParams(entityParamsSchema),
  asyncHandler(EntityController.getEntityById)
);

export default router;
```

### Validations (`src/controllers/validations/`)
- Use Joi for all input validation
- Provide clear, user-friendly error messages
- Validate different parts: body, params, query

**Template:**
```typescript
import Joi from 'joi';

export const createEntitySchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  })
});

export const entityParamsSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': 'Entity ID is required'
  })
});
```

### Types (`src/types/`)
- Define all interfaces and types
- Use consistent naming conventions
- Export custom error classes

**Template:**
```typescript
export interface EntityType {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEntityRequest {
  name: string;
  email: string;
}

export interface UpdateEntityRequest {
  name?: string;
  email?: string;
}
```

## 🔧 Development Patterns

### Error Handling Pattern
```typescript
try {
  logger.info('Operation description', { context });
  
  // Business logic here
  const result = await SomeModel.operation();
  
  if (!result) {
    throw new AppError('Specific error message', 404);
  }
  
  logger.info('Operation successful', { id: result.id });
  return result;
} catch (error) {
  if (error instanceof AppError) {
    throw error; // Re-throw operational errors
  }
  logger.error('Operation failed', error);
  throw new AppError('Generic error message', 500);
}
```

### Pagination Pattern
```typescript
static async getAllEntities(
  page = 1,
  limit = 10,
  sortBy = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
) {
  try {
    logger.info('Fetching entities', { page, limit, sortBy, sortOrder });
    
    const { entities, total } = await EntityModel.findAll(page, limit, sortBy, sortOrder);
    const pagination = getPaginationMeta(page, total, limit);

    return { entities, pagination };
  } catch (error) {
    logger.error('Error fetching entities', error);
    throw new AppError('Failed to fetch entities', 500);
  }
}
```

### Validation Middleware Usage
```typescript
router.post(
  '/',
  validate(createSchema),           // Body validation
  asyncHandler(Controller.create)
);

router.get(
  '/:id',
  validateParams(paramsSchema),     // Params validation
  asyncHandler(Controller.getById)
);

router.get(
  '/',
  validateQuery(querySchema),       // Query validation
  asyncHandler(Controller.getAll)
);
```

## 📋 Code Quality Rules

### Import Organization
```typescript
// 1. External libraries
import express from 'express';
import Joi from 'joi';

// 2. Internal imports with @ aliases
import { UserService } from '@/services/UserService';
import { successResponse } from '@/utils/helpers';
import logger from '@/utils/logger';
import { User, CreateUserRequest } from '@/types';
```

### Function Signatures
```typescript
// Controllers - always return Promise<Response>
static async createUser(req: Request, res: Response): Promise<Response>

// Services - return business data types
static async createUser(userData: CreateUserRequest): Promise<User>

// Models - return data types or null
static async findById(id: string): Promise<User | null>
```

### Logging Standards
```typescript
// Info level - normal operations
logger.info('Operation starting', { context });
logger.info('Operation completed', { id: result.id });

// Error level - error conditions
logger.error('Operation failed', error);
logger.error('Validation failed', { field: 'email', value: email });

// Debug level - detailed debugging info
logger.debug('Processing item', { item, step: 'validation' });
```

## 🧪 Testing Patterns

### Test Structure
```typescript
describe('Entity Routes', () => {
  const testEntity = {
    name: 'Test Entity',
    email: 'test@example.com'
  };

  let createdEntityId: string;

  describe('POST /api/entities', () => {
    it('should create a new entity', async () => {
      const res = await request(app)
        .post('/api/entities')
        .send(testEntity)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'Entity created successfully');
      expect(res.body.data).toHaveProperty('id');
      
      createdEntityId = res.body.data.id;
    });

    it('should not create entity with invalid data', async () => {
      const invalidEntity = { ...testEntity, email: 'invalid-email' };
      
      const res = await request(app)
        .post('/api/entities')
        .send(invalidEntity)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
    });
  });
});
```

## 📝 Documentation Standards

### JSDoc Comments
```typescript
/**
 * Create a new user account
 * @param userData - User registration data
 * @returns Promise resolving to created user
 * @throws AppError when email already exists
 */
static async createUser(userData: CreateUserRequest): Promise<User>
```

### Route Documentation
```typescript
/**
 * @route   POST /api/users
 * @desc    Create new user account
 * @access  Public
 * @body    { email, firstName, lastName, password }
 * @returns { success, message, data: User }
 */
```

## 🚀 Quick Commands

### Adding New Entity
1. Create types in `src/types/index.ts`
2. Create model in `src/models/EntityModel.ts`
3. Create service in `src/services/EntityService.ts`
4. Create validation schemas in `src/controllers/validations/entityValidation.ts`
5. Create controller in `src/controllers/EntityController.ts`
6. Create routes in `src/routes/entityRoutes.ts`
7. Add routes to main app in `src/app.ts`
8. Create tests in `src/tests/entity.test.ts`

### Development Workflow
```bash
npm run dev        # Start development server
npm test           # Run tests during development
npm run lint       # Check code quality
npm run build      # Verify production build
```

## ⚠️ Common Mistakes to Avoid

1. **Don't handle HTTP responses in services** - Services return data, controllers handle HTTP
2. **Don't skip error logging** - Always log errors with context
3. **Don't use relative imports** - Use `@/` path aliases
4. **Don't forget input validation** - Validate all inputs with Joi
5. **Don't mix business logic in controllers** - Keep controllers thin
6. **Don't forget async/await** - All database operations are async
7. **Don't use `any` types** - Maintain strict TypeScript typing
8. **Don't skip tests** - Write tests for new functionality

Follow these rules for consistent, maintainable, and professional Express TypeScript development!
