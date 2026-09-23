import { apiRequest } from './apiClient';
import type { CmsPage } from '../types/cms';

export interface PagesResponse {
  success: boolean;
  pages: CmsPage[];
}

export interface SinglePageResponse {
  success: boolean;
  page: CmsPage;
}

export const pagesService = {
  async getPages(): Promise<CmsPage[]> {
    try {
      const res = await apiRequest<PagesResponse>('/api/pages.php');
      return res.pages || [];
    } catch {
      return [];
    }
  },

  async getPageBySlug(slug: string): Promise<CmsPage | null> {
    try {
      const res = await apiRequest<SinglePageResponse>(`/api/pages.php?slug=${encodeURIComponent(slug)}`);
      return res.page || null;
    } catch {
      return null;
    }
  },

  async getPageById(id: number): Promise<CmsPage | null> {
    try {
      const res = await apiRequest<SinglePageResponse>(`/api/pages.php?id=${id}`);
      return res.page || null;
    } catch {
      return null;
    }
  },

  async createPage(data: Partial<CmsPage>): Promise<number> {
    const res = await apiRequest<{ success: boolean; id: number }>('/api/pages.php', {
      method: 'POST',
      data,
    });
    return res.id;
  },

  async updatePage(id: number, data: Partial<CmsPage>): Promise<void> {
    await apiRequest(`/api/pages.php?id=${id}`, {
      method: 'PUT',
      data,
    });
  },

  async deletePage(id: number): Promise<void> {
    await apiRequest(`/api/pages.php?id=${id}`, {
      method: 'DELETE',
    });
  },
};
