import React, { useState, useEffect } from 'react';
import { HeroSlider } from '../components/home/HeroSlider';
import { DifferentialsBar } from '../components/home/DifferentialsBar';
import { slidesService } from '../services/slidesService';
import type { HomeSlide } from '../types/slide';

export interface HeroSectionData {
  badge?: string;
  title?: string;
  subtitle?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  imageUrl?: string;
  imageAlt?: string;
}

interface HeroSectionProps {
  data?: HeroSectionData;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  const [slides, setSlides] = useState<HomeSlide[]>([]);

  useEffect(() => {
    slidesService
      .getPublicSlides()
      .then((items) => {
        if (items && items.length > 0) {
          setSlides(items);
        } else if (data && data.title) {
          // Retrocompatibilidade graciosa com dados de page_sections
          setSlides([
            {
              id: 1,
              badge: data.badge || 'CONSULTORIA ESTRATÉGICA EUROPEIA',
              title: data.title,
              subtitle: data.subtitle,
              ctaPrimaryText: data.ctaPrimaryText || 'Fale com um Especialista',
              ctaPrimaryLink: data.ctaPrimaryLink || '#contato',
              ctaSecondaryText: data.ctaSecondaryText || 'Conheça Nossos Serviços',
              ctaSecondaryLink: data.ctaSecondaryLink || '#servicos',
              imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1400&q=80',
              imageAlt: data.imageAlt || 'Consultoria corporativa internacional',
              sortOrder: 1,
              isActive: true,
            },
          ]);
        }
      })
      .catch((err) => {
        console.warn('Falha ao carregar slides do backend, usando defaults:', err);
      });
  }, [data]);

  return (
    <section id="inicio" className="relative pt-24 sm:pt-28 lg:pt-32 overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-white">
      {/* Subtle luxury ambient glows */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-[600px] h-[600px] rounded-full bg-blue-100/50 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-0 -ml-28 w-[450px] h-[450px] rounded-full bg-amber-100/40 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-12 left-1/3 w-[300px] h-[300px] rounded-full bg-indigo-50/60 blur-2xl pointer-events-none -z-10" />

      {/* Hero Carousel Slider */}
      <div className="w-full pb-8 sm:pb-12">
        <HeroSlider slides={slides} />
      </div>

      {/* Differentials Institutional Bar */}
      <DifferentialsBar />
    </section>
  );
};
