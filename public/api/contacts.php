<?php
/**
 * ==============================================================================
 * Angel Consultancy & Network - API Administrativa de Mensagens / Contatos
 * ==============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/common.php';

try {
    $pdo = getDbConnection();
    ensureCmsTablesExist($pdo);
    $admin = requireAuth($pdo);
} catch (Throwable $e) {
    sendJson(false, 'Falha de autenticação ou banco de dados.', 500);
}

$method = $_SERVER['REQUEST_METHOD'];

// 1. GET (Listar com filtros ou buscar única)
if ($method === 'GET') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;

    if ($id) {
        $stmt = $pdo->prepare('SELECT * FROM contact_requests WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $contact = $stmt->fetch();
        if (!$contact) {
            sendJson(false, 'Mensagem não encontrada.', 404);
        }
        sendJson(true, ['contact' => $contact]);
    }

    $page   = max(1, (int)($_GET['page'] ?? 1));
    $limit  = min(100, max(5, (int)($_GET['limit'] ?? 15)));
    $offset = ($page - 1) * $limit;

    $search = trim((string)($_GET['search'] ?? ''));
    $status = trim((string)($_GET['status'] ?? 'all'));

    $where = [];
    $params = [];

    if ($status !== '' && $status !== 'all') {
        $where[] = 'status = :status';
        $params[':status'] = $status;
    }

    if ($search !== '') {
        $where[] = '(full_name LIKE :s OR email LIKE :s OR phone LIKE :s OR message LIKE :s)';
        $params[':s'] = '%' . $search . '%';
    }

    $whereSql = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    // Contagem total
    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM contact_requests {$whereSql}");
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    // Registros
    $sql = "SELECT id, full_name, email, phone, client_type, services, message, attendance_preference, status, ip_address, created_at 
            FROM contact_requests 
            {$whereSql} 
            ORDER BY created_at DESC 
            LIMIT {$limit} OFFSET {$offset}";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $items = $stmt->fetchAll();

    sendJson(true, [
        'data'       => $items,
        'total'      => $total,
        'page'       => $page,
        'limit'      => $limit,
        'totalPages' => (int)ceil($total / $limit),
    ]);
}

// 2. PUT (Atualizar status)
if ($method === 'PUT') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) {
        sendJson(false, 'ID inválido.', 400);
    }

    $data = getJsonInput();
    $status = trim((string)($data['status'] ?? ''));

    $allowedStatuses = ['unread', 'in_review', 'replied', 'archived'];
    if (!in_array($status, $allowedStatuses, true)) {
        sendJson(false, 'Status inválido.', 422);
    }

    $stmt = $pdo->prepare('UPDATE contact_requests SET status = :status WHERE id = :id');
    $stmt->execute([':status' => $status, ':id' => $id]);

    logAdminActivity($pdo, (int)$admin['id'], 'update_status', 'contact_requests', $id, "Status alterado para {$status}");

    sendJson(true, ['message' => 'Status da mensagem atualizado com sucesso.']);
}

// 3. DELETE (Excluir mensagem)
if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) {
        sendJson(false, 'ID inválido.', 400);
    }

    $stmt = $pdo->prepare('DELETE FROM contact_requests WHERE id = :id');
    $stmt->execute([':id' => $id]);

    logAdminActivity($pdo, (int)$admin['id'], 'delete', 'contact_requests', $id, "Mensagem excluída ID {$id}");

    sendJson(true, ['message' => 'Mensagem excluída com sucesso.']);
}

sendJson(false, 'Método não suportado.', 405);
