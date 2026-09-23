import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles, Heart, Compass, ShieldCheck } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../lib/animations';
import { useLanguage } from '../i18n/LanguageContext';

export interface IntroSectionData {
  tag?: string;
  quoteTitle?: string;
  paragraph1?: string;
  paragraph2?: string;
  boxTitle?: string;
  boxText?: string;
}

interface IntroSectionProps {
  data?: IntroSectionData;
}

export const IntroSection: React.FC<IntroSectionProps> = ({ data }) => {
  const { translations } = useLanguage();
  const introT = translations.intro;

  return (
    <section id="sobre" className="py-20 lg:py-28 bg-white relative overflow-hidden border-y border-slate-100">
      {/* Decorative subtle background accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-brand-navy-50/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-amber-50/60 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* Left Column: Mission Quote Box */}
          <motion.div variants={fadeInUp} className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B1528]/5 text-[#0B1528] text-xs sm:text-sm font-bold border border-[#D4AF37]/40 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{data?.tag || introT.tag}</span>
            </div>

            <div className="relative pl-6 sm:pl-8 border-l-4 border-[#0B1528] space-y-4">
              <Quote className="w-10 h-10 text-[#0B1528]/10 absolute -top-4 -left-3 rotate-180 -z-10" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-snug tracking-tight">
                {data?.quoteTitle || introT.quoteTitle}
              </h2>
            </div>

            <div className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed pt-2 font-normal">
              <p>{data?.paragraph1 || introT.paragraph1}</p>
              <p>{data?.paragraph2 || introT.paragraph2}</p>
            </div>

            {/* Quote banner for "O que fazemos por você" */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-[#0B1528]/5 border border-slate-200/80 shadow-soft-xs">
              <p className="text-xs uppercase tracking-wider font-extrabold text-[#0B1528] mb-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                {data?.boxTitle || introT.boxTitle}
              </p>
              <p className="text-slate-700 font-medium text-sm sm:text-base leading-relaxed">
                {data?.boxText || introT.boxText}
              </p>
            </div>
          </motion.div>

          {/* Right Column: Values Pillars based strictly on the text */}
          <motion.div variants={fadeInUp} className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Pillar 1: Acolhimento */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-navy-100 hover:bg-white hover:shadow-soft-md transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-white shadow-soft-sm text-brand-navy flex items-center justify-center mb-4 border border-slate-100">
                <Heart className="w-6 h-6 text-brand-navy" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Acolhimento Real
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Um suporte atencioso que compreende suas necessidades práticas e respeita o seu tempo, sem julgamentos.
              </p>
            </div>

            {/* Pillar 2: Clareza */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-amber-200 hover:bg-white hover:shadow-soft-md transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-white shadow-soft-sm text-brand-amber flex items-center justify-center mb-4 border border-slate-100">
                <Compass className="w-6 h-6 text-brand-amber" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Linguagem Simples
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Explicamos tudo com clareza, evitando jargões ou termos técnicos para que você entenda cada detalhe com segurança.
              </p>
            </div>

            {/* Pillar 3: Segurança */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-navy-100 hover:bg-white hover:shadow-soft-md transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-white shadow-soft-sm text-brand-navy flex items-center justify-center mb-4 border border-slate-100">
                <ShieldCheck className="w-6 h-6 text-brand-navy" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Decisões Seguras
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Orientação sólida e verdadeira para que você tenha tranquilidade em todas as suas obrigações e escolhas.
              </p>
            </div>

            {/* Pillar 4: Leveza */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-amber-200 hover:bg-white hover:shadow-soft-md transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-white shadow-soft-sm text-brand-amber flex items-center justify-center mb-4 border border-slate-100">
                <Sparkles className="w-6 h-6 text-brand-amber" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Vida Mais Leve
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Transformamos burocracias e papeladas acumuladas em rotinas simples, organizadas e tranquilas.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
