import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const whatsappUrl = "https://wa.me/32492319741?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20servi%C3%A7os%20da%20Angel%20Consultancy.";

  return (
    <aside aria-label="Atendimento rápido por WhatsApp">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp com a Angel Consultancy (+32 492 319 741)"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center justify-center sm:justify-start gap-2.5 p-3 sm:px-4 sm:py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-soft-lg hover:shadow-soft-xl transition-all duration-300 hover:scale-105 active:scale-95 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]"
      >
        <MessageCircle className="w-5 h-5 fill-current flex-shrink-0" />
        <span className="hidden sm:inline text-xs font-bold tracking-wide uppercase">
          Fale Conosco
        </span>
      </a>
    </aside>
  );
};
