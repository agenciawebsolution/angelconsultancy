<?php
/**
 * ==============================================================================
 * Angel Consultancy & Network - Configuração de Conexão com MariaDB (one.com)
 * ==============================================================================
 *
 * INSTRUÇÕES PARA PRODUÇÃO NO SERVIDOR ONE.COM:
 * 1. No Painel de Controle da one.com, acesse "PHP & MariaDB" para obter:
 *    - Host do banco de dados (ex: angel-consultancy.be.mysql ou localhost)
 *    - Nome do banco de dados (ex: angel_consultancy_be)
 *    - Nome de usuário do banco
 *    - Senha do banco de dados
 * 2. Copie este arquivo para 'config.php' no mesmo diretório (public/api/config.php ou na raiz do servidor em /api/config.php).
 * 3. Preencha as credenciais abaixo com os dados reais do seu banco.
 * 4. NUNCA envie o arquivo 'config.php' para o GitHub ou controle de versão!
 *    O arquivo 'config.php' já está protegido no .gitignore e bloqueado no .htaccess.
 */

defined('API_ACCESS') or define('API_ACCESS', true);

return [
    // Configurações do Banco de Dados MariaDB / MySQL na one.com
    'db' => [
        'host'     => 'localhost', // Na one.com, pode ser 'localhost' ou o hostname especificado no painel
        'port'     => 3306,
        'name'     => 'angel_consultancy_db',
        'user'     => 'seu_usuario_mariadb',
        'password' => 'sua_senha_segura_mariadb',
        'charset'  => 'utf8mb4',
    ],

    // Configurações da Aplicação
    'app' => [
        'environment'      => 'production', // 'production' ou 'development'
        'max_payload_size' => 51200,        // 50 KB máximo para o payload JSON
        'allowed_origins'  => [
            'https://angel-consultancy.be',
            'https://www.angel-consultancy.be',
            'http://localhost:5173',
            'http://localhost:4173',
        ],
    ],
];
