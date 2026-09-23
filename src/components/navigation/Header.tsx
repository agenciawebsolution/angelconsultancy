import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, ArrowRight } from 'lucide-react';
import { useScrollHeader } from '../../hooks/useScrollHeader';
import { MobileMenu } from './MobileMenu';
import { cn } from '../../lib/utils';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../i18n/LanguageContext';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolled = useScrollHeader(25);
  const location = useLocation();
  const { translations } = useLanguage();

  const isHome = location.pathname === '/';

  const navItems = [
    { label: translations.nav.home, href: '#inicio' },
    { label: translations.nav.about, href: '#quem-somos' },
    { label: translations.nav.services, href: '#servicos' },
    { label: translations.nav.audience, href: '#publico' },
    { label: translations.nav.methodology, href: '#metodo' },
    { label: translations.nav.contact, href: '#contato' },
    { label: translations.nav.blog, href: '/blog' },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-soft-sm py-3 border-b border-slate-200/60"
            : "bg-white/40 backdrop-blur-xs py-5 border-b border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            {isHome ? (
              <a 
                href="#inicio" 
                className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy rounded-lg p-1"
                aria-label="Angel Consultancy - Ir para o início"
              >
                <img 
                  src="/logo.png" 
                  alt="Angel Consultancy and Network" 
                  className="h-10 sm:h-12 w-auto object-contain"
                  loading="eager"
                />
              </a>
            ) : (
              <Link 
                to="/" 
                className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy rounded-lg p-1"
                aria-label="Angel Consultancy - Ir para a página inicial"
              >
                <img 
                  src="/logo.png" 
                  alt="Angel Consultancy and Network" 
                  className="h-10 sm:h-12 w-auto object-contain"
                  loading="eager"
                />
              </Link>
            )}

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navItems.map((item) => {
                if (item.href.startsWith('#')) {
                  return isHome ? (
                    <a
                      key={item.label}
                      href={item.href}
                      className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-brand-navy hover:bg-slate-100/70 rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.label}
                      to={`/${item.href}`}
                      className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-brand-navy hover:bg-slate-100/70 rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy"
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy ${
                      location.pathname.startsWith(item.href)
                        ? 'text-brand-navy bg-brand-navy-50 font-semibold'
                        : 'text-slate-700 hover:text-brand-navy hover:bg-slate-100/70'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Right CTA + Language Selector */}
            <div className="hidden lg:flex items-center gap-3">
              <LanguageSelector />

              {isHome ? (
                <a
                  href="#contato"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy-700 text-white text-sm font-semibold shadow-soft-sm hover:shadow-soft-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy active:scale-[0.98]"
                >
                  <span>{translations.nav.ctaButton}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>
              ) : (
                <Link
                  to="/#contato"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy-700 text-white text-sm font-semibold shadow-soft-sm hover:shadow-soft-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy active:scale-[0.98]"
                >
                  <span>{translations.nav.ctaButton}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>

            {/* Mobile Menu Button + Mobile Language Selector */}
            <div className="flex items-center lg:hidden gap-2">
              <LanguageSelector />

              <a
                href="#contato"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-navy-50 text-brand-navy text-xs font-semibold hover:bg-brand-navy-100 transition-colors"
              >
                <span>{translations.nav.ctaButton}</span>
              </a>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Abrir menu de navegação"
                aria-expanded={isMobileMenuOpen}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-brand-navy"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navItems={navItems}
      />
    </>
  );
};
