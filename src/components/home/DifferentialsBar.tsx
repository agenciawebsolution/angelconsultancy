import React from 'react';
import { motion } from 'framer-motion';
import { HeartHandshake, Target, ShieldCheck, Globe2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const DifferentialsBar: React.FC = () => {
  const { language } = useLanguage();

  const differentials = [
    {
      icon: <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />,
      title: {
        'pt-BR': 'Atendimento Personalizado',
        'en': 'Personalized Service',
        'fr': 'Service Personnalisé',
      }[language] || 'Atendimento Personalizado',
      subtitle: {
        'pt-BR': 'Pessoas reais, soluções reais e suporte próximo.',
        'en': 'Real people, real solutions, and close support.',
        'fr': 'Des personnes réelles, des solutions concrètes et un suivi attentif.',
      }[language] || 'Pessoas reais, soluções reais e suporte próximo.',
    },
    {
      icon: <Target className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />,
      title: {
        'pt-BR': 'Foco em Resultados',
        'en': 'Results-Driven',
        'fr': 'Axé sur les Résultats',
      }[language] || 'Foco em Resultados',
      subtitle: {
        'pt-BR': 'Mais organização financeira e liberdade para você.',
        'en': 'Greater financial organization and personal freedom.',
        'fr': 'Plus d\'organisation financière et de liberté au quotidien.',
      }[language] || 'Mais organização financeira e liberdade para você.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />,
      title: {
        'pt-BR': 'Segurança & Confidencialidade',
        'en': 'Security & Confidentiality',
        'fr': 'Sécurité & Confidentialité',
      }[language] || 'Segurança & Confidencialidade',
      subtitle: {
        'pt-BR': 'Seus dados e processos sempre protegidos com rigor.',
        'en': 'Your data and processes strictly guarded at all times.',
        'fr': 'Vos données et démarches strictement protégées.',
      }[language] || 'Seus dados e processos sempre protegidos com rigor.',
    },
    {
      icon: <Globe2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />,
      title: {
        'pt-BR': 'Atuação Internacional',
        'en': 'International Presence',
        'fr': 'Présence Internationale',
      }[language] || 'Atuação Internacional',
      subtitle: {
        'pt-BR': 'Apoiando você com excelência na Bélgica e Europa.',
        'en': 'Excellence in supporting you across Belgium and Europe.',
        'fr': 'Accompagnement d\'excellence en Belgique et en Europe.',
      }[language] || 'Apoiando você com excelência na Bélgica e Europa.',
    },
  ];

  return (
    <section className="relative bg-[#0B1528] text-white border-y border-[#D4AF37]/20 shadow-soft-xl overflow-hidden z-20">
      {/* Subtle luxury ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,175,55,0.12),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {differentials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group flex items-start gap-4 p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] hover:border-[#D4AF37]/40 transition-all duration-300"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#132342] to-[#0A162B] border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0 shadow-soft-sm group-hover:scale-105 group-hover:border-[#D4AF37]/70 transition-all duration-300">
                {item.icon}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-[#F3E5AB] transition-colors duration-200 leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300/85 mt-1 leading-relaxed">
                  {item.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
    </section>
  );
};
