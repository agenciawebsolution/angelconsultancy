<?php
/**
 * ==============================================================================
 * Angel Consultancy & Network - API de Gestão de Usuários Administradores
 * ==============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/common.php';

try {
    $pdo = getDbConnection();
    ensureCmsTablesExist($pdo);
    $currentAdmin = requireAuth($pdo);
} catch (Throwable $e) {
    sendJson(false, 'Falha de autenticação ou banco de dados.', 500);
}

$method = $_SERVER['REQUEST_METHOD'];

// 1. GET (Listar administradores)
if ($method === 'GET') {
    $stmt = $pdo->query('SELECT id, name, email, status, last_login_at, created_at FROM admin_users ORDER BY id ASC');
    sendJson(true, ['users' => $stmt->fetchAll()]);
}

// 2. POST (Criar novo administrador)
if ($method === 'POST') {
    $data = getJsonInput();
    $name     = trim((string)($data['name'] ?? ''));
    $email    = strtolower(trim((string)($data['email'] ?? '')));
    $password = (string)($data['password'] ?? '');

    if (mb_strlen($name) < 3) {
        sendJson(false, 'O nome deve ter no mínimo 3 caracteres.', 422);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJson(false, 'E-mail inválido.', 422);
    }
    if (strlen($password) < 8) {
        sendJson(false, 'A senha deve ter no mínimo 8 caracteres.', 422);
    }

    // Verificar e-mail duplicado
    $check = $pdo->prepare('SELECT id FROM admin_users WHERE email = :email LIMIT 1');
    $check->execute([':email' => $email]);
    if ($check->fetch()) {
        sendJson(false, 'Este e-mail já está cadastrado para outro administrador.', 409);
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare(
        'INSERT INTO admin_users (name, email, password_hash, status) 
         VALUES (:name, :email, :hash, "active")'
    );
    $stmt->execute([
        ':name'  => $name,
        ':email' => $email,
        ':hash'  => $hash,
    ]);

    $newId = (int)$pdo->lastInsertId();
    logAdminActivity($pdo, (int)$currentAdmin['id'], 'create_user', 'admin_users', $newId, "Novo administrador criado: {$email}");

    sendJson(true, ['message' => 'Administrador cadastrado com sucesso.', 'id' => $newId], 201);
}

// 3. PUT (Atualizar administrador)
if ($method === 'PUT') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) {
        sendJson(false, 'ID inválido.', 400);
    }

    $data = getJsonInput();
    $name   = trim((string)($data['name'] ?? ''));
    $email  = strtolower(trim((string)($data['email'] ?? '')));
    $status = trim((string)($data['status'] ?? 'active'));
    $newPass = (string)($data['password'] ?? '');

    if (empty($name) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJson(false, 'Nome e e-mail válidos são obrigatórios.', 422);
    }

    // Verificar se está tentando desativar o último administrador ativo
    if ($status === 'inactive') {
        $countActive = (int)$pdo->query('SELECT COUNT(*) FROM admin_users WHERE status = "active"')->fetchColumn();
        $isCurrentlyActive = (bool)$pdo->query("SELECT 1 FROM admin_users WHERE id = {$id} AND status = 'active'")->fetchColumn();
        if ($isCurrentlyActive && $countActive <= 1) {
            sendJson(false, 'Não é permitido desativar o único administrador ativo do sistema.', 400);
        }
    }

    if (!empty($newPass)) {
        if (strlen($newPass) < 8) {
            sendJson(false, 'A nova senha deve ter no mínimo 8 caracteres.', 422);
        }
        $hash = password_hash($newPass, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare(
            'UPDATE admin_users SET name = :name, email = :email, status = :status, password_hash = :hash WHERE id = :id'
        );
        $stmt->execute([
            ':name'   => $name,
            ':email'  => $email,
            ':status' => in_array($status, ['active', 'inactive'], true) ? $status : 'active',
            ':hash'   => $hash,
            ':id'     => $id,
        ]);
    } else {
        $stmt = $pdo->prepare(
            'UPDATE admin_users SET name = :name, email = :email, status = :status WHERE id = :id'
        );
        $stmt->execute([
            ':name'   => $name,
            ':email'  => $email,
            ':status' => in_array($status, ['active', 'inactive'], true) ? $status : 'active',
            ':id'     => $id,
        ]);
    }

    logAdminActivity($pdo, (int)$currentAdmin['id'], 'update_user', 'admin_users', $id, "Administrador atualizado: {$email}");

    sendJson(true, ['message' => 'Dados do administrador atualizados com sucesso.']);
}

// 4. DELETE (Excluir administrador)
if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) {
        sendJson(false, 'ID inválido.', 400);
    }

    // Impedir que o usuário exclua a si mesmo
    if ($id === (int)$currentAdmin['id']) {
        sendJson(false, 'Você não pode excluir a sua própria conta ativa.', 400);
    }

    // Impedir que exclua o último administrador
    $count = (int)$pdo->query('SELECT COUNT(*) FROM admin_users')->fetchColumn();
    if ($count <= 1) {
        sendJson(false, 'Não é possível excluir o único administrador existente.', 400);
    }

    $stmt = $pdo->prepare('DELETE FROM admin_users WHERE id = :id');
    $stmt->execute([':id' => $id]);

    logAdminActivity($pdo, (int)$currentAdmin['id'], 'delete_user', 'admin_users', $id, "Administrador excluído ID {$id}");

    sendJson(true, ['message' => 'Administrador excluído com sucesso.']);
}

sendJson(false, 'Método não suportado.', 405);
