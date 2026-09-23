import { apiRequest, setStoredToken } from './apiClient';
import type { AdminUser } from '../types/cms';

export interface AuthCheckResponse {
  success: boolean;
  authenticated: boolean;
  setup_required: boolean;
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
      return await apiRequest<AuthCheckResponse>('/api/auth.php?action=check');
    } catch (err: any) {
      if (err?.status === 401) {
        return { success: false, authenticated: false, setup_required: false };
      }
      // Se estiver em ambiente dev local e a API não existir, simula sessão para preview
      if (import.meta.env.DEV && (err?.status === 404 || !err?.status)) {
        return { success: true, authenticated: false, setup_required: false };
      }
      throw err;
    }
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const res = await apiRequest<LoginResponse>('/api/auth.php?action=login', {
        method: 'POST',
        data: { email, password },
      });
      if (res.token) {
        setStoredToken(res.token);
      }
      return res;
    } catch (err: any) {
      if (import.meta.env.DEV && (err?.status === 404 || !err?.status)) {
        // Mock fallback para testes de interface em servidor Vite sem PHP
        const mockToken = 'mock_dev_session_token_' + Date.now();
        setStoredToken(mockToken);
        return {
          success: true,
          token: mockToken,
          user: {
            id: 1,
            name: 'Administrador (Preview Local)',
            email: email,
            status: 'active',
            last_login_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
        };
      }
      throw err;
    }
  },

  async setupInitialAdmin(name: string, email: string, password: string): Promise<LoginResponse> {
    const res = await apiRequest<LoginResponse>('/api/auth.php?action=setup', {
      method: 'POST',
      data: { name, email, password },
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
      // Continua e limpa armazenamento
    } finally {
      setStoredToken(null);
    }
  },
};
