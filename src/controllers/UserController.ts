import { Request, Response } from 'express';
import { UserService } from '@/services/UserService';
import { successResponse } from '@/utils/helpers';
import { CreateUserRequest, UpdateUserRequest, PaginationParams } from '@/types';

export class UserController {
  /**
   * Get all users
   */
  static async getAllUsers(req: Request, res: Response): Promise<Response> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query as Partial<PaginationParams> & {
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    };

    const result = await UserService.getAllUsers(
      Number(page),
      Number(limit),
      sortBy,
      sortOrder
    );

    return successResponse(res, 'Users fetched successfully', result);
  }

  /**
   * Get user by ID
   */
  static async getUserById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }
    const user = await UserService.getUserById(id);
    
    return successResponse(res, 'User fetched successfully', user);
  }

  /**
   * Create new user
   */
  static async createUser(req: Request, res: Response): Promise<Response> {
    const userData: CreateUserRequest = req.body;
    const newUser = await UserService.createUser(userData);
    
    return successResponse(res, 'User created successfully', newUser, 201);
  }

  /**
   * Update user
   */
  static async updateUser(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }
    const updateData: UpdateUserRequest = req.body;
    
    const updatedUser = await UserService.updateUser(id, updateData);
    
    return successResponse(res, 'User updated successfully', updatedUser);
  }

  /**
   * Delete user
   */
  static async deleteUser(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
    }
    await UserService.deleteUser(id);
    
    return successResponse(res, 'User deleted successfully');
  }
}

export default UserController;
