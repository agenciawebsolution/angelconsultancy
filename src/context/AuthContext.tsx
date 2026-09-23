import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { getStoredToken } from '../services/apiClient';
import type { AdminUser } from '../types/cms';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await authService.checkSession();
      if (res.authenticated && res.user) {
        setUser(res.user);
      } else {
        // Se houver token de teste em modo DEV
        const token = getStoredToken();
        if (import.meta.env.DEV && token && token.startsWith('mock_dev')) {
          setUser({
            id: 1,
            name: 'Agencia Web Solution',
            email: 'agenciawebsolution@gmail.com',
            status: 'active',
            last_login_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          });
        } else {
          setUser(null);
        }
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    (async () => {
      await checkAuth();
      if (ignore) return;
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await authService.login(email, pass);
    if (res.user) {
      setUser(res.user);
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
        login,
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
