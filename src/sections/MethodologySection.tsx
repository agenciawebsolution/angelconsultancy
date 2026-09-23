import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Sliders, MessageCircle, HeartHandshake, ShieldCheck } from 'lucide-react';
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
    <section id="metodo" className="py-20 lg:py-28 bg-gradient-to-b from-[#0A162B] via-[#0E1E38] to-[#0B1528] text-white relative overflow-hidden">
      {/* Subtle luxury ambient glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/10 blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#F3E5AB] text-xs sm:text-sm font-bold border border-[#D4AF37]/40 uppercase tracking-wider mb-4">
            <span>{data?.tag || methT.tag}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.16]">
            {data?.title || methT.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            {data?.subtitle || methT.subtitle}
          </p>
        </div>

        {/* Timeline / Sequential Steps */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative mt-8 sm:mt-12"
        >
          {/* Subtle Horizontal Connector Bar on Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent -translate-y-12 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {methT.steps.map((step, index) => (
              <motion.div
                key={step.step}
                variants={fadeInUp}
                className="group relative bg-white/[0.04] backdrop-blur-md rounded-3xl p-7 border border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/[0.08] shadow-soft-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Step indicator & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-13 h-13 rounded-2xl bg-white/10 group-hover:bg-[#D4AF37]/20 flex items-center justify-center transition-colors duration-300 border border-white/10 group-hover:border-[#D4AF37]/40 p-3">
                      {stepIcons[index % stepIcons.length]}
                    </div>
                    <span className="text-2xl font-black text-white/30 group-hover:text-[#D4AF37] transition-colors duration-300">
                      {step.step}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-[#F3E5AB] transition-colors duration-200 mb-2.5">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-300/90 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span className="text-slate-300">{step.step}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Closing Purpose Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 max-w-3xl mx-auto rounded-3xl bg-gradient-to-r from-white/[0.07] via-white/[0.1] to-white/[0.07] backdrop-blur-lg border border-[#D4AF37]/30 text-white p-8 sm:p-10 shadow-soft-2xl text-center relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#D4AF37]/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#0B1528] border border-[#D4AF37]/40 text-[#D4AF37] mb-2 shadow-soft-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {methT.closingAuthor}
            </h3>
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-normal max-w-xl mx-auto">
              {methT.closingQuote}
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
