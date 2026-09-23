import React from 'react';
import { motion } from 'framer-motion';
import { 
  FolderArchive, 
  Calculator, 
  Users, 
  Briefcase, 
  Check, 
  ArrowRight,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import { SectionTitle } from '../components/ui/SectionTitle';
import { fadeInUp, staggerContainer } from '../lib/animations';
import { useLanguage } from '../i18n/LanguageContext';

export interface ServicesSectionData {
  tag?: string;
  title?: string;
  subtitle?: string;
}

interface ServicesSectionProps {
  data?: ServicesSectionData;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ data }) => {
  const { translations } = useLanguage();
  const servT = translations.services;

  const icons = [
    <FolderArchive className="w-6 h-6 text-brand-navy" key="0" />,
    <Calculator className="w-6 h-6 text-brand-amber-600" key="1" />,
    <Users className="w-6 h-6 text-brand-navy" key="2" />,
    <Briefcase className="w-6 h-6 text-brand-amber-600" key="3" />,
    <ShieldCheck className="w-6 h-6 text-brand-navy" key="4" />,
    <HeartHandshake className="w-6 h-6 text-brand-amber-600" key="5" />,
  ];

  return (
    <section id="servicos" className="py-20 lg:py-28 bg-[#FAFBFD] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          tag={data?.tag || servT.tag}
          tagVariant="blue"
          title={data?.title || servT.title}
          subtitle={data?.subtitle || servT.subtitle}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {servT.items.map((service, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="group relative bg-white rounded-3xl p-7 sm:p-9 border border-slate-100 shadow-soft-sm hover:shadow-soft-xl hover:border-brand-navy-200 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header card: Number & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-brand-navy-50 text-slate-700 group-hover:text-brand-navy flex items-center justify-center transition-colors duration-300 border border-slate-100">
                    {icons[index % icons.length]}
                  </div>
                  <span className="text-3xl font-black text-slate-200 group-hover:text-brand-navy-100 transition-colors duration-300 select-none">
                    {`0${index + 1}`}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-brand-navy transition-colors duration-200 mb-3 leading-snug">
                  {service.title}
                </h3>

                {/* Subtitle / Description */}
                <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features List */}
                <div className="pt-4 border-t border-slate-100">
                  <ul className="space-y-2.5">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Link to Contact Form */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <a
                  href="#contato"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy hover:text-brand-navy-700 group-hover:translate-x-1 transition-all duration-200"
                >
                  <span>{servT.ctaButton}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
