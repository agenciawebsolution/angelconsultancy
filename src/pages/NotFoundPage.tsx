import React from 'react';
import { Home } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useLanguage } from '../i18n/LanguageContext';

export const NotFoundPage: React.FC = () => {
  const { translations } = useLanguage();
  const c = translations.common;

  return (
    <section className="min-h-[70vh] flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <span className="text-6xl sm:text-7xl font-black text-brand-navy-200 block">
          404
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {c.pageNotFound}
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {c.pageNotFoundDesc}
        </p>
        <div className="pt-2">
          <Button
            as="a"
            href="/"
            variant="primary"
            size="md"
            icon={<Home className="w-4 h-4" />}
            iconPosition="left"
          >
            {c.backToHome}
          </Button>
        </div>
      </div>
    </section>
  );
};
