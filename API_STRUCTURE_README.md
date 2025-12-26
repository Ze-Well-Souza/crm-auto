# API Structure - Documentação Completa

## Visão Geral

Este documento descreve a estrutura completa da API REST implementada no CRM Auto, incluindo autenticação, rate limiting, error handling e response wrapper padrão.

## Arquitetura

```
supabase/functions/
├── _shared/
│   ├── api-cors.ts          # Middleware CORS
│   ├── api-auth.ts          # Autenticação com API Keys
│   ├── api-rate-limit.ts    # Rate limiting
│   ├── api-errors.ts        # Error handling
│   ├── api-response.ts      # Response wrapper
│   ├── api-validation.ts    # Validação de dados
│   └── api-logger.ts        # Logging de requisições
├── api-test/                # Endpoint de teste
│   └── index.ts
└── api-keys/                # Gerenciamento de API Keys
    └── index.ts
```

## Banco de Dados

### Tabelas Criadas

#### `crm_api_keys`
Armazena as API keys dos usuários com hash SHA-256 para segurança.

**Campos:**
- `id` (uuid): Identificador único
- `user_id` (uuid): Referência ao usuário
- `name` (text): Nome descritivo da chave
- `key_hash` (text): Hash SHA-256 da chave
- `key_preview` (text): Últimos 8 caracteres (para identificação)
- `permissions` (jsonb): Permissões granulares `{read: [], write: [], delete: []}`
- `rate_limit_per_minute` (integer): Limite por minuto (padrão: 60)
- `rate_limit_per_day` (integer): Limite por dia (padrão: 10000)
- `is_active` (boolean): Status ativo/inativo
- `last_used_at` (timestamptz): Último uso
- `expires_at` (timestamptz): Data de expiração
- `created_at` (timestamptz): Data de criação
- `updated_at` (timestamptz): Data de atualização

#### `crm_api_rate_limits`
Controla o rate limiting por janela de tempo.

**Campos:**
- `id` (uuid): Identificador único
- `api_key_id` (uuid): Referência à API key
- `endpoint` (text): Endpoint acessado
- `window_start` (timestamptz): Início da janela
- `window_type` (text): 'minute' ou 'day'
- `request_count` (integer): Contador de requests
- `created_at` (timestamptz): Data de criação

#### `crm_api_logs`
Registra todas as requisições à API para auditoria.

**Campos:**
- `id` (uuid): Identificador único
- `api_key_id` (uuid): Referência à API key
- `endpoint` (text): Endpoint acessado
- `method` (text): Método HTTP
- `status_code` (integer): Código de status
- `response_time_ms` (integer): Tempo de resposta
- `ip_address` (inet): Endereço IP
- `user_agent` (text): User agent
- `request_body` (jsonb): Corpo da requisição
- `response_body` (jsonb): Corpo da resposta
- `error_message` (text): Mensagem de erro
- `created_at` (timestamptz): Data de criação

## Autenticação

### Gerando uma API Key

**Endpoint:** `POST /api-keys`

**Headers:**
```
Authorization: Bearer {SUPABASE_JWT_TOKEN}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "My API Key",
  "permissions": {
    "read": ["*"],
    "write": ["clients", "vehicles"],
    "delete": []
  },
  "rate_limit_per_minute": 100,
  "rate_limit_per_day": 50000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My API Key",
    "key": "abc123...xyz789",
    "key_preview": "xyz789",
    "permissions": {...},
    "warning": "Save this key securely. It will not be shown again!"
  },
  "meta": {
    "timestamp": "2025-12-26T10:00:00Z"
  }
}
```

### Usando uma API Key

Existem duas formas de autenticar:

**1. Authorization Header (Recomendado):**
```
Authorization: Bearer {API_KEY}
```

**2. X-API-Key Header:**
```
X-API-Key: {API_KEY}
```

### Listando API Keys

**Endpoint:** `GET /api-keys`

