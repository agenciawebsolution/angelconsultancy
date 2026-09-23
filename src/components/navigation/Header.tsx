import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
import { useScrollHeader } from '../../hooks/useScrollHeader';
import { MobileMenu } from './MobileMenu';
import { cn } from '../../lib/utils';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../i18n/LanguageContext';
import { useSettings } from '../../context/SettingsContext';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolled = useScrollHeader(25);
  const location = useLocation();
  const { translations } = useLanguage();
  const { settings } = useSettings();

  const isHome = location.pathname === '/';

  const navItems = [
    { label: translations.nav.home, href: '#inicio', key: 'home' },
    { label: translations.nav.about, href: '#quem-somos', key: 'about' },
    { label: translations.nav.services, href: '#servicos', key: 'services' },
    { label: translations.nav.audience, href: '#publico', key: 'audience' },
    { label: translations.nav.methodology, href: '#metodo', key: 'methodology' },
    { label: translations.nav.blog, href: '/blog', key: 'blog' },
    { label: translations.nav.contact, href: '#contato', key: 'contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
        
        {/* ========================================================= */}
        {/* Institutional Top Bar (Deep Navy - Hide on Scroll)       */}
        {/* ========================================================= */}
        <div 
          className={cn(
            "hidden md:block bg-[#0A162B] text-slate-300 text-xs py-2 px-4 transition-all duration-300 border-b border-slate-800/70 z-50",
            isScrolled && "max-h-0 py-0 opacity-0 overflow-hidden border-none"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Real CMS Institutional Contacts Only */}
            <div className="flex items-center gap-6 text-[11px] font-medium text-slate-300">
              {settings.company_phone && (
                <a 
                  href={`tel:${settings.company_phone.replace(/[^0-9+]/g, '')}`} 
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{settings.company_phone}</span>
                </a>
              )}
              {settings.company_email && (
                <a 
                  href={`mailto:${settings.company_email}`} 
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{settings.company_email}</span>
                </a>
              )}
              {settings.company_location && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{settings.company_location}</span>
                </div>
              )}
            </div>

            {/* Language Selector in Top Bar on Desktop */}
            <div className="flex items-center gap-4 text-[11px]">
              <LanguageSelector />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Main Header Navigation Bar                                */}
        {/* ========================================================= */}
        <div 
          className={cn(
            "w-full transition-all duration-300 border-b",
            isScrolled 
              ? "bg-white/95 backdrop-blur-md py-3 shadow-soft-sm border-slate-200/80" 
              : "bg-white py-4 shadow-soft-xs border-slate-100"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              
              {/* Logo */}
              {isHome ? (
                <a 
                  href="#inicio" 
                  className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy rounded-lg p-1"
                  aria-label={translations.common.logoHomeAria || "Angel Consultancy - Ir para o início"}
                >
                  <img 
                    src="/logo.png" 
                    alt="Angel Consultancy and Network" 
                    className="h-9 sm:h-11 w-auto object-contain"
                    loading="eager"
                  />
                </a>
              ) : (
                <Link 
                  to="/" 
                  className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy rounded-lg p-1"
                  aria-label={translations.common.logoHomeAria || "Angel Consultancy - Ir para o início"}
                >
                  <img 
                    src="/logo.png" 
                    alt="Angel Consultancy and Network" 
                    className="h-9 sm:h-11 w-auto object-contain"
                    loading="eager"
                  />
                </Link>
              )}

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
                {navItems.map((item) => {
                  const isActive = isHome && item.key === 'home';

                  if (item.href.startsWith('#')) {
                    return isHome ? (
                      <a
                        key={item.key}
                        href={item.href}
                        className={cn(
                          "relative px-3.5 py-2 text-sm font-semibold transition-all duration-150 rounded-lg group",
                          isActive
                            ? "text-[#1D5BD8] font-bold"
                            : "text-slate-700 hover:text-[#0B1F3A] hover:bg-slate-50"
                        )}
                      >
                        <span>{item.label}</span>
                        {isActive && (
                          <span className="block w-6 h-0.5 bg-[#D4AF37] rounded-full mx-auto mt-0.5" />
                        )}
                      </a>
                    ) : (
                      <Link
                        key={item.key}
                        to={`/${item.href}`}
                        className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-[#0B1F3A] hover:bg-slate-50 rounded-lg transition-colors duration-150"
                      >
                        {item.label}
                      </Link>
                    );
                  }

                  const isCurrentRoute = location.pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.key}
                      to={item.href}
                      className={cn(
                        "relative px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors duration-150",
                        isCurrentRoute
                          ? "text-[#1D5BD8] font-bold bg-blue-50/50"
                          : "text-slate-700 hover:text-[#0B1F3A] hover:bg-slate-50"
                      )}
                    >
                      <span>{item.label}</span>
                      {isCurrentRoute && (
                        <span className="block w-6 h-0.5 bg-[#D4AF37] rounded-full mx-auto mt-0.5" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Desktop Right CTA Pill */}
              <div className="hidden lg:flex items-center gap-3">
                {isHome ? (
                  <a
                    href="#contato"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0B1F3A] hover:bg-[#102D55] text-white text-sm font-bold shadow-soft-sm hover:shadow-soft-md transition-all duration-200 active:scale-[0.98] group"
                  >
                    <span>{translations.nav.ctaButton}</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37] transition-transform duration-200 group-hover:translate-x-0.5" />
                  </a>
                ) : (
                  <Link
                    to="/#contato"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0B1F3A] hover:bg-[#102D55] text-white text-sm font-bold shadow-soft-sm hover:shadow-soft-md transition-all duration-200 active:scale-[0.98] group"
                  >
                    <span>{translations.nav.ctaButton}</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37] transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button + Language Selector */}
              <div className="flex items-center lg:hidden gap-2">
                <LanguageSelector />

                <a
                  href="#contato"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0B1F3A] text-white text-xs font-semibold"
                >
                  <span>{translations.nav.ctaButton}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label={translations.common.menuOpenAria || "Abrir menu de navegação"}
                  aria-expanded={isMobileMenuOpen}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-brand-navy"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>

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
