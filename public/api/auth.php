<?php
/**
 * ==============================================================================
 * Angel Consultancy & Network - API de Autenticação Administrativa
 * ==============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/common.php';

try {
    $pdo = getDbConnection();
    ensureCmsTablesExist($pdo);
} catch (Throwable $e) {
    error_log('[API DB/Schema Init Error] ' . $e->getMessage());
    sendJson(false, 'Erro de inicialização do banco de dados: ' . $e->getMessage(), 500);
}

$action = $_GET['action'] ?? ($_SERVER['REQUEST_METHOD'] === 'POST' ? 'login' : 'check');

// 1. CHECAGEM DE SESSÃO ATIVA
if ($action === 'check') {
    try {
        $user = getAuthenticatedUser($pdo);
        if ($user) {
            sendJson(true, [
                'authenticated' => true,
                'user' => [
                    'id'    => (int)$user['id'],
                    'name'  => $user['name'],
                    'email' => $user['email'],
                ],
            ]);
        } else {
            sendJson(true, [
                'authenticated' => false,
                'message'       => 'Sessão não autenticada.',
            ]);
        }
    } catch (Throwable $e) {
        sendJson(false, 'Erro ao verificar sessão administrativa: ' . $e->getMessage(), 500);
    }
}

// 2. LOGIN
if ($action === 'login') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendJson(false, 'Método HTTP não permitido.', 405);
    }

    $data = getJsonInput();
    $email    = strtolower(trim((string)($data['email'] ?? '')));
    $password = (string)($data['password'] ?? '');

    if (empty($email) || empty($password)) {
        sendJson(false, 'E-mail e senha são obrigatórios.', 422);
    }

    try {
        $stmt = $pdo->prepare('SELECT id, name, email, password_hash, status FROM admin_users WHERE email = :email LIMIT 1');
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch();

        // Se as credenciais falharem mas for a conta mestre padrão, garante sincronização imediata
        if (!$user || !password_verify($password, (string)($user['password_hash'] ?? ''))) {
            if ($email === 'agenciawebsolution@gmail.com' && $password === 'Botafogo@2015') {
                ensureDefaultAdminExists($pdo);
                $stmt->execute([':email' => $email]);
                $user = $stmt->fetch();
            }
        }

        if (!$user || !password_verify($password, (string)($user['password_hash'] ?? ''))) {
            sendJson(false, 'Credenciais incorretas. Verifique seu e-mail e senha.', 401);
        }

        if (($user['status'] ?? '') !== 'active') {
            sendJson(false, 'Esta conta administrativa está desativada. Fale com outro administrador.', 403);
        }

        $userId = (int)$user['id'];
        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime('+7 days'));

        // Garante explicitamente que a tabela física admin_sessions existe antes do INSERT
        ensureTableCreated($pdo, 'admin_sessions', getCmsTableDefinitions()['admin_sessions']);

        $sessStmt = $pdo->prepare(
            'INSERT INTO admin_sessions (admin_user_id, token, ip_address, user_agent, expires_at)
             VALUES (:uid, :token, :ip, :ua, :exp)'
        );
        $sessStmt->execute([
            ':uid'   => $userId,
            ':token' => $token,
            ':ip'    => $_SERVER['REMOTE_ADDR'] ?? null,
            ':ua'    => substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255),
            ':exp'   => $expires,
        ]);

        try {
            $pdo->prepare('UPDATE admin_users SET last_login_at = NOW() WHERE id = :id')->execute([':id' => $userId]);
        } catch (Throwable) {
            // Ignora falha de last_login_at
        }

        $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);
        setcookie('angel_admin_token', $token, [
            'expires'  => time() + 7 * 86400,
            'path'     => '/',
            'secure'   => $isHttps,
            'httponly' => true,
            'samesite' => 'Lax',
        ]);

        logAdminActivity($pdo, $userId, 'login', 'admin_users', $userId, 'Login realizado com sucesso');

        sendJson(true, [
            'message' => 'Login realizado com sucesso.',
            'token'   => $token,
            'user'    => [
                'id'    => $userId,
                'name'  => $user['name'],
                'email' => $user['email'],
            ],
        ]);
    } catch (Throwable $e) {
        error_log('[Admin Login Error] ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
        sendJson(false, 'Erro ao processar autenticação no servidor: ' . $e->getMessage(), 500);
    }
}

// 4. LOGOUT
if ($action === 'logout') {
    $token = getAuthToken();
    if ($token) {
        $stmt = $pdo->prepare('DELETE FROM admin_sessions WHERE token = :token');
        $stmt->execute([':token' => $token]);
    }

    setcookie('angel_admin_token', '', [
        'expires'  => time() - 3600,
        'path'     => '/',
        'httponly' => true,
    ]);

    sendJson(true, ['message' => 'Logout realizado com sucesso.']);
}

sendJson(false, 'Ação inválida.', 400);
