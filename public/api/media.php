<?php
/**
 * ==============================================================================
 * Angel Consultancy & Network - API da Biblioteca de Mídia / Upload Seguro
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

$uploadDir = dirname(__DIR__) . '/uploads';

// Garantir que a pasta de uploads exista com proteção contra execução de scripts PHP
if (!is_dir($uploadDir)) {
    @mkdir($uploadDir, 0755, true);
}

$htaccessUpload = $uploadDir . '/.htaccess';
if (!file_exists($htaccessUpload)) {
    $htaccessContent = "# Bloquear execução de scripts neste diretório\n"
        . "<FilesMatch \"\.(php|phtml|phar|pl|py|cgi|asp|js|sh)$\">\n"
        . "    Require all denied\n"
        . "</FilesMatch>\n"
        . "Options -Indexes\n";
    @file_put_contents($htaccessUpload, $htaccessContent);
}

$method = $_SERVER['REQUEST_METHOD'];

// 1. GET (Listar imagens)
if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM media ORDER BY created_at DESC');
    $items = $stmt->fetchAll();
    sendJson(true, ['media' => $items]);
}

// 2. POST (Upload de imagem)
if ($method === 'POST') {
    if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        $errorCode = $_FILES['file']['error'] ?? 'desconhecido';
        sendJson(false, "Falha no recebimento do arquivo (código {$errorCode}).", 400);
    }

    $file = $_FILES['file'];
    $maxBytes = 8 * 1024 * 1024; // 8 MB

    if ($file['size'] > $maxBytes) {
        sendJson(false, 'O arquivo excede o limite máximo permitido de 8 MB.', 413);
    }

    // Validar extensão
    $originalName = basename($file['name']);
    $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

    $allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
    if (!in_array($ext, $allowedExts, true)) {
        sendJson(false, 'Formato de arquivo não suportado. Envie apenas JPG, PNG, WEBP, GIF ou SVG.', 422);
    }

    // Validar MIME type real
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    $allowedMimes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml',
    ];

    if (!in_array($mimeType, $allowedMimes, true)) {
        sendJson(false, 'Arquivo com tipo de conteúdo inválido ou corrompido.', 422);
    }

    // Gerar nome único e seguro
    $safeFilename = 'img_' . bin2hex(random_bytes(16)) . '.' . $ext;
    $targetPath = $uploadDir . '/' . $safeFilename;
    $publicPath = '/uploads/' . $safeFilename;

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        sendJson(false, 'Não foi possível salvar o arquivo no servidor.', 500);
    }

    $altText = trim((string)($_POST['alt_text'] ?? pathinfo($originalName, PATHINFO_FILENAME)));
    $title   = trim((string)($_POST['title'] ?? pathinfo($originalName, PATHINFO_FILENAME)));

    $stmt = $pdo->prepare(
        'INSERT INTO media (filename, original_name, path, mime_type, size, alt_text, title)
         VALUES (:fname, :orig, :path, :mime, :size, :alt, :title)'
    );
    $stmt->execute([
        ':fname' => $safeFilename,
        ':orig'  => $originalName,
        ':path'  => $publicPath,
        ':mime'  => $mimeType,
        ':size'  => (int)$file['size'],
        ':alt'   => $altText,
        ':title' => $title,
    ]);

    $mediaId = (int)$pdo->lastInsertId();
    logAdminActivity($pdo, (int)$admin['id'], 'upload_media', 'media', $mediaId, "Arquivo enviado: {$originalName}");

    sendJson(true, [
        'message' => 'Arquivo enviado com sucesso.',
        'media'   => [
            'id'            => $mediaId,
            'filename'      => $safeFilename,
            'original_name' => $originalName,
            'path'          => $publicPath,
            'mime_type'     => $mimeType,
            'size'          => (int)$file['size'],
            'alt_text'      => $altText,
            'title'         => $title,
        ],
    ], 201);
}

// 3. DELETE (Excluir mídia)
if ($method === 'DELETE') {
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) {
        sendJson(false, 'ID inválido.', 400);
    }

    $stmt = $pdo->prepare('SELECT filename FROM media WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $id]);
    $item = $stmt->fetch();

    if ($item) {
        $filePath = $uploadDir . '/' . $item['filename'];
        if (file_exists($filePath)) {
            @unlink($filePath);
        }
        $pdo->prepare('DELETE FROM media WHERE id = :id')->execute([':id' => $id]);
        logAdminActivity($pdo, (int)$admin['id'], 'delete_media', 'media', $id, "Mídia excluída: {$item['filename']}");
    }

    sendJson(true, ['message' => 'Arquivo excluído com sucesso.']);
}

sendJson(false, 'Método não suportado.', 405);
