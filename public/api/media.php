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
    sendJson(false, 'Falha de autenticação ou banco de dados: ' . $e->getMessage(), 500);
}

// Diretório físico de uploads
$uploadDir = dirname(__DIR__) . '/uploads';

// Garantir que a pasta de uploads exista com permissões adequadas
if (!is_dir($uploadDir)) {
    if (!@mkdir($uploadDir, 0775, true) && !is_dir($uploadDir)) {
        @mkdir($uploadDir, 0777, true);
    }
}

if (is_dir($uploadDir) && !is_writable($uploadDir)) {
    @chmod($uploadDir, 0775);
    if (!is_writable($uploadDir)) {
        @chmod($uploadDir, 0777);
    }
}

// Proteção do diretório de uploads contra execução direta de scripts
$htaccessUpload = $uploadDir . '/.htaccess';
if (!file_exists($htaccessUpload) && is_writable($uploadDir)) {
    $htaccessContent = "# Bloquear execução de scripts neste diretório\n"
        . "<FilesMatch \"\.(php|phtml|phar|pl|py|cgi|asp|js|sh)$\">\n"
        . "    Require all denied\n"
        . "</FilesMatch>\n"
        . "Options -Indexes\n";
    @file_put_contents($htaccessUpload, $htaccessContent);
}

$method = $_SERVER['REQUEST_METHOD'];

// 1. GET (Listar imagens da biblioteca)
if ($method === 'GET') {
    try {
        ensureTableCreated($pdo, 'media', getCmsTableDefinitions()['media']);
        $stmt = $pdo->query('SELECT * FROM `media` ORDER BY created_at DESC');
        $items = $stmt->fetchAll();
        sendJson(true, ['media' => $items]);
    } catch (Throwable $e) {
        sendJson(false, 'Erro ao carregar mídias: ' . $e->getMessage(), 500);
    }
}

