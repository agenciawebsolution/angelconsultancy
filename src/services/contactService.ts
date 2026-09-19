import type { ContactFormData } from '../types';

export interface ContactApiResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
  data?: {
    id?: number;
  };
}

const API_ENDPOINT = '/api/contact.php';

/**
 * Envia o formulário de contato para o backend PHP / MariaDB no servidor one.com.
 *
 * @param formData Dados preenchidos no formulário pelo usuário
 * @returns Resposta estruturada da API com status, mensagem e eventuais erros de validação
 */
export async function submitContact(formData: ContactFormData): Promise<ContactApiResponse> {
  const payload = {
    fullName: formData.fullName.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    profileType: formData.profileType,
    services: formData.services,
    message: formData.message.trim(),
    meetingPreference: formData.meetingPreference,
    consentAccepted: formData.consentAccepted,
  };

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Em ambiente de desenvolvimento local com Vite (que não executa PHP nativamente)
    if (response.status === 404 && import.meta.env.DEV) {
      console.info(
        '[contactService] O servidor de desenvolvimento do Vite não processa PHP nativamente. ' +
        'Em produção no servidor one.com, a rota /api/contact.php é processada pelo Apache + PHP e gravada no MariaDB.'
      );

      // Simulação elegante para permitir testes de fluxo completo no frontend durante o desenvolvimento local
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        success: true,
        message: 'Solicitação registrada com sucesso! (Modo de desenvolvimento local)',
      };
    }

    let data: ContactApiResponse;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      // Caso o servidor responda com HTML ou erro genérico do Apache
      throw new Error(`Resposta inesperada do servidor (${response.status}): ${text.slice(0, 100)}`);
    }

    return data;
  } catch (error) {
    console.error('[contactService] Erro ao enviar solicitação de contato:', error);

    // Se estiver em desenvolvimento local e ocorrer erro de rede (ex: servidor Vite puro)
    if (import.meta.env.DEV) {
      console.warn(
        '[contactService DEV Fallback] Simulando sucesso para testes visuais locais, pois o backend PHP requer Apache/PHP.'
      );
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        success: true,
        message: 'Solicitação recebida com sucesso! (Simulação em ambiente local)',
      };
    }

    return {
      success: false,
      message:
        'Não foi possível estabelecer conexão com o servidor no momento. ' +
        'Por favor, tente novamente ou entre em contato diretamente pelo WhatsApp (+32 492 319 741) ou e-mail (info@angel-consultancy.be).',
    };
  }
}
