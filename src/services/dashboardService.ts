import { apiRequest } from './apiClient';
import type { DashboardStats, ContactMessage, BlogPost } from '../types/cms';

export interface DashboardDataResponse {
  success: boolean;
  stats: DashboardStats;
  recent_messages: ContactMessage[];
  recent_posts: BlogPost[];
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardDataResponse> {
    try {
      return await apiRequest<DashboardDataResponse>('/api/dashboard.php');
    } catch (err: any) {
      if (import.meta.env.DEV && (err?.status === 404 || !err?.status)) {
        return {
          success: true,
          stats: {
            total_messages: 14,
            unread_messages: 3,
            this_month_messages: 8,
            published_posts: 4,
            draft_posts: 1,
            total_pages: 1,
          },
          recent_messages: [
            {
              id: 1,
              full_name: 'Maria da Silva',
              email: 'maria.silva@exemplo.com',
              phone: '+32 492 123 456',
              client_type: 'Profissional liberal / autônomo',
              services: ['Consultoria administrativa', 'Organização de documentos'],
              message: 'Gostaria de agendar uma consulta inicial para regularizar meus documentos.',
              attendance_preference: 'Online',
              consent: 1,
              status: 'unread',
              created_at: new Date().toISOString(),
            },
            {
              id: 2,
              full_name: 'Associação Esperança',
              email: 'contato@ongesperanca.be',
              phone: '+32 492 987 654',
              client_type: 'Associação / ONG',
              services: ['Associação / ONG'],
              message: 'Precisamos de suporte na revisão do estatuto e atas.',
              attendance_preference: 'Presencial',
              consent: 1,
              status: 'in_review',
              created_at: new Date(Date.now() - 86400000).toISOString(),
            },
          ],
          recent_posts: [
            {
              id: 1,
              title: 'Como Organizar seus Documentos Administrativos na Bélgica',
              slug: 'como-organizar-documentos-administrativos-belgica',
              excerpt: 'Dicas práticas para manter sua vida fiscal e contábil em dia sem complicações.',
              content: '',
              featured_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
              image_alt: 'Documentos e organização',
              author_name: 'Angel Consultancy',
              status: 'published',
              published_at: new Date(Date.now() - 172800000).toISOString(),
              views_count: 142,
              meta_title: null,
              meta_description: null,
              focus_keyword: null,
              canonical_url: null,
              og_title: null,
              og_description: null,
              og_image: null,
              twitter_card: null,
              category_id: 1,
              category_name: 'Organização Administrativa',
              category_slug: 'organizacao-administrativa',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ],
        };
      }
      throw err;
    }
  },
};