**Headers:**
```
Authorization: Bearer {SUPABASE_JWT_TOKEN}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "My API Key",
      "key_preview": "xyz789",
      "permissions": {...},
      "rate_limit_per_minute": 100,
      "rate_limit_per_day": 50000,
      "is_active": true,
      "last_used_at": "2025-12-26T10:00:00Z",
      "created_at": "2025-12-20T10:00:00Z"
    }
  ]
}
```

### Atualizando uma API Key

**Endpoint:** `PATCH /api-keys/{id}`

**Headers:**
```
Authorization: Bearer {SUPABASE_JWT_TOKEN}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Updated Name",
  "is_active": false
}
```

### Deletando uma API Key

**Endpoint:** `DELETE /api-keys/{id}`

**Headers:**
```
Authorization: Bearer {SUPABASE_JWT_TOKEN}
```

## Rate Limiting

O sistema implementa rate limiting em duas janelas de tempo:

- **Por Minuto:** Limite configurável (padrão: 60 requests/min)
- **Por Dia:** Limite configurável (padrão: 10000 requests/dia)

### Headers de Rate Limit

Todas as respostas incluem headers informativos:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1703592060
```

### Erro de Rate Limit Excedido

**Status:** 429 Too Many Requests

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "details": {
      "resetAt": "2025-12-26T10:01:00Z"
    },
    "timestamp": "2025-12-26T10:00:30Z"
  }
}
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": {...},
  "meta": {
    "timestamp": "2025-12-26T10:00:00Z",
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": {...},
    "timestamp": "2025-12-26T10:00:00Z"
  }
}
```

## Error Codes

| Código | Status | Descrição |
|--------|--------|-----------|
| `UNAUTHORIZED` | 401 | Acesso não autorizado |
| `FORBIDDEN` | 403 | Acesso proibido |
| `NOT_FOUND` | 404 | Recurso não encontrado |
| `VALIDATION_ERROR` | 400 | Erro de validação |
| `RATE_LIMIT_EXCEEDED` | 429 | Rate limit excedido |
| `INTERNAL_ERROR` | 500 | Erro interno do servidor |
| `BAD_REQUEST` | 400 | Requisição inválida |
| `CONFLICT` | 409 | Conflito de recursos |
| `EXPIRED_KEY` | 401 | API key expirada |
| `INVALID_KEY` | 401 | API key inválida |

## Permissões

As permissões são granulares por recurso e ação:

```json
{
  "read": ["*"],           // Leitura em todos os recursos
  "write": ["clients"],    // Escrita apenas em clientes
  "delete": []             // Sem permissão de deleção
}
```

### Recursos Disponíveis

- `clients` - Clientes
- `vehicles` - Veículos
- `orders` - Ordens de serviço
- `appointments` - Agendamentos
- `parts` - Peças/Estoque
- `transactions` - Transações financeiras
- `invoices` - Faturas
- `webhooks` - Webhooks
- `test` - Endpoint de teste

### Wildcard

Use `"*"` para permitir acesso a todos os recursos:

```json
{
  "read": ["*"],
  "write": ["*"],
  "delete": ["*"]
}
```

## Logging

Todas as requisições à API são registradas automaticamente na tabela `crm_api_logs` com:

- Endpoint acessado
- Método HTTP
- Status code
- Tempo de resposta
- IP e User Agent
- Request/Response bodies (opcional)
- Mensagens de erro

### Consultando Logs

Os logs podem ser consultados via dashboard ou diretamente no banco:

```sql
SELECT * FROM crm_api_logs
WHERE api_key_id = 'uuid'
ORDER BY created_at DESC
LIMIT 100;
```

## Exemplo de Uso Completo

### 1. Autenticar no Supabase

```bash
curl -X POST https://simqszeoovjipujuxeus.supabase.co/auth/v1/token \
  -H "Content-Type: application/json" \
  -H "apikey: {SUPABASE_ANON_KEY}" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'
```

