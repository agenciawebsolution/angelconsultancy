-- ==============================================================================
-- Migration: Compatibilidade de Colunas na Tabela Media
-- Projeto: Angel Consultancy and Network
-- Descrição: Garante a presença e compatibilidade de colunas na tabela `media`:
--            original_name, path, size e title, migrando dados existentes de
--            original_filename, file_url, file_size e caption.
-- ==============================================================================

-- 1. Adicionar colunas se ausentes
ALTER TABLE `media` 
  ADD COLUMN IF NOT EXISTS `original_name` VARCHAR(255) NULL AFTER `filename`,
  ADD COLUMN IF NOT EXISTS `path` VARCHAR(500) NULL AFTER `original_name`,
  ADD COLUMN IF NOT EXISTS `size` INT UNSIGNED NULL AFTER `mime_type`,
  ADD COLUMN IF NOT EXISTS `title` VARCHAR(255) NULL AFTER `alt_text`;

-- 2. Sincronizar dados a partir das colunas legadas caso existam
UPDATE `media` SET `original_name` = `original_filename` WHERE (`original_name` IS NULL OR `original_name` = '') AND `original_filename` IS NOT NULL;
UPDATE `media` SET `path` = `file_url` WHERE (`path` IS NULL OR `path` = '') AND `file_url` IS NOT NULL;
UPDATE `media` SET `size` = `file_size` WHERE (`size` IS NULL OR `size` = 0) AND `file_size` IS NOT NULL;
UPDATE `media` SET `title` = `caption` WHERE (`title` IS NULL OR `title` = '') AND `caption` IS NOT NULL;
