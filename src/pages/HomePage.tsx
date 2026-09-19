import React from 'react';
import { HeroSection } from '../sections/HeroSection';
import { IntroSection } from '../sections/IntroSection';
import { ServicesSection } from '../sections/ServicesSection';
import { TargetAudienceSection } from '../sections/TargetAudienceSection';
import { MethodologySection } from '../sections/MethodologySection';
import { ContactSection } from '../sections/ContactSection';

export const HomePage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <ServicesSection />
      <TargetAudienceSection />
      <MethodologySection />
      <ContactSection />
    </>
  );
};
