# Example: Adding a "Product" Feature

This example demonstrates how to add a complete CRUD feature following the LLM development rules.

## Step 1: Define Types (`src/types/index.ts`)

Add these interfaces to the existing file:

```typescript
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  inStock?: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  inStock?: boolean;
}
```

## Step 2: Create Model (`src/models/Product.ts`)

```typescript
import { Product, CreateProductRequest, UpdateProductRequest } from '@/types';
import { generateRandomString } from '@/utils/helpers';

// Mock database storage
let products: Product[] = [];

export class ProductModel {
  /**
   * Get all products with pagination
   */
  static async findAll(
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{ products: Product[]; total: number }> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const sortedProducts = [...products].sort((a, b) => {
      const aValue = a[sortBy as keyof Product];
      const bValue = b[sortBy as keyof Product];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    const paginatedProducts = sortedProducts.slice(startIndex, endIndex);
    
    return {
      products: paginatedProducts,
      total: products.length,
    };
  }

  /**
   * Find product by ID
   */
  static async findById(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return products.find(product => product.id === id) || null;
  }

  /**
   * Find product by name
   */
  static async findByName(name: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return products.find(product => product.name.toLowerCase() === name.toLowerCase()) || null;
  }

  /**
   * Create new product
   */
  static async create(productData: CreateProductRequest): Promise<Product> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const newProduct: Product = {
      id: generateRandomString(12),
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category: productData.category,
      inStock: productData.inStock ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    products.push(newProduct);
    return newProduct;
  }

  /**
   * Update product by ID
   */
  static async updateById(id: string, updateData: UpdateProductRequest): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const productIndex = products.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
      return null;
    }

    const existingProduct = products[productIndex];
    if (!existingProduct) {
      return null;
    }

    const updatedProduct: Product = {
      ...existingProduct,
      ...updateData,
      updatedAt: new Date(),
    };

    products[productIndex] = updatedProduct;
    return updatedProduct;
  }

  /**
   * Delete product by ID
   */
  static async deleteById(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const productIndex = products.findIndex(product => product.id === id);
    
    if (productIndex === -1) {
      return false;
    }

    products.splice(productIndex, 1);
    return true;
  }

  /**
   * Get products by category
   */
  static async findByCategory(category: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }
}

export default ProductModel;
```

## Step 3: Create Service (`src/services/ProductService.ts`)

```typescript
import { Product, CreateProductRequest, UpdateProductRequest, AppError } from '@/types';
import { ProductModel } from '@/models/Product';
import { getPaginationMeta } from '@/utils/helpers';
import logger from '@/utils/logger';

export class ProductService {
  /**
   * Get all products with pagination
   */
  static async getAllProducts(
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    category?: string
  ) {
    try {
      logger.info('Fetching products', { page, limit, sortBy, sortOrder, category });
      
      let products: Product[];
      let total: number;

      if (category) {
        products = await ProductModel.findByCategory(category);
        total = products.length;
        
        // Apply pagination to filtered results
        const startIndex = (page - 1) * limit;
        products = products.slice(startIndex, startIndex + limit);
      } else {
        const result = await ProductModel.findAll(page, limit, sortBy, sortOrder);
        products = result.products;
        total = result.total;
      }

      const pagination = getPaginationMeta(page, total, limit);

      return {
        products,
        pagination,
      };
    } catch (error) {
      logger.error('Error fetching products', error);
      throw new AppError('Failed to fetch products', 500);
    }
  }

  /**
   * Get product by ID
   */
  static async getProductById(id: string): Promise<Product> {
    try {
      logger.info('Fetching product by ID', { id });
      
      const product = await ProductModel.findById(id);
      
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      return product;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Error fetching product by ID', error);
      throw new AppError('Failed to fetch product', 500);
    }
  }

  /**
   * Create new product
   */
  static async createProduct(productData: CreateProductRequest): Promise<Product> {
    try {
      logger.info('Creating new product', { name: productData.name });

      // Check if product name already exists
      const existingProduct = await ProductModel.findByName(productData.name);
      if (existingProduct) {
        throw new AppError('Product name already exists', 409);
      }

      // Validate price
      if (productData.price <= 0) {
        throw new AppError('Price must be greater than 0', 400);
      }

      const newProduct = await ProductModel.create(productData);
      
      logger.info('Product created successfully', { id: newProduct.id });
      return newProduct;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Error creating product', error);
      throw new AppError('Failed to create product', 500);
    }
  }

  /**
   * Update product by ID
   */
  static async updateProduct(id: string, updateData: UpdateProductRequest): Promise<Product> {
    try {
      logger.info('Updating product', { id, updateData });

      // Check if product exists
      const existingProduct = await ProductModel.findById(id);
      if (!existingProduct) {
        throw new AppError('Product not found', 404);
      }

      // Check if name is being updated and if it already exists
      if (updateData.name && updateData.name !== existingProduct.name) {
        const nameExists = await ProductModel.findByName(updateData.name);
        if (nameExists) {
          throw new AppError('Product name already exists', 409);
        }
      }

      // Validate price if being updated
      if (updateData.price !== undefined && updateData.price <= 0) {
        throw new AppError('Price must be greater than 0', 400);
      }

      const updatedProduct = await ProductModel.updateById(id, updateData);
      
      if (!updatedProduct) {
        throw new AppError('Failed to update product', 500);
      }

      logger.info('Product updated successfully', { id });
      return updatedProduct;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Error updating product', error);
      throw new AppError('Failed to update product', 500);
    }
  }

  /**
   * Delete product by ID
   */
  static async deleteProduct(id: string): Promise<void> {
    try {
      logger.info('Deleting product', { id });

      const productExists = await ProductModel.findById(id);
      if (!productExists) {
        throw new AppError('Product not found', 404);
      }

      const deleted = await ProductModel.deleteById(id);
      
      if (!deleted) {
        throw new AppError('Failed to delete product', 500);
      }

      logger.info('Product deleted successfully', { id });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Error deleting product', error);
      throw new AppError('Failed to delete product', 500);
    }
  }
}

export default ProductService;
```

