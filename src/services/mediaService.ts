import { apiRequest } from './apiClient';
import type { MediaItem } from '../types/cms';

export interface MediaListResponse {
  success: boolean;
  media: MediaItem[];
}

export interface MediaUploadResponse {
  success: boolean;
  message: string;
  media: MediaItem;
}

export const mediaService = {
  async getMedia(): Promise<MediaItem[]> {
    try {
      const res = await apiRequest<MediaListResponse>('/api/media.php');
      return res.media || [];
    } catch {
      return [];
    }
  },

  async uploadMedia(file: File, altText?: string, title?: string): Promise<MediaItem> {
    const formData = new FormData();
    formData.append('file', file);
    if (altText) formData.append('alt_text', altText);
    if (title) formData.append('title', title);

    const res = await apiRequest<MediaUploadResponse>('/api/media.php', {
      method: 'POST',
      data: formData,
    });
    return res.media;
  },

  async deleteMedia(id: number): Promise<void> {
    await apiRequest(`/api/media.php?id=${id}`, {
      method: 'DELETE',
    });
  },
};
