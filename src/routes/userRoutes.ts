import { Router } from 'express';
import { UserController } from '@/controllers/UserController';
import { validate, validateParams, validateQuery } from '@/middlewares/validation';
import { 
  createUserSchema, 
  updateUserSchema, 
  userParamsSchema,
  paginationQuerySchema 
} from '@/controllers/validations/userValidation';
import { asyncHandler } from '@/utils/helpers';

const router = Router();

/**
 * @route   GET /api/users
 * @desc    Get all users with pagination
 * @access  Public (in production, add authentication middleware)
 */
router.get(
  '/',
  validateQuery(paginationQuerySchema),
  asyncHandler(UserController.getAllUsers)
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public (in production, add authentication middleware)
 */
router.get(
  '/:id',
  validateParams(userParamsSchema),
  asyncHandler(UserController.getUserById)
);

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Public (in production, add authentication middleware)
 */
router.post(
  '/',
  validate(createUserSchema),
  asyncHandler(UserController.createUser)
);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user by ID
 * @access  Public (in production, add authentication middleware)
 */
router.put(
  '/:id',
  validateParams(userParamsSchema),
  validate(updateUserSchema),
  asyncHandler(UserController.updateUser)
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user by ID
 * @access  Public (in production, add authentication middleware)
 */
router.delete(
  '/:id',
  validateParams(userParamsSchema),
  asyncHandler(UserController.deleteUser)
);

export default router;
