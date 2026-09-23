import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Sliders, MessageCircle, HeartHandshake, ShieldCheck } from 'lucide-react';
import { SectionTitle } from '../components/ui/SectionTitle';
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
    <Clock className="w-6 h-6 text-brand-navy" key="0" />,
    <Sliders className="w-6 h-6 text-brand-amber-600" key="1" />,
    <MessageCircle className="w-6 h-6 text-brand-navy" key="2" />,
    <HeartHandshake className="w-6 h-6 text-brand-amber-600" key="3" />,
  ];

  return (
    <section id="metodo" className="py-20 lg:py-28 bg-[#FAFBFD] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          tag={data?.tag || methT.tag}
          tagVariant="blue"
          title={data?.title || methT.title}
          subtitle={data?.subtitle || methT.subtitle}
        />

        {/* Timeline / Sequential Steps */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative mt-8 sm:mt-12"
        >
          {/* Subtle Horizontal Connector Bar on Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-slate-200/80 -translate-y-12 -z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {methT.steps.map((step, index) => (
              <motion.div
                key={step.step}
                variants={fadeInUp}
                className="group relative bg-white rounded-3xl p-7 border border-slate-100 shadow-soft-sm hover:shadow-soft-lg hover:border-brand-navy-200 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Step indicator & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-13 h-13 rounded-2xl bg-slate-50 group-hover:bg-brand-navy-50 text-slate-800 group-hover:text-brand-navy flex items-center justify-center transition-colors duration-300 border border-slate-100 p-3">
                      {stepIcons[index % stepIcons.length]}
                    </div>
                    <span className="text-2xl font-black text-slate-200 group-hover:text-brand-amber transition-colors duration-300">
                      {step.step}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-navy transition-colors duration-200 mb-2.5">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-navy" />
                  <span>{step.step}</span>
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
          className="mt-14 max-w-3xl mx-auto rounded-3xl bg-brand-navy text-white p-8 sm:p-10 shadow-soft-xl text-center relative overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-amber/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-brand-amber mb-1">
              <ShieldCheck className="w-5 h-5" />
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
