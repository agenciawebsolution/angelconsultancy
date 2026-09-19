<?php
/**
 * ==============================================================================
 * Angel Consultancy & Network - API Endpoint de Contato
 * ==============================================================================
 *
 * Endpoint RESTful para recepção e persistência de formulários de contato.
 *
 * Rota: POST /api/contact.php
 * Formato esperado: JSON
 * Respostas:
 *   - 201: Solicitação salva com sucesso
 *   - 400: Requisição malformada / JSON inválido
 *   - 405: Método HTTP não permitido (apenas POST aceito)
 *   - 413: Payload muito grande (> 50 KB)
 *   - 422: Erros de validação de dados
 *   - 500: Erro interno de conexão / banco
 */

declare(strict_types=1);

define('API_ACCESS', true);

// Definir cabeçalhos padrão de resposta
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Tratamento de CORS básico
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
    'https://angel-consultancy.be',
    'https://www.angel-consultancy.be',
    'http://localhost:5173',
    'http://localhost:4173',
];

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept');
    header('Access-Control-Max-Age: 86400');
}

// Tratamento de requisições preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// 1. Validar Método HTTP (Apenas POST é permitido)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode([
        'success' => false,
        'message' => 'Método HTTP não permitido. Utilize POST.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 2. Validar Tamanho do Payload (Máximo 50 KB)
