<?php
/**
 * ==============================================================================
 * Angel Consultancy & Network - API de Seções Dinâmicas da Home / CMS
 * ==============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/common.php';

try {
    $pdo = getDbConnection();
    ensureCmsTablesExist($pdo);
} catch (Throwable $e) {
    sendJson(false, 'Falha ao acessar o banco de dados.', 500);
}

$method = $_SERVER['REQUEST_METHOD'];

// 1. GET (Público - Retorna seções da página)
if ($method === 'GET') {
    $pageSlug = trim((string)($_GET['page'] ?? 'home'));
    
    $stmt = $pdo->prepare('SELECT section_key, content_json FROM page_sections WHERE page_slug = :slug AND status = "active" ORDER BY sort_order ASC');
    $stmt->execute([':slug' => $pageSlug]);
    $rows = $stmt->fetchAll();

    $sections = [];
    foreach ($rows as $row) {
        $decoded = json_decode($row['content_json'], true);
        $sections[$row['section_key']] = is_array($decoded) ? $decoded : $row['content_json'];
    }

    sendJson(true, ['sections' => $sections]);
}

// 2. POST / PUT (Administrativo - Salvar ou atualizar conteúdo da seção)
if ($method === 'POST' || $method === 'PUT') {
    $admin = requireAuth($pdo);
    $data = getJsonInput();

    $pageSlug   = trim((string)($data['page_slug'] ?? 'home'));
    $sectionKey = trim((string)($data['section_key'] ?? ''));
    $content    = $data['content'] ?? null;

    if (empty($sectionKey) || $content === null) {
        sendJson(false, 'Chave da seção e conteúdo são obrigatórios.', 422);
    }

    $contentJson = is_string($content) ? $content : json_encode($content, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    $sql = 'INSERT INTO page_sections (page_slug, section_key, content_json, status, updated_at)
            VALUES (:slug, :key, :json, "active", NOW())
            ON DUPLICATE KEY UPDATE 
                content_json = VALUES(content_json), 
                status = "active", 
                updated_at = NOW()';

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':slug' => $pageSlug,
        ':key'  => $sectionKey,
        ':json' => $contentJson,
    ]);

    logAdminActivity($pdo, (int)$admin['id'], 'update_section', 'page_sections', null, "Seção atualizada: {$sectionKey} da página {$pageSlug}");

    sendJson(true, ['message' => "Seção '{$sectionKey}' salva com sucesso."]);
}

sendJson(false, 'Método não suportado.', 405);
