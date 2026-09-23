import { apiRequest, setStoredToken } from './apiClient';
import type { AdminUser } from '../types/cms';

export interface AuthCheckResponse {
  success: boolean;
  authenticated: boolean;
  user?: AdminUser;
  message?: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: AdminUser;
  message?: string;
}

export const authService = {
  async checkSession(): Promise<AuthCheckResponse> {
    try {
      const res = await apiRequest<AuthCheckResponse>('/api/auth.php?action=check');
      return {
        success: res.success,
        authenticated: Boolean(res.authenticated),
        user: res.user,
        message: res.message,
      };
    } catch {
      return { success: false, authenticated: false };
    }
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await apiRequest<LoginResponse>('/api/auth.php?action=login', {
      method: 'POST',
      data: { email, password },
    });
    if (res.token) {
      setStoredToken(res.token);
    }
    return res;
  },

  async logout(): Promise<void> {
    try {
      await apiRequest('/api/auth.php?action=logout', { method: 'POST' });
    } catch {
      // Continua e limpa armazenamento local
    } finally {
      setStoredToken(null);
    }
  },
};
