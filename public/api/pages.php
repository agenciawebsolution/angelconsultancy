<?php
/**
 * ==============================================================================
 * Angel Consultancy & Network - API de Páginas Institucionais Dinâmicas
 * ==============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/common.php';

try {
    $pdo = getDbConnection();
    ensureCmsTablesExist($pdo);
} catch (Throwable $e) {
    sendJson(false, 'Falha de conexão com o banco de dados.', 500);
}

$method = $_SERVER['REQUEST_METHOD'];

// 1. GET (Listar ou buscar página individual)
if ($method === 'GET') {
    $slug = trim((string)($_GET['slug'] ?? ''));
    $id   = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    $user = getAuthenticatedUser($pdo);

    if ($id > 0) {
        $stmt = $pdo->prepare('SELECT * FROM pages WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $page = $stmt->fetch();
        if (!$page) {
            sendJson(false, 'Página não encontrada.', 404);
        }
        sendJson(true, ['page' => $page]);
    }

    if (!empty($slug)) {
        $sql = 'SELECT * FROM pages WHERE slug = :slug';
        if (!$user) {
            $sql .= ' AND status = "published"';
        }
        $sql .= ' LIMIT 1';

        $stmt = $pdo->prepare($sql);
        $stmt->execute([':slug' => $slug]);
        $page = $stmt->fetch();
        if (!$page) {
            sendJson(false, 'Página não encontrada.', 404);
        }
        sendJson(true, ['page' => $page]);
    }

    // Listagem
    $sql = 'SELECT id, title, slug, status, sort_order, meta_title, published_at, created_at, updated_at FROM pages';
    if (!$user) {
        $sql .= ' WHERE status = "published"';
    }
    $sql .= ' ORDER BY sort_order ASC, created_at DESC';

    $stmt = $pdo->query($sql);
    sendJson(true, ['pages' => $stmt->fetchAll()]);
}

// 2. POST (Criar página)
if ($method === 'POST') {
    $admin = requireAuth($pdo);
    $data = getJsonInput();

    $title   = trim((string)($data['title'] ?? ''));
    $slug    = trim((string)($data['slug'] ?? ''));
    $content = (string)($data['content'] ?? '');
    $status  = trim((string)($data['status'] ?? 'draft'));

    if (empty($title) || empty($slug)) {
        sendJson(false, 'Título e slug são obrigatórios.', 422);
    }

    // Sanitizar slug
    $slug = preg_replace('/[^a-z0-9\-]/i', '', str_replace(' ', '-', strtolower($slug)));

    $stmt = $pdo->prepare(
        'INSERT INTO pages (title, slug, content, featured_image, status, sort_order, meta_title, meta_description, canonical_url, robots)
         VALUES (:title, :slug, :content, :img, :status, :sort, :m_title, :m_desc, :canonical, :robots)'
    );
    $stmt->execute([
        ':title'     => $title,
        ':slug'      => $slug,
        ':content'   => $content,
        ':img'       => $data['featured_image'] ?? null,
        ':status'    => in_array($status, ['draft', 'published'], true) ? $status : 'draft',
        ':sort'      => (int)($data['sort_order'] ?? 0),
        ':m_title'   => $data['meta_title'] ?? $title,
        ':m_desc'    => $data['meta_description'] ?? null,
        ':canonical' => $data['canonical_url'] ?? null,
        ':robots'    => $data['robots'] ?? 'index, follow',
    ]);

    $insertId = (int)$pdo->lastInsertId();
    logAdminActivity($pdo, (int)$admin['id'], 'create_page', 'pages', $insertId, "Página criada: {$title}");

    sendJson(true, ['message' => 'Página criada com sucesso.', 'id' => $insertId], 201);
}

// 3. PUT (Atualizar página)
if ($method === 'PUT') {
    $admin = requireAuth($pdo);
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) {
        sendJson(false, 'ID inválido.', 400);
    }

    $data = getJsonInput();
    $title = trim((string)($data['title'] ?? ''));
    $slug  = trim((string)($data['slug'] ?? ''));

    if (empty($title) || empty($slug)) {
        sendJson(false, 'Título e slug são obrigatórios.', 422);
    }

    $slug = preg_replace('/[^a-z0-9\-]/i', '', str_replace(' ', '-', strtolower($slug)));

    $stmt = $pdo->prepare(
        'UPDATE pages SET
            title = :title,
            slug = :slug,
            content = :content,
            featured_image = :img,
            status = :status,
            sort_order = :sort,
            meta_title = :m_title,
            meta_description = :m_desc,
            canonical_url = :canonical,
            robots = :robots
         WHERE id = :id'
    );
    $stmt->execute([
        ':title'     => $title,
        ':slug'      => $slug,
        ':content'   => (string)($data['content'] ?? ''),
        ':img'       => $data['featured_image'] ?? null,
        ':status'    => in_array($data['status'] ?? '', ['draft', 'published'], true) ? $data['status'] : 'draft',
        ':sort'      => (int)($data['sort_order'] ?? 0),
        ':m_title'   => $data['meta_title'] ?? $title,
        ':m_desc'    => $data['meta_description'] ?? null,
        ':canonical' => $data['canonical_url'] ?? null,
        ':robots'    => $data['robots'] ?? 'index, follow',
        ':id'        => $id,
    ]);

    logAdminActivity($pdo, (int)$admin['id'], 'update_page', 'pages', $id, "Página atualizada: {$title}");

    sendJson(true, ['message' => 'Página atualizada com sucesso.']);
}

// 4. DELETE (Excluir página)
if ($method === 'DELETE') {
    $admin = requireAuth($pdo);
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) {
        sendJson(false, 'ID inválido.', 400);
    }

    $stmt = $pdo->prepare('DELETE FROM pages WHERE id = :id');
    $stmt->execute([':id' => $id]);

    logAdminActivity($pdo, (int)$admin['id'], 'delete_page', 'pages', $id, "Página excluída ID {$id}");

    sendJson(true, ['message' => 'Página excluída com sucesso.']);
}

sendJson(false, 'Método não suportado.', 405);
