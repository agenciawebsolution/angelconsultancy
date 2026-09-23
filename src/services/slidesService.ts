import { apiRequest } from './apiClient';
import type { HomeSlide, HomeSlideInput } from '../types/slide';

export interface SlidesResponse {
  success: boolean;
  slides: HomeSlide[];
  message?: string;
}

export interface SlideSingleResponse {
  success: boolean;
  slide: HomeSlide;
  message?: string;
}

export const slidesService = {
  /**
   * Obtém slides ativos para visualização pública
   */
  async getPublicSlides(): Promise<HomeSlide[]> {
    try {
      const res = await apiRequest<SlidesResponse>('/api/slides.php');
      return res.slides || [];
    } catch {
      return [];
    }
  },

  /**
   * Obtém todos os slides (inclusive inativos) para o painel administrativo
   */
  async getAllSlides(): Promise<HomeSlide[]> {
    const res = await apiRequest<SlidesResponse>('/api/slides.php?all=1');
    return res.slides || [];
  },

  /**
   * Cria um novo slide (admin)
   */
  async createSlide(data: HomeSlideInput): Promise<HomeSlide> {
    const res = await apiRequest<SlideSingleResponse>('/api/slides.php', {
      method: 'POST',
      data,
    });
    return res.slide;
  },

  /**
   * Atualiza um slide existente (admin)
   */
  async updateSlide(id: number, data: Partial<HomeSlideInput>): Promise<HomeSlide> {
    const res = await apiRequest<SlideSingleResponse>(`/api/slides.php?id=${id}`, {
      method: 'PUT',
      data,
    });
    return res.slide;
  },

  /**
   * Alterna rapidamente o status ativo/inativo
   */
  async toggleActive(id: number): Promise<boolean> {
    const res = await apiRequest<{ success: boolean; isActive: boolean }>(`/api/slides.php?id=${id}`, {
      method: 'PUT',
      data: { toggleActive: true },
    });
    return res.isActive;
  },

  /**
   * Reordena múltiplos slides
   */
  async reorderSlides(orders: Array<{ id: number; sortOrder: number }>): Promise<void> {
    await apiRequest('/api/slides.php?action=reorder', {
      method: 'PUT',
      data: { orders },
    });
  },

  /**
   * Exclui um slide (admin)
   */
  async deleteSlide(id: number): Promise<void> {
    await apiRequest(`/api/slides.php?id=${id}`, {
      method: 'DELETE',
    });
  },
};