## Step 4: Create Validation Schemas (`src/controllers/validations/productValidation.ts`)

```typescript
import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Product name must be at least 2 characters long',
    'string.max': 'Product name cannot exceed 100 characters',
    'any.required': 'Product name is required'
  }),
  description: Joi.string().min(10).max(500).required().messages({
    'string.min': 'Description must be at least 10 characters long',
    'string.max': 'Description cannot exceed 500 characters',
    'any.required': 'Description is required'
  }),
  price: Joi.number().positive().precision(2).required().messages({
    'number.positive': 'Price must be a positive number',
    'any.required': 'Price is required'
  }),
  category: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Category must be at least 2 characters long',
    'string.max': 'Category cannot exceed 50 characters',
    'any.required': 'Category is required'
  }),
  inStock: Joi.boolean().optional()
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).messages({
    'string.min': 'Product name must be at least 2 characters long',
    'string.max': 'Product name cannot exceed 100 characters'
  }),
  description: Joi.string().min(10).max(500).messages({
    'string.min': 'Description must be at least 10 characters long',
    'string.max': 'Description cannot exceed 500 characters'
  }),
  price: Joi.number().positive().precision(2).messages({
    'number.positive': 'Price must be a positive number'
  }),
  category: Joi.string().min(2).max(50).messages({
    'string.min': 'Category must be at least 2 characters long',
    'string.max': 'Category cannot exceed 50 characters'
  }),
  inStock: Joi.boolean()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const productParamsSchema = Joi.object({
  id: Joi.string().required().messages({
    'any.required': 'Product ID is required'
  })
});

export const productQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('createdAt', 'updatedAt', 'name', 'price', 'category').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  category: Joi.string().optional()
});
```

## Step 5: Create Controller (`src/controllers/ProductController.ts`)

```typescript
import { Request, Response } from 'express';
import { ProductService } from '@/services/ProductService';
import { successResponse } from '@/utils/helpers';
import { CreateProductRequest, UpdateProductRequest, PaginationParams } from '@/types';

export class ProductController {
  /**
   * Get all products
   */
  static async getAllProducts(req: Request, res: Response): Promise<Response> {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      category 
    } = req.query as Partial<PaginationParams> & {
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      category?: string;
    };

    const result = await ProductService.getAllProducts(
      Number(page),
      Number(limit),
      sortBy,
      sortOrder,
      category
    );

    return successResponse(res, 'Products fetched successfully', result);
  }

  /**
   * Get product by ID
   */
  static async getProductById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }
    
    const product = await ProductService.getProductById(id);
    return successResponse(res, 'Product fetched successfully', product);
  }

  /**
   * Create new product
   */
  static async createProduct(req: Request, res: Response): Promise<Response> {
    const productData: CreateProductRequest = req.body;
    const newProduct = await ProductService.createProduct(productData);
    
    return successResponse(res, 'Product created successfully', newProduct, 201);
  }

  /**
   * Update product
   */
  static async updateProduct(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }
    
    const updateData: UpdateProductRequest = req.body;
    const updatedProduct = await ProductService.updateProduct(id, updateData);
    
    return successResponse(res, 'Product updated successfully', updatedProduct);
  }

  /**
   * Delete product
   */
  static async deleteProduct(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }
    
    await ProductService.deleteProduct(id);
    return successResponse(res, 'Product deleted successfully');
  }
}

export default ProductController;
```

