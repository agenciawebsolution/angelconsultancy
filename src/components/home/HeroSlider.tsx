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
import { useLanguage } from '../../i18n/LanguageContext';

export interface HeroSliderProps {
  slides?: HomeSlide[];
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ slides: propSlides }) => {
  const shouldReduceMotion = useReducedMotion();
  const { language, translations } = useLanguage();
  const heroT = translations.hero;

  // Curated premium default slides synchronized with global translation dictionary
  const defaultSlides: HomeSlide[] = [
    {
      id: 1,
      badge: heroT.slides[0]?.badge || 'ANGEL CONSULTANCY AND NETWORK',
      title: heroT.slides[0]?.title || 'Assistência humana,',
      highlightText: heroT.slides[0]?.highlightText || 'simples e confiável',
      subtitle: heroT.slides[0]?.subtitle || 'Apoio humano, simples e confiável para você, sua organização financeira e administrativa. Orientação clara, acessível e verdadeira para tornar o seu mundo administrativo muito mais leve.',
      ctaPrimaryText: heroT.slides[0]?.ctaPrimaryText || heroT.ctaPrimary,
      ctaPrimaryLink: '#contato',
      ctaSecondaryText: heroT.slides[0]?.ctaSecondaryText || heroT.ctaSecondary,
      ctaSecondaryLink: '#servicos',
      imageUrl: '/images/hero-slide-01.png',
      imageAlt: 'Composição executiva corporativa Angel Consultancy & Network com executivo internacional',
      stats: heroT.slides[0]?.stats || [
        { label: 'Clientes atendidos na Europa', value: '+500' },
        { label: 'Satisfação dos clientes', value: '99%' },
        { label: 'De experiência no mercado europeu', value: '+10 anos' },
      ],
      sortOrder: 1,
      isActive: true,
      desktopPositionX: 75,
      desktopPositionY: 50,
      desktopZoom: 100,
      mobilePositionX: 65,
      mobilePositionY: 50,
      mobileZoom: 110,
    },
    {
      id: 2,
      badge: heroT.slides[1]?.badge || 'ORGANIZAÇÃO & CONFORMIDADE',
      title: heroT.slides[1]?.title || 'Simplifique sua Gestão Administrativa e',
      highlightText: heroT.slides[1]?.highlightText || 'Tributária na Europa',
      subtitle: heroT.slides[1]?.subtitle || 'Elimine burocracias e tenha controle total sobre suas finanças, declarações e rotinas operacionais com atendimento sob medida.',
      ctaPrimaryText: heroT.slides[1]?.ctaPrimaryText || heroT.ctaPrimary,
      ctaPrimaryLink: '#contato',
      ctaSecondaryText: heroT.slides[1]?.ctaSecondaryText || heroT.ctaSecondary,
      ctaSecondaryLink: '#servicos',
      imageUrl: '/images/hero-slide-02.png',
      imageAlt: 'Consultora executiva em terraço corporativo de Bruxelas',
      stats: heroT.slides[1]?.stats || [
        { label: 'Conformidade nos processos', value: '100%' },
        { label: 'Processos otimizados', value: '+250' },
        { label: 'Sigilo profissional garantido', value: 'Total' },
      ],
      sortOrder: 2,
      isActive: true,
      desktopPositionX: 75,
      desktopPositionY: 50,
      desktopZoom: 100,
      mobilePositionX: 65,
      mobilePositionY: 50,
      mobileZoom: 110,
    },
    {
      id: 3,
      badge: heroT.slides[2]?.badge || 'NETWORKING & EXPANSÃO',
      title: heroT.slides[2]?.title || 'Conexões Estratégicas para o seu Crescimento',
      highlightText: heroT.slides[2]?.highlightText || 'Sem Fronteiras',
      subtitle: heroT.slides[2]?.subtitle || 'Estruturamos sua presença e expandimos suas oportunidades no mercado europeu com governança sólida e visão de futuro.',
      ctaPrimaryText: heroT.slides[2]?.ctaPrimaryText || heroT.ctaPrimary,
      ctaPrimaryLink: '#contato',
      ctaSecondaryText: heroT.slides[2]?.ctaSecondaryText || heroT.ctaSecondary,
      ctaSecondaryLink: '#servicos',
      imageUrl: '/images/hero-slide-03.png',
      imageAlt: 'Diretoria executiva em reunião corporativa com vista panorâmica europeia',
      stats: heroT.slides[2]?.stats || [
        { label: 'Presença e alcance', value: 'Bélgica & UE' },
        { label: 'Soluções estruturadas', value: 'Sob Medida' },
        { label: 'Suporte consultivo', value: 'Dedicado' },
      ],
      sortOrder: 3,
      isActive: true,
      desktopPositionX: 75,
      desktopPositionY: 50,
      desktopZoom: 100,
      mobilePositionX: 65,
      mobilePositionY: 50,
      mobileZoom: 110,
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

  // Localized active slide texts based on current language
  const localizedSlide = heroT.slides?.[currentIndex];
  const slideBadge = (language !== 'pt-BR' && localizedSlide?.badge)
    ? localizedSlide.badge
    : (currentSlide.badge || localizedSlide?.badge || 'ANGEL CONSULTANCY AND NETWORK');
  const slideTitle = (language !== 'pt-BR' && localizedSlide?.title)
    ? localizedSlide.title
    : (currentSlide.title || localizedSlide?.title || '');
  const slideHighlightText = (language !== 'pt-BR' && localizedSlide?.highlightText !== undefined)
    ? localizedSlide.highlightText
    : (currentSlide.highlightText ?? localizedSlide?.highlightText ?? '');
  const slideSubtitle = (language !== 'pt-BR' && localizedSlide?.subtitle)
    ? localizedSlide.subtitle
    : (currentSlide.subtitle || localizedSlide?.subtitle || '');
  const slideCtaPrimaryText = (language !== 'pt-BR' && localizedSlide?.ctaPrimaryText)
    ? localizedSlide.ctaPrimaryText
    : (currentSlide.ctaPrimaryText || localizedSlide?.ctaPrimaryText || heroT.ctaPrimary);
  const slideCtaSecondaryText = (language !== 'pt-BR' && localizedSlide?.ctaSecondaryText)
    ? localizedSlide.ctaSecondaryText
    : (currentSlide.ctaSecondaryText || localizedSlide?.ctaSecondaryText || heroT.ctaSecondary);
  const slideStats = (language !== 'pt-BR' && localizedSlide?.stats && localizedSlide.stats.length > 0)
    ? localizedSlide.stats
    : (currentSlide.stats && currentSlide.stats.length > 0 ? currentSlide.stats : localizedSlide?.stats || []);

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
      className="relative w-full overflow-hidden min-h-[580px] sm:min-h-[680px] lg:h-[760px] xl:h-[780px] flex items-center bg-[#F8FAFC]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label={heroT.aria.sliderRegion}
    >
      {/* ========================================================= */}
      {/* 1. Full-Bleed Panoramic Background Image Composition      */}
      {/* ========================================================= */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.imageUrl + (currentSlide.id || currentIndex)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full overflow-hidden"
          >
            {/* Mobile / Tablet Image (< 1024px) */}
            <div className="block lg:hidden w-full h-full overflow-hidden">
              <img
                src={currentSlide.imageUrl}
                alt={currentSlide.imageAlt || slideTitle}
                style={{
                  objectPosition: `${currentSlide.mobilePositionX ?? 65}% ${currentSlide.mobilePositionY ?? 50}%`,
                  transform: `scale(${(currentSlide.mobileZoom ?? 110) / 100})`,
                  transformOrigin: `${currentSlide.mobilePositionX ?? 65}% ${currentSlide.mobilePositionY ?? 50}%`,
                }}
                className="w-full h-full object-cover transition-transform duration-300"
                loading="eager"
              />
            </div>

            {/* Desktop Image (>= 1024px) */}
            <div className="hidden lg:block w-full h-full overflow-hidden">
              <img
                src={currentSlide.imageUrl}
                alt={currentSlide.imageAlt || slideTitle}
                style={{
                  objectPosition: `${currentSlide.desktopPositionX ?? 75}% ${currentSlide.desktopPositionY ?? 50}%`,
                  transform: `scale(${(currentSlide.desktopZoom ?? 100) / 100})`,
                  transformOrigin: `${currentSlide.desktopPositionX ?? 75}% ${currentSlide.desktopPositionY ?? 50}%`,
                }}
                className="w-full h-full object-cover transition-transform duration-300"
                loading="eager"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Editorial Gradient Overlay for Perfect Typography Readability */}
        {/* Mobile: Strong opacity in text zone (0-55%), smooth taper to 75%, 100% transparent on the right to keep executive crisp */}
        <div 
          className="block lg:hidden absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(95deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 55%, rgba(255,255,255,0.25) 75%, rgba(255,255,255,0) 100%)',
          }}
        />

        {/* Desktop: Gentle linear gradient from solid white on the left to crystal clear on the right */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-white via-white/95 via-35% lg:via-white/70 lg:via-48% to-transparent" />
      </div>

      {/* Floating Circular Carousel Arrows on Outer Edges */}
      <button
        onClick={prevSlide}
        aria-label={heroT.aria.prevSlide}
        className="absolute left-1.5 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-white/85 sm:bg-white/90 hover:bg-white shadow-soft-md sm:shadow-soft-lg text-[#0A162B] flex items-center justify-center border border-slate-200/80 z-30 transition-all hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-[#0A162B]"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 group-hover:text-[#0A162B] transition-colors" />
      </button>

      <button
        onClick={nextSlide}
        aria-label={heroT.aria.nextSlide}
        className="absolute right-1.5 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-white/85 sm:bg-white/90 hover:bg-white shadow-soft-md sm:shadow-soft-lg text-[#0A162B] flex items-center justify-center border border-slate-200/80 z-30 transition-all hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-[#0A162B]"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 group-hover:text-[#0A162B] transition-colors" />
      </button>

      {/* Floating Micro-Cards on the Panoramic Composition (Desktop Only) */}
      {/* Floating Card 1: Atendimento seguro (Top Right Area) */}
      <div className="hidden lg:flex absolute top-10 xl:top-14 right-12 xl:right-24 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-soft-xl border border-white/80 items-center gap-3.5 z-20 transition-transform hover:-translate-y-0.5">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#D4AF37] flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div>
          <p className="text-xs sm:text-sm font-bold text-[#0A162B] leading-tight">
            {heroT.floatingCards.secureServiceTitle}
          </p>
          <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">
            {heroT.floatingCards.secureServiceSub}
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
            {heroT.floatingCards.confidentDecisionsTitle}
          </p>
          <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">
            {heroT.floatingCards.confidentDecisionsSub}
          </p>
        </div>
      </div>

      {/* Scroll Explorer Indicator (Bottom Right) */}
      <div className="hidden sm:flex absolute bottom-6 right-6 xl:right-12 items-center gap-2 text-slate-600 text-xs font-semibold z-20 bg-white/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/60 shadow-soft-xs">
        <MousePointer2 className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
        <span>{heroT.scrollIndicator}</span>
      </div>

      {/* ========================================================= */}
      {/* 2. Editorial Foreground Content Container                 */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto w-full px-11 sm:px-14 lg:px-8 py-8 sm:py-14 lg:py-0 relative z-10">
        
        {/* Text Area bounded to left side (~48% - 52%) */}
        <div className="max-w-[275px] min-[390px]:max-w-[310px] sm:max-w-[480px] lg:max-w-[590px] xl:max-w-[620px] text-left">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide.id || currentIndex}
              custom={direction}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-3 sm:space-y-5"
            >
              {/* 1. Pill Badge */}
              <div>
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200/90 shadow-soft-xs text-[10px] sm:text-xs font-bold tracking-wide max-w-full">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37] flex-shrink-0" />
                  <span className="text-[#D4AF37] font-extrabold uppercase">
                    {slideBadge ? slideBadge.split('AND')[0].trim() : 'ANGEL CONSULTANCY'}
                  </span>
                  <span className="text-[#0A162B] font-extrabold uppercase">
                    {slideBadge && slideBadge.includes('AND') ? 'AND ' + slideBadge.split('AND')[1].trim() : 'AND NETWORK'}
                  </span>
                </div>
              </div>

              {/* 2. Headline with High-End Proportions */}
              <h1 className="text-[28px] min-[380px]:text-[32px] sm:text-4xl lg:text-[2.65rem] xl:text-[3.15rem] font-extrabold tracking-tight text-[#0A162B] leading-[1.02] sm:leading-[1.12]">
                {slideTitle}{' '}
                {slideHighlightText && (
                  <span className="text-[#1D5BD8] inline-block font-extrabold">
                    {slideHighlightText}
                  </span>
                )}
                {currentIndex === 0 && (
                  <span className="hidden sm:inline lg:block text-[#0A162B]">
                    {language === 'pt-BR' && ' para sua organização financeira e administrativa.'}
                    {language === 'en' && ' for your financial and administrative organization.'}
                    {language === 'fr' && ' pour votre organisation financière et administrative.'}
                  </span>
                )}
              </h1>

              {/* 3. Editorial Description with Improved High Contrast */}
              <p className="text-[14px] min-[380px]:text-[15px] sm:text-base lg:text-[1.025rem] text-slate-800 font-medium leading-snug sm:leading-relaxed max-w-[270px] min-[390px]:max-w-[300px] sm:max-w-[480px] lg:max-w-[520px] line-clamp-3 sm:line-clamp-none drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
                {slideSubtitle}
              </p>

              {/* 4. Two Pill CTAs */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3.5 pt-1 sm:pt-2">
                <a
                  href={currentSlide.ctaPrimaryLink || '#contato'}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-8 sm:py-4 rounded-full bg-[#0A162B] hover:bg-[#102D55] text-white font-bold text-xs sm:text-base shadow-soft-md hover:shadow-soft-lg transition-all duration-200 active:scale-[0.98] group"
                >
                  <span>{slideCtaPrimaryText}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] transition-transform duration-200 group-hover:translate-x-1" />
                </a>

                {slideCtaSecondaryText && (
                  <a
                    href={currentSlide.ctaSecondaryLink || '#servicos'}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-7 sm:py-4 rounded-full bg-white/95 hover:bg-white border border-[#2563EB]/80 text-[#1D5BD8] font-bold text-xs sm:text-base transition-all duration-200 shadow-soft-xs hover:shadow-soft-sm active:scale-[0.98]"
                  >
                    <span>{slideCtaSecondaryText}</span>
                  </a>
                )}
              </div>

              {/* 5. Metrics Row Directly Below CTAs */}
              <div className="pt-3 sm:pt-6 border-t border-slate-200/80">
                {/* Mobile: horizontal scrollable pills strip with zero text clipping */}
                <div className="flex sm:hidden items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
                  {slideStats.map((stat, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-soft-xs"
                    >
                      <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                        {React.cloneElement(metricIcons[i % metricIcons.length], { className: 'w-2.5 h-2.5' })}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-black text-[#0A162B] leading-none">{stat.value}</span>
                        <span className="text-[10px] font-medium text-slate-700 whitespace-nowrap leading-none">{stat.label}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop / Tablet: standard 3-column grid */}
                <div className="hidden sm:grid sm:grid-cols-3 gap-3 sm:gap-4 max-w-xl">
                  {slideStats.map((stat, i) => (
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
              <div className="pt-2 sm:pt-3 flex items-center gap-3 sm:gap-4">
                {slidesToRender.map((s, idx) => {
                  const isCurrent = idx === currentIndex;
                  const numberFormatted = String(idx + 1).padStart(2, '0');

                  return (
                    <button
                      key={s.id || idx}
                      onClick={() => goToSlide(idx)}
                      aria-label={`${heroT.aria.goToSlide} ${idx + 1}`}
                      className="flex items-center gap-2 sm:gap-3 group focus:outline-none"
                    >
                      <span
                        className={`text-xs sm:text-base font-extrabold transition-colors ${
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
                          className="w-8 sm:w-16 h-1 bg-[#D4AF37] rounded-full inline-block"
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
