-- ==============================================================================
-- Angel Consultancy & Network - Banco de Dados MariaDB / MySQL
-- Arquitetura compatível com servidor one.com (Apache + MariaDB 10.x+ / MySQL 8.0+)
-- ==============================================================================

-- Criação da tabela de solicitações de contato
CREATE TABLE IF NOT EXISTS `contact_requests` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL COMMENT 'Nome completo do solicitante',
  `email` VARCHAR(191) NOT NULL COMMENT 'E-mail de contato',
  `phone` VARCHAR(50) NOT NULL COMMENT 'Telefone / WhatsApp com código',
  `client_type` VARCHAR(100) NOT NULL COMMENT 'Pessoa física, Profissional liberal, Associação / ONG, Outro',
  `services` LONGTEXT NOT NULL COMMENT 'Array JSON com os serviços de interesse selecionados',
  `message` TEXT NOT NULL COMMENT 'Mensagem ou detalhamento da necessidade',
  `attendance_preference` VARCHAR(50) NOT NULL COMMENT 'Presencial, Online, Não tenho preferência',
  `consent` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Consentimento LGPD/GDPR para contato',
  `status` VARCHAR(30) NOT NULL DEFAULT 'unread' COMMENT 'unread, contacted, in_progress, archived',
  `ip_address` VARCHAR(45) DEFAULT NULL COMMENT 'Endereço IP do solicitante (IPv4 ou IPv6)',
  `user_agent` VARCHAR(255) DEFAULT NULL COMMENT 'Navegador/dispositivo de origem',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data e hora da solicitação',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última atualização de status',
  INDEX `idx_email` (`email`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Registro de solicitações de contato recebidas pelo website';