### 2. Criar API Key

```bash
curl -X POST https://simqszeoovjipujuxeus.supabase.co/functions/v1/api-keys \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production Key",
    "permissions": {
      "read": ["*"],
      "write": ["clients", "vehicles"],
      "delete": []
    }
  }'
```

### 3. Usar API Key

```bash
curl -X GET https://simqszeoovjipujuxeus.supabase.co/functions/v1/api-test \
  -H "Authorization: Bearer {API_KEY}"
```

## Testes

### Testar Autenticação

```bash
# Sem API key (deve retornar 401)
curl https://simqszeoovjipujuxeus.supabase.co/functions/v1/api-test

# Com API key inválida (deve retornar 401)
curl -H "Authorization: Bearer invalid_key" \
  https://simqszeoovjipujuxeus.supabase.co/functions/v1/api-test

# Com API key válida (deve retornar 200)
curl -H "Authorization: Bearer {API_KEY}" \
  https://simqszeoovjipujuxeus.supabase.co/functions/v1/api-test
```

### Testar Rate Limiting

```bash
# Fazer 100 requests em sequência
for i in {1..100}; do
  curl -H "Authorization: Bearer {API_KEY}" \
    https://simqszeoovjipujuxeus.supabase.co/functions/v1/api-test
done
```

### Testar CORS

```bash
curl -X OPTIONS \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  https://simqszeoovjipujuxeus.supabase.co/functions/v1/api-test
```

## Manutenção

### Limpar Logs Antigos

```sql
-- Limpar logs com mais de 90 dias
SELECT cleanup_old_api_logs(90);

-- Limpar rate limits com mais de 48 horas
SELECT cleanup_old_rate_limits(48);
```

### Monitorar Uso

```sql
-- Top 10 API keys por uso
SELECT
  ak.name,
  ak.key_preview,
  COUNT(*) as request_count,
  AVG(al.response_time_ms) as avg_response_time
FROM crm_api_logs al
JOIN crm_api_keys ak ON ak.id = al.api_key_id
WHERE al.created_at > NOW() - INTERVAL '24 hours'
GROUP BY ak.id, ak.name, ak.key_preview
ORDER BY request_count DESC
LIMIT 10;
```

### Revogar API Key Comprometida

```sql
-- Desativar key
UPDATE crm_api_keys
SET is_active = false
WHERE id = 'uuid';

-- Ou deletar permanentemente
DELETE FROM crm_api_keys
WHERE id = 'uuid';
```

## Próximos Passos

1. **Deploy das Edge Functions**
   ```bash
   # Deploy api-test
   supabase functions deploy api-test

   # Deploy api-keys
   supabase functions deploy api-keys
   ```

2. **Implementar Endpoints de Recursos**
   - `/api/v1/clients` - CRUD de clientes
   - `/api/v1/vehicles` - CRUD de veículos
   - `/api/v1/orders` - CRUD de ordens
   - E assim por diante...

3. **Criar Dashboard de Gerenciamento**
   - Interface para criar/editar API keys
   - Visualização de logs
   - Métricas de uso
   - Alertas de rate limit

4. **Documentação Swagger/OpenAPI**
   - Gerar spec OpenAPI 3.0
   - Publicar documentação interativa
   - Adicionar exemplos de código

5. **Testes Automatizados**
   - Unit tests para middlewares
   - Integration tests para endpoints
   - Load tests para rate limiting

## Segurança

- ✅ API keys são hasheadas com SHA-256
- ✅ Rate limiting implementado
- ✅ CORS configurado
- ✅ Validação de entrada de dados
- ✅ Logging de todas as requisições
- ✅ RLS habilitado em todas as tabelas
- ✅ Expiration de keys
- ✅ Permissões granulares

## Suporte

Para dúvidas ou problemas, consulte:
- Este documento
- Logs da aplicação
- Tabela `crm_api_logs`
