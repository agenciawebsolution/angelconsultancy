import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  HeartHandshake, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2 
} from 'lucide-react';
import type { HomeSlide } from '../../types/slide';
import { useLanguage } from '../../i18n/LanguageContext';

export interface HeroSliderProps {
  slides?: HomeSlide[];
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ slides: propSlides }) => {
  const { translations } = useLanguage();
  const heroT = translations.hero;
  const shouldReduceMotion = useReducedMotion();

  // Curated premium default slides with corporate European aesthetic
  const defaultSlides: HomeSlide[] = [
    {
      id: 1,
      badge: heroT.badge || 'CONSULTORIA ESTRATÉGICA EUROPEIA',
      title: 'Soluções Corporativas com Clareza, Segurança e',
      highlightText: 'Alto Desempenho',
      subtitle: 'Apoio administrativo, financeiro e consultoria estratégica internacional para pessoas físicas, autônomos e empresas na Bélgica e União Europeia.',
      ctaPrimaryText: heroT.ctaPrimary || 'Fale com um Especialista',
      ctaPrimaryLink: '#contato',
      ctaSecondaryText: heroT.ctaSecondary || 'Conheça Nossos Serviços',
      ctaSecondaryLink: '#servicos',
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=80',
      imageAlt: 'Executivo internacional corporativo em terno azul marinho em escritório envidraçado',
      stats: [
        { label: 'Anos de Atuação', value: '+10' },
        { label: 'Atendimento', value: 'Multilíngue' },
        { label: 'Clientes Satisfeitos', value: '100%' },
      ],
      sortOrder: 1,
      isActive: true,
    },
    {
      id: 2,
      badge: 'ORGANIZAÇÃO & CONFORMIDADE',
      title: 'Simplifique sua Gestão Administrativa e',
      highlightText: 'Tributária na Europa',
      subtitle: 'Elimine burocracias e tenha controle total sobre suas finanças, declarações e rotinas operacionais com atendimento sob medida.',
      ctaPrimaryText: 'Agendar Atendimento',
      ctaPrimaryLink: '#contato',
      ctaSecondaryText: 'Nossa Metodologia',
      ctaSecondaryLink: '#metodo',
      imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=80',
      imageAlt: 'Consultoria administrativa e financeira especializada',
      stats: [
        { label: 'Conformidade', value: 'Total' },
        { label: 'Processos', value: 'Otimizados' },
        { label: 'Sigilo', value: 'Garantido' },
      ],
      sortOrder: 2,
      isActive: true,
    },
    {
      id: 3,
      badge: 'NETWORKING & EXPANSÃO',
      title: 'Conexões Estratégicas para o seu Crescimento',
      highlightText: 'Sem Fronteiras',
      subtitle: 'Estruturamos sua presença e expandimos suas oportunidades no mercado europeu com governança sólida e visão de futuro.',
      ctaPrimaryText: 'Iniciar Parceria',
      ctaPrimaryLink: '#contato',
      ctaSecondaryText: 'Para Quem é',
      ctaSecondaryLink: '#publico',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1400&q=80',
      imageAlt: 'Reunião executiva internacional e networking empresarial',
      stats: [
        { label: 'Presença', value: 'Internacional' },
        { label: 'Soluções', value: 'Sob Medida' },
        { label: 'Suporte', value: 'Dedicado' },
      ],
      sortOrder: 3,
      isActive: true,
    },
  ];

  const activeSlides = (propSlides && propSlides.length > 0)
    ? propSlides.filter((s) => s.isActive)
    : defaultSlides;

  const slidesToRender = activeSlides.length > 0 ? activeSlides : defaultSlides;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalSlides = slidesToRender.length;
  const currentSlide = slidesToRender[currentIndex] || slidesToRender[0];

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Autoplay timer
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, totalSlides]);

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const deltaX = touchStartX.current - touchEndX.current;
    if (Math.abs(deltaX) > 45) {
      if (deltaX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Format indicator "01 / 03"
  const formattedCurrent = String(currentIndex + 1).padStart(2, '0');
  const formattedTotal = String(totalSlides).padStart(2, '0');

  // Animation variants
  const slideVariants: {
    enter: (dir: number) => { opacity: number; x: number };
    center: { opacity: number; x: number; transition: { duration: number; ease: 'easeOut' } };
    exit: (dir: number) => { opacity: number; x: number; transition: { duration: number; ease: 'easeIn' } };
  } = {
    enter: (dir: number) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : dir > 0 ? 30 : -30,
    }),
    center: {
      opacity: 1,
      x: 0,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.45,
        ease: 'easeOut',
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : dir > 0 ? -30 : 30,
      transition: {
        duration: shouldReduceMotion ? 0.15 : 0.3,
        ease: 'easeIn',
      },
    }),
  };

  return (
    <div 
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Destaques Principais"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[580px] lg:min-h-[640px]">
          
          {/* ========================================================= */}
          {/* Left Column: Dynamic Slide Text & CTAs                    */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentSlide.id || currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4 sm:space-y-6"
              >
                {/* Refined Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B1528]/5 border border-[#D4AF37]/40 text-[#0B1528] text-xs sm:text-sm font-bold tracking-wide uppercase shadow-soft-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{currentSlide.badge || 'ANGEL CONSULTANCY & NETWORK'}</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-slate-900 leading-[1.12] text-balance">
                  {currentSlide.title}{' '}
                  {currentSlide.highlightText && (
                    <span className="relative inline-block text-[#0B1528] bg-gradient-to-r from-[#0B1528] via-[#1E3A8A] to-[#0B1528] bg-clip-text text-transparent">
                      {currentSlide.highlightText}
                      <span className="absolute bottom-1.5 left-0 w-full h-[6px] bg-[#D4AF37]/35 rounded-full -z-10" />
                    </span>
                  )}
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl font-normal">
                  {currentSlide.subtitle}
                </p>

                {/* Dual CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                  <a
                    href={currentSlide.ctaPrimaryLink || '#contato'}
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-gradient-to-r from-[#0B1528] via-[#132342] to-[#0B1528] hover:from-[#132342] hover:to-[#0B1528] text-white font-bold text-base shadow-soft-lg hover:shadow-soft-xl border border-white/10 transition-all duration-300 active:scale-[0.98] group"
                  >
                    <span>{currentSlide.ctaPrimaryText || 'Fale com um Especialista'}</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                  </a>
                  
                  {currentSlide.ctaSecondaryText && (
                    <a
                      href={currentSlide.ctaSecondaryLink || '#servicos'}
                      className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-slate-200/90 hover:border-[#D4AF37]/60 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base transition-all duration-200 shadow-soft-sm hover:shadow-soft-md"
                    >
                      <span>{currentSlide.ctaSecondaryText}</span>
                    </a>
                  )}
                </div>

                {/* Trust stats or badges */}
                <div className="pt-4 sm:pt-6 border-t border-slate-200/70">
                  {currentSlide.stats && currentSlide.stats.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg">
                      {currentSlide.stats.map((stat, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-50/90 border border-slate-100/90 text-left">
                          <p className="text-lg sm:text-xl font-extrabold text-[#0B1528] tracking-tight">
                            {stat.value}
                          </p>
                          <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-tight mt-0.5">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-600 font-medium">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0B1528] flex-shrink-0" />
                        <span>{heroT.trustClear || 'Atendimento Claro'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                        <span>{heroT.trustNoJargon || 'Sem Burocracias'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0B1528] flex-shrink-0" />
                        <span>{heroT.trustClose || 'Suporte Próximo'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ========================================================= */}
          {/* Right Column: Editorial Visual Portrait                   */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 relative mt-2 lg:mt-0 flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              
              {/* Luxury Frame Backdrop Glow */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#0B1528]/15 via-[#D4AF37]/20 to-brand-blue-soft/30 blur-xl -z-10" />

              <div className="relative rounded-3xl overflow-hidden shadow-soft-2xl border border-slate-200/80 bg-white p-2.5 sm:p-3.5">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-900">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.img
                      key={currentSlide.imageUrl}
                      src={currentSlide.imageUrl}
                      alt={currentSlide.imageAlt || currentSlide.title}
                      custom={direction}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="w-full h-full object-cover object-top"
                      loading="eager"
                    />
                  </AnimatePresence>

                  {/* High-end vignette gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1528]/85 via-[#0B1528]/15 to-transparent pointer-events-none" />

                  {/* Caption banner on bottom of photo */}
                  <div className="absolute bottom-0 inset-x-0 p-5 text-white z-10">
                    <p className="text-[11px] uppercase tracking-wider font-bold text-[#F3E5AB] mb-0.5">
                      ANGEL CONSULTANCY & NETWORK
                    </p>
                    <p className="text-sm font-semibold text-slate-100 leading-snug line-clamp-2">
                      {currentSlide.badge || 'Consultoria Estratégica Internacional'}
                    </p>
                  </div>
                </div>

                {/* Floating Badge 1: Humanized / Trust */}
                <div className="absolute -bottom-3 sm:-bottom-4 -left-2 sm:-left-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-soft-xl border border-slate-100 flex items-center gap-3 whitespace-nowrap z-20">
                  <div className="w-10 h-10 rounded-xl bg-[#0B1528] text-white flex items-center justify-center flex-shrink-0 shadow-soft-sm">
                    <HeartHandshake className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Atendimento Personalizado</p>
                    <p className="text-[10px] text-slate-500 font-medium">Bélgica & União Europeia</p>
                  </div>
                </div>

                {/* Floating Badge 2: Security & Confidentiality */}
                <div className="absolute -top-3 sm:-top-4 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-soft-xl border border-slate-100 flex items-center gap-2.5 whitespace-nowrap z-20">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Sigilo & Segurança</p>
                    <p className="text-[10px] text-slate-500 font-medium">Proteção total dos seus dados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Carousel Navigation Bar (Arrows, 01/03, Progress)         */}
        {/* ========================================================= */}
        <div className="mt-8 sm:mt-10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/70">
          
          {/* Left: Numbered Indicator & Mini Progress Bar */}
          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-1 text-slate-900 font-extrabold tracking-wider">
              <span className="text-xl sm:text-2xl text-[#0B1528]">{formattedCurrent}</span>
              <span className="text-sm text-slate-400 font-normal">/</span>
              <span className="text-sm text-slate-400 font-medium">{formattedTotal}</span>
            </div>

            {/* Visual Slide Dots / Progress */}
            <div className="flex items-center gap-2">
              {slidesToRender.map((s, idx) => (
                <button
                  key={s.id || idx}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Ir para slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-8 bg-[#0B1528]'
                      : 'w-2 bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right: Previous / Next Interactive Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={prevSlide}
              aria-label="Slide anterior"
              className="w-11 h-11 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 text-slate-700 hover:text-slate-900 flex items-center justify-center shadow-soft-xs hover:shadow-soft-sm active:scale-95 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Próximo slide"
              className="w-11 h-11 rounded-xl bg-[#0B1528] hover:bg-[#132342] text-white flex items-center justify-center shadow-soft-sm hover:shadow-soft-md active:scale-95 transition-all"
            >
              <ChevronRight className="w-5 h-5 text-[#D4AF37]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
