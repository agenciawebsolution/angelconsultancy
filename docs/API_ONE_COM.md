# Guia de Implantação e Contrato da API (Servidor one.com)

Este documento descreve a arquitetura, estrutura de banco de dados MariaDB, segurança e contrato da API REST PHP desenvolvida para o projeto **Angel Consultancy and Network** no ambiente de hospedagem compartilhada Apache/PHP da **one.com**.

---

## 1. Visão Geral da Arquitetura

```
[ Navegador Web / Cliente ]
           │
           │ HTTPS (POST /api/contact.php)
           ▼
[ Servidor Web Apache (one.com) ]
  ├── dist/ (Frontend SPA compilado com React + Vite + Tailwind CSS)
  ├── .htaccess (Roteamento SPA, HTTPS forçado, cabeçalhos de segurança, cache)
  └── api/
      ├── .htaccess (Protege arquivos internos, bloqueia config.php e db.php)
      ├── contact.php (Endpoint REST público para recebimento de mensagens)
      ├── db.php (Conexão segura via PDO Singleton com prepared statements)
      └── config.php (Credenciais do MariaDB no servidor — NÃO versionado)
           │
           │ PDO MySQL / MariaDB (Prepared Statements)
           ▼
[ Banco de Dados MariaDB (one.com) ]
  └── Tabela: contact_requests
```

### Principais Diretrizes
- **Hospedagem própria:** 100% autônoma no servidor da one.com, sem dependência de Vercel, Supabase ou Node.js em produção.
- **Segurança de credenciais:** O arquivo `config.php` fica isolado no servidor e é protegido contra acesso HTTP via `.htaccess` e excluído de commits via `.gitignore`.
- **Integridade dos dados:** Proteção contra SQL Injection (PDO com `ATTR_EMULATE_PREPARES => false`), validação server-side rígida com whitelists e sanitização de dados.

---

## 2. Estrutura de Arquivos da API

```
public/api/ (durante desenvolvimento e copiado para dist/api/ no build)
├── .htaccess             # Regras de segurança Apache (bloqueia config.php, db.php, schema.sql)
├── contact.php           # Endpoint REST de processamento do formulário
├── db.php                # Conexão PDO com MariaDB
├── config.example.php    # Modelo de configuração (versionado)
└── database/
    └── schema.sql        # Script de criação da tabela no MariaDB
```

---

## 3. Passo a Passo de Configuração no Painel da one.com

