import { User, CreateUserRequest, UpdateUserRequest, AppError } from '@/types';
import { UserModel } from '@/models/User';
import { getPaginationMeta } from '@/utils/helpers';
import logger from '@/utils/logger';

export class UserService {
  /**
   * Get all users with pagination
   */
  static async getAllUsers(
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    try {
      logger.info('Fetching users', { page, limit, sortBy, sortOrder });
      
      const { users, total } = await UserModel.findAll(page, limit, sortBy, sortOrder);
      const pagination = getPaginationMeta(page, total, limit);

      return {
        users,
        pagination,
      };
    } catch (error) {
      logger.error('Error fetching users', error);
      throw new AppError('Failed to fetch users', 500);
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<User> {
    try {
      logger.info('Fetching user by ID', { id });
      
      const user = await UserModel.findById(id);
      
      if (!user) {
        throw new AppError('User not found', 404);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Error fetching user by ID', error);
      throw new AppError('Failed to fetch user', 500);
    }
  }

  /**
   * Create new user
   */
  static async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      logger.info('Creating new user', { email: userData.email });

      // Check if email already exists
      const existingUser = await UserModel.findByEmail(userData.email);
      if (existingUser) {
        throw new AppError('Email already exists', 409);
      }

      const newUser = await UserModel.create(userData);
      
      logger.info('User created successfully', { id: newUser.id });
      return newUser;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Error creating user', error);
      throw new AppError('Failed to create user', 500);
    }
  }

  /**
   * Update user by ID
   */
  static async updateUser(id: string, updateData: UpdateUserRequest): Promise<User> {
    try {
      logger.info('Updating user', { id, updateData });

      // Check if user exists
      const existingUser = await UserModel.findById(id);
      if (!existingUser) {
        throw new AppError('User not found', 404);
      }

      // Check if email is being updated and if it already exists
      if (updateData.email && updateData.email !== existingUser.email) {
        const emailExists = await UserModel.emailExists(updateData.email);
        if (emailExists) {
          throw new AppError('Email already exists', 409);
        }
      }

      const updatedUser = await UserModel.updateById(id, updateData);
      
      if (!updatedUser) {
        throw new AppError('Failed to update user', 500);
      }

      logger.info('User updated successfully', { id });
      return updatedUser;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Error updating user', error);
      throw new AppError('Failed to update user', 500);
    }
  }

  /**
   * Delete user by ID
   */
  static async deleteUser(id: string): Promise<void> {
    try {
      logger.info('Deleting user', { id });

      const userExists = await UserModel.findById(id);
      if (!userExists) {
        throw new AppError('User not found', 404);
      }

      const deleted = await UserModel.deleteById(id);
      
      if (!deleted) {
        throw new AppError('Failed to delete user', 500);
      }

      logger.info('User deleted successfully', { id });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Error deleting user', error);
      throw new AppError('Failed to delete user', 500);
    }
  }
}

export default UserService;
