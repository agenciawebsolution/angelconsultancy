import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles, Heart, Compass, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
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

  const cardMeta = [
    { icon: <Heart className="w-5 h-5 text-[#1D5BD8]" /> },
    { icon: <Compass className="w-5 h-5 text-[#D4AF37]" /> },
    { icon: <ShieldCheck className="w-5 h-5 text-[#0A162B]" /> },
    { icon: <Sparkles className="w-5 h-5 text-[#D4AF37]" /> },
  ];

  return (
    <section id="quem-somos" className="py-24 lg:py-32 bg-gradient-to-b from-[#F6F8FC] via-white to-[#F6F8FC] relative overflow-hidden border-b border-slate-200/80">
      {/* Decorative Subtle Geometric Corporate Lines */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="hidden xl:block absolute top-12 left-8 w-24 h-24 border border-slate-200/50 rounded-3xl pointer-events-none rotate-12" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* Left Column: High-End Editorial Composition */}
          <motion.div variants={fadeInUp} className="lg:col-span-6 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-soft-xs text-[#0A162B] text-xs font-bold border border-slate-200 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[#0A162B] font-extrabold">{data?.tag || introT.tag}</span>
            </div>

            {/* Headline with Royal Blue Accent */}
            <div className="relative pl-6 sm:pl-8 border-l-4 border-[#0A162B] space-y-3">
              <Quote className="w-12 h-12 text-[#0A162B]/10 absolute -top-4 -left-3 rotate-180 -z-10" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A162B] leading-tight tracking-tight">
                {data?.quoteTitle || introT.quoteTitle}{' '}
                <span className="text-[#1D5BD8] inline">{introT.clarityAccent}</span>
              </h2>
            </div>

            {/* Editorial Paragraphs */}
            <div className="space-y-4 text-slate-600 text-base sm:text-[1.05rem] leading-relaxed font-normal">
              <p>{data?.paragraph1 || introT.paragraph1}</p>
              <p>{data?.paragraph2 || introT.paragraph2}</p>
            </div>

            {/* Corporate Purpose Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-white to-[#EEF4FB] border border-blue-100 shadow-soft-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-2 h-full bg-[#1D5BD8] rounded-r-2xl" />
              <p className="text-xs uppercase tracking-wider font-extrabold text-[#0A162B] mb-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                {data?.boxTitle || introT.boxTitle}
              </p>
              <p className="text-slate-700 font-medium text-sm sm:text-base leading-relaxed">
                {data?.boxText || introT.boxText}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-[#1D5BD8]">
                <span>{introT.locationNote}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.div>

          {/* Right Column: 4 Luxury Value Cards */}
          <motion.div variants={fadeInUp} className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {(introT.valueCards || []).map((card, idx) => (
              <div
                key={idx}
                className="group relative p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm hover:shadow-soft-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-[#F6F8FC] group-hover:bg-[#0A162B] group-hover:text-white flex items-center justify-center transition-all duration-300 border border-slate-200/80 shadow-soft-xs">
                      {cardMeta[idx % cardMeta.length].icon}
                    </div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-[#D4AF37] transition-colors">
                      {card.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#0A162B] group-hover:text-[#1D5BD8] transition-colors mb-2.5 leading-snug">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {card.desc}
                  </p>
                </div>

                {/* Bottom subtle check indicator */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{introT.commitment}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
