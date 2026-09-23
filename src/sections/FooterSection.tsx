import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin, ArrowUp, Lock } from 'lucide-react';
import { navItems } from '../lib/constants';
import { useSettings } from '../context/SettingsContext';

export const FooterSection: React.FC = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const phone = settings.company_phone || '+32 492 319 741';
  const email = settings.company_email || 'info@angel-consultancy.be';
  const locationText = settings.company_location || 'Bélgica (Atendimento Presencial e Online)';
  const phoneClean = phone.replace(/[^0-9+]/g, '');

  return (
    <footer className="bg-[#0A162B] text-slate-300 relative overflow-hidden border-t border-slate-800">
      {/* Background soft glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-navy-700/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-5">
            {isHome ? (
              <a href="#inicio" className="inline-block p-1 bg-white/95 rounded-xl shadow-soft-sm">
                <img
                  src="/logo.png"
                  alt={settings.company_name || 'Angel Consultancy and Network'}
                  className="h-10 w-auto object-contain"
                />
              </a>
            ) : (
              <Link to="/" className="inline-block p-1 bg-white/95 rounded-xl shadow-soft-sm">
                <img
                  src="/logo.png"
                  alt={settings.company_name || 'Angel Consultancy and Network'}
                  className="h-10 w-auto object-contain"
                />
              </Link>
            )}
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {settings.company_description || 'Assistência humana, simples e confiável para sua organização financeira e administrativa. Cuidado, transparência e clareza para você, sua associação ou seu negócio.'}
            </p>
            <div className="text-xs text-slate-500 font-medium">
              {settings.company_name || 'Angel Consultancy and Network'} • Registrada na Bélgica
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="lg:col-span-3 space-y-4">
            <p className="text-xs font-bold text-white uppercase tracking-widest">
              Navegação
            </p>
            <ul className="space-y-2.5 text-sm">
              {navItems.map((item) => {
                if (item.href.startsWith('#')) {
                  return (
                    <li key={item.label}>
                      {isHome ? (
                        <a
                          href={item.href}
                          className="text-slate-400 hover:text-white transition-colors duration-150"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          to={`/${item.href}`}
                          className="text-slate-400 hover:text-white transition-colors duration-150"
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                }
                return (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="text-slate-400 hover:text-white transition-colors duration-150"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Direct Contacts & Operating Area */}
          <div className="lg:col-span-4 space-y-4">
            <p className="text-xs font-bold text-white uppercase tracking-widest">
              Canais Oficiais
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`tel:${phoneClean}`}
                  className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-slate-800 text-brand-amber-400 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </span>
                  <span>{phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-slate-800 text-brand-amber-400 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </span>
                  <span className="truncate">{email}</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-400 pt-1">
                <span className="w-8 h-8 rounded-lg bg-slate-800 text-brand-navy-300 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </span>
                <span>{locationText}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Legal Links, Scroll to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {settings.company_name || 'Angel Consultancy and Network'}. Todos os direitos reservados.
          </div>

          {/* Legal & Admin Links */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors"
              title="Acesso Administrativo"
            >
              <Lock className="w-3 h-3" />
              <span>Painel</span>
            </Link>
            <span className="text-slate-700">•</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
              aria-label="Voltar ao topo da página"
            >
              <span>Voltar ao topo</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
