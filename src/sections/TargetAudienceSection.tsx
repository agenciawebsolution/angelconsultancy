import React from 'react';
import { motion } from 'framer-motion';
import { User, Building2, UserCheck, Globe, ArrowRight, ShieldCheck } from 'lucide-react';
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
    <User className="w-7 h-7 text-brand-navy" key="0" />,
    <UserCheck className="w-7 h-7 text-brand-amber-600" key="1" />,
    <Building2 className="w-7 h-7 text-brand-navy" key="2" />,
    <Globe className="w-7 h-7 text-brand-amber-600" key="3" />,
  ];

  return (
    <section id="publico" className="py-20 lg:py-28 bg-white relative border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {audT.items.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="group relative bg-slate-50 hover:bg-white rounded-3xl p-7 border border-slate-100 hover:border-brand-navy-200 shadow-soft-sm hover:shadow-soft-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-white shadow-soft-sm group-hover:bg-brand-navy-50 flex items-center justify-center transition-colors duration-300 border border-slate-100 mb-6">
                  {icons[index % icons.length]}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-navy transition-colors duration-200 mb-3">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Highlights */}
                <div className="space-y-1.5 pt-3 border-t border-slate-200/60">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-amber flex-shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA trigger */}
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-navy" />
                  Atendimento dedicado
                </span>
                <a
                  href="#contato"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-navy hover:text-brand-navy-700 transition-colors"
                >
                  <span>Conversar</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
