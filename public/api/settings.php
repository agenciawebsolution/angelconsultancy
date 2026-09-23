<?php
/**
 * ==============================================================================
 * Angel Consultancy & Network - API de Configurações Globais / SEO / Scripts
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

// 1. GET (Leitura pública ou administrativa)
if ($method === 'GET') {
    $isPublic = !empty($_GET['public']);

    $stmt = $pdo->query('SELECT setting_key, setting_value, setting_type FROM site_settings');
    $rows = $stmt->fetchAll();

    $settings = [];
    foreach ($rows as $row) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }

    if ($isPublic) {
        // Chaves permitidas para consumo público seguro
        $allowedPublicKeys = [
            'company_name',
            'company_description',
            'company_phone',
            'company_email',
            'company_whatsapp_url',
            'company_location',
            'company_social_linkedin',
            'company_social_instagram',
            'company_social_facebook',
            'seo_site_title',
            'seo_meta_description',
            'seo_default_og_image',
            'seo_canonical_url',
            'seo_robots',
            'google_search_console_token',
            'google_analytics_id',
            'custom_scripts_head',
            'custom_scripts_body',
            'custom_scripts_footer',
        ];

        $publicSettings = [];
        foreach ($allowedPublicKeys as $key) {
            $publicSettings[$key] = $settings[$key] ?? '';
        }

        sendJson(true, ['settings' => $publicSettings]);
    }

    // Administrativo
    requireAuth($pdo);
    sendJson(true, ['settings' => $settings]);
}

// 2. POST / PUT (Salvar em lote - Admin)
if ($method === 'POST' || $method === 'PUT') {
    $admin = requireAuth($pdo);
    $data = getJsonInput();

    if (empty($data) || !is_array($data)) {
        sendJson(false, 'Nenhum dado enviado.', 422);
    }

    $stmt = $pdo->prepare(
        'INSERT INTO site_settings (setting_key, setting_value, updated_at) 
         VALUES (:key, :val, NOW())
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_at = NOW()'
    );

    foreach ($data as $key => $value) {
        $cleanKey = trim((string)$key);
        if ($cleanKey === '') continue;

        $stmt->execute([
            ':key' => $cleanKey,
            ':val' => is_scalar($value) || $value === null ? (string)$value : json_encode($value),
        ]);
    }

    logAdminActivity($pdo, (int)$admin['id'], 'update_settings', 'site_settings', null, 'Configurações globais atualizadas');

    sendJson(true, ['message' => 'Configurações salvas com sucesso.']);
}

sendJson(false, 'Método não suportado.', 405);