$maxPayloadBytes = 51200;
$contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > $maxPayloadBytes) {
    http_response_code(413);
    echo json_encode([
        'success' => false,
        'message' => 'Tamanho da requisição excede o limite permitido de 50 KB.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 3. Ler o corpo bruto da requisição
$rawInput = file_get_contents('php://input');
if (empty($rawInput)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Corpo da requisição vazio.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if (strlen($rawInput) > $maxPayloadBytes) {
    http_response_code(413);
    echo json_encode([
        'success' => false,
        'message' => 'Tamanho da requisição excede o limite permitido de 50 KB.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 4. Decodificar JSON
$data = json_decode($rawInput, true);
if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Formato JSON inválido no corpo da requisição.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 5. Validações e Whitelists rígidas
$errors = [];

// Whitelists
$allowedProfileTypes = [
    'Pessoa física',
    'Profissional liberal / autônomo',
    'Associação / ONG',
    'Outro',
];

$allowedServices = [
    'Consultoria administrativa',
    'Organização de documentos',
    'Apoio contábil e tributário',
    'Associação / ONG',
    'Atividade profissional / autônomo',
    'Declaração de imposto',
    'Outro',
];

$allowedMeetingPreferences = [
    'Presencial',
    'Online',
    'Não tenho preferência',
];

// Campo: Nome Completo
$fullName = trim((string)($data['fullName'] ?? ''));
if ($fullName === '') {
    $errors['fullName'] = 'Por favor, informe seu nome completo.';
} elseif (mb_strlen($fullName, 'UTF-8') < 3) {
    $errors['fullName'] = 'O nome deve ter no mínimo 3 caracteres.';
} elseif (mb_strlen($fullName, 'UTF-8') > 150) {
    $errors['fullName'] = 'O nome não pode exceder 150 caracteres.';
}

// Campo: E-mail
$email = trim((string)($data['email'] ?? ''));
if ($email === '') {
    $errors['email'] = 'Por favor, informe seu e-mail.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Por favor, informe um endereço de e-mail válido.';
} elseif (mb_strlen($email, 'UTF-8') > 191) {
    $errors['email'] = 'O e-mail informado é muito longo.';
}

// Campo: Telefone / WhatsApp
$phone = trim((string)($data['phone'] ?? ''));
$digitsOnly = preg_replace('/\D/', '', $phone);
if ($phone === '') {
    $errors['phone'] = 'Por favor, informe seu telefone ou WhatsApp.';
} elseif (strlen($digitsOnly) < 7) {
    $errors['phone'] = 'Por favor, informe um número de telefone válido com código.';
} elseif (mb_strlen($phone, 'UTF-8') > 50) {
    $errors['phone'] = 'O número de telefone informado é muito longo.';
}

// Campo: Perfil (profileType)
$profileType = trim((string)($data['profileType'] ?? ''));
if ($profileType === '') {
    $errors['profileType'] = 'Selecione qual perfil melhor descreve você.';
} elseif (!in_array($profileType, $allowedProfileTypes, true)) {
    $errors['profileType'] = 'Perfil selecionado inválido.';
}

// Campo: Serviços (services)
$services = $data['services'] ?? [];
if (!is_array($services) || count($services) === 0) {
    $errors['services'] = 'Selecione pelo menos um assunto de interesse.';
} else {
    $invalidServices = array_diff($services, $allowedServices);
    if (!empty($invalidServices)) {
        $errors['services'] = 'Um ou mais assuntos selecionados são inválidos.';
    }
}

// Campo: Mensagem
$message = trim((string)($data['message'] ?? ''));
if ($message === '') {
    $errors['message'] = 'Por favor, escreva uma breve mensagem sobre o que você precisa.';
} elseif (mb_strlen($message, 'UTF-8') < 10) {
    $errors['message'] = 'Por favor, detalhe um pouco mais sua necessidade (mínimo 10 caracteres).';
} elseif (mb_strlen($message, 'UTF-8') > 5000) {
    $errors['message'] = 'A mensagem excede o limite máximo permitido de 5000 caracteres.';
}

// Campo: Preferência de Atendimento (meetingPreference)
$meetingPreference = trim((string)($data['meetingPreference'] ?? ''));
if ($meetingPreference === '') {
    $errors['meetingPreference'] = 'Selecione sua preferência de atendimento.';
} elseif (!in_array($meetingPreference, $allowedMeetingPreferences, true)) {
    $errors['meetingPreference'] = 'Preferência de atendimento selecionada inválida.';
}

// Campo: Consentimento
$consentAccepted = (bool)($data['consentAccepted'] ?? false);
if (!$consentAccepted) {
    $errors['consentAccepted'] = 'É necessário autorizar o uso dos dados para entrarmos em contato.';
}

// Se houver erros de validação, retornar HTTP 422
if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Por favor, revise os campos destacados no formulário.',
        'errors'  => $errors,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 6. Conexão e Inserção no MariaDB
try {
    require_once __DIR__ . '/db.php';

    $pdo = getDbConnection();

    $sql = 'INSERT INTO `contact_requests` (
        `full_name`,
        `email`,
        `phone`,
        `client_type`,
        `services`,
        `message`,
        `attendance_preference`,
        `consent`,
        `status`,
        `ip_address`,
        `user_agent`,
        `created_at`
    ) VALUES (
        :full_name,
        :email,
        :phone,
        :client_type,
        :services,
        :message,
        :attendance_preference,
        :consent,
        :status,
        :ip_address,
        :user_agent,
        NOW()
    )';

    $stmt = $pdo->prepare($sql);

    // Formatar dados para inserção segura
    $ipAddress = substr((string)($_SERVER['REMOTE_ADDR'] ?? ''), 0, 45);
    $userAgent = substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255);
    $servicesJson = json_encode(array_values($services), JSON_UNESCAPED_UNICODE);

    $stmt->execute([
        ':full_name'             => $fullName,
        ':email'                 => $email,
        ':phone'                 => $phone,
        ':client_type'           => $profileType,
        ':services'              => $servicesJson,
        ':message'               => $message,
        ':attendance_preference' => $meetingPreference,
        ':consent'               => 1,
        ':status'                => 'unread',
        ':ip_address'            => $ipAddress,
        ':user_agent'            => $userAgent,
    ]);

    $insertId = (int)$pdo->lastInsertId();

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Muito obrigado! Sua solicitação foi recebida com sucesso e entraremos em contato em breve.',
        'data'    => [
            'id' => $insertId,
        ],
    ], JSON_UNESCAPED_UNICODE);
    exit;

} catch (RuntimeException $e) {
    // Erros de configuração (ex: config.php ausente ou DB indisponível)
    error_log('[Angel API RuntimeException] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Ocorreu uma indisponibilidade temporária no servidor. Por favor, tente novamente mais tarde ou fale conosco pelo WhatsApp (+32 492 319 741) ou e-mail (info@angel-consultancy.be).',
    ], JSON_UNESCAPED_UNICODE);
    exit;
} catch (Exception $e) {
    // Outros erros inesperados
    error_log('[Angel API Unexpected Exception] ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Não foi possível registrar seu contato no momento. Por favor, tente novamente mais tarde ou fale conosco diretamente.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
