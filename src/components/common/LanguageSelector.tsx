import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import type { Language } from '../../i18n/types';
import { ChevronDown, Check } from 'lucide-react';

interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
  shortLabel: string;
}

const languages: LanguageOption[] = [
  { code: 'pt-BR', label: 'Português', flag: '🇧🇷', shortLabel: 'PT' },
  { code: 'en', label: 'English', flag: '🇬🇧', shortLabel: 'EN' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', shortLabel: 'FR' },
];

interface LanguageSelectorProps {
  variant?: 'header' | 'mobile' | 'minimal';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'header' }) => {
  const { language, setLanguage, translations } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'mobile') {
    return (
      <div className="pt-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Idioma / Language / Langue
        </label>
        <div className="grid grid-cols-3 gap-2">
          {languages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'bg-brand-navy text-white border-brand-navy shadow-soft-sm font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={translations.common.selectLanguageAria || "Selecionar idioma"}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200/80 bg-white/90 hover:bg-white text-slate-700 hover:text-brand-navy text-xs font-semibold shadow-soft-xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-navy"
      >
        <span className="text-sm leading-none" role="img" aria-hidden="true">
          {currentLang.flag}
        </span>
        <span className="font-bold tracking-wide">{currentLang.shortLabel}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-brand-navy' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white shadow-soft-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100/80 mb-1">
            {translations.common.selectLanguage || "Selecione o Idioma"}
          </div>
          {languages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                  isSelected
                    ? 'bg-brand-navy-50 text-brand-navy font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-navy flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
