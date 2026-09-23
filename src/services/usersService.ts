import { apiRequest } from './apiClient';
import type { AdminUser } from '../types/cms';

export interface UsersResponse {
  success: boolean;
  users: AdminUser[];
}

export const usersService = {
  async getUsers(): Promise<AdminUser[]> {
    try {
      const res = await apiRequest<UsersResponse>('/api/users.php');
      return res.users || [];
    } catch {
      return [];
    }
  },

  async createUser(data: { name: string; email: string; password: string }): Promise<number> {
    const res = await apiRequest<{ success: boolean; id: number }>('/api/users.php', {
      method: 'POST',
      data,
    });
    return res.id;
  },

  async updateUser(id: number, data: { name: string; email: string; status?: string; password?: string }): Promise<void> {
    await apiRequest(`/api/users.php?id=${id}`, {
      method: 'PUT',
      data,
    });
  },

  async deleteUser(id: number): Promise<void> {
    await apiRequest(`/api/users.php?id=${id}`, {
      method: 'DELETE',
    });
  },
};
