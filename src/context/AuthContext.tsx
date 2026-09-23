import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { getStoredToken } from '../services/apiClient';
import type { AdminUser } from '../types/cms';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setupRequired: boolean;
  login: (email: string, pass: string) => Promise<void>;
  setupInitialAdmin: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [setupRequired, setSetupRequired] = useState(false);

  const checkAuth = async () => {
    try {
      const res = await authService.checkSession();
      if (res.setup_required) {
        setSetupRequired(true);
        setUser(null);
      } else if (res.authenticated && res.user) {
        setUser(res.user);
        setSetupRequired(false);
      } else {
        // Se houver token armazenado localmente em modo DEV
        const token = getStoredToken();
        if (import.meta.env.DEV && token && token.startsWith('mock_dev')) {
          setUser({
            id: 1,
            name: 'Administrador (Preview Local)',
            email: 'admin@angel-consultancy.be',
            status: 'active',
            last_login_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          });
        } else {
          setUser(null);
        }
        setSetupRequired(false);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await authService.login(email, pass);
    if (res.user) {
      setUser(res.user);
    }
  };

  const setupInitialAdmin = async (name: string, email: string, pass: string) => {
    const res = await authService.setupInitialAdmin(name, email, pass);
    if (res.user) {
      setUser(res.user);
      setSetupRequired(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        setupRequired,
        login,
        setupInitialAdmin,
        logout,
        refresh: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
