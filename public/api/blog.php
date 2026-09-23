<?php
/**
 * ==============================================================================
 * Angel Consultancy & Network - API do Blog (Público e Administrativo)
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
$action = $_GET['action'] ?? '';

// ==============================================================================
// GESTÃO DE CATEGORIAS
// ==============================================================================
if ($action === 'categories' || $action === 'category') {
    // 1. Listar Categorias (Público / Admin)
    if ($method === 'GET') {
        $stmt = $pdo->query(
            'SELECT c.*, COUNT(p.id) AS posts_count 
             FROM blog_categories c 
             LEFT JOIN blog_posts p ON p.category_id = c.id AND p.status = "published"
             GROUP BY c.id 
             ORDER BY c.name ASC'
        );
        sendJson(true, ['categories' => $stmt->fetchAll()]);
    }

    // 2. Criar Categoria (Admin)
    if ($method === 'POST') {
        $admin = requireAuth($pdo);
        $data = getJsonInput();
        $name = trim((string)($data['name'] ?? ''));
        $slug = trim((string)($data['slug'] ?? ''));
        $desc = trim((string)($data['description'] ?? ''));

        if (empty($name)) {
            sendJson(false, 'Nome da categoria é obrigatório.', 422);
        }
        if (empty($slug)) {
            $slug = preg_replace('/[^a-z0-9\-]/i', '', str_replace(' ', '-', strtolower($name)));
        }

        $stmt = $pdo->prepare('INSERT INTO blog_categories (name, slug, description) VALUES (:name, :slug, :desc)');
        $stmt->execute([':name' => $name, ':slug' => $slug, ':desc' => $desc]);

        $catId = (int)$pdo->lastInsertId();
        logAdminActivity($pdo, (int)$admin['id'], 'create_category', 'blog_categories', $catId, "Categoria criada: {$name}");

        sendJson(true, ['message' => 'Categoria criada com sucesso.', 'id' => $catId], 201);
    }

    // 3. Excluir Categoria (Admin)
    if ($method === 'DELETE') {
        $admin = requireAuth($pdo);
        $id = (int)($_GET['id'] ?? 0);
        if ($id <= 0) {
            sendJson(false, 'ID inválido.', 400);
        }

        $stmt = $pdo->prepare('DELETE FROM blog_categories WHERE id = :id');
        $stmt->execute([':id' => $id]);

        logAdminActivity($pdo, (int)$admin['id'], 'delete_category', 'blog_categories', $id, "Categoria excluída ID {$id}");

        sendJson(true, ['message' => 'Categoria excluída com sucesso.']);
    }
}

// ==============================================================================
// ARTIGOS DO BLOG
// ==============================================================================

// 1. GET (Listar ou buscar individual)
if ($method === 'GET') {
    $slug   = trim((string)($_GET['slug'] ?? ''));
    $id     = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    $isAdmin = !empty($_GET['admin']);

    if ($isAdmin) {
        requireAuth($pdo);
    }

    // A. Buscar por ID para edição no painel
    if ($id > 0) {
        $stmt = $pdo->prepare(
            'SELECT p.*, c.name AS category_name, c.slug AS category_slug 
             FROM blog_posts p 
             LEFT JOIN blog_categories c ON c.id = p.category_id 
             WHERE p.id = :id LIMIT 1'
        );
        $stmt->execute([':id' => $id]);
        $post = $stmt->fetch();
        if (!$post) {
            sendJson(false, 'Artigo não encontrado.', 404);
        }
        sendJson(true, ['post' => $post]);
    }

    // B. Buscar por Slug para página pública
    if (!empty($slug)) {
        $stmt = $pdo->prepare(
            'SELECT p.*, c.name AS category_name, c.slug AS category_slug 
             FROM blog_posts p 
             LEFT JOIN blog_categories c ON c.id = p.category_id 
             WHERE p.slug = :slug AND p.status = "published" 
             LIMIT 1'
        );
        $stmt->execute([':slug' => $slug]);
        $post = $stmt->fetch();

        if (!$post) {
            sendJson(false, 'Artigo não encontrado ou não está publicado.', 404);
        }

        // Incrementar visualizações de forma silenciosa
        $pdo->prepare('UPDATE blog_posts SET views_count = views_count + 1 WHERE id = :id')->execute([':id' => $post['id']]);

        // Buscar artigos relacionados (mesma categoria, excluindo o atual)
        $relStmt = $pdo->prepare(
            'SELECT id, title, slug, excerpt, featured_image, image_alt, published_at, author_name 
             FROM blog_posts 
             WHERE status = "published" AND id != :id AND category_id = :cat_id 
             ORDER BY published_at DESC LIMIT 3'
        );
        $relStmt->execute([':id' => $post['id'], ':cat_id' => $post['category_id']]);
        $related = $relStmt->fetchAll();

        sendJson(true, [
            'post'    => $post,
            'related' => $related,
        ]);
    }

    // C. Listagem de Artigos
    $page     = max(1, (int)($_GET['page'] ?? 1));
    $limit    = min(50, max(1, (int)($_GET['limit'] ?? ($isAdmin ? 20 : 9))));
    $offset   = ($page - 1) * $limit;
    $category = trim((string)($_GET['category'] ?? ''));
    $search   = trim((string)($_GET['search'] ?? ''));
    $status   = trim((string)($_GET['status'] ?? ''));

    $where = [];
    $params = [];

    if (!$isAdmin) {
        $where[] = 'p.status = "published"';
    } elseif (!empty($status) && $status !== 'all') {
        $where[] = 'p.status = :status';
        $params[':status'] = $status;
    }

    if (!empty($category) && $category !== 'all') {
        $where[] = 'c.slug = :cat_slug';
        $params[':cat_slug'] = $category;
    }

    if (!empty($search)) {
        $where[] = '(p.title LIKE :s OR p.excerpt LIKE :s OR p.content LIKE :s)';
        $params[':s'] = '%' . $search . '%';
    }

    $whereSql = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    $countSql = "SELECT COUNT(*) 
                 FROM blog_posts p 
                 LEFT JOIN blog_categories c ON c.id = p.category_id 
                 {$whereSql}";
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    $sql = "SELECT p.id, p.category_id, p.title, p.slug, p.excerpt, p.featured_image, p.image_alt, 
                   p.author_name, p.status, p.published_at, p.views_count, p.created_at,
                   c.name AS category_name, c.slug AS category_slug 
            FROM blog_posts p 
            LEFT JOIN blog_categories c ON c.id = p.category_id 
            {$whereSql} 
            ORDER BY " . ($isAdmin ? "p.created_at DESC" : "p.published_at DESC, p.created_at DESC") . " 
            LIMIT {$limit} OFFSET {$offset}";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $posts = $stmt->fetchAll();

    sendJson(true, [
        'posts'      => $posts,
        'total'      => $total,
        'page'       => $page,
        'limit'      => $limit,
        'totalPages' => (int)ceil($total / $limit),
    ]);
}

// 2. POST (Criar Artigo - Admin)
if ($method === 'POST') {
    $admin = requireAuth($pdo);
    $data = getJsonInput();

    $title   = trim((string)($data['title'] ?? ''));
    $slug    = trim((string)($data['slug'] ?? ''));
    $content = (string)($data['content'] ?? '');
    $status  = trim((string)($data['status'] ?? 'draft'));
    $status  = in_array($status, ['draft', 'published'], true) ? $status : 'draft';

    if (empty($title)) {
        sendJson(false, 'Título do artigo é obrigatório.', 422);
    }
    if (empty($slug)) {
        $slug = preg_replace('/[^a-z0-9\-]/i', '', str_replace(' ', '-', strtolower($title)));
    }

    $publishedAt = ($status === 'published')
        ? (!empty($data['published_at']) ? $data['published_at'] : date('Y-m-d H:i:s'))
        : null;

    $stmt = $pdo->prepare(
        'INSERT INTO blog_posts (
            category_id, title, slug, excerpt, content, featured_image, image_alt,
            author_name, status, published_at, meta_title, meta_description, focus_keyword,
            canonical_url, og_title, og_description, og_image, twitter_card
         ) VALUES (
            :cat_id, :title, :slug, :excerpt, :content, :img, :alt,
            :author, :status, :pub_at, :m_title, :m_desc, :keyword,
            :canonical, :og_title, :og_desc, :og_img, :tw_card
         )'
    );

    $stmt->execute([
        ':cat_id'    => !empty($data['category_id']) ? (int)$data['category_id'] : null,
        ':title'     => $title,
        ':slug'      => $slug,
        ':excerpt'   => $data['excerpt'] ?? null,
        ':content'   => $content,
        ':img'       => $data['featured_image'] ?? null,
        ':alt'       => $data['image_alt'] ?? null,
        ':author'    => !empty($data['author_name']) ? trim((string)$data['author_name']) : $admin['name'],
        ':status'    => $status,
        ':pub_at'    => $publishedAt,
        ':m_title'   => !empty($data['meta_title']) ? $data['meta_title'] : $title,
        ':m_desc'    => $data['meta_description'] ?? null,
        ':keyword'   => $data['focus_keyword'] ?? null,
        ':canonical' => $data['canonical_url'] ?? null,
        ':og_title'  => !empty($data['og_title']) ? $data['og_title'] : $title,
        ':og_desc'   => $data['og_description'] ?? null,
        ':og_img'    => $data['og_image'] ?? ($data['featured_image'] ?? null),
        ':tw_card'   => $data['twitter_card'] ?? 'summary_large_image',
    ]);

    $insertId = (int)$pdo->lastInsertId();
    logAdminActivity($pdo, (int)$admin['id'], 'create_post', 'blog_posts', $insertId, "Artigo criado: {$title}");

    sendJson(true, ['message' => 'Artigo criado com sucesso.', 'id' => $insertId, 'slug' => $slug], 201);
}

// 3. PUT (Atualizar Artigo - Admin)
if ($method === 'PUT') {
    $admin = requireAuth($pdo);
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) {
        sendJson(false, 'ID inválido.', 400);
    }

    $data = getJsonInput();
    $title   = trim((string)($data['title'] ?? ''));
    $slug    = trim((string)($data['slug'] ?? ''));
    $status  = trim((string)($data['status'] ?? 'draft'));
    $status  = in_array($status, ['draft', 'published'], true) ? $status : 'draft';

    if (empty($title) || empty($slug)) {
        sendJson(false, 'Título e slug são obrigatórios.', 422);
    }

    $publishedAt = ($status === 'published')
        ? (!empty($data['published_at']) ? $data['published_at'] : date('Y-m-d H:i:s'))
        : null;

    $stmt = $pdo->prepare(
        'UPDATE blog_posts SET
            category_id = :cat_id,
            title = :title,
            slug = :slug,
            excerpt = :excerpt,
            content = :content,
            featured_image = :img,
            image_alt = :alt,
            author_name = :author,
            status = :status,
            published_at = :pub_at,
            meta_title = :m_title,
            meta_description = :m_desc,
            focus_keyword = :keyword,
            canonical_url = :canonical,
            og_title = :og_title,
            og_description = :og_desc,
            og_image = :og_img,
            twitter_card = :tw_card
         WHERE id = :id'
    );

    $stmt->execute([
        ':cat_id'    => !empty($data['category_id']) ? (int)$data['category_id'] : null,
        ':title'     => $title,
        ':slug'      => $slug,
        ':excerpt'   => $data['excerpt'] ?? null,
        ':content'   => (string)($data['content'] ?? ''),
        ':img'       => $data['featured_image'] ?? null,
        ':alt'       => $data['image_alt'] ?? null,
        ':author'    => !empty($data['author_name']) ? trim((string)$data['author_name']) : $admin['name'],
        ':status'    => $status,
        ':pub_at'    => $publishedAt,
        ':m_title'   => !empty($data['meta_title']) ? $data['meta_title'] : $title,
        ':m_desc'    => $data['meta_description'] ?? null,
        ':keyword'   => $data['focus_keyword'] ?? null,
        ':canonical' => $data['canonical_url'] ?? null,
        ':og_title'  => !empty($data['og_title']) ? $data['og_title'] : $title,
        ':og_desc'   => $data['og_description'] ?? null,
        ':og_img'    => $data['og_image'] ?? ($data['featured_image'] ?? null),
        ':tw_card'   => $data['twitter_card'] ?? 'summary_large_image',
        ':id'        => $id,
    ]);

    logAdminActivity($pdo, (int)$admin['id'], 'update_post', 'blog_posts', $id, "Artigo atualizado: {$title}");

    sendJson(true, ['message' => 'Artigo atualizado com sucesso.']);
}

// 4. DELETE (Excluir Artigo - Admin)
if ($method === 'DELETE') {
    $admin = requireAuth($pdo);
    $id = (int)($_GET['id'] ?? 0);
    if ($id <= 0) {
        sendJson(false, 'ID inválido.', 400);
    }

    $stmt = $pdo->prepare('DELETE FROM blog_posts WHERE id = :id');
    $stmt->execute([':id' => $id]);

    logAdminActivity($pdo, (int)$admin['id'], 'delete_post', 'blog_posts', $id, "Artigo excluído ID {$id}");

    sendJson(true, ['message' => 'Artigo excluído com sucesso.']);
}

sendJson(false, 'Método não suportado.', 405);
