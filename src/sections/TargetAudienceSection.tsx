import React from 'react';
import { motion } from 'framer-motion';
import { User, Building2, UserCheck, Globe, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { SectionTitle } from '../components/ui/SectionTitle';
import { fadeInUp, staggerContainer } from '../lib/animations';
import { useLanguage } from '../i18n/LanguageContext';

export interface AudienceSectionData {
  tag?: string;
  title?: string;
  subtitle?: string;
}

interface TargetAudienceSectionProps {
  data?: AudienceSectionData;
}

export const TargetAudienceSection: React.FC<TargetAudienceSectionProps> = ({ data }) => {
  const { translations } = useLanguage();
  const audT = translations.audience;

  const icons = [
    <User className="w-6 h-6 text-[#1D5BD8]" key="0" />,
    <UserCheck className="w-6 h-6 text-[#D4AF37]" key="1" />,
    <Building2 className="w-6 h-6 text-[#1D5BD8]" key="2" />,
    <Globe className="w-6 h-6 text-[#D4AF37]" key="3" />,
  ];

  return (
    <section id="publico" className="py-24 lg:py-32 bg-white relative border-b border-slate-200/80 overflow-hidden">
      {/* Subtle organic light accent */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-50/40 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle
          tag={data?.tag || audT.tag}
          tagVariant="amber"
          title={data?.title || audT.title}
          subtitle={data?.subtitle || audT.subtitle}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 sm:mt-16"
        >
          {audT.items.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="group relative bg-[#F6F8FC] hover:bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 hover:border-slate-300 shadow-soft-sm hover:shadow-soft-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Subtle top indicator line on hover */}
              <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-[#1D5BD8] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-full" />

              <div>
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-2xl bg-white shadow-soft-xs group-hover:bg-[#0A162B] flex items-center justify-center transition-all duration-300 border border-slate-200 mb-6">
                  <div className="transition-transform duration-300 group-hover:scale-110">
                    {icons[index % icons.length]}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-[#0A162B] group-hover:text-[#1D5BD8] transition-colors duration-200 mb-3 leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5 font-normal">
                  {item.description}
                </p>

                {/* Highlights List with Gold Bullets */}
                <div className="space-y-2 pt-4 border-t border-slate-200/70">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-[#D4AF37]" />
                      </span>
                      <span className="leading-snug">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Trigger */}
              <div className="mt-6 pt-4 border-t border-slate-200/70 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1D5BD8]" />
                  {audT.customTag || 'Sob medida'}
                </span>
                <a
                  href="#contato"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0A162B] group-hover:text-[#1D5BD8] transition-colors"
                >
                  <span>{audT.talkButton || 'Conversar'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
