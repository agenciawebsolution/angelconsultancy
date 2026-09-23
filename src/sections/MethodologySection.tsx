import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Sliders, MessageCircle, HeartHandshake, ShieldCheck } from 'lucide-react';
import { SectionTitle } from '../components/ui/SectionTitle';
import type { MethodologyStep } from '../types';
import { fadeInUp, staggerContainer } from '../lib/animations';

const stepsData: MethodologyStep[] = [
  {
    number: '01',
    title: 'No seu próprio ritmo',
    description: 'Explicamos cada passo com calma e no seu ritmo, para que nada fique confuso ou apressado.',
    icon: 'clock',
  },
  {
    number: '02',
    title: 'Adaptado a você',
    description: 'Adaptamos tudo ao seu nível de conhecimento, respeitando sua bagagem e esclarecendo cada dúvida.',
    icon: 'sliders',
  },
  {
    number: '03',
    title: 'Linguagem simples e humana',
    description: 'Evitamos termos técnicos, preferindo uma linguagem simples e acessível em cada orientação.',
    icon: 'message',
  },
  {
    number: '04',
    title: 'Contato próximo e contínuo',
    description: 'Mantemos contato próximo para que você nunca se sinta sozinho durante todo o processo.',
    icon: 'heartHandshake',
  },
];

export interface MethodologySectionData {
  tag?: string;
  title?: string;
  subtitle?: string;
}

interface MethodologySectionProps {
  data?: MethodologySectionData;
}

export const MethodologySection: React.FC<MethodologySectionProps> = ({ data }) => {
  const getStepIcon = (icon: string) => {
    switch (icon) {
      case 'clock':
        return <Clock className="w-6 h-6 text-brand-navy" />;
      case 'sliders':
        return <Sliders className="w-6 h-6 text-brand-amber-600" />;
      case 'message':
        return <MessageCircle className="w-6 h-6 text-brand-navy" />;
      case 'heartHandshake':
        return <HeartHandshake className="w-6 h-6 text-brand-amber-600" />;
      default:
        return <Clock className="w-6 h-6 text-brand-navy" />;
    }
  };

  return (
    <section id="como-trabalhamos" className="py-20 lg:py-28 bg-[#FAFBFD] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          tag={data?.tag || "Nosso Jeito de Trabalhar"}
          tagVariant="blue"
          title={data?.title || "Acolhimento, paciência e comunicação transparente"}
          subtitle={data?.subtitle || "Acreditamos em um processo humano onde você é ouvido com atenção e participa ativamente de cada escolha."}
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
            {stepsData.map((step) => (
              <motion.div
                key={step.number}
                variants={fadeInUp}
                className="group relative bg-white rounded-3xl p-7 border border-slate-100 shadow-soft-sm hover:shadow-soft-lg hover:border-brand-navy-200 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Step indicator & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-13 h-13 rounded-2xl bg-slate-50 group-hover:bg-brand-navy-50 text-slate-800 group-hover:text-brand-navy flex items-center justify-center transition-colors duration-300 border border-slate-100 p-3">
                      {getStepIcon(step.icon)}
                    </div>
                    <span className="text-2xl font-black text-slate-200 group-hover:text-brand-amber transition-colors duration-300">
                      {step.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-navy transition-colors duration-200 mb-2.5">
                    {step.title}
                  </h3>

                  {/* Description strictly from client text */}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-navy" />
                  <span>Etapa {step.number}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Closing Purpose Banner strictly based on client doc */}
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
              Nosso Propósito
            </h3>
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-normal max-w-xl mx-auto">
              “Fazer com que você entenda, participe e se sinta seguro em todas as decisões.”
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
