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
    <FolderArchive className="w-6 h-6 text-[#1D5BD8]" key="0" />,
    <Calculator className="w-6 h-6 text-[#D4AF37]" key="1" />,
    <Users className="w-6 h-6 text-[#1D5BD8]" key="2" />,
    <Briefcase className="w-6 h-6 text-[#D4AF37]" key="3" />,
    <ShieldCheck className="w-6 h-6 text-[#1D5BD8]" key="4" />,
    <HeartHandshake className="w-6 h-6 text-[#D4AF37]" key="5" />,
  ];

  return (
    <section id="servicos" className="py-24 lg:py-32 bg-[#F6F8FC] relative overflow-hidden">
      {/* Soft Ambient Depth */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12 sm:mt-16"
        >
          {servT.items.map((service, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="group relative bg-white rounded-3xl p-8 sm:p-9 border border-slate-200/80 shadow-soft-sm hover:shadow-soft-2xl hover:border-slate-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Subtle top indicator line on hover */}
              <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-full" />

              <div>
                {/* Header card: Number & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#F6F8FC] group-hover:bg-[#0A162B] flex items-center justify-center transition-all duration-300 border border-slate-200 shadow-soft-xs">
                    <div className="transition-transform duration-300 group-hover:scale-110">
                      {icons[index % icons.length]}
                    </div>
                  </div>
                  <span className="text-3xl font-black text-slate-200 group-hover:text-[#D4AF37]/50 transition-colors duration-300 select-none font-mono">
                    {`0${index + 1}`}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-[#0A162B] group-hover:text-[#1D5BD8] transition-colors duration-200 mb-3 leading-snug">
                  {service.title}
                </h3>

                {/* Subtitle / Description */}
                <p className="text-sm sm:text-[15px] text-slate-600 mb-6 leading-relaxed font-normal">
                  {service.description}
                </p>

                {/* Features List */}
                <div className="pt-4 border-t border-slate-100">
                  <ul className="space-y-2.5">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <span className="w-5 h-5 rounded-full bg-blue-50 text-[#1D5BD8] flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-100">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Link to Contact Form */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <a
                  href="#contato"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#0A162B] group-hover:text-[#1D5BD8] transition-colors"
                >
                  <span>{servT.ctaButton}</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37] transition-transform duration-200 group-hover:translate-x-1" />
                </a>

                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-[#D4AF37] transition-colors">
                  {servT.locationTag || 'Bélgica & UE'}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
