import { apiRequest } from './apiClient';
import type { ContactMessage } from '../types/cms';

export interface ContactsListResponse {
  success: boolean;
  data: ContactMessage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const contactsAdminService = {
  async getContacts(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  } = {}): Promise<ContactsListResponse> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);
    if (params.status) query.set('status', params.status);

    try {
      return await apiRequest<ContactsListResponse>(`/api/contacts.php?${query.toString()}`);
    } catch (err: any) {
      if (import.meta.env.DEV && (err?.status === 404 || !err?.status)) {
        return {
          success: true,
          data: [
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
          total: 2,
          page: 1,
          limit: 15,
          totalPages: 1,
        };
      }
      throw err;
    }
  },

  async updateStatus(id: number, status: ContactMessage['status']): Promise<void> {
    await apiRequest(`/api/contacts.php?id=${id}`, {
      method: 'PUT',
      data: { status },
    });
  },

  async deleteContact(id: number): Promise<void> {
    await apiRequest(`/api/contacts.php?id=${id}`, {
      method: 'DELETE',
    });
  },
};
