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
    sendJson(false, 'Indisponibilidade de conexão com o banco de dados.', 500);
}

$action = $_GET['action'] ?? ($_SERVER['REQUEST_METHOD'] === 'POST' ? 'login' : 'check');

// 1. CHECAGEM DE SESSÃO / SETUP
if ($action === 'check') {
    try {
        $countStmt = $pdo->query('SELECT COUNT(*) FROM admin_users');
        $totalAdmins = (int)$countStmt->fetchColumn();

        if ($totalAdmins === 0) {
            sendJson(true, [
                'authenticated'  => false,
                'setup_required' => true,
                'message'        => 'Nenhum administrador cadastrado. Setup inicial necessário.',
            ]);
        }

        $user = getAuthenticatedUser($pdo);
        if ($user) {
            sendJson(true, [
                'authenticated'  => true,
                'setup_required' => false,
                'user' => [
                    'id'    => (int)$user['id'],
                    'name'  => $user['name'],
                    'email' => $user['email'],
                ],
            ]);
        } else {
            sendJson(false, [
                'authenticated'  => false,
                'setup_required' => false,
                'message'        => 'Sessão não autenticada.',
            ], 401);
        }
    } catch (Throwable $e) {
        sendJson(false, 'Erro ao verificar sessão administrativa.', 500);
    }
}

// 2. SETUP DO PRIMEIRO ADMINISTRADOR (Bloqueado se já existir qualquer admin)
if ($action === 'setup') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendJson(false, 'Método HTTP não permitido.', 405);
    }

    $countStmt = $pdo->query('SELECT COUNT(*) FROM admin_users');
    if ((int)$countStmt->fetchColumn() > 0) {
        sendJson(false, 'O setup inicial já foi concluído anteriormente. Acesso bloqueado.', 403);
    }

    $data = getJsonInput();
    $name     = trim((string)($data['name'] ?? ''));
    $email    = strtolower(trim((string)($data['email'] ?? '')));
    $password = (string)($data['password'] ?? '');

    if (mb_strlen($name) < 3) {
        sendJson(false, 'O nome deve ter no mínimo 3 caracteres.', 422);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJson(false, 'Informe um endereço de e-mail válido.', 422);
    }
    if (strlen($password) < 8) {
        sendJson(false, 'A senha deve ter no mínimo 8 caracteres.', 422);
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare(
        'INSERT INTO admin_users (name, email, password_hash, status, last_login_at)
         VALUES (:name, :email, :hash, "active", NOW())'
    );
    $stmt->execute([
        ':name'  => $name,
        ':email' => $email,
        ':hash'  => $hash,
    ]);

    $userId = (int)$pdo->lastInsertId();
    $token = bin2hex(random_bytes(32));
    $expires = date('Y-m-d H:i:s', strtotime('+7 days'));

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

    // Cookie seguro
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);
    setcookie('angel_admin_token', $token, [
        'expires'  => time() + 7 * 86400,
        'path'     => '/',
        'secure'   => $isHttps,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    logAdminActivity($pdo, $userId, 'setup', 'admin_users', $userId, 'Setup do primeiro administrador realizado');

    sendJson(true, [
        'message' => 'Primeiro administrador configurado com sucesso.',
        'token'   => $token,
        'user'    => [
            'id'    => $userId,
            'name'  => $name,
            'email' => $email,
        ],
    ], 201);
}

// 3. LOGIN
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

    $stmt = $pdo->prepare('SELECT id, name, email, password_hash, status FROM admin_users WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        sendJson(false, 'Credenciais incorretas. Verifique seu e-mail e senha.', 401);
    }

    if ($user['status'] !== 'active') {
        sendJson(false, 'Esta conta administrativa está desativada. Fale com outro administrador.', 403);
    }

    $userId = (int)$user['id'];
    $token = bin2hex(random_bytes(32));
    $expires = date('Y-m-d H:i:s', strtotime('+7 days'));

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

    $pdo->prepare('UPDATE admin_users SET last_login_at = NOW() WHERE id = :id')->execute([':id' => $userId]);

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
