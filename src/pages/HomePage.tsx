import React, { useEffect, useState } from 'react';
import { HeroSection, type HeroSectionData } from '../sections/HeroSection';
import { IntroSection, type IntroSectionData } from '../sections/IntroSection';
import { ServicesSection, type ServicesSectionData } from '../sections/ServicesSection';
import { TargetAudienceSection, type AudienceSectionData } from '../sections/TargetAudienceSection';
import { MethodologySection, type MethodologySectionData } from '../sections/MethodologySection';
import { ContactSection } from '../sections/ContactSection';
import { DynamicHead } from '../components/common/DynamicHead';
import { sectionsService } from '../services/sectionsService';

export const HomePage: React.FC = () => {
  const [sections, setSections] = useState<{
    hero?: HeroSectionData;
    intro?: IntroSectionData;
    services?: ServicesSectionData;
    audience?: AudienceSectionData;
    methodology?: MethodologySectionData;
  }>({});

  useEffect(() => {
    sectionsService
      .getPageSections('home')
      .then((data) => {
        if (data && typeof data === 'object') {
          setSections(data);
        }
      })
      .catch((err) => {
        console.warn('Erro ao carregar seções dinâmicas da home:', err);
      });
  }, []);

  return (
    <>
      <DynamicHead />
      <HeroSection data={sections.hero} />
      <IntroSection data={sections.intro} />
      <ServicesSection data={sections.services} />
      <TargetAudienceSection data={sections.audience} />
      <MethodologySection data={sections.methodology} />
      <ContactSection />
    </>
  );
};

