import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Sliders, MessageCircle, HeartHandshake, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../lib/animations';
import { useLanguage } from '../i18n/LanguageContext';

export interface MethodologySectionData {
  tag?: string;
  title?: string;
  subtitle?: string;
}

interface MethodologySectionProps {
  data?: MethodologySectionData;
}

export const MethodologySection: React.FC<MethodologySectionProps> = ({ data }) => {
  const { translations } = useLanguage();
  const methT = translations.methodology;

  const stepIcons = [
    <Clock className="w-6 h-6 text-[#D4AF37]" key="0" />,
    <Sliders className="w-6 h-6 text-[#D4AF37]" key="1" />,
    <MessageCircle className="w-6 h-6 text-[#D4AF37]" key="2" />,
    <HeartHandshake className="w-6 h-6 text-[#D4AF37]" key="3" />,
  ];

  return (
    <section id="metodo" className="py-24 lg:py-32 bg-gradient-to-b from-[#0A162B] via-[#0E1E38] to-[#0A162B] text-white relative overflow-hidden">
      {/* Luxury Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#D4AF37]/10 blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#1D5BD8]/15 blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#F3E5AB] text-xs font-bold border border-[#D4AF37]/40 uppercase tracking-wider mb-4 shadow-soft-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{data?.tag || methT.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.14]">
            {data?.title || methT.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            {data?.subtitle || methT.subtitle}
          </p>
        </div>

        {/* Sequential Steps with Connected Progress Line */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="relative mt-8 sm:mt-12"
        >
          {/* Subtle Horizontal Glowing Connector Line on Desktop */}
          <div className="hidden lg:block absolute top-20 left-12 right-12 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {methT.steps.map((step, index) => (
              <motion.div
                key={step.step}
                variants={fadeInUp}
                className="group relative bg-white/[0.04] backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:border-[#D4AF37]/60 hover:bg-white/[0.08] hover:-translate-y-1.5 shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Step indicator & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 group-hover:bg-[#D4AF37]/20 flex items-center justify-center transition-all duration-300 border border-white/10 group-hover:border-[#D4AF37]/50 shadow-soft-xs">
                      <div className="transition-transform duration-300 group-hover:scale-110">
                        {stepIcons[index % stepIcons.length]}
                      </div>
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-white/30 group-hover:text-[#D4AF37] transition-colors duration-300 font-mono">
                      {step.step}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#F3E5AB] transition-colors duration-200 mb-3 leading-snug">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                    Etapa {index + 1}
                  </span>
                  <span className="text-[11px] font-mono text-[#D4AF37]">
                    Fase {index + 1}/4
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Closing Purpose Banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 max-w-3xl mx-auto rounded-3xl bg-gradient-to-r from-white/[0.08] via-white/[0.12] to-white/[0.08] backdrop-blur-xl border border-[#D4AF37]/40 text-white p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden"
        >
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0A162B] border border-[#D4AF37]/50 text-[#D4AF37] mb-1 shadow-soft-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {methT.closingAuthor}
            </h3>
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-normal max-w-xl mx-auto">
              "{methT.closingQuote}"
            </p>
            <div className="pt-2">
              <a
                href="#contato"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#0A162B] font-bold text-xs sm:text-sm hover:bg-slate-100 transition-all shadow-soft-sm active:scale-95"
              >
                <span>Fale Conosco e Inicie seu Atendimento</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
