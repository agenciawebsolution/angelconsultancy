<?php
/**
 * ==============================================================================
 * Angel Consultancy & Network - API de Gestão de Slides do Hero (CMS)
 * ==============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/common.php';

try {
    $pdo = getDbConnection();
    ensureCmsTablesExist($pdo);
} catch (Throwable $e) {
    sendJson(false, 'Falha ao acessar o banco de dados: ' . $e->getMessage(), 500);
}

$method = $_SERVER['REQUEST_METHOD'];

/**
 * Normaliza o registro do banco para o formato de resposta da API
 */
function formatSlideRow(array $row): array
{
    $stats = [];
    if (!empty($row['stats_json'])) {
        $decoded = json_decode((string)$row['stats_json'], true);
        if (is_array($decoded)) {
            $stats = $decoded;
        }
    }

    return [
        'id'               => (int)$row['id'],
        'badge'            => (string)($row['badge'] ?? ''),
        'title'            => (string)$row['title'],
        'highlightText'    => (string)($row['highlight_text'] ?? ''),
        'subtitle'         => (string)($row['subtitle'] ?? ''),
        'ctaPrimaryText'   => (string)($row['cta_primary_text'] ?? ''),
        'ctaPrimaryLink'   => (string)($row['cta_primary_link'] ?? ''),
        'ctaSecondaryText' => (string)($row['cta_secondary_text'] ?? ''),
        'ctaSecondaryLink' => (string)($row['cta_secondary_link'] ?? ''),
        'imageUrl'         => (string)$row['image_url'],
        'imageAlt'         => (string)($row['image_alt'] ?? ''),
        'stats'            => $stats,
        'sortOrder'        => (int)($row['sort_order'] ?? 0),
        'isActive'         => (bool)($row['is_active'] ?? 1),
        'createdAt'        => $row['created_at'] ?? null,
        'updatedAt'        => $row['updated_at'] ?? null,
    ];
}

