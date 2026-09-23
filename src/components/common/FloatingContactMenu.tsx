import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  MessageCircle, 
  Mail, 
  Phone, 
  X, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const FloatingContactMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Option 2 handler: Smooth scroll to contact form, highlight card & focus first field
  const handleEmailFormClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);

    const contactSection = document.getElementById('contato');
    const formCard = document.getElementById('contact-form-card') || contactSection;

    if (formCard) {
      formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Apply luxury highlighting glow/ring for 3 seconds
      formCard.classList.add(
        'ring-4', 
        'ring-[#1D5BD8]/40', 
        'border-[#1D5BD8]', 
        'shadow-[0_0_45px_rgba(29,91,216,0.25)]'
      );
      
      const timer = setTimeout(() => {
        formCard.classList.remove(
          'ring-4', 
          'ring-[#1D5BD8]/40', 
          'border-[#1D5BD8]', 
          'shadow-[0_0_45px_rgba(29,91,216,0.25)]'
        );
      }, 3000);

      // Focus the first fillable field in the form
      setTimeout(() => {
        const nameInput = document.getElementById('contact-form-name') as HTMLInputElement | null;
        if (nameInput) {
          nameInput.focus();
        } else {
          const firstInput = formCard.querySelector('input:not([type="hidden"])') as HTMLInputElement | null;
          if (firstInput) firstInput.focus();
        }
      }, 480);

      return () => clearTimeout(timer);
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14, scale: 0.96 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: custom * 0.05,
        duration: 0.22,
        ease: 'easeOut',
      },
    }),
    exit: (custom: number) => ({
      opacity: 0,
      y: 8,
      scale: 0.96,
      transition: {
        delay: (2 - custom) * 0.03,
        duration: 0.16,
        ease: 'easeIn',
      },
    }),
  };

  return (
    <aside 
      ref={menuRef}
      aria-label="Canais de contato direto"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end"
    >
      {/* ========================================================= */}
      {/* Expandable Contact Cards (Floating Upwards)               */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="floating-contact-menu"
            role="menu"
            aria-label="Opções de atendimento direto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="mb-3 w-[265px] sm:w-[285px] flex flex-col gap-2.5 origin-bottom-right"
          >
            {/* Header pill inside menu */}
            <div className="px-3 py-1.5 rounded-xl bg-[#0A162B]/95 backdrop-blur-md border border-[#D4AF37]/30 text-white shadow-soft-sm flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#F3E5AB]">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>Atendimento Angel Consultancy</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Bélgica & UE</span>
            </div>

            {/* 1. WhatsApp Option */}
            <motion.a
              custom={0}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              href="https://wa.me/32492319741"
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              aria-label="Conversar no WhatsApp com +32 492 319 741"
              onClick={() => setIsOpen(false)}
              className="group p-3 rounded-2xl bg-white hover:bg-slate-50/90 border border-slate-200/90 shadow-soft-lg hover:shadow-soft-xl flex items-center justify-between gap-3 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-[#25D366] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-soft-xs">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-[#0A162B] group-hover:text-[#1D5BD8] transition-colors leading-tight">
                    Conversar no WhatsApp
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                    +32 492 319 741
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1D5BD8] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </motion.a>

            {/* 2. Email Option (Scrolls to Form) */}
            <motion.button
              type="button"
              custom={1}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="menuitem"
              aria-label="Enviar um e-mail pelo formulário de contato"
              onClick={handleEmailFormClick}
              className="group p-3 rounded-2xl bg-white hover:bg-slate-50/90 border border-slate-200/90 shadow-soft-lg hover:shadow-soft-xl flex items-center justify-between gap-3 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D5BD8]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#1D5BD8] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-soft-xs">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-[#0A162B] group-hover:text-[#1D5BD8] transition-colors leading-tight">
                    Enviar um e-mail
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                    Preencher formulário no site
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1D5BD8] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </motion.button>

            {/* 3. Phone Call Option */}
            <motion.a
              custom={2}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              href="tel:+32492319741"
              role="menuitem"
              aria-label="Telefonar para +32 492 319 741"
              onClick={() => setIsOpen(false)}
              className="group p-3 rounded-2xl bg-white hover:bg-slate-50/90 border border-slate-200/90 shadow-soft-lg hover:shadow-soft-xl flex items-center justify-between gap-3 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-[#D4AF37] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-soft-xs">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-[#0A162B] group-hover:text-[#1D5BD8] transition-colors leading-tight">
                    Telefonar
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                    +32 492 319 741
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1D5BD8] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* Main Trigger Floating Button                              */}
      {/* ========================================================= */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="floating-contact-menu"
        aria-label={isOpen ? "Fechar canais de contato" : "Fale Conosco — Canais de atendimento Angel Consultancy"}
        className={`group flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full text-white font-bold text-xs uppercase tracking-wider shadow-soft-xl hover:shadow-2xl transition-all duration-300 active:scale-95 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1D5BD8] ${
          isOpen
            ? 'bg-[#0A162B] border-[#D4AF37] text-white'
            : 'bg-gradient-to-r from-[#0A162B] via-[#0E203C] to-[#123A73] hover:from-[#102D55] hover:to-[#1D5BD8] border-[#D4AF37]/50 hover:border-[#D4AF37]'
        }`}
      >
        {/* Animated Icon Rotation */}
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0, scale: isOpen ? 1.05 : 1 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="flex items-center justify-center flex-shrink-0"
        >
          {isOpen ? (
            <X className="w-4 h-4 text-[#D4AF37]" />
          ) : (
            <div className="relative">
              <MessageCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#D4AF37]" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0A162B] animate-pulse" />
            </div>
          )}
        </motion.div>

        {/* Button Label */}
        <span className="text-xs font-extrabold tracking-wide">
          {isOpen ? 'Fechar' : 'Fale Conosco'}
        </span>
      </button>
    </aside>
  );
};
