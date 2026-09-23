-- ==============================================================================
-- Angel Consultancy & Network - Estrutura de Banco de Dados CMS & Painel
-- Compatível com MariaDB 10.x+ / MySQL 8.0+ no servidor one.com
-- ==============================================================================

-- 1. Usuários Administradores
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT 'Nome completo do administrador',
  `email` VARCHAR(191) NOT NULL UNIQUE COMMENT 'E-mail para login',
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'Hash da senha gerado com password_hash()',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT 'Status de acesso',
  `last_login_at` DATETIME NULL COMMENT 'Data do último login bem-sucedido',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_admin_email` (`email`),
  INDEX `idx_admin_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Sessões Administrativas Seguras
CREATE TABLE IF NOT EXISTS `admin_sessions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `admin_user_id` INT UNSIGNED NOT NULL,
  `token` VARCHAR(64) NOT NULL UNIQUE COMMENT 'Token de sessão gerado criptograficamente',
  `ip_address` VARCHAR(45) NULL,
  `user_agent` VARCHAR(255) NULL,
  `expires_at` DATETIME NOT NULL COMMENT 'Expiração da sessão',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_session_token` (`token`),
  INDEX `idx_session_expires` (`expires_at`),
  CONSTRAINT `fk_session_user` FOREIGN KEY (`admin_user_id`) REFERENCES `admin_users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Log de Atividades e Auditoria
CREATE TABLE IF NOT EXISTS `admin_activity_log` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `admin_user_id` INT UNSIGNED NULL,
  `action` VARCHAR(50) NOT NULL COMMENT 'Tipo de ação (login, create, update, delete)',
  `entity_type` VARCHAR(50) NOT NULL COMMENT 'Entidade afetada (contacts, blog, settings, users)',
  `entity_id` INT UNSIGNED NULL,
  `description` TEXT NOT NULL COMMENT 'Detalhes da ação',
  `ip_address` VARCHAR(45) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_activity_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Categorias do Blog
CREATE TABLE IF NOT EXISTS `blog_categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_cat_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Artigos do Blog com SEO Completo
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT UNSIGNED NULL,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `excerpt` TEXT NULL COMMENT 'Resumo para listagens e meta description',
  `content` LONGTEXT NOT NULL COMMENT 'Conteúdo completo do artigo',
  `featured_image` VARCHAR(500) NULL COMMENT 'URL da imagem destacada',
  `image_alt` VARCHAR(255) NULL COMMENT 'Texto alternativo para acessibilidade e SEO',
  `author_name` VARCHAR(100) NOT NULL DEFAULT 'Angel Consultancy',
  `status` ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  `published_at` DATETIME NULL,
  `views_count` INT UNSIGNED NOT NULL DEFAULT 0,
  -- SEO Individual
  `meta_title` VARCHAR(255) NULL,
  `meta_description` TEXT NULL,
  `focus_keyword` VARCHAR(100) NULL,
  `canonical_url` VARCHAR(500) NULL,
  `og_title` VARCHAR(255) NULL,
  `og_description` TEXT NULL,
  `og_image` VARCHAR(500) NULL,
  `twitter_card` VARCHAR(50) DEFAULT 'summary_large_image',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_post_slug` (`slug`),
  INDEX `idx_post_status` (`status`),
  INDEX `idx_post_published` (`published_at`),
  CONSTRAINT `fk_post_category` FOREIGN KEY (`category_id`) REFERENCES `blog_categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Páginas Institucionais Dinâmicas
CREATE TABLE IF NOT EXISTS `pages` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `content` LONGTEXT NOT NULL,
  `featured_image` VARCHAR(500) NULL,
  `status` ENUM('draft', 'published') NOT NULL DEFAULT 'published',
  `sort_order` INT NOT NULL DEFAULT 0,
  `meta_title` VARCHAR(255) NULL,
  `meta_description` TEXT NULL,
  `canonical_url` VARCHAR(500) NULL,
  `robots` VARCHAR(50) DEFAULT 'index, follow',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_page_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Conteúdo Dinâmico das Seções da Home
CREATE TABLE IF NOT EXISTS `page_sections` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `page_slug` VARCHAR(100) NOT NULL DEFAULT 'home',
  `section_key` VARCHAR(50) NOT NULL COMMENT 'hero, intro, services, audience, methodology, footer',
  `content_json` LONGTEXT NOT NULL COMMENT 'Dados estruturados da seção em JSON',
  `sort_order` INT NOT NULL DEFAULT 0,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `idx_page_section` (`page_slug`, `section_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Biblioteca de Mídia
CREATE TABLE IF NOT EXISTS `media` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `filename` VARCHAR(255) NOT NULL,
  `original_name` VARCHAR(255) NOT NULL,
  `path` VARCHAR(500) NOT NULL,
  `mime_type` VARCHAR(100) NOT NULL,
  `size` INT UNSIGNED NOT NULL,
  `alt_text` VARCHAR(255) NULL,
  `title` VARCHAR(255) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_media_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Configurações Globais do Site
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` LONGTEXT NULL,
  `setting_type` VARCHAR(30) NOT NULL DEFAULT 'text',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserção de configurações padrão caso ainda não existam
INSERT IGNORE INTO `site_settings` (`setting_key`, `setting_value`, `setting_type`) VALUES
('company_name', 'Angel Consultancy and Network', 'text'),
('company_description', 'Assistência humana, simples e confiável para sua organização financeira e administrativa.', 'textarea'),
('company_phone', '+32 492 319 741', 'text'),
('company_email', 'info@angel-consultancy.be', 'text'),
('company_whatsapp_url', 'https://wa.me/32492319741?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20servi%C3%A7os%20da%20Angel%20Consultancy.', 'text'),
('company_location', 'Bélgica (Atendimento Presencial e Online)', 'text'),
('company_social_linkedin', '', 'text'),
('company_social_instagram', '', 'text'),
('company_social_facebook', '', 'text'),
('seo_site_title', 'Angel Consultancy and Network | Apoio Humano, Simples e Confiável', 'text'),
('seo_meta_description', 'Assistência humana, simples e confiável para sua organização financeira e administrativa. Atendimento personalizado para pessoas físicas, associações e autônomos.', 'textarea'),
('seo_default_og_image', '/logo.png', 'text'),
('seo_canonical_url', 'https://www.angel-consultancy.be', 'text'),
('seo_robots', 'index, follow', 'text'),
('google_search_console_token', '', 'text'),
('google_analytics_id', '', 'text'),
('custom_scripts_head', '', 'code'),
('custom_scripts_body', '', 'code'),
('custom_scripts_footer', '', 'code');

-- Inserção de categoria padrão para o Blog
INSERT IGNORE INTO `blog_categories` (`id`, `name`, `slug`, `description`) VALUES
(1, 'Geral', 'geral', 'Artigos gerais e novidades da Angel Consultancy'),
(2, 'Organização Administrativa', 'organizacao-administrativa', 'Dicas práticas para organizar documentos e rotinas'),
(3, 'Tributário & Finanças', 'tributario-financas', 'Orientações simplificadas sobre impostos e obrigações');
