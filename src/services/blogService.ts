import { apiRequest } from './apiClient';
import type { BlogPost, BlogCategory } from '../types/cms';

export interface BlogListResponse {
  success: boolean;
  posts: BlogPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SinglePostResponse {
  success: boolean;
  post: BlogPost;
  related?: BlogPost[];
}

export interface CategoriesResponse {
  success: boolean;
  categories: BlogCategory[];
}

export const blogService = {
  async getPublishedPosts(params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  } = {}): Promise<BlogListResponse> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.category) query.set('category', params.category);
    if (params.search) query.set('search', params.search);

    try {
      return await apiRequest<BlogListResponse>(`/api/blog.php?${query.toString()}`);
    } catch {
      return {
        success: true,
        posts: [],
        total: 0,
        page: 1,
        limit: params.limit || 9,
        totalPages: 0,
      };
    }
  },

  async getPostBySlug(slug: string): Promise<SinglePostResponse | null> {
    try {
      return await apiRequest<SinglePostResponse>(`/api/blog.php?slug=${encodeURIComponent(slug)}`);
    } catch {
      return null;
    }
  },

  async getCategories(): Promise<BlogCategory[]> {
    try {
      const res = await apiRequest<CategoriesResponse>('/api/blog.php?action=categories');
      return res.categories || [];
    } catch {
      return [];
    }
  },

  // ADMIN
  async getAdminPosts(params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    status?: string;
  } = {}): Promise<BlogListResponse> {
    const query = new URLSearchParams();
    query.set('admin', '1');
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.category) query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    if (params.status) query.set('status', params.status);

    try {
      return await apiRequest<BlogListResponse>(`/api/blog.php?${query.toString()}`);
    } catch {
      return {
        success: true,
        posts: [],
        total: 0,
        page: 1,
        limit: params.limit || 20,
        totalPages: 0,
      };
    }
  },

  async getPostById(id: number): Promise<BlogPost | null> {
    try {
      const res = await apiRequest<SinglePostResponse>(`/api/blog.php?admin=1&id=${id}`);
      return res.post || null;
    } catch {
      return null;
    }
  },

  async createPost(data: Partial<BlogPost>): Promise<{ id: number; slug: string }> {
    const res = await apiRequest<{ success: boolean; id: number; slug: string }>('/api/blog.php', {
      method: 'POST',
      data,
    });
    return { id: res.id, slug: res.slug };
  },

  async updatePost(id: number, data: Partial<BlogPost>): Promise<void> {
    await apiRequest(`/api/blog.php?id=${id}`, {
      method: 'PUT',
      data,
    });
  },

  async deletePost(id: number): Promise<void> {
    await apiRequest(`/api/blog.php?id=${id}`, {
      method: 'DELETE',
    });
  },

  async createCategory(name: string, slug?: string, description?: string): Promise<number> {
    const res = await apiRequest<{ success: boolean; id: number }>('/api/blog.php?action=category', {
      method: 'POST',
      data: { name, slug, description },
    });
    return res.id;
  },

  async deleteCategory(id: number): Promise<void> {
    await apiRequest(`/api/blog.php?action=category&id=${id}`, {
      method: 'DELETE',
    });
  },
};
