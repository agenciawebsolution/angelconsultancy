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
              badge: data.badge || 'ANGEL CONSULTANCY AND NETWORK',
              title: data.title,
              subtitle: data.subtitle,
              ctaPrimaryText: data.ctaPrimaryText || 'Fale conosco',
              ctaPrimaryLink: data.ctaPrimaryLink || '#contato',
              ctaSecondaryText: data.ctaSecondaryText || 'Conheça nossos serviços',
              ctaSecondaryLink: data.ctaSecondaryLink || '#servicos',
              imageUrl: data.imageUrl || '/images/hero-slide-01.png',
              imageAlt: data.imageAlt || 'Composição corporativa Angel Consultancy & Network',
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
    <section id="inicio" className="relative pt-20 md:pt-28 lg:pt-32 overflow-hidden bg-[#F8FAFC]">
      {/* Hero Carousel Slider */}
      <div className="w-full">
        <HeroSlider slides={slides} />
      </div>

      {/* Differentials Institutional Bar */}
      <DifferentialsBar />
    </section>
  );
};
