import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../lib/animations';

export const HeroSection: React.FC = () => {
  return (
    <section id="inicio" className="relative min-h-[90vh] pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden flex items-center">
      {/* Subtle organic background glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[550px] h-[550px] rounded-full bg-brand-blue-soft/60 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-0 -ml-20 w-[420px] h-[420px] rounded-full bg-brand-amber-50/70 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <motion.div 
            className="lg:col-span-7 text-left space-y-6 sm:space-y-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Tag Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-navy-50 border border-brand-navy-100 text-brand-navy text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-brand-amber" />
              <span>Angel Consultancy and Network</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              variants={fadeInUp}
              className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.14] text-balance"
            >
              Assistência humana, simples e confiável para sua{' '}
              <span className="relative inline-block text-brand-navy">
                organização financeira
                <span className="absolute bottom-1 left-0 w-full h-[6px] bg-brand-amber/30 rounded-full -z-10" />
              </span>{' '}
              e administrativa.
            </motion.h1>

            {/* Subtitle strictly from client doc */}
            <motion.p 
              variants={fadeInUp}
              className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl font-normal"
            >
              Apoio humano, simples e confiável para você, sua organização financeira e administrativa. 
              Orientação clara, acessível e verdadeira para tornar o seu mundo administrativo muito mais leve.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <a
                href="#contato"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-brand-navy hover:bg-brand-navy-700 text-white font-semibold text-base shadow-soft-md hover:shadow-soft-lg transition-all duration-200 active:scale-[0.98]"
              >
                <span>Fale conosco</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#servicos"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white/90 hover:bg-slate-50 text-slate-700 font-semibold text-base transition-all duration-200 shadow-soft-sm"
              >
                <span>Conheça nossos serviços</span>
              </a>
            </motion.div>

            {/* Trust highlights directly from company ethos */}
            <motion.div variants={fadeInUp} className="pt-4 border-t border-slate-200/80 flex flex-wrap gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-navy" />
                <span>Orientação clara e sem pressa</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-amber-600" />
                <span>Sem linguagem técnica desnecessária</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-navy" />
                <span>Acompanhamento próximo</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Editorial Visual Composition */}
          <motion.div 
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            {/* Visual Card / Editorial Container */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative subtle frame backdrop */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-brand-navy/10 via-brand-amber/10 to-brand-blue-soft/30 blur-lg -z-10" />
              
              <div className="relative rounded-3xl overflow-hidden shadow-soft-xl border border-slate-100 bg-white p-2.5 sm:p-3">
                {/* High quality photography depicting warm consultation / personal guidance */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80"
                    alt="Consultora prestando orientação atenciosa e próxima"
                    className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
                    loading="eager"
                  />
                  
                  {/* Subtle gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />

                  {/* Inside image caption */}
                  <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                    <p className="text-xs uppercase tracking-wider font-semibold text-brand-amber-300 mb-1">
                      Apoio Humano e Verdadeiro
                    </p>
                    <p className="text-sm sm:text-base font-medium text-slate-100 leading-snug">
                      Tornamos o mundo administrativo menos complicado e muito mais leve.
                    </p>
                  </div>
                </div>

                {/* Floating pill 1: Proximidade */}
                <div className="absolute -bottom-4 -left-3 sm:-left-5 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-soft-lg border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-navy-50 text-brand-navy flex items-center justify-center flex-shrink-0">
                    <HeartHandshake className="w-5 h-5 text-brand-navy" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Atendimento acolhedor</p>
                    <p className="text-[11px] text-slate-500">No seu próprio ritmo</p>
                  </div>
                </div>

                {/* Floating pill 2: Segurança */}
                <div className="absolute -top-3 -right-3 sm:-right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-soft-lg border border-slate-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-amber-50 text-brand-amber-700 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-brand-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Decisões seguras</p>
                    <p className="text-[10px] text-slate-500">Clareza a cada passo</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
