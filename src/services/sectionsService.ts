import { apiRequest } from './apiClient';

export interface PageSectionsResponse {
  success: boolean;
  sections: Record<string, Record<string, unknown>>;
}

export const sectionsService = {
  async getPageSections(pageSlug: string = 'home'): Promise<Record<string, Record<string, unknown>>> {
    try {
      const res = await apiRequest<PageSectionsResponse>(`/api/sections.php?page=${encodeURIComponent(pageSlug)}`);
      return res.sections || {};
    } catch {
      // Fallback gracioso para dados locais do código
      return {};
    }
  },

  async saveSection(pageSlug: string, sectionKey: string, content: unknown): Promise<void> {
    await apiRequest('/api/sections.php', {
      method: 'POST',
      data: {
        page_slug: pageSlug,
        section_key: sectionKey,
        content,
      },
    });
  },
};
