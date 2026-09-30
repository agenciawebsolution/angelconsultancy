-- ==============================================================================
-- Migration: Logos Independentes (Header/Menu e Footer)
-- Projeto: Angel Consultancy and Network
-- Descrição: Insere as chaves de configuração para permitir o gerenciamento
--            independente da logo horizontal (Header/Menu) e vertical (Footer).
-- ==============================================================================

INSERT IGNORE INTO `site_settings` (`setting_key`, `setting_value`, `setting_type`) 
VALUES
('logo_header', '/logo.png', 'text'),
('logo_footer', '/logo.png', 'text');
