<?php
/**
 * ==============================================================================
 * Angel Consultancy & Network - Fábrica de Conexão PDO MariaDB
 * ==============================================================================
 *
 * Gerencia a conexão com o banco de dados MariaDB da one.com utilizando PDO.
 * Garante segurança, prepared statements nativos e tratamento seguro de exceções.
 */

// Impede acesso direto se invocado fora do contexto da API
defined('API_ACCESS') or define('API_ACCESS', true);

/**
 * Retorna a instância única (Singleton) de conexão PDO com MariaDB
 *
 * @throws RuntimeException em caso de falha de configuração ou conexão
 * @return PDO
 */
function getDbConnection(): PDO
{
    static $pdo = null;

    if ($pdo !== null) {
        return $pdo;
    }

    $configFile = __DIR__ . '/config.php';

    if (!file_exists($configFile)) {
        error_log('[Angel API Error] config.php não encontrado em ' . __DIR__ . '. Copie config.example.php para config.php com as credenciais do servidor.');
        throw new RuntimeException('Configuração do banco de dados não encontrada no servidor.');
    }

    $config = require $configFile;

    if (!is_array($config) || !isset($config['db']) || !is_array($config['db'])) {
        error_log('[Angel API Error] config.php possui formato inválido.');
        throw new RuntimeException('Formato de configuração do banco inválido.');
    }

    $db = $config['db'];

    $host    = $db['host'] ?? 'localhost';
    $port    = $db['port'] ?? 3306;
    $dbName  = $db['name'] ?? '';
    $charset = $db['charset'] ?? 'utf8mb4';
    $user    = $db['user'] ?? '';
    $pass    = $db['password'] ?? '';

    $dsn = "mysql:host={$host};port={$port};dbname={$dbName};charset={$charset}";

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$charset} COLLATE utf8mb4_unicode_ci",
    ];

    if (defined('PDO::MYSQL_ATTR_MULTI_STATEMENTS')) {
        $options[PDO::MYSQL_ATTR_MULTI_STATEMENTS] = true;
    }

    try {
        $pdo = new PDO($dsn, $user, $pass, $options);
        return $pdo;
    } catch (PDOException $e) {
        // Log seguro no servidor (sem exibir credenciais ou stack trace para o usuário final)
        error_log('[Angel API DB Error] Falha de conexão ao MariaDB: ' . $e->getMessage());
        throw new RuntimeException('Não foi possível conectar ao banco de dados neste momento.');
    }
}
