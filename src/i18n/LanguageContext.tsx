import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Language, TranslationSchema } from './types';
import { ptBR } from './locales/ptBR';
import { en } from './locales/en';
import { fr } from './locales/fr';

const STORAGE_KEY = 'angel_language';

const dictionaries: Record<Language, TranslationSchema> = {
  'pt-BR': ptBR,
  'en': en,
  'fr': fr,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, fallback?: string) => string;
  translations: TranslationSchema;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved && ['pt-BR', 'en', 'fr'].includes(saved)) {
      return saved;
    }
    return 'pt-BR';
  });

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const translations = useMemo(() => dictionaries[language] || ptBR, [language]);

  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    let current: unknown = translations;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[key];
      } else {
        return fallback || path;
      }
    }

    if (typeof current === 'string') {
      return current;
    }

    return fallback || path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
