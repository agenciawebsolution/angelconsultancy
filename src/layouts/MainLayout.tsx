import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/navigation/Header';
import { FooterSection } from '../sections/FooterSection';
import { WhatsAppButton } from '../components/common/WhatsAppButton';
import { ScrollToTop } from '../components/common/ScrollToTop';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen relative selection:bg-brand-navy-100 selection:text-brand-navy">
      {/* Accessible skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-brand-navy text-white font-semibold rounded-lg shadow-lg outline-none ring-2 ring-brand-amber"
      >
        Pular para o conteúdo principal
      </a>

      <ScrollToTop />
      <Header />

      <main id="main-content" className="flex-grow">
        {children || <Outlet />}
      </main>

      <FooterSection />
      <WhatsAppButton />
    </div>
  );
};
