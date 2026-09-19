import React from 'react';
import { motion } from 'framer-motion';
import { User, Building2, UserCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { SectionTitle } from '../components/ui/SectionTitle';
import type { TargetAudienceItem } from '../types';
import { fadeInUp, staggerContainer } from '../lib/animations';

const audienceData: TargetAudienceItem[] = [
  {
    id: 'pessoas-fisicas',
    title: 'Pessoas Físicas',
    tag: 'Organização Pessoal',
    description: 'Apoio para quem precisa organizar sua vida administrativa e não sabe por onde começar. Seja uma dúvida simples ou uma reorganização completa, estamos aqui para ajudar com cuidado e clareza.',
    icon: 'user',
  },
  {
    id: 'associacoes',
    title: 'Associações & ONGs',
    tag: 'Gestão Institucional',
    description: 'Da formalização ao funcionamento diário, oferecemos suporte responsável e acessível para garantir que sua associação opere dentro das normas e de forma transparente.',
    icon: 'building',
  },
  {
    id: 'profissionais-autonomos',
    title: 'Profissionais Liberais e Autônomos',
    tag: 'Para Quem Empreende',
    description: 'Para quem trabalha sozinho e precisa de orientação para manter tudo em ordem. Nosso foco é facilitar a sua vida para que você possa se concentrar no que realmente sabe fazer.',
    icon: 'userCheck',
  },
];

export const TargetAudienceSection: React.FC = () => {
  const getAudienceIcon = (icon: string) => {
    switch (icon) {
      case 'user':
        return <User className="w-7 h-7 text-brand-navy" />;
      case 'building':
        return <Building2 className="w-7 h-7 text-brand-amber-600" />;
      case 'userCheck':
        return <UserCheck className="w-7 h-7 text-brand-navy" />;
      default:
        return <User className="w-7 h-7 text-brand-navy" />;
    }
  };

  return (
    <section id="para-quem-e" className="py-20 lg:py-28 bg-white relative border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          tag="Público Atendido"
          tagVariant="amber"
          title="Para quem é o nosso trabalho"
          subtitle="Atendimento focado em quem precisa de apoio verdadeiro, descomplicado e seguro no dia a dia."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {audienceData.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeInUp}
              className="group relative bg-slate-50 hover:bg-white rounded-3xl p-8 border border-slate-100 hover:border-brand-navy-200 shadow-soft-sm hover:shadow-soft-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Icon & Tag */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-soft-sm group-hover:bg-brand-navy-50 flex items-center justify-center transition-colors duration-300 border border-slate-100">
                    {getAudienceIcon(item.icon)}
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white text-slate-600 border border-slate-200/80">
                    {item.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-navy transition-colors duration-200 mb-3.5">
                  {item.title}
                </h3>

                {/* Description strictly from client text */}
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom CTA trigger */}
              <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-navy" />
                  Atendimento dedicado
                </span>
                <a
                  href="#contato"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand-navy hover:text-brand-navy-700 transition-colors"
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