## Step 6: Create Routes (`src/routes/productRoutes.ts`)

```typescript
import { Router } from 'express';
import { ProductController } from '@/controllers/ProductController';
import { validate, validateParams, validateQuery } from '@/middlewares/validation';
import { 
  createProductSchema, 
  updateProductSchema, 
  productParamsSchema,
  productQuerySchema 
} from '@/controllers/validations/productValidation';
import { asyncHandler } from '@/utils/helpers';

const router = Router();

/**
 * @route   GET /api/products
 * @desc    Get all products with pagination and filtering
 * @access  Public
 */
router.get(
  '/',
  validateQuery(productQuerySchema),
  asyncHandler(ProductController.getAllProducts)
);

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get(
  '/:id',
  validateParams(productParamsSchema),
  asyncHandler(ProductController.getProductById)
);

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Public (add auth middleware as needed)
 */
router.post(
  '/',
  validate(createProductSchema),
  asyncHandler(ProductController.createProduct)
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product by ID
 * @access  Public (add auth middleware as needed)
 */
router.put(
  '/:id',
  validateParams(productParamsSchema),
  validate(updateProductSchema),
  asyncHandler(ProductController.updateProduct)
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product by ID
 * @access  Public (add auth middleware as needed)
 */
router.delete(
  '/:id',
  validateParams(productParamsSchema),
  asyncHandler(ProductController.deleteProduct)
);

export default router;
```

## Step 7: Add Routes to App (`src/app.ts`)

Add this import and route:

```typescript
// Add to imports
import productRoutes from './routes/productRoutes';

// Add to initializeRoutes method
this.app.use('/api/products', productRoutes);
```

## Step 8: Create Tests (`src/tests/product.test.ts`)

```typescript
import request from 'supertest';
import App from '../app';

const app = new App().app;

describe('Product Routes', () => {
  const testProduct = {
    name: 'Test Product',
    description: 'This is a test product for testing purposes',
    price: 29.99,
    category: 'Electronics',
    inStock: true
  };

  let createdProductId: string;

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const res = await request(app)
        .post('/api/products')
        .send(testProduct)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'Product created successfully');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('name', testProduct.name);
      expect(res.body.data).toHaveProperty('price', testProduct.price);

      createdProductId = res.body.data.id;
    });

    it('should not create product with duplicate name', async () => {
      const res = await request(app)
        .post('/api/products')
        .send(testProduct)
        .expect('Content-Type', /json/)
        .expect(409);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'Product name already exists');
    });

    it('should not create product with invalid price', async () => {
      const invalidProduct = { ...testProduct, name: 'Different Name', price: -10 };
      
      const res = await request(app)
        .post('/api/products')
        .send(invalidProduct)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/products', () => {
    it('should get all products with pagination', async () => {
      const res = await request(app)
        .get('/api/products')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'Products fetched successfully');
      expect(res.body.data).toHaveProperty('products');
      expect(res.body.data).toHaveProperty('pagination');
      expect(Array.isArray(res.body.data.products)).toBe(true);
    });

    it('should filter products by category', async () => {
      const res = await request(app)
        .get('/api/products?category=Electronics')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.data.products).toHaveLength(1);
      expect(res.body.data.products[0].category).toBe('Electronics');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should get product by ID', async () => {
      const res = await request(app)
        .get(`/api/products/${createdProductId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('id', createdProductId);
    });

    it('should return 404 for non-existent product', async () => {
      const res = await request(app)
        .get('/api/products/non-existent-id')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update product', async () => {
      const updateData = {
        name: 'Updated Product Name',
        price: 39.99
      };

      const res = await request(app)
        .put(`/api/products/${createdProductId}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('name', updateData.name);
      expect(res.body.data).toHaveProperty('price', updateData.price);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete product', async () => {
      const res = await request(app)
        .delete(`/api/products/${createdProductId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'Product deleted successfully');
    });
  });
});
```

This example demonstrates all the LLM development rules in action:
- ✅ Clean architecture separation
- ✅ Consistent error handling with AppError
- ✅ Proper logging with context
- ✅ Input validation with Joi
- ✅ Type safety throughout
- ✅ Standardized API responses
- ✅ Comprehensive testing
- ✅ Path mapping with @/ imports

Follow this pattern for any new feature! 🚀
