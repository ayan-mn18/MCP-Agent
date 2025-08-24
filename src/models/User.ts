// Mock database - In a real application, use a proper database like PostgreSQL, MongoDB, etc.
import { User, CreateUserRequest, UpdateUserRequest } from '@/types';
import { generateRandomString } from '@/utils/helpers';

// In-memory storage (replace with actual database)
let users: User[] = [];

export class UserModel {
  /**
   * Get all users with pagination
   */
  static async findAll(
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{ users: User[]; total: number }> {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Sort users
    const sortedUsers = [...users].sort((a, b) => {
      const aValue = a[sortBy as keyof User];
      const bValue = b[sortBy as keyof User];
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    const paginatedUsers = sortedUsers.slice(startIndex, endIndex);
    
    return {
      users: paginatedUsers,
      total: users.length,
    };
  }

  /**
   * Find user by ID
   */
  static async findById(id: string): Promise<User | null> {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return users.find(user => user.id === id) || null;
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return users.find(user => user.email === email) || null;
  }

  /**
   * Create new user
   */
  static async create(userData: CreateUserRequest): Promise<User> {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const newUser: User = {
      id: generateRandomString(12),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);
    return newUser;
  }

  /**
   * Update user by ID
   */
  static async updateById(id: string, updateData: UpdateUserRequest): Promise<User | null> {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return null;
    }

    const existingUser = users[userIndex];
    if (!existingUser) {
      return null;
    }

    const updatedUser: User = {
      ...existingUser,
      ...updateData,
      updatedAt: new Date(),
    };

    users[userIndex] = updatedUser;
    return updatedUser;
  }

  /**
   * Delete user by ID
   */
  static async deleteById(id: string): Promise<boolean> {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return false;
    }

    users.splice(userIndex, 1);
    return true;
  }

  /**
   * Check if email exists
   */
  static async emailExists(email: string): Promise<boolean> {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return users.some(user => user.email === email);
  }
}

export default UserModel;
