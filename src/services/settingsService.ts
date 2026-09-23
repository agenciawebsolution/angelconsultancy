import { apiRequest } from './apiClient';
import type { SiteSettings } from '../types/cms';

export interface SettingsResponse {
  success: boolean;
  settings: Partial<SiteSettings>;
}

export const defaultSettings: SiteSettings = {
  company_name: 'Angel Consultancy and Network',
  company_description: 'Assistência humana, simples e confiável para sua organização financeira e administrativa.',
  company_phone: '+32 492 319 741',
  company_email: 'info@angel-consultancy.be',
  company_whatsapp_url: 'https://wa.me/32492319741?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20servi%C3%A7os%20da%20Angel%20Consultancy.',
  company_location: 'Bélgica (Atendimento Presencial e Online)',
  company_social_linkedin: '',
  company_social_instagram: '',
  company_social_facebook: '',
  seo_site_title: 'Angel Consultancy and Network | Apoio Humano, Simples e Confiável',
  seo_meta_description: 'Assistência humana, simples e confiável para sua organização financeira e administrativa. Atendimento personalizado para pessoas físicas, associações e autônomos.',
  seo_default_og_image: '/logo.png',
  seo_canonical_url: 'https://www.angel-consultancy.be',
  seo_robots: 'index, follow',
  google_search_console_token: '',
  google_analytics_id: '',
  custom_scripts_head: '',
  custom_scripts_body: '',
  custom_scripts_footer: '',
};

export const settingsService = {
  async getPublicSettings(): Promise<SiteSettings> {
    try {
      const res = await apiRequest<SettingsResponse>('/api/settings.php?public=1');
      return { ...defaultSettings, ...(res.settings || {}) };
    } catch {
      return defaultSettings;
    }
  },

  async getAllSettings(): Promise<SiteSettings> {
    try {
      const res = await apiRequest<SettingsResponse>('/api/settings.php');
      return { ...defaultSettings, ...(res.settings || {}) };
    } catch {
      return defaultSettings;
    }
  },

  async updateSettings(data: Partial<SiteSettings>): Promise<void> {
    await apiRequest('/api/settings.php', {
      method: 'POST',
      data,
    });
  },
};