### Passo 1: Criar / Acessar o Banco de Dados MariaDB
1. Faça login no Painel de Controle da [one.com](https://one.com).
2. No menu de navegação, selecione **PHP e MariaDB**.
3. Localize as credenciais do seu banco de dados:
   - **Host do Banco:** Normalmente especificado no painel (ex: `angel-consultancy.be.mysql` ou `localhost`).
   - **Nome do Banco:** (ex: `angel_consultancy_be`).
   - **Nome de Usuário:** (ex: `angel_consultancy_be`).
   - **Senha:** A senha definida para o banco de dados.

### Passo 2: Importar a Tabela no phpMyAdmin
1. Ainda na seção **PHP e MariaDB** do painel da one.com, clique no link para abrir o **phpMyAdmin**.
2. Faça login com o usuário e senha do MariaDB.
3. No menu superior, clique na aba **Importar** (ou **SQL**).
4. Abra o arquivo `schema.sql` (localizado em `public/api/database/schema.sql`) e execute o comando:

```sql
CREATE TABLE IF NOT EXISTS `contact_requests` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL COMMENT 'Nome completo do solicitante',
  `email` VARCHAR(191) NOT NULL COMMENT 'E-mail de contato',
  `phone` VARCHAR(50) NOT NULL COMMENT 'Telefone / WhatsApp com código',
  `client_type` VARCHAR(100) NOT NULL COMMENT 'Pessoa física, Profissional liberal, Associação / ONG, Outro',
  `services` LONGTEXT NOT NULL COMMENT 'Array JSON com os serviços de interesse selecionados',
  `message` TEXT NOT NULL COMMENT 'Mensagem ou detalhamento da necessidade',
  `attendance_preference` VARCHAR(50) NOT NULL COMMENT 'Presencial, Online, Não tenho preferência',
  `consent` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Consentimento LGPD/GDPR para contato',
  `status` VARCHAR(30) NOT NULL DEFAULT 'unread' COMMENT 'unread, contacted, in_progress, archived',
  `ip_address` VARCHAR(45) DEFAULT NULL COMMENT 'Endereço IP do solicitante (IPv4 ou IPv6)',
  `user_agent` VARCHAR(255) DEFAULT NULL COMMENT 'Navegador/dispositivo de origem',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data e hora da solicitação',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Última atualização de status',
  INDEX `idx_email` (`email`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Registro de solicitações de contato recebidas pelo website';
```

### Passo 3: Configurar o `config.php` no Servidor
1. No servidor da one.com (via SFTP ou Gerenciador de Arquivos do Painel), navegue até o diretório da API (ex: `httpd.www/api/`).
2. Copie ou renomeie `config.example.php` para `config.php`.
3. Edite o arquivo inserindo os dados obtidos no Passo 1:

```php
<?php
defined('API_ACCESS') or define('API_ACCESS', true);

return [
    'db' => [
        'host'     => 'localhost', // ou o hostname informado pelo painel one.com
        'port'     => 3306,
        'name'     => 'nome_do_banco_na_one_com',
        'user'     => 'usuario_do_banco',
        'password' => 'senha_do_banco',
        'charset'  => 'utf8mb4',
    ],
    'app' => [
        'environment'      => 'production',
        'max_payload_size' => 51200, // 50 KB
        'allowed_origins'  => [
            'https://angel-consultancy.be',
            'https://www.angel-consultancy.be',
        ],
    ],
];
```

---

## 4. Contrato da API

### `POST /api/contact.php`

Recebe a submissão de um novo contato pelo formulário do website e persiste no banco MariaDB.

#### Cabeçalhos da Requisição
| Cabeçalho | Valor | Obrigatório |
|---|---|---|
| `Content-Type` | `application/json` | Sim |
| `Accept` | `application/json` | Sim |

#### Corpo da Requisição (JSON Payload)
```json
{
  "fullName": "Maria Silva",
  "email": "maria.silva@exemplo.com",
  "phone": "+32 492 000 000",
  "profileType": "Profissional liberal / autônomo",
  "services": [
    "Consultoria administrativa",
    "Organização de documentos"
  ],
  "message": "Gostaria de agendar uma consulta inicial para regularizar meus documentos de atividade profissional na Bélgica.",
  "meetingPreference": "Online",
  "consentAccepted": true
}
```

#### Valores Permitidos (Whitelists Rígidas)
- **`profileType`**:
  - `Pessoa física`
  - `Profissional liberal / autônomo`
  - `Associação / ONG`
  - `Outro`
- **`services`** (Array com pelo menos 1 item):
  - `Consultoria administrativa`
  - `Organização de documentos`
  - `Apoio contábil e tributário`
  - `Associação / ONG`
  - `Atividade profissional / autônomo`
  - `Declaração de imposto`
  - `Outro`
- **`meetingPreference`**:
  - `Presencial`
  - `Online`
  - `Não tenho preferência`
- **`consentAccepted`**:
  - `true` (obrigatório)

---

### Respostas da API

#### 1. Sucesso (`201 Created`)
```json
{
  "success": true,
  "message": "Muito obrigado! Sua solicitação foi recebida com sucesso e entraremos em contato em breve.",
  "data": {
    "id": 14
  }
}
```

#### 2. Erros de Validação (`422 Unprocessable Content`)
```json
{
  "success": false,
  "message": "Por favor, revise os campos destacados no formulário.",
  "errors": {
    "fullName": "O nome deve ter no mínimo 3 caracteres.",
    "email": "Por favor, informe um endereço de e-mail válido.",
    "phone": "Por favor, informe um número de telefone válido com código.",
    "profileType": "Selecione qual perfil melhor descreve você.",
    "services": "Selecione pelo menos um assunto de interesse.",
    "message": "Por favor, detalhe um pouco mais sua necessidade (mínimo 10 caracteres).",
    "meetingPreference": "Selecione sua preferência de atendimento.",
    "consentAccepted": "É necessário autorizar o uso dos dados para entrarmos em contato."
  }
}
```

#### 3. Método Não Permitido (`405 Method Not Allowed`)
```json
{
  "success": false,
  "message": "Método HTTP não permitido. Utilize POST."
}
```

#### 4. Payload Excedido (`413 Payload Too Large`)
```json
{
  "success": false,
  "message": "Tamanho da requisição excede o limite permitido de 50 KB."
}
```

#### 5. Erro Interno do Servidor (`500 Internal Server Error`)
```json
{
  "success": false,
  "message": "Ocorreu uma indisponibilidade temporária no servidor. Por favor, tente novamente mais tarde ou fale conosco pelo WhatsApp (+32 492 319 741) ou e-mail (info@angel-consultancy.be)."
}
```

---

## 5. Medidas de Segurança Implementadas

1. **Proteção contra SQL Injection:**
   - O arquivo `db.php` desativa a emulação de prepared statements (`ATTR_EMULATE_PREPARES => false`).
   - Todas as variáveis passam exclusivamente por bind parameters (`:full_name`, `:email`, etc.).
2. **Proteção de Arquivos Sensíveis:**
   - O arquivo `public/api/.htaccess` bloqueia requisições HTTP a `config.php`, `config.example.php`, `db.php`, scripts `.sql` e diretório `database/`.
   - Listagem de diretórios desativada (`Options -Indexes`).
3. **Não Exposição de Erros / Credenciais:**
   - Em caso de falha de conexão com o banco, o erro detalhado é gravado via `error_log()` no servidor e uma mensagem amigável é retornada ao cliente, sem expor strings de conexão, hosts ou senhas.
4. **Validação e Sanitização Rígida:**
   - Limite de 50 KB no corpo da requisição para prevenção de DoS por saturação de memória.
   - Whitelists estritas para campos de enumeração e múltipla escolha.
   - Armazenamento de IP do cliente (compatível com IPv4 e IPv6 até 45 caracteres) e User-Agent truncado com segurança.
5. **CORS Seguro:**
   - Cabeçalhos de CORS restritos aos domínios oficiais da Angel Consultancy.

---

## 6. Publicação do Build no Servidor one.com

Quando chegar o momento da publicação (em etapa futura autorizada):
1. Execute localmente:
   ```bash
   npm run build
   ```
2. A pasta `dist/` conterá:
   - `index.html` (SPA)
   - `assets/` (JS e CSS minificados)
   - `.htaccess` (Roteamento SPA da raiz)
   - `api/` (Endpoints PHP, `.htaccess` de segurança e arquivos auxiliares)
3. Envie os arquivos contidos em `dist/` para o diretório raiz web da one.com (geralmente `httpd.www/`).
4. Crie o arquivo `api/config.php` diretamente no servidor com as credenciais reais do MariaDB.
