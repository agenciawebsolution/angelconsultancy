import React from 'react';
import { motion } from 'framer-motion';
import { 
  FolderArchive, 
  Calculator, 
  Users, 
  Briefcase, 
  Check, 
  ArrowRight 
} from 'lucide-react';
import { SectionTitle } from '../components/ui/SectionTitle';
import type { ServiceItem } from '../types';
import { fadeInUp, staggerContainer } from '../lib/animations';

const servicesData: ServiceItem[] = [
  {
    id: 'consultoria-administrativa',
    number: '01',
    title: 'Consultoria administrativa e organização documental',
    subtitle: 'Ajudamos você a colocar tudo em ordem — mesmo que esteja começando do zero.',
    benefits: [
      'Organização de documentos físicos e digitais',
      'Criação de rotinas simples para manter tudo atualizado',
      'Orientações práticas para entender e cumprir exigências administrativas',
      'Suporte para situações urgentes ou pendências acumuladas',
    ],
    icon: 'folder',
  },
  {
    id: 'apoio-contabil-tributario',
    number: '02',
    title: 'Apoio contábil e tributário simplificado',
    subtitle: 'Entender impostos e obrigações não precisa ser difícil.',
    benefits: [
      'Explicações claras sobre impostos e taxas aplicáveis ao seu caso',
      'Acompanhamento no preenchimento e envio de documentos',
      'Apoio em dúvidas sobre declarações, comprovativos e prazos',
      'Auxílio na leitura e compreensão de termos contábeis',
    ],
    icon: 'calculator',
  },
  {
    id: 'associacoes-ongs',
    number: '03',
    title: 'Serviço especializado para associações e ONGs',
    subtitle: 'Sabemos que organizações sem fins lucrativos enfrentam desafios únicos. Estamos aqui para ajudar com responsabilidade e transparência.',
    benefits: [
      'Regularização e manutenção documental',
      'Organização de estatutos, atas e relatórios obrigatórios',
      'Orientação sobre responsabilidades legais de dirigentes',
      'Estruturação administrativa para um funcionamento mais seguro e organizado',
    ],
    icon: 'users',
  },
  {
    id: 'profissionais-autonomos',
    number: '04',
    title: 'Suporte para profissionais liberais e autônomos',
    subtitle: 'Se você trabalha por conta própria, pode contar conosco para dar estrutura ao seu negócio.',
    benefits: [
      'Entendimento das obrigações tributárias específicas da sua atividade',
      'Criação de um sistema simples para gerir rendimentos e despesas',
      'Acompanhamento para quem está iniciando a vida profissional',
      'Dicas práticas para manter sua atividade regularizada e bem organizada',
    ],
    icon: 'briefcase',
  },
];

export const ServicesSection: React.FC = () => {
  const getIcon = (icon: string) => {
    switch (icon) {
      case 'folder':
        return <FolderArchive className="w-6 h-6 text-brand-navy" />;
      case 'calculator':
        return <Calculator className="w-6 h-6 text-brand-amber-600" />;
      case 'users':
        return <Users className="w-6 h-6 text-brand-navy" />;
      case 'briefcase':
        return <Briefcase className="w-6 h-6 text-brand-amber-600" />;
      default:
        return <FolderArchive className="w-6 h-6 text-brand-navy" />;
    }
  };

  return (
    <section id="servicos" className="py-20 lg:py-28 bg-[#FAFBFD] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          tag="Nossos Serviços"
          tagVariant="blue"
          title="Soluções estruturadas para suas necessidades reais"
          subtitle="Acompanhamento contínuo e personalizado, com explicações claras e sem complicações burocráticas."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {servicesData.map((service) => (
            <motion.div
              key={service.id}
              variants={fadeInUp}
              className="group relative bg-white rounded-3xl p-7 sm:p-9 border border-slate-100 shadow-soft-sm hover:shadow-soft-xl hover:border-brand-navy-200 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header card: Number & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-brand-navy-50 text-slate-700 group-hover:text-brand-navy flex items-center justify-center transition-colors duration-300 border border-slate-100">
                    {getIcon(service.icon)}
                  </div>
                  <span className="text-3xl font-black text-slate-200 group-hover:text-brand-navy-100 transition-colors duration-300 select-none">
                    {service.number}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-brand-navy transition-colors duration-200 mb-3 leading-snug">
                  {service.title}
                </h3>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed">
                  {service.subtitle}
                </p>

                {/* Benefits List */}
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    O que inclui:
                  </p>
                  <ul className="space-y-2.5">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                        <span className="leading-snug">{benefit}</span>
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
                  <span>Solicitar este suporte</span>
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
