/**
 * ==============================================================================
 * Angel Consultancy & Network - Tipagens do CMS e Painel Administrativo
 * ==============================================================================
 */

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  last_login_at: string | null;
  created_at: string;
}

export interface DashboardStats {
  total_messages: number;
  unread_messages: number;
  this_month_messages: number;
  published_posts: number;
  draft_posts: number;
  total_pages: number;
}

export interface ContactMessage {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  client_type: string;
  services: string | string[]; // Pode vir como string JSON ou array
  message: string;
  attendance_preference: string;
  consent: number | boolean;
  status: 'unread' | 'in_review' | 'replied' | 'archived';
  ip_address?: string | null;
  created_at: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  posts_count?: number;
  created_at: string;
}

export interface BlogPost {
  id: number;
  category_id: number | null;
  category_name?: string | null;
  category_slug?: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  image_alt: string | null;
  author_name: string;
  status: 'draft' | 'published';
  published_at: string | null;
  views_count: number;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  twitter_card: string | null;
  created_at: string;
  updated_at: string;
}

export interface CmsPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  featured_image?: string | null;
  status: 'draft' | 'published';
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  robots: string | null;
  created_at: string;
  updated_at: string;
}

export interface PageSectionContent {
  [key: string]: any;
}

export interface MediaItem {
  id: number;
  filename: string;
  original_name: string;
  path: string;
  mime_type: string;
  size: number;
  alt_text: string | null;
  title: string | null;
  created_at: string;
}

export interface SiteSettings {
  company_name: string;
  company_description: string;
  company_phone: string;
  company_email: string;
  company_whatsapp_url: string;
  company_location: string;
  company_social_linkedin: string;
  company_social_instagram: string;
  company_social_facebook: string;
  seo_site_title: string;
  seo_meta_description: string;
  seo_default_og_image: string;
  seo_canonical_url: string;
  seo_robots: string;
  google_search_console_token: string;
  google_analytics_id: string;
  custom_scripts_head: string;
  custom_scripts_body: string;
  custom_scripts_footer: string;
  [key: string]: string | undefined;
}

