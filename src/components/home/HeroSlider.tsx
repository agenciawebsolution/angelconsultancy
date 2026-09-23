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
      subtitle: 'para sua organização financeira e administrativa. Apoio humano, simples e confiável para você, sua organização financeira e administrativa. Orientação clara, acessível e verdadeira para tornar o seu mundo administrativo muito mais leve.',
      ctaPrimaryText: 'Fale conosco',
      ctaPrimaryLink: '#contato',
      ctaSecondaryText: 'Conheça nossos serviços',
      ctaSecondaryLink: '#servicos',
      imageUrl: '/images/hero-executive-1.jpg',
      imageAlt: 'Executivo internacional corporativo em terno azul marinho',
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
      imageUrl: '/images/hero-consultant-2.jpg',
      imageAlt: 'Consultora financeira prestando atendimento executivo em escritório moderno',
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
      imageUrl: '/images/hero-consultant-3.jpg',
      imageAlt: 'Reunião executiva internacional e consultoria corporativa',
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
    <Users className="w-5 h-5 text-amber-600" key="0" />,
    <ShieldCheck className="w-5 h-5 text-[#D4AF37]" key="1" />,
    <TrendingUp className="w-5 h-5 text-blue-600" key="2" />,
  ];

  // Animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : dir > 0 ? 25 : -25,
    }),
    center: {
      opacity: 1,
      x: 0,
      transition: {
        duration: shouldReduceMotion ? 0.2 : 0.4,
        ease: 'easeOut' as const,
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : dir > 0 ? -25 : 25,
      transition: {
        duration: shouldReduceMotion ? 0.15 : 0.25,
        ease: 'easeIn' as const,
      },
    }),
  };

  return (
    <div 
      className="relative w-full overflow-hidden bg-gradient-to-br from-[#EEF4FB] via-[#F8FAFD] to-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Destaques Principais"
    >
      {/* Background Soft Organic Curves */}
      <div className="absolute top-0 left-0 w-[550px] h-[550px] rounded-full bg-blue-100/40 blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-amber-50/50 blur-3xl pointer-events-none -z-0" />

      {/* Floating Circular Carousel Arrows on Outer Edges */}
      <button
        onClick={prevSlide}
        aria-label="Slide anterior"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white shadow-soft-lg text-[#0B1F3A] flex items-center justify-center border border-slate-200/80 z-30 transition-all hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
      >
        <ChevronLeft className="w-5 h-5 text-slate-700 group-hover:text-[#0B1F3A] transition-colors" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Próximo slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white shadow-soft-lg text-[#0B1F3A] flex items-center justify-center border border-slate-200/80 z-30 transition-all hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
      >
        <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-[#0B1F3A] transition-colors" />
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14 relative z-10">
        
        {/* Main 48% Text / 52% Image Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-14 items-center">
          
          {/* ========================================================= */}
          {/* Left Column: Editorial Headline, CTAs & Metrics           */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center text-left">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentSlide.id || currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-5 sm:space-y-6"
              >
                {/* 1. Pill Badge */}
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-soft-xs text-xs font-bold tracking-wide">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-[#D4AF37] font-extrabold uppercase">
                      {currentSlide.badge ? currentSlide.badge.split('AND')[0].trim() : 'ANGEL CONSULTANCY'}
                    </span>
                    <span className="text-[#0B1F3A] font-extrabold uppercase">
                      {currentSlide.badge && currentSlide.badge.includes('AND') ? 'AND ' + currentSlide.badge.split('AND')[1].trim() : 'AND NETWORK'}
                    </span>
                  </div>
                </div>

                {/* 2. Giant Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] xl:text-[3.9rem] font-extrabold tracking-tight text-[#0B1F3A] leading-[1.10] text-balance">
                  {currentSlide.title}{' '}
                  {currentSlide.highlightText && (
                    <span className="text-[#1D5BD8] inline-block font-extrabold">
                      {currentSlide.highlightText}
                    </span>
                  )}
                  {currentIndex === 0 && !currentSlide.title.includes('administrativa') && (
                    <span className="block text-[#0B1F3A]">
                      para sua organização financeira e administrativa.
                    </span>
                  )}
                </h1>

                {/* 3. Description */}
                <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-xl font-normal">
                  {currentIndex === 0 
                    ? 'Apoio humano, simples e confiável para você, sua organização financeira e administrativa. Orientação clara, acessível e verdadeira para tornar o seu mundo administrativo muito mais leve.'
                    : currentSlide.subtitle}
                </p>

                {/* 4. Two Pill CTAs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                  <a
                    href={currentSlide.ctaPrimaryLink || '#contato'}
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#0B1F3A] hover:bg-[#102D55] text-white font-bold text-base shadow-soft-md hover:shadow-soft-lg transition-all duration-200 active:scale-[0.98] group"
                  >
                    <span>{currentSlide.ctaPrimaryText || 'Fale conosco'}</span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37] transition-transform duration-200 group-hover:translate-x-1" />
                  </a>

                  {currentSlide.ctaSecondaryText && (
                    <a
                      href={currentSlide.ctaSecondaryLink || '#servicos'}
                      className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white hover:bg-slate-50 border border-[#3B82F6]/80 text-[#1D5BD8] font-bold text-base transition-all duration-200 shadow-soft-xs hover:shadow-soft-sm active:scale-[0.98]"
                    >
                      <span>{currentSlide.ctaSecondaryText}</span>
                    </a>
                  )}
                </div>

                {/* 5. Metrics Row Directly Below CTAs */}
                <div className="pt-6 sm:pt-7 border-t border-slate-200/80">
                  <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xl">
                    {(currentSlide.stats && currentSlide.stats.length > 0 ? currentSlide.stats : [
                      { label: 'Clientes atendidos na Europa', value: '+500' },
                      { label: 'Satisfação dos clientes', value: '99%' },
                      { label: 'De experiência no mercado europeu', value: '+10 anos' },
                    ]).map((stat, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-soft-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          {metricIcons[i % metricIcons.length]}
                        </div>
                        <div>
                          <p className="text-xl sm:text-2xl font-black text-[#0B1F3A] tracking-tight leading-tight">
                            {stat.value}
                          </p>
                          <p className="text-[11px] sm:text-xs text-[#64748B] font-medium leading-snug mt-0.5">
                            {stat.label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* ========================================================= */}
          {/* Right Column: Imposing Executive Portrait + Floating Cards*/}
          {/* ========================================================= */}
          <div className="lg:col-span-6 xl:col-span-6 relative mt-4 lg:mt-0 flex justify-center">
            <div className="relative w-full max-w-xl lg:max-w-none">
              
              {/* Image Frame Container */}
              <div className="relative w-full h-[500px] sm:h-[580px] lg:h-[620px] xl:h-[640px] rounded-[2rem] overflow-hidden shadow-soft-2xl border border-slate-200/90 bg-slate-900">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.img
                    key={currentSlide.imageUrl}
                    src={currentSlide.imageUrl}
                    alt={currentSlide.imageAlt || currentSlide.title}
                    custom={direction}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full h-full object-cover object-top"
                    loading="eager"
                  />
                </AnimatePresence>

                {/* Subtle Cinematic Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/75 via-transparent to-transparent pointer-events-none" />

                {/* Floating Card 1: Atendimento Seguro (Top Left of image) */}
                <div className="absolute top-6 left-6 sm:top-8 sm:left-8 bg-white/95 backdrop-blur-md px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl shadow-soft-xl border border-slate-100 flex items-center gap-3 sm:gap-3.5 z-20">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#D4AF37] flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#0B1F3A] leading-tight">
                      Atendimento seguro
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                      Clareza em cada passo
                    </p>
                  </div>
                </div>

                {/* Floating Card 2: Decisões Seguras (Bottom Left of image) */}
                <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 bg-white/95 backdrop-blur-md px-4 py-2.5 sm:py-3 rounded-2xl shadow-soft-xl border border-slate-100 flex items-center gap-3 z-20">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-[#1D5BD8] flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#1D5BD8]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#0B1F3A] leading-tight">
                      Decisões seguras
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                      Confidencialidade e rigor
                    </p>
                  </div>
                </div>

                {/* Scroll Indicator (Bottom Right of image) */}
                <div className="absolute bottom-6 right-6 flex items-center gap-2 text-white/90 text-xs font-semibold z-20 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
                  <MousePointer2 className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                  <span>Scroll para explorar</span>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* ========================================================= */}
        {/* Slider Bottom Pagination (01 ─────── 02  03)              */}
        {/* ========================================================= */}
        <div className="mt-8 sm:mt-10 pt-4 flex items-center justify-center lg:justify-start gap-4">
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
                      ? 'text-[#0B1F3A]'
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

      </div>
    </div>
  );
};
