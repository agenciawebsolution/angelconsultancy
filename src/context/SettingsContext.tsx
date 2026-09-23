import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsService, defaultSettings } from '../services/settingsService';
import type { SiteSettings } from '../types/cms';

interface SettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    try {
      const data = await settingsService.getPublicSettings();
      setSettings(data);
    } catch {
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        refreshSettings: load,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings deve ser utilizado dentro de um SettingsProvider');
  }
  return context;
}
