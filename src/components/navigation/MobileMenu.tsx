import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { X, Phone, Mail, ArrowRight } from 'lucide-react';
import type { NavItem } from '../../types';
import { useScrollLock } from '../../hooks/useScrollLock';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

const overlayVariants: Variants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.3 } },
};

const drawerVariants: Variants = {
  closed: {
    x: '100%',
    transition: {
      type: 'spring' as const,
      damping: 30,
      stiffness: 300,
    },
  },
  open: {
    x: '0%',
    transition: {
      type: 'spring' as const,
      damping: 28,
      stiffness: 260,
      staggerChildren: 0.07,
      delayChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  closed: { opacity: 0, x: 30 },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, navItems }) => {
  // Lock body scroll while drawer is open
  useScrollLock(isOpen);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Derive active section cleanly during render
  const getActiveSection = () => {
    if (typeof window === 'undefined') return '#inicio';
    const sections = navItems.map(item => item.href.replace('#', ''));
    const currentScroll = window.scrollY + 140;
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el && el.offsetTop <= currentScroll) {
        return `#${sections[i]}`;
      }
    }
    return '#inicio';
  };

  const activeSection = isOpen ? getActiveSection() : '#inicio';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop Overlay */}
          <motion.div
            key="mobile-overlay"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          {/* Drawer (80% width) */}
          <motion.aside
            key="mobile-drawer"
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal de navegação"
            className="relative z-10 w-[82vw] max-w-[380px] min-w-[280px] h-full bg-white shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-slate-100"
          >
            {/* Header / Top bar inside drawer */}
            <div>
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <a href="#inicio" onClick={onClose} className="flex items-center gap-2">
                  <img src="/logo.png" alt="Angel Consultancy" className="h-8 w-auto object-contain" />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fechar menu"
                  className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-brand-navy"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links with staggered entrance */}
              <nav className="p-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">
                  Navegação
                </p>
                <motion.ul className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = item.href === activeSection;
                    return (
                      <motion.li key={item.label} variants={itemVariants}>
                        <a
                          href={item.href}
                          onClick={onClose}
                          className={`group flex items-center justify-between px-3.5 py-3 rounded-xl text-base transition-all duration-200 ${
                            isActive
                              ? 'bg-brand-navy-50 text-brand-navy font-semibold'
                              : 'text-slate-700 hover:text-brand-navy hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {isActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-amber flex-shrink-0" />
                            )}
                            <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                              {item.label}
                            </span>
                          </div>
                          <ArrowRight className={`w-4 h-4 transition-all duration-200 ${
                            isActive 
                              ? 'text-brand-navy opacity-100' 
                              : 'text-slate-400 group-hover:text-brand-navy group-hover:translate-x-1 opacity-0 group-hover:opacity-100'
                          }`} />
                        </a>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </nav>
            </div>

            {/* Bottom Drawer CTA & Direct Contacts */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/70 space-y-4">
              <a
                href="#contato"
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-brand-navy hover:bg-brand-navy-700 text-white text-sm font-semibold shadow-soft-sm transition-all duration-200 active:scale-[0.98]"
              >
                <span>Fale conosco</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Direct channels */}
              <div className="pt-2 space-y-2 text-xs text-slate-600">
                <a
                  href="tel:+32492319741"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white transition-colors"
                >
                  <Phone className="w-4 h-4 text-brand-navy flex-shrink-0" />
                  <span className="font-medium">+32 492 319 741</span>
                </a>
                <a
                  href="mailto:info@angel-consultancy.be"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-brand-navy flex-shrink-0" />
                  <span className="font-medium truncate">info@angel-consultancy.be</span>
                </a>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
