import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, Target, ShieldCheck, Globe } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const DifferentialsBar: React.FC = () => {
  const { language } = useLanguage();

  const differentials = [
    {
      icon: <HeartHandshake className="w-5 h-5 text-[#D4AF37]" />,
      title: {
        'pt-BR': 'Atendimento personalizado',
        'en': 'Personalized service',
        'fr': 'Service personnalisé',
      }[language] || 'Atendimento personalizado',
      subtitle: {
        'pt-BR': 'Pessoas reais, soluções reais.',
        'en': 'Real people, real solutions.',
        'fr': 'Des personnes réelles, des solutions réelles.',
      }[language] || 'Pessoas reais, soluções reais.',
    },
    {
      icon: <Target className="w-5 h-5 text-[#D4AF37]" />,
      title: {
        'pt-BR': 'Foco em resultados',
        'en': 'Focus on results',
        'fr': 'Axé sur les résultats',
      }[language] || 'Foco em resultados',
      subtitle: {
        'pt-BR': 'Mais organização, mais liberdade.',
        'en': 'More organization, more freedom.',
        'fr': 'Plus d\'organisation, plus de liberté.',
      }[language] || 'Mais organização, mais liberdade.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />,
      title: {
        'pt-BR': 'Segurança e confidencialidade',
        'en': 'Security and confidentiality',
        'fr': 'Sécurité et confidentialité',
      }[language] || 'Segurança e confidencialidade',
      subtitle: {
        'pt-BR': 'Seus dados sempre protegidos.',
        'en': 'Your data always protected.',
        'fr': 'Vos données toujours protégées.',
      }[language] || 'Seus dados sempre protegidos.',
    },
    {
      icon: <Globe className="w-5 h-5 text-[#D4AF37]" />,
      title: {
        'pt-BR': 'Atuação internacional',
        'en': 'International presence',
        'fr': 'Présence internationale',
      }[language] || 'Atuação internacional',
      subtitle: {
        'pt-BR': 'Apoiando você na Europa.',
        'en': 'Supporting you in Europe.',
        'fr': 'Vous soutenir en Europe.',
      }[language] || 'Apoiando você na Europa.',
    },
  ];

  return (
    <section className="relative bg-[#0A162B] text-white border-y border-slate-800 shadow-2xl overflow-hidden z-20">
      {/* Subtle organic light accent */}
      <div className="absolute -top-24 left-1/3 w-96 h-48 bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-96 h-48 bg-[#1D5BD8]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-0">
          {differentials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
              className={`flex items-center gap-4 px-3 lg:px-6 py-2 group cursor-default transition-all duration-300 rounded-2xl hover:bg-white/[0.04] ${
                index < differentials.length - 1 ? 'lg:border-r lg:border-white/10' : ''
              }`}
            >
              {/* Circular Gold Icon Frame with Soft Glow on Hover */}
              <div className="relative w-12 h-12 rounded-full border border-[#D4AF37]/50 bg-white/[0.04] group-hover:bg-[#D4AF37]/15 group-hover:border-[#D4AF37] group-hover:scale-105 flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-soft-xs">
                <div className="transition-transform duration-300 group-hover:rotate-6">
                  {item.icon}
                </div>
                <div className="absolute inset-0 rounded-full bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/10 blur-sm transition-all duration-300" />
              </div>

              {/* Text Content */}
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-[#F3E5AB] transition-colors leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-[13px] text-slate-300 mt-0.5 leading-tight font-normal">
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