// 2. POST (Upload seguro de imagem)
if ($method === 'POST') {
    try {
        if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            $errorCode = $_FILES['file']['error'] ?? 'ausente';
            $errorMap = [
                UPLOAD_ERR_INI_SIZE   => 'O arquivo excede o limite upload_max_filesize do servidor.',
                UPLOAD_ERR_FORM_SIZE  => 'O arquivo excede o limite definido no formulário.',
                UPLOAD_ERR_PARTIAL    => 'O upload do arquivo foi feito apenas parcialmente.',
                UPLOAD_ERR_NO_FILE    => 'Nenhum arquivo de imagem foi enviado.',
                UPLOAD_ERR_NO_TMP_DIR => 'Pasta temporária do servidor ausente.',
                UPLOAD_ERR_CANT_WRITE => 'Falha ao escrever o arquivo temporário no disco do servidor.',
                UPLOAD_ERR_EXTENSION  => 'Uma extensão do PHP interrompeu o upload do arquivo.',
            ];
            $friendlyMsg = $errorMap[$errorCode] ?? "Falha no recebimento do arquivo (código {$errorCode}).";
            sendJson(false, $friendlyMsg, 400);
        }

        $file = $_FILES['file'];
        $maxBytes = 12 * 1024 * 1024; // 12 MB

        if ($file['size'] > $maxBytes) {
            sendJson(false, 'O arquivo excede o limite máximo permitido de 12 MB.', 413);
        }

        // 1. Validar extensão
        $originalName = basename($file['name']);
        $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

        $allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
        if (!in_array($ext, $allowedExts, true)) {
            sendJson(false, 'Formato de arquivo não suportado. Envie apenas JPG, PNG, WEBP, GIF ou SVG.', 422);
        }

        // 2. Detecção e validação de MIME type multi-camada à prova de falhas
        $mimeType = null;

        // Camada A: fileinfo seguro
        if (function_exists('finfo_open')) {
            $finfo = @finfo_open(FILEINFO_MIME_TYPE);
            if ($finfo !== false) {
                $detected = @finfo_file($finfo, $file['tmp_name']);
                if (is_string($detected) && !empty($detected)) {
                    $mimeType = $detected;
                }
                @finfo_close($finfo);
            }
        }

        // Camada B: mime_content_type
        if (!$mimeType && function_exists('mime_content_type')) {
            $detected = @mime_content_type($file['tmp_name']);
            if (is_string($detected) && !empty($detected)) {
                $mimeType = $detected;
            }
        }

        // Camada C: getimagesize
        if (!$mimeType && function_exists('getimagesize')) {
            $imgInfo = @getimagesize($file['tmp_name']);
            if (!empty($imgInfo['mime'])) {
                $mimeType = $imgInfo['mime'];
            }
        }

        // Camada D: Mapeamento de extensão confiável
        $extensionMimes = [
            'jpg'  => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'png'  => 'image/png',
            'webp' => 'image/webp',
            'gif'  => 'image/gif',
            'svg'  => 'image/svg+xml',
        ];

        if (!$mimeType && isset($extensionMimes[$ext])) {
            $mimeType = $extensionMimes[$ext];
        }

        $allowedMimes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif',
            'image/svg+xml',
            'image/svg',
        ];

        if ($mimeType && !in_array($mimeType, $allowedMimes, true)) {
            sendJson(false, "Tipo de arquivo não permitido ({$mimeType}). Envie apenas imagens válidas.", 422);
        }

        // 3. Gerar nome de arquivo único e seguro
        $safeFilename = 'img_' . bin2hex(random_bytes(16)) . '.' . $ext;
        $targetPath = $uploadDir . '/' . $safeFilename;
        $publicPath = '/uploads/' . $safeFilename;

        // 4. Mover arquivo para o diretório final
        $moved = @move_uploaded_file($file['tmp_name'], $targetPath);
        if (!$moved) {
            $moved = @copy($file['tmp_name'], $targetPath);
        }

        if (!$moved) {
            $isDirWritable = is_writable($uploadDir) ? 'sim' : 'não';
            sendJson(false, "Não foi possível salvar o arquivo no servidor. (Destino: {$uploadDir} | Gravável: {$isDirWritable})", 500);
        }

        @chmod($targetPath, 0664);

        $altText = trim((string)($_POST['alt_text'] ?? pathinfo($originalName, PATHINFO_FILENAME)));
        $title   = trim((string)($_POST['title'] ?? pathinfo($originalName, PATHINFO_FILENAME)));

        // 5. Garantir tabela media e registrar no banco
        ensureTableCreated($pdo, 'media', getCmsTableDefinitions()['media']);

        $stmt = $pdo->prepare(
            'INSERT INTO `media` (`filename`, `original_name`, `path`, `mime_type`, `size`, `alt_text`, `title`)
             VALUES (:fname, :orig, :path, :mime, :size, :alt, :title)'
        );
        $stmt->execute([
            ':fname' => $safeFilename,
            ':orig'  => substr($originalName, 0, 255),
            ':path'  => $publicPath,
            ':mime'  => $mimeType ?: 'image/jpeg',
            ':size'  => (int)$file['size'],
            ':alt'   => substr($altText, 0, 255),
            ':title' => substr($title, 0, 255),
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
    } catch (Throwable $e) {
        error_log('[Media Upload Error] ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
        sendJson(false, 'Erro no processamento do upload: ' . $e->getMessage(), 500);
    }
}

// 3. DELETE (Excluir mídia)
if ($method === 'DELETE') {
    try {
        $id = (int)($_GET['id'] ?? 0);
        if ($id <= 0) {
            sendJson(false, 'ID inválido.', 400);
        }

        $stmt = $pdo->prepare('SELECT filename FROM `media` WHERE id = :id LIMIT 1');
        $stmt->execute([':id' => $id]);
        $item = $stmt->fetch();

        if ($item) {
            $filePath = $uploadDir . '/' . $item['filename'];
            if (file_exists($filePath)) {
                @unlink($filePath);
            }
            $pdo->prepare('DELETE FROM `media` WHERE id = :id')->execute([':id' => $id]);
            logAdminActivity($pdo, (int)$admin['id'], 'delete_media', 'media', $id, "Mídia excluída: {$item['filename']}");
        }

        sendJson(true, ['message' => 'Arquivo excluído com sucesso.']);
    } catch (Throwable $e) {
        sendJson(false, 'Erro ao excluir mídia: ' . $e->getMessage(), 500);
    }
}

sendJson(false, 'Método não suportado.', 405);
