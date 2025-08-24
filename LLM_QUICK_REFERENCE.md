# LLM Quick Reference - Express TypeScript Boilerplate

## 🎯 Golden Rules

1. **Use `@/` imports** - Never relative paths (`import { User } from '@/types'`)
2. **Controllers = HTTP only** - No business logic, just request/response handling
3. **Services = Business logic** - Always try/catch, log operations, throw AppError
4. **Models = Data access** - Mock database with setTimeout delays
5. **Validate everything** - Use Joi schemas with validation middleware
6. **Type everything** - Explicit return types, no `any`

## 🏗️ Code Templates

### New Controller Method
```typescript
static async methodName(req: Request, res: Response): Promise<Response> {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'ID is required',
    });
  }
  
  const result = await ServiceName.methodName(id);
  return successResponse(res, 'Success message', result);
}
```

### New Service Method
```typescript
static async methodName(param: string): Promise<ReturnType> {
  try {
    logger.info('Operation starting', { param });
    
    const result = await ModelName.operation(param);
    if (!result) {
      throw new AppError('Not found', 404);
    }
    
    logger.info('Operation completed', { id: result.id });
    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Operation failed', error);
    throw new AppError('Operation failed', 500);
  }
}
```

### New Route
```typescript
router.method(
  '/path/:id?',
  validateParams(paramsSchema),      // if params
  validate(bodySchema),              // if body
  validateQuery(querySchema),        // if query
  asyncHandler(Controller.method)
);
```

### New Validation Schema
```typescript
export const createSchema = Joi.object({
  field: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Field must be at least 2 characters',
    'any.required': 'Field is required'
  })
});
```

### New Model Method
```typescript
static async methodName(param: string): Promise<Type | null> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return items.find(item => item.field === param) || null;
}
```

## 📋 Checklist for New Features

- [ ] Define types in `@/types`
- [ ] Create model methods with setTimeout
- [ ] Create service with try/catch + logging
- [ ] Create validation schemas with clear messages
- [ ] Create controller methods returning Promise<Response>
- [ ] Create routes with validation middleware
- [ ] Add routes to app.ts
- [ ] Write tests with describe/it structure
- [ ] Test all error cases (404, 400, 409, 500)

## 🔧 Common Patterns

### CRUD Service Pattern
```typescript
// Create with duplicate check
const existing = await Model.findByEmail(email);
if (existing) throw new AppError('Already exists', 409);

// Update with existence check
const entity = await Model.findById(id);
if (!entity) throw new AppError('Not found', 404);

// Delete with existence check
const exists = await Model.findById(id);
if (!exists) throw new AppError('Not found', 404);
```

### Error Handling Pattern
```typescript
try {
  logger.info('Starting operation', { context });
  // business logic
  logger.info('Operation successful', { id });
  return result;
} catch (error) {
  if (error instanceof AppError) throw error;
  logger.error('Operation failed', error);
  throw new AppError('Generic message', 500);
}
```

### Test Pattern
```typescript
describe('Entity Tests', () => {
  const testData = { field: 'value' };
  let createdId: string;

  it('should create entity', async () => {
    const res = await request(app)
      .post('/api/entities')
      .send(testData)
      .expect(201);
    
    expect(res.body.success).toBe(true);
    createdId = res.body.data.id;
  });

  it('should handle validation error', async () => {
    await request(app)
      .post('/api/entities')
      .send({})
      .expect(400);
  });
});
```

## ⚡ Quick Commands

```bash
# Development
npm run dev           # Start with hot reload

# Testing
npm test             # Run all tests
npm run test:watch   # Watch mode

# Code Quality
npm run lint         # Check linting
npm run format       # Format code

# Build
npm run build        # Production build
npm start           # Run production
```

## 🚨 Never Do This

❌ `import '../../../utils/logger'` → ✅ `import logger from '@/utils/logger'`
❌ Business logic in controllers → ✅ Business logic in services
❌ HTTP responses in services → ✅ Data return from services
❌ Missing try/catch in services → ✅ Always wrap in try/catch
❌ No input validation → ✅ Joi validation on all inputs
❌ `any` types → ✅ Explicit typing
❌ No logging → ✅ Log operations with context

This is your cheat sheet for consistent Express TypeScript development! 🚀
