import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, Target, ShieldCheck, Globe } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const DifferentialsBar: React.FC = () => {
  const { translations } = useLanguage();
  const diffItems = translations.differentials?.items || [];

  const icons = [
    <HeartHandshake className="w-5 h-5 text-[#D4AF37]" key="0" />,
    <Target className="w-5 h-5 text-[#D4AF37]" key="1" />,
    <ShieldCheck className="w-5 h-5 text-[#D4AF37]" key="2" />,
    <Globe className="w-5 h-5 text-[#D4AF37]" key="3" />,
  ];

  return (
    <section className="relative bg-[#0A162B] text-white border-y border-slate-800 shadow-2xl overflow-hidden z-20">
      {/* Subtle organic light accent */}
      <div className="absolute -top-24 left-1/3 w-96 h-48 bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-96 h-48 bg-[#1D5BD8]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-9 relative z-10">
        {/* On mobile/tablet (< 1024px): Horizontal swipeable track with snap
            On desktop (>= 1024px): Standard 4-column balanced grid */}
        <div className="flex lg:grid lg:grid-cols-4 overflow-x-auto lg:overflow-visible no-scrollbar snap-x snap-mandatory gap-3.5 sm:gap-4 lg:gap-0 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 py-1">
          {diffItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
              className={`flex-shrink-0 min-w-[260px] sm:min-w-[280px] lg:min-w-0 snap-center flex items-center gap-3.5 sm:gap-4 px-4 lg:px-6 py-3 lg:py-2 group cursor-default transition-all duration-300 rounded-2xl bg-white/[0.03] lg:bg-transparent border border-white/5 lg:border-none hover:bg-white/[0.06] ${
                index < diffItems.length - 1 ? 'lg:border-r lg:border-white/10' : ''
              }`}
            >
              {/* Circular Gold Icon Frame with Soft Glow on Hover */}
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#D4AF37]/50 bg-white/[0.04] group-hover:bg-[#D4AF37]/15 group-hover:border-[#D4AF37] group-hover:scale-105 flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-soft-xs">
                <div className="transition-transform duration-300 group-hover:rotate-6">
                  {icons[index % icons.length]}
                </div>
                <div className="absolute inset-0 rounded-full bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/10 blur-sm transition-all duration-300" />
              </div>

              {/* Text Content */}
              <div className="min-w-0 flex-1">
                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-[#F3E5AB] transition-colors leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-[13px] text-slate-300 mt-0.5 leading-snug font-normal">
                  {item.subtitle}
                </p>
                {/* Micro accent gold line on hover */}
                <span className="block w-0 group-hover:w-6 h-0.5 bg-[#D4AF37] mt-1.5 transition-all duration-300 rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
