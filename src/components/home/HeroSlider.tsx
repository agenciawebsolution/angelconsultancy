import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  TrendingUp, 
  MousePointer2,
  CheckCircle2
} from 'lucide-react';
import type { HomeSlide } from '../../types/slide';

export interface HeroSliderProps {
  slides?: HomeSlide[];
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ slides: propSlides }) => {
  const shouldReduceMotion = useReducedMotion();

  // Curated premium default slides matching the exact reference
  const defaultSlides: HomeSlide[] = [
    {
      id: 1,
      badge: 'ANGEL CONSULTANCY AND NETWORK',
      title: 'Assistência humana,',
      highlightText: 'simples e confiável',
      subtitle: 'Apoio humano, simples e confiável para você, sua organização financeira e administrativa. Orientação clara, acessível e verdadeira para tornar o seu mundo administrativo muito mais leve.',
      ctaPrimaryText: 'Fale conosco',
      ctaPrimaryLink: '#contato',
      ctaSecondaryText: 'Conheça nossos serviços',
      ctaSecondaryLink: '#servicos',
      imageUrl: '/images/hero-slide-01.png',
      imageAlt: 'Composição executiva corporativa Angel Consultancy & Network com executivo internacional',
      stats: [
        { label: 'Clientes atendidos na Europa', value: '+500' },
        { label: 'Satisfação dos clientes', value: '99%' },
        { label: 'De experiência no mercado europeu', value: '+10 anos' },
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
      ctaPrimaryText: 'Fale conosco',
      ctaPrimaryLink: '#contato',
      ctaSecondaryText: 'Conheça nossos serviços',
      ctaSecondaryLink: '#servicos',
      imageUrl: '/images/hero-slide-02.png',
      imageAlt: 'Consultora executiva em terraço corporativo de Bruxelas',
      stats: [
        { label: 'Conformidade nos processos', value: '100%' },
        { label: 'Processos otimizados', value: '+250' },
        { label: 'Sigilo profissional garantido', value: 'Total' },
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
      ctaPrimaryText: 'Fale conosco',
      ctaPrimaryLink: '#contato',
      ctaSecondaryText: 'Conheça nossos serviços',
      ctaSecondaryLink: '#servicos',
      imageUrl: '/images/hero-slide-03.png',
      imageAlt: 'Diretoria executiva em reunião corporativa com vista panorâmica europeia',
      stats: [
        { label: 'Presença e alcance', value: 'Bélgica & UE' },
        { label: 'Soluções estruturadas', value: 'Sob Medida' },
        { label: 'Suporte consultivo', value: 'Dedicado' },
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

  // Autoplay (6.5s)
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6500);
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Icons for metrics row
  const metricIcons = [
    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" key="0" />,
    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" key="1" />,
    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" key="2" />,
  ];

  // Editorial content animation variants
  const contentVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : dir > 0 ? 20 : -20,
    }),
    center: {
      opacity: 1,
      x: 0,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.45,
        ease: 'easeOut' as const,
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : dir > 0 ? -20 : 20,
      transition: {
        duration: shouldReduceMotion ? 0.15 : 0.2,
        ease: 'easeIn' as const,
      },
    }),
  };

  return (
    <div 
      className="relative w-full overflow-hidden min-h-[660px] sm:min-h-[720px] lg:h-[760px] xl:h-[780px] flex items-center bg-[#F8FAFC]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Destaques Principais"
    >
      {/* ========================================================= */}
      {/* 1. Full-Bleed Panoramic Background Image Composition      */}
      {/* ========================================================= */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.imageUrl}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.65, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentSlide.imageUrl}
              alt={currentSlide.imageAlt || currentSlide.title}
              className="w-full h-full object-cover object-[75%_center] lg:object-[80%_center] xl:object-right"
              loading="eager"
            />
          </motion.div>
        </AnimatePresence>

        {/* Subtle Editorial Gradient Overlay for Perfect Typography Readability */}
        {/* Mobile: soft veil covering whole width for high contrast text */}
        <div className="block lg:hidden absolute inset-0 bg-white/85 backdrop-blur-[2px]" />

        {/* Desktop: Gentle linear gradient from solid white on the left to crystal clear on the right */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-white via-white/85 via-35% lg:via-white/50 lg:via-45% to-transparent" />
      </div>

      {/* Floating Circular Carousel Arrows on Outer Edges */}
      <button
        onClick={prevSlide}
        aria-label="Slide anterior"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white shadow-soft-lg text-[#0A162B] flex items-center justify-center border border-slate-200/80 z-30 transition-all hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-[#0A162B]"
      >
        <ChevronLeft className="w-5 h-5 text-slate-700 group-hover:text-[#0A162B] transition-colors" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Próximo slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white shadow-soft-lg text-[#0A162B] flex items-center justify-center border border-slate-200/80 z-30 transition-all hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-[#0A162B]"
      >
        <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-[#0A162B] transition-colors" />
      </button>

      {/* Floating Micro-Cards on the Panoramic Composition (Desktop Only) */}
      {/* Floating Card 1: Atendimento seguro (Top Right Area) */}
      <div className="hidden lg:flex absolute top-10 xl:top-14 right-12 xl:right-24 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-soft-xl border border-white/80 items-center gap-3.5 z-20 transition-transform hover:-translate-y-0.5">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#D4AF37] flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div>
          <p className="text-xs sm:text-sm font-bold text-[#0A162B] leading-tight">
            Atendimento seguro
          </p>
          <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">
            Clareza em cada passo
          </p>
        </div>
      </div>

      {/* Floating Card 2: Decisões seguras (Mid-Bottom Right Area) */}
      <div className="hidden lg:flex absolute bottom-20 xl:bottom-24 right-16 xl:right-32 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-soft-xl border border-white/80 items-center gap-3.5 z-20 transition-transform hover:-translate-y-0.5">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D5BD8] flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-5 h-5 text-[#1D5BD8]" />
        </div>
        <div>
          <p className="text-xs sm:text-sm font-bold text-[#0A162B] leading-tight">
            Decisões seguras
          </p>
          <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">
            Confidencialidade e rigor
          </p>
        </div>
      </div>

      {/* Scroll Explorer Indicator (Bottom Right) */}
      <div className="hidden sm:flex absolute bottom-6 right-6 xl:right-12 items-center gap-2 text-slate-600 text-xs font-semibold z-20 bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/60 shadow-soft-xs">
        <MousePointer2 className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
        <span>Scroll para explorar</span>
      </div>

      {/* ========================================================= */}
      {/* 2. Editorial Foreground Content Container                 */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-0 relative z-10">
        
        {/* Text Area bounded to left side (~48% - 52%) */}
        <div className="max-w-[560px] lg:max-w-[590px] xl:max-w-[620px] text-left">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide.id || currentIndex}
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-4 sm:space-y-5"
            >
              {/* 1. Pill Badge */}
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-soft-xs text-xs font-bold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[#D4AF37] font-extrabold uppercase">
                    {currentSlide.badge ? currentSlide.badge.split('AND')[0].trim() : 'ANGEL CONSULTANCY'}
                  </span>
                  <span className="text-[#0A162B] font-extrabold uppercase">
                    {currentSlide.badge && currentSlide.badge.includes('AND') ? 'AND ' + currentSlide.badge.split('AND')[1].trim() : 'AND NETWORK'}
                  </span>
                </div>
              </div>

              {/* 2. Headline with High-End Proportions */}
              <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] xl:text-[3.15rem] font-extrabold tracking-tight text-[#0A162B] leading-[1.12]">
                {currentSlide.title}{' '}
                {currentSlide.highlightText && (
                  <span className="text-[#1D5BD8] inline-block font-extrabold">
                    {currentSlide.highlightText}
                  </span>
                )}
                {currentIndex === 0 && !currentSlide.title.includes('administrativa') && (
                  <span className="block text-[#0A162B]">
                    para sua organização financeira e administrativa.
                  </span>
                )}
              </h1>

              {/* 3. Editorial Description */}
              <p className="text-sm sm:text-base lg:text-[1.025rem] text-[#475569] leading-relaxed max-w-[520px] font-normal">
                {currentSlide.subtitle}
              </p>

              {/* 4. Two Pill CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <a
                  href={currentSlide.ctaPrimaryLink || '#contato'}
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-[#0A162B] hover:bg-[#102D55] text-white font-bold text-sm sm:text-base shadow-soft-md hover:shadow-soft-lg transition-all duration-200 active:scale-[0.98] group"
                >
                  <span>{currentSlide.ctaPrimaryText || 'Fale conosco'}</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37] transition-transform duration-200 group-hover:translate-x-1" />
                </a>

                {currentSlide.ctaSecondaryText && (
                  <a
                    href={currentSlide.ctaSecondaryLink || '#servicos'}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-7 sm:py-4 rounded-full bg-white/95 hover:bg-white border border-[#2563EB]/80 text-[#1D5BD8] font-bold text-sm sm:text-base transition-all duration-200 shadow-soft-xs hover:shadow-soft-sm active:scale-[0.98]"
                  >
                    <span>{currentSlide.ctaSecondaryText}</span>
                  </a>
                )}
              </div>

              {/* 5. Metrics Row Directly Below CTAs */}
              <div className="pt-5 sm:pt-6 border-t border-slate-200/80">
                <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xl">
                  {(currentSlide.stats && currentSlide.stats.length > 0 ? currentSlide.stats : [
                    { label: 'Clientes atendidos na Europa', value: '+500' },
                    { label: 'Satisfação dos clientes', value: '99%' },
                    { label: 'De experiência no mercado europeu', value: '+10 anos' },
                  ]).map((stat, i) => (
                    <div key={i} className="flex items-start gap-2.5 sm:gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {metricIcons[i % metricIcons.length]}
                      </div>
                      <div>
                        <p className="text-lg sm:text-xl font-black text-[#0A162B] tracking-tight leading-tight">
                          {stat.value}
                        </p>
                        <p className="text-[10px] sm:text-xs text-[#64748B] font-medium leading-snug mt-0.5">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Slider Pagination Indicator (01 ━━━━━ 02 03) */}
              <div className="pt-3 flex items-center gap-4">
                {slidesToRender.map((s, idx) => {
                  const isCurrent = idx === currentIndex;
                  const numberFormatted = String(idx + 1).padStart(2, '0');

                  return (
                    <button
                      key={s.id || idx}
                      onClick={() => goToSlide(idx)}
                      aria-label={`Ir para slide ${idx + 1}`}
                      className="flex items-center gap-3 group focus:outline-none"
                    >
                      <span
                        className={`text-sm sm:text-base font-extrabold transition-colors ${
                          isCurrent
                            ? 'text-[#0A162B]'
                            : 'text-slate-400 group-hover:text-slate-600'
                        }`}
                      >
                        {numberFormatted}
                      </span>

                      {isCurrent && (
                        <motion.span
                          layoutId="activeSlideIndicator"
                          className="w-12 sm:w-16 h-1 bg-[#D4AF37] rounded-full inline-block"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
