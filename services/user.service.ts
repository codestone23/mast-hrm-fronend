import axiosInstance from '@/lib/axios';
import {
  ApiResponse,
  PaginatedResponse,
  User,
  UpdateUserRequest,
  UserRole
} from '@/types/api';

class UserService {
  async getUsers(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });
    
    const response = await axiosInstance.get(`/users?${params}`);
    return response.data;
  }

  async getUserById(userId: string): Promise<ApiResponse<User>> {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  }

  async updateUser(userId: string, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    const response = await axiosInstance.put(`/users/${userId}`, userData);
    return response.data;
  }

  async updateCurrentUser(userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    const response = await axiosInstance.put('/users/me', userData);
    return response.data;
  }

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response.data;
  }

  async toggleUserStatus(userId: string): Promise<ApiResponse<User>> {
    const response = await axiosInstance.patch(`/users/${userId}/toggle-status`);
    return response.data;
  }

  async updateUserRole(userId: string, role: UserRole): Promise<ApiResponse<User>> {
    const response = await axiosInstance.patch(`/users/${userId}/role`, { role });
    return response.data;
  }

  async getUsersByDepartment(departmentId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    const response = await axiosInstance.get(`/users/department/${departmentId}?${params}`);
    return response.data;
  }

  async searchUsers(query: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString()
    });
    
    const response = await axiosInstance.get(`/users/search?${params}`);
    return response.data;
  }

  async uploadAvatar(userId: string, file: File): Promise<ApiResponse<{ avatarUrl: string }>> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await axiosInstance.post(`/users/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteAvatar(userId: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`/users/${userId}/avatar`);
    return response.data;
  }
}

export const userService = new UserService();
export default userService;
