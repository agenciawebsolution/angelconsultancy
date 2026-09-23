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
    sendJson(false, 'Erro interno no servidor ao processar requisição.', 500);
});

// Manipulador de encerramento para garantir que erros fatais nunca retornem corpo vazio
register_shutdown_function(function (): void {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        error_log('[Angel API Fatal Error] ' . $error['message'] . ' in ' . $error['file'] . ':' . $error['line']);
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
 * Garante a existência do usuário administrador padrão com senha criptografada via password_hash()
 */
function ensureDefaultAdminExists(PDO $pdo): void
{
    try {
        // Tenta garantir que a coluna role exista se a tabela já foi criada anteriormente sem ela
        try {
            $pdo->exec("ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'admin'");
        } catch (Throwable) {
            // Silencia caso a versão do MariaDB use sintaxe diferente ou a coluna já exista
        }

        $email = 'agenciawebsolution@gmail.com';
        $stmt = $pdo->prepare('SELECT id, status FROM admin_users WHERE email = :email LIMIT 1');
        $stmt->execute([':email' => $email]);
        $existing = $stmt->fetch();

        if (!$existing) {
            $defaultPassword = 'Botafogo@2015';
            $hash = password_hash($defaultPassword, PASSWORD_DEFAULT);

            $insert = $pdo->prepare(
                'INSERT INTO admin_users (name, email, password_hash, role, status, created_at)
                 VALUES (:name, :email, :hash, "admin", "active", NOW())'
            );
            $insert->execute([
                ':name'  => 'Agencia Web Solution',
                ':email' => $email,
                ':hash'  => $hash,
            ]);
        } else {
            // Usuário já existe: garante status ativo
            if (($existing['status'] ?? '') !== 'active') {
                $upd = $pdo->prepare('UPDATE admin_users SET status = "active" WHERE id = :id');
                $upd->execute([':id' => $existing['id']]);
            }
        }
    } catch (Throwable $e) {
        error_log('[Admin Init Error] ' . $e->getMessage());
    }
}

/**
 * Inicialização automática das tabelas CMS caso ainda não existam no MariaDB
 */
function ensureCmsTablesExist(PDO $pdo): void
{
    static $checked = false;
    if ($checked) {
        return;
    }
    $checked = true;

    try {
        // Verifica se a tabela admin_users já existe
        $test = $pdo->query("SHOW TABLES LIKE 'admin_users'")->fetch();
        if (!$test) {
            $schemaFile = __DIR__ . '/database/schema_cms.sql';
            if (file_exists($schemaFile)) {
                $sql = file_get_contents($schemaFile);
                $pdo->exec($sql);
            }
        }

        // Garante a existência do usuário administrador padrão com hash seguro
        ensureDefaultAdminExists($pdo);
    } catch (Exception $e) {
        error_log('[CMS Tables Init Error] ' . $e->getMessage());
    }
}
