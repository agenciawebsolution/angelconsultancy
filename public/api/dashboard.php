<?php
/**
 * ==============================================================================
 * Angel Consultancy & Network - API do Dashboard Administrativo
 * ==============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/common.php';

try {
    $pdo = getDbConnection();
    ensureCmsTablesExist($pdo);
    $admin = requireAuth($pdo);
} catch (Throwable $e) {
    sendJson(false, 'Falha ao acessar o banco de dados.', 500);
}

try {
    // 1. Métricas de Mensagens (tabela contact_requests real)
    $stmt = $pdo->query(
        'SELECT 
            COUNT(*) AS total_messages,
            SUM(CASE WHEN status = "unread" THEN 1 ELSE 0 END) AS unread_messages,
            SUM(CASE WHEN created_at >= DATE_FORMAT(NOW(), "%Y-%m-01") THEN 1 ELSE 0 END) AS this_month_messages
         FROM contact_requests'
    );
    $contactStats = $stmt->fetch() ?: [];

    // 2. Métricas do Blog
    $blogStmt = $pdo->query(
        'SELECT 
            SUM(CASE WHEN status = "published" THEN 1 ELSE 0 END) AS published_posts,
            SUM(CASE WHEN status = "draft" THEN 1 ELSE 0 END) AS draft_posts,
            COUNT(*) AS total_posts
         FROM blog_posts'
    );
    $blogStats = $blogStmt->fetch() ?: [];

    // 3. Páginas
    $pagesStmt = $pdo->query('SELECT COUNT(*) AS total_pages FROM pages');
    $pagesCount = (int)$pagesStmt->fetchColumn();

    // 4. Mensagens Recentes
    $recentMsgsStmt = $pdo->query(
        'SELECT id, full_name, email, phone, client_type, services, attendance_preference, status, created_at 
         FROM contact_requests 
         ORDER BY created_at DESC 
         LIMIT 6'
    );
    $recentMessages = $recentMsgsStmt->fetchAll();

    // 5. Artigos Recentes
    $recentPostsStmt = $pdo->query(
        'SELECT id, title, slug, status, published_at, created_at 
         FROM blog_posts 
         ORDER BY created_at DESC 
         LIMIT 5'
    );
    $recentPosts = $recentPostsStmt->fetchAll();

    sendJson(true, [
        'stats' => [
            'total_messages'      => (int)($contactStats['total_messages'] ?? 0),
            'unread_messages'     => (int)($contactStats['unread_messages'] ?? 0),
            'this_month_messages' => (int)($contactStats['this_month_messages'] ?? 0),
            'published_posts'     => (int)($blogStats['published_posts'] ?? 0),
            'draft_posts'         => (int)($blogStats['draft_posts'] ?? 0),
            'total_pages'         => $pagesCount,
        ],
        'recent_messages' => $recentMessages,
        'recent_posts'    => $recentPosts,
    ]);
} catch (Throwable $e) {
    error_log('[Dashboard API Error] ' . $e->getMessage());
    sendJson(false, 'Erro ao carregar estatísticas do dashboard.', 500);
}
