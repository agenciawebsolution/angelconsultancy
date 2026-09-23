<?php
/**
 * ==============================================================================
 * Angel Consultancy & Network - Utilitários Comuns da API PHP
 * ==============================================================================
 */

declare(strict_types=1);

define('API_ACCESS', true);

// Configuração de cabeçalhos padrão
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Manipulador global de exceções não capturadas para SEMPRE retornar JSON válido
set_exception_handler(function (Throwable $e): void {
    error_log('[Angel API Unhandled Exception] ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
    while (ob_get_level() > 0) {
        ob_end_clean();
    }
    sendJson(false, 'Erro interno no servidor ao processar requisição.', 500);
});

// Manipulador de encerramento para garantir que erros fatais nunca retornem corpo vazio
register_shutdown_function(function (): void {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        error_log('[Angel API Fatal Error] ' . $error['message'] . ' in ' . $error['file'] . ':' . $error['line']);
        while (ob_get_level() > 0) {
            ob_end_clean();
        }
        if (!headers_sent()) {
            http_response_code(500);
            header('Content-Type: application/json; charset=UTF-8');
        }
        echo json_encode([
            'success' => false,
            'message' => 'Erro interno no servidor.',
            'error'   => 'Erro interno no servidor.',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
});

// Tratamento de CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'https://angel-consultancy.be',
    'https://www.angel-consultancy.be',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:3000',
];

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/db.php';

/**
 * Resposta JSON padronizada
 */
function sendJson(bool $success, mixed $dataOrMessage, int $statusCode = 200): void
{
    http_response_code($statusCode);
    if ($success) {
        $response = ['success' => true];
        if (is_array($dataOrMessage)) {
            $response = array_merge($response, $dataOrMessage);
        } else {
            $response['data'] = $dataOrMessage;
        }
    } else {
        $msg = is_string($dataOrMessage) ? $dataOrMessage : 'Ocorreu um erro no processamento.';
        $response = [
            'success' => false,
            'message' => $msg,
            'error'   => $msg,
        ];
        if (is_array($dataOrMessage)) {
            $response = array_merge($response, $dataOrMessage);
        }
    }
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Lê e decodifica o corpo JSON da requisição
 */
function getJsonInput(): array
{
    $raw = file_get_contents('php://input');
    if (empty($raw)) {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/**
 * Obtém o token de autenticação via Header Authorization ou Cookie
 */
function getAuthToken(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(\S+)/i', $header, $matches)) {
        return $matches[1];
    }
    if (!empty($_COOKIE['angel_admin_token'])) {
        return $_COOKIE['angel_admin_token'];
    }
    return null;
}

/**
 * Valida a sessão do usuário administrador
 */
function getAuthenticatedUser(PDO $pdo): ?array
{
    $token = getAuthToken();
    if (!$token) {
        return null;
    }

    $stmt = $pdo->prepare(
        'SELECT u.id, u.name, u.email, u.status, s.expires_at, s.token 
         FROM admin_sessions s
         JOIN admin_users u ON u.id = s.admin_user_id
         WHERE s.token = :token AND s.expires_at > NOW() AND u.status = "active"
         LIMIT 1'
    );
    $stmt->execute([':token' => $token]);
    $user = $stmt->fetch();

    return $user ?: null;
}

/**
 * Garante que a requisição é de um administrador autenticado
 */
function requireAuth(PDO $pdo): array
{
    $user = getAuthenticatedUser($pdo);
    if (!$user) {
        sendJson(false, 'Acesso não autorizado. Faça login novamente.', 401);
    }
    return $user;
}

/**
 * Registra atividade no log de auditoria
 */
function logAdminActivity(PDO $pdo, ?int $userId, string $action, string $entityType, ?int $entityId, string $description): void
{
    try {
        $stmt = $pdo->prepare(
            'INSERT INTO admin_activity_log (admin_user_id, action, entity_type, entity_id, description, ip_address)
             VALUES (:user_id, :action, :entity_type, :entity_id, :description, :ip)'
        );
        $stmt->execute([
            ':user_id'     => $userId,
            ':action'      => $action,
            ':entity_type' => $entityType,
            ':entity_id'   => $entityId,
            ':description' => $description,
            ':ip'          => $_SERVER['REMOTE_ADDR'] ?? null,
        ]);
    } catch (Exception $e) {
        // Falha no log não deve interromper a operação principal
        error_log('[Activity Log Error] ' . $e->getMessage());
    }
}

/**
 * Verifica individualmente se uma tabela existe no banco de dados MariaDB
 */
function checkTableExists(PDO $pdo, string $tableName): bool
{
    try {
        $stmt = $pdo->prepare('SHOW TABLES LIKE :table');
        $stmt->execute([':table' => $tableName]);
        return (bool)$stmt->fetch();
    } catch (Throwable) {
        return false;
    }
}

/**
 * Retorna as definições DDL individuais para todas as tabelas do CMS
 *
 * @return array<string, string>
 */
function getCmsTableDefinitions(): array
{
    return [
        'admin_users' => "CREATE TABLE IF NOT EXISTS `admin_users` (
            `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `name` VARCHAR(100) NOT NULL COMMENT 'Nome completo do administrador',
            `email` VARCHAR(191) NOT NULL UNIQUE COMMENT 'E-mail para login',
            `password_hash` VARCHAR(255) NOT NULL COMMENT 'Hash da senha gerado com password_hash()',
            `role` VARCHAR(50) NOT NULL DEFAULT 'admin' COMMENT 'Nível de permissão administrativa',
            `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active' COMMENT 'Status de acesso',
            `last_login_at` DATETIME NULL COMMENT 'Data do último login bem-sucedido',
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX `idx_admin_email` (`email`),
            INDEX `idx_admin_status` (`status`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

        'admin_sessions' => "CREATE TABLE IF NOT EXISTS `admin_sessions` (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

        'admin_activity_log' => "CREATE TABLE IF NOT EXISTS `admin_activity_log` (
            `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `admin_user_id` INT UNSIGNED NULL,
            `action` VARCHAR(50) NOT NULL COMMENT 'Tipo de ação (login, create, update, delete)',
            `entity_type` VARCHAR(50) NOT NULL COMMENT 'Entidade afetada (contacts, blog, settings, users)',
            `entity_id` INT UNSIGNED NULL,
            `description` TEXT NOT NULL COMMENT 'Detalhes da ação',
            `ip_address` VARCHAR(45) NULL,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX `idx_activity_created` (`created_at`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

        'blog_categories' => "CREATE TABLE IF NOT EXISTS `blog_categories` (
            `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `name` VARCHAR(100) NOT NULL,
            `slug` VARCHAR(120) NOT NULL UNIQUE,
            `description` TEXT NULL,
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX `idx_cat_slug` (`slug`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

        'blog_posts' => "CREATE TABLE IF NOT EXISTS `blog_posts` (
            `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `category_id` INT UNSIGNED NULL,
            `title` VARCHAR(255) NOT NULL,
            `slug` VARCHAR(255) NOT NULL UNIQUE,
            `excerpt` TEXT NULL,
            `content` LONGTEXT NOT NULL,
            `featured_image` VARCHAR(500) NULL,
            `image_alt` VARCHAR(255) NULL,
            `author_name` VARCHAR(100) NOT NULL DEFAULT 'Angel Consultancy',
            `status` ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
            `published_at` DATETIME NULL,
            `views_count` INT UNSIGNED NOT NULL DEFAULT 0,
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

        'pages' => "CREATE TABLE IF NOT EXISTS `pages` (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

        'page_sections' => "CREATE TABLE IF NOT EXISTS `page_sections` (
            `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `page_slug` VARCHAR(100) NOT NULL DEFAULT 'home',
            `section_key` VARCHAR(50) NOT NULL,
            `content_json` LONGTEXT NOT NULL,
            `sort_order` INT NOT NULL DEFAULT 0,
            `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
            `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY `idx_page_section` (`page_slug`, `section_key`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

        'media' => "CREATE TABLE IF NOT EXISTS `media` (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

        'site_settings' => "CREATE TABLE IF NOT EXISTS `site_settings` (
            `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `setting_key` VARCHAR(100) NOT NULL UNIQUE,
            `setting_value` LONGTEXT NULL,
            `setting_type` VARCHAR(30) NOT NULL DEFAULT 'text',
            `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX `idx_setting_key` (`setting_key`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    ];
}

/**
 * Garante a existência do usuário administrador padrão com senha criptografada via password_hash()
 */
function ensureDefaultAdminExists(PDO $pdo): void
{
    try {
        $email = 'agenciawebsolution@gmail.com';
        $defaultPassword = 'Botafogo@2015';
        $hash = password_hash($defaultPassword, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare('SELECT id, password_hash, role, status FROM `admin_users` WHERE email = :email LIMIT 1');
        $stmt->execute([':email' => $email]);
        $existing = $stmt->fetch();

        if (!$existing) {
            $insert = $pdo->prepare(
                'INSERT INTO `admin_users` (name, email, password_hash, role, status, created_at)
                 VALUES (:name, :email, :hash, "admin", "active", NOW())'
            );
            $insert->execute([
                ':name'  => 'Agencia Web Solution',
                ':email' => $email,
                ':hash'  => $hash,
            ]);
        } else {
            // Garante que o administrador oficial sempre tenha a senha e status corretos
            $needsUpdate = false;
            if (!password_verify($defaultPassword, (string)($existing['password_hash'] ?? ''))) {
                $needsUpdate = true;
            }
            if (($existing['status'] ?? '') !== 'active') {
                $needsUpdate = true;
            }
            if (($existing['role'] ?? '') !== 'admin') {
                $needsUpdate = true;
            }

            if ($needsUpdate) {
                $upd = $pdo->prepare(
                    'UPDATE `admin_users` 
                     SET password_hash = :hash, status = "active", role = "admin" 
                     WHERE id = :id'
                );
                $upd->execute([
                    ':hash' => $hash,
                    ':id'   => $existing['id'],
                ]);
            }
        }
    } catch (Throwable $e) {
        error_log('[Admin Init Error] ' . $e->getMessage());
    }
}

/**
 * Inicialização individual e idempotente de TODAS as tabelas CMS no MariaDB
 */
function ensureCmsTablesExist(PDO $pdo): void
{
    static $executed = false;
    if ($executed) {
        return;
    }
    $executed = true;

    try {
        $tables = getCmsTableDefinitions();

        // 1. Cria cada tabela individualmente se estiver ausente
        foreach ($tables as $tableName => $createSql) {
            if (!checkTableExists($pdo, $tableName)) {
                try {
                    $pdo->exec($createSql);
                } catch (Throwable $e) {
                    error_log("[CMS Table Create Error] Falha ao criar tabela {$tableName}: " . $e->getMessage());
                }
            }
        }

        // 2. Garante a coluna role na tabela admin_users caso a tabela já existisse sem ela
        try {
            $colStmt = $pdo->query("SHOW COLUMNS FROM `admin_users` LIKE 'role'");
            if (!$colStmt || !$colStmt->fetch()) {
                $pdo->exec("ALTER TABLE `admin_users` ADD COLUMN `role` VARCHAR(50) NOT NULL DEFAULT 'admin' AFTER `password_hash`");
            }
        } catch (Throwable $e) {
            // Coluna já existe ou variação sintática permitida
        }

        // 3. Views de compatibilidade caso o ambiente faça referência com prefixo angel_consultancy_
        try {
            $pdo->exec("CREATE OR REPLACE VIEW `angel_consultancy_admin_sessions` AS SELECT * FROM `admin_sessions`");
            $pdo->exec("CREATE OR REPLACE VIEW `angel_consultancy_admin_users` AS SELECT * FROM `admin_users`");
        } catch (Throwable) {
            // Silencia caso criação de view não seja suportada pelo usuário do banco
        }

        // 4. Insere configurações padrão em site_settings caso a tabela esteja vazia
        try {
            $countStmt = $pdo->query('SELECT COUNT(*) FROM `site_settings`');
            if ((int)$countStmt->fetchColumn() === 0) {
                $pdo->exec("INSERT IGNORE INTO `site_settings` (`setting_key`, `setting_value`, `setting_type`) VALUES
                    ('company_name', 'Angel Consultancy and Network', 'text'),
                    ('company_description', 'Assistência humana, simples e confiável para sua organização financeira e administrativa.', 'textarea'),
                    ('company_phone', '+32 492 319 741', 'text'),
                    ('company_email', 'info@angel-consultancy.be', 'text'),
                    ('company_whatsapp_url', 'https://wa.me/32492319741?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20servi%C3%A7os%20da%20Angel%20Consultancy.', 'text'),
                    ('company_location', 'Bélgica (Atendimento Presencial e Online)', 'text'),
                    ('seo_site_title', 'Angel Consultancy and Network | Apoio Humano, Simples e Confiável', 'text'),
                    ('seo_meta_description', 'Assistência humana, simples e confiável para sua organização financeira e administrativa. Atendimento personalizado para pessoas físicas, associações e autônomos.', 'textarea'),
                    ('seo_default_og_image', '/logo.png', 'text'),
                    ('seo_canonical_url', 'https://www.angel-consultancy.be', 'text'),
                    ('seo_robots', 'index, follow', 'text')");
            }
        } catch (Throwable) {
            // Continua caso já existam configurações
        }

        // 5. Insere categorias padrão no blog caso esteja vazio
        try {
            $catCountStmt = $pdo->query('SELECT COUNT(*) FROM `blog_categories`');
            if ((int)$catCountStmt->fetchColumn() === 0) {
                $pdo->exec("INSERT IGNORE INTO `blog_categories` (`id`, `name`, `slug`, `description`) VALUES
                    (1, 'Geral', 'geral', 'Artigos gerais e novidades da Angel Consultancy'),
                    (2, 'Organização Administrativa', 'organizacao-administrativa', 'Dicas práticas para organizar documentos e rotinas'),
                    (3, 'Tributário & Finanças', 'tributario-financas', 'Orientações simplificadas sobre impostos e obrigações')");
            }
        } catch (Throwable) {
            // Continua caso já existam categorias
        }

        // 6. Garante o usuário administrador padrão com hash seguro
        ensureDefaultAdminExists($pdo);

    } catch (Throwable $e) {
        error_log('[CMS Tables Init Error] ' . $e->getMessage());
    }
}