// ------------------------------------------------------------------------------
// 1. GET — Listar slides (Público ou Admin)
// ------------------------------------------------------------------------------
if ($method === 'GET') {
    $user = getAuthenticatedUser($pdo);
    $isAdmin = ($user !== null);
    $all = isset($_GET['all']) && (string)$_GET['all'] === '1';

    if ($isAdmin && $all) {
        $stmt = $pdo->query('SELECT * FROM `home_slides` ORDER BY sort_order ASC, id ASC');
    } else {
        $stmt = $pdo->query('SELECT * FROM `home_slides` WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
    }

    $rows = $stmt->fetchAll();
    $slides = array_map('formatSlideRow', $rows);

    sendJson(true, ['slides' => $slides]);
}

// ------------------------------------------------------------------------------
// 2. POST — Criar novo slide (Admin)
// ------------------------------------------------------------------------------
if ($method === 'POST') {
    $admin = requireAuth($pdo);
    $data = getJsonInput();

    $title = trim((string)($data['title'] ?? ''));
    $imageUrl = trim((string)($data['imageUrl'] ?? $data['image_url'] ?? ''));

    if (empty($title)) {
        sendJson(false, 'O título do slide é obrigatório.', 422);
    }
    if (empty($imageUrl)) {
        sendJson(false, 'A imagem do slide é obrigatória.', 422);
    }

    $badge            = trim((string)($data['badge'] ?? ''));
    $highlightText    = trim((string)($data['highlightText'] ?? $data['highlight_text'] ?? ''));
    $subtitle         = trim((string)($data['subtitle'] ?? ''));
    $ctaPrimaryText   = trim((string)($data['ctaPrimaryText'] ?? $data['cta_primary_text'] ?? ''));
    $ctaPrimaryLink   = trim((string)($data['ctaPrimaryLink'] ?? $data['cta_primary_link'] ?? ''));
    $ctaSecondaryText = trim((string)($data['ctaSecondaryText'] ?? $data['cta_secondary_text'] ?? ''));
    $ctaSecondaryLink = trim((string)($data['ctaSecondaryLink'] ?? $data['cta_secondary_link'] ?? ''));
    $imageAlt         = trim((string)($data['imageAlt'] ?? $data['image_alt'] ?? ''));
    $isActive         = isset($data['isActive']) ? ((bool)$data['isActive'] ? 1 : 0) : (isset($data['is_active']) ? ((bool)$data['is_active'] ? 1 : 0) : 1);
    
    // Sort order: caso não venha, coloca no final
    if (isset($data['sortOrder'])) {
        $sortOrder = (int)$data['sortOrder'];
    } elseif (isset($data['sort_order'])) {
        $sortOrder = (int)$data['sort_order'];
    } else {
        $maxOrderStmt = $pdo->query('SELECT COALESCE(MAX(sort_order), 0) FROM `home_slides`');
        $sortOrder = (int)$maxOrderStmt->fetchColumn() + 1;
    }

    // Stats JSON
    $stats = $data['stats'] ?? null;
    $statsJson = null;
    if (is_array($stats)) {
        $statsJson = json_encode($stats, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } elseif (!empty($data['stats_json']) && is_string($data['stats_json'])) {
        $statsJson = $data['stats_json'];
    }

    $stmt = $pdo->prepare(
        'INSERT INTO `home_slides` 
         (`badge`, `title`, `highlight_text`, `subtitle`, `cta_primary_text`, `cta_primary_link`, 
          `cta_secondary_text`, `cta_secondary_link`, `image_url`, `image_alt`, `stats_json`, `sort_order`, `is_active`, `created_at`, `updated_at`)
         VALUES 
         (:badge, :title, :highlight, :subtitle, :cta1_text, :cta1_link,
          :cta2_text, :cta2_link, :image_url, :image_alt, :stats_json, :sort_order, :is_active, NOW(), NOW())'
    );

    $stmt->execute([
        ':badge'      => $badge ?: null,
        ':title'      => $title,
        ':highlight'  => $highlightText ?: null,
        ':subtitle'   => $subtitle ?: null,
        ':cta1_text'  => $ctaPrimaryText ?: null,
        ':cta1_link'  => $ctaPrimaryLink ?: null,
        ':cta2_text'  => $ctaSecondaryText ?: null,
        ':cta2_link'  => $ctaSecondaryLink ?: null,
        ':image_url'  => $imageUrl,
        ':image_alt'  => $imageAlt ?: null,
        ':stats_json' => $statsJson,
        ':sort_order' => $sortOrder,
        ':is_active'  => $isActive,
    ]);

    $newId = (int)$pdo->lastInsertId();

    logAdminActivity($pdo, (int)$admin['id'], 'create_slide', 'home_slides', $newId, "Slide criado: {$title} (ID {$newId})");

    $fetchStmt = $pdo->prepare('SELECT * FROM `home_slides` WHERE id = :id LIMIT 1');
    $fetchStmt->execute([':id' => $newId]);
    $created = $fetchStmt->fetch();

    sendJson(true, [
        'message' => 'Slide cadastrado com sucesso!',
        'slide'   => formatSlideRow($created),
    ], 201);
}

// ------------------------------------------------------------------------------
// 3. PUT — Atualizar slide ou reordenar (Admin)
// ------------------------------------------------------------------------------
if ($method === 'PUT') {
    $admin = requireAuth($pdo);
    $data = getJsonInput();

    // Reordenação em lote
    if (isset($_GET['action']) && $_GET['action'] === 'reorder') {
        $orderList = $data['orders'] ?? $data['slideIds'] ?? [];
        if (is_array($orderList)) {
            $stmt = $pdo->prepare('UPDATE `home_slides` SET sort_order = :ord WHERE id = :id');
            foreach ($orderList as $index => $id) {
                $slideId = is_array($id) ? (int)($id['id'] ?? 0) : (int)$id;
                $orderVal = is_array($id) ? (int)($id['sortOrder'] ?? $index) : $index;
                if ($slideId > 0) {
                    $stmt->execute([':ord' => $orderVal, ':id' => $slideId]);
                }
            }
            logAdminActivity($pdo, (int)$admin['id'], 'reorder_slides', 'home_slides', null, 'Reordenação de slides realizada');
            sendJson(true, ['message' => 'Ordem dos slides atualizada com sucesso!']);
        }
        sendJson(false, 'Formato de reordenação inválido.', 422);
    }

    $id = (int)($_GET['id'] ?? $data['id'] ?? 0);
    if ($id <= 0) {
        sendJson(false, 'ID do slide é obrigatório para atualização.', 422);
    }

    $fetchStmt = $pdo->prepare('SELECT * FROM `home_slides` WHERE id = :id LIMIT 1');
    $fetchStmt->execute([':id' => $id]);
    $current = $fetchStmt->fetch();

    if (!$current) {
        sendJson(false, 'Slide não encontrado.', 404);
    }

    // Suporte a alternância rápida de status
    if (isset($data['toggleActive'])) {
        $newActive = $current['is_active'] ? 0 : 1;
        $upd = $pdo->prepare('UPDATE `home_slides` SET is_active = :act, updated_at = NOW() WHERE id = :id');
        $upd->execute([':act' => $newActive, ':id' => $id]);
        sendJson(true, ['message' => 'Status do slide alterado com sucesso!', 'isActive' => (bool)$newActive]);
    }

    $badge            = isset($data['badge']) ? trim((string)$data['badge']) : $current['badge'];
    $title            = isset($data['title']) ? trim((string)$data['title']) : $current['title'];
    $highlightText    = isset($data['highlightText']) ? trim((string)$data['highlightText']) : (isset($data['highlight_text']) ? trim((string)$data['highlight_text']) : $current['highlight_text']);
    $subtitle         = isset($data['subtitle']) ? trim((string)$data['subtitle']) : $current['subtitle'];
    $ctaPrimaryText   = isset($data['ctaPrimaryText']) ? trim((string)$data['ctaPrimaryText']) : (isset($data['cta_primary_text']) ? trim((string)$data['cta_primary_text']) : $current['cta_primary_text']);
    $ctaPrimaryLink   = isset($data['ctaPrimaryLink']) ? trim((string)$data['ctaPrimaryLink']) : (isset($data['cta_primary_link']) ? trim((string)$data['cta_primary_link']) : $current['cta_primary_link']);
    $ctaSecondaryText = isset($data['ctaSecondaryText']) ? trim((string)$data['ctaSecondaryText']) : (isset($data['cta_secondary_text']) ? trim((string)$data['cta_secondary_text']) : $current['cta_secondary_text']);
    $ctaSecondaryLink = isset($data['ctaSecondaryLink']) ? trim((string)$data['ctaSecondaryLink']) : (isset($data['cta_secondary_link']) ? trim((string)$data['cta_secondary_link']) : $current['cta_secondary_link']);
    $imageUrl         = isset($data['imageUrl']) ? trim((string)$data['imageUrl']) : (isset($data['image_url']) ? trim((string)$data['image_url']) : $current['image_url']);
    $imageAlt         = isset($data['imageAlt']) ? trim((string)$data['imageAlt']) : (isset($data['image_alt']) ? trim((string)$data['image_alt']) : $current['image_alt']);
    
    $sortOrder = isset($data['sortOrder']) ? (int)$data['sortOrder'] : (isset($data['sort_order']) ? (int)$data['sort_order'] : (int)$current['sort_order']);
    $isActive  = isset($data['isActive']) ? ((bool)$data['isActive'] ? 1 : 0) : (isset($data['is_active']) ? ((bool)$data['is_active'] ? 1 : 0) : (int)$current['is_active']);

    $statsJson = $current['stats_json'];
    if (isset($data['stats']) && is_array($data['stats'])) {
        $statsJson = json_encode($data['stats'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } elseif (isset($data['stats_json']) && is_string($data['stats_json'])) {
        $statsJson = $data['stats_json'];
    }

    $updStmt = $pdo->prepare(
        'UPDATE `home_slides` 
         SET `badge` = :badge,
             `title` = :title,
             `highlight_text` = :highlight,
             `subtitle` = :subtitle,
             `cta_primary_text` = :cta1_text,
             `cta_primary_link` = :cta1_link,
             `cta_secondary_text` = :cta2_text,
             `cta_secondary_link` = :cta2_link,
             `image_url` = :image_url,
             `image_alt` = :image_alt,
             `stats_json` = :stats_json,
             `sort_order` = :sort_order,
             `is_active` = :is_active,
             `updated_at` = NOW()
         WHERE id = :id'
    );

    $updStmt->execute([
        ':badge'      => $badge ?: null,
        ':title'      => $title,
        ':highlight'  => $highlightText ?: null,
        ':subtitle'   => $subtitle ?: null,
        ':cta1_text'  => $ctaPrimaryText ?: null,
        ':cta1_link'  => $ctaPrimaryLink ?: null,
        ':cta2_text'  => $ctaSecondaryText ?: null,
        ':cta2_link'  => $ctaSecondaryLink ?: null,
        ':image_url'  => $imageUrl,
        ':image_alt'  => $imageAlt ?: null,
        ':stats_json' => $statsJson,
        ':sort_order' => $sortOrder,
        ':is_active'  => $isActive,
        ':id'         => $id,
    ]);

    logAdminActivity($pdo, (int)$admin['id'], 'update_slide', 'home_slides', $id, "Slide atualizado: {$title} (ID {$id})");

    $fetchStmt->execute([':id' => $id]);
    $updated = $fetchStmt->fetch();

    sendJson(true, [
        'message' => 'Slide atualizado com sucesso!',
        'slide'   => formatSlideRow($updated),
    ]);
}

// ------------------------------------------------------------------------------
// 4. DELETE — Excluir slide (Admin)
// ------------------------------------------------------------------------------
if ($method === 'DELETE') {
    $admin = requireAuth($pdo);
    $id = (int)($_GET['id'] ?? 0);

    if ($id <= 0) {
        $input = getJsonInput();
        $id = (int)($input['id'] ?? 0);
    }

    if ($id <= 0) {
        sendJson(false, 'ID do slide inválido.', 422);
    }

    $delStmt = $pdo->prepare('DELETE FROM `home_slides` WHERE id = :id');
    $delStmt->execute([':id' => $id]);

    logAdminActivity($pdo, (int)$admin['id'], 'delete_slide', 'home_slides', $id, "Slide excluído: ID {$id}");

    sendJson(true, ['message' => 'Slide excluído com sucesso!']);
}

sendJson(false, 'Método não suportado.', 405);
