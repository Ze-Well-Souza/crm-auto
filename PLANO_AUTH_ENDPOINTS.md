# Plano de Implementação - Endpoints de Autenticação

## Tarefa 1.2 - Endpoints de Autenticação

**Status:** 📋 PLANEJAMENTO
**Prioridade:** ALTA
**Tempo Estimado:** 3-4 dias
**Data:** 26/12/2025

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura de Segurança](#arquitetura-de-segurança)
3. [Endpoints a Implementar](#endpoints-a-implementar)
4. [Fluxo de Autenticação](#fluxo-de-autenticação)
5. [Estrutura de Implementação](#estrutura-de-implementação)
6. [Segurança](#segurança)
7. [Validações](#validações)
8. [Testes](#testes)
9. [Checklist de Implementação](#checklist-de-implementação)

---

## Visão Geral

### Objetivo

Criar endpoints REST seguros que permitam aplicações terceiras autenticarem usuários no sistema CRM Auto usando Supabase Auth como backend.

### Escopo

- ✅ Integração completa com Supabase Auth
- ✅ Suporte a JWT tokens (access_token + refresh_token)
- ✅ Validação robusta de entrada
- ✅ Rate limiting específico para auth
- ✅ Logging de tentativas de autenticação
- ✅ Proteção contra ataques (brute force, credential stuffing)
- ✅ Geração de API Keys após autenticação

### Endpoints a Criar

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/api/v1/auth/login` | Login com email/senha | Não |
| POST | `/api/v1/auth/register` | Criar nova conta | Não |
| POST | `/api/v1/auth/refresh` | Renovar access token | refresh_token |
| POST | `/api/v1/auth/logout` | Invalidar sessão | access_token |
| GET | `/api/v1/auth/me` | Dados do usuário atual | access_token |
| POST | `/api/v1/auth/api-keys` | Gerar API Key | access_token |
| POST | `/api/v1/auth/forgot-password` | Solicitar reset de senha | Não |
| POST | `/api/v1/auth/reset-password` | Resetar senha | reset_token |
| POST | `/api/v1/auth/verify-email` | Verificar email | verification_token |

---

## Arquitetura de Segurança

### 1. Camadas de Proteção

```
┌─────────────────────────────────────────┐
│   Cliente (App Terceira)                │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│   CORS + Rate Limiting (Camada 1)       │
│   - Max 10 tentativas/min por IP        │
│   - Max 100 requisições/hora            │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│   Validação de Entrada (Camada 2)       │
│   - Email válido                         │
│   - Senha forte (8+ chars)              │
│   - Sanitização de dados                │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│   Supabase Auth (Camada 3)              │
│   - Verificação de credenciais          │
│   - Geração de JWT tokens               │
│   - Gerenciamento de sessões            │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│   Logging & Auditoria (Camada 4)        │
│   - Log de tentativas                    │
│   - Detecção de anomalias               │
│   - Alertas de segurança                │
└─────────────────────────────────────────┘
```

### 2. Rate Limiting Específico para Auth

**Limites mais restritivos para endpoints de autenticação:**

| Endpoint | Limite/Minuto | Limite/Hora | Limite/Dia |
|----------|---------------|-------------|------------|
| `/auth/login` | 5 | 20 | 100 |
| `/auth/register` | 3 | 10 | 20 |
| `/auth/refresh` | 60 | 500 | 5000 |
| `/auth/forgot-password` | 3 | 5 | 10 |
| `/auth/reset-password` | 5 | 10 | 20 |
| `/auth/me` | 60 | 1000 | 10000 |

### 3. Proteção contra Ataques

#### Brute Force Protection

```typescript
// Bloquear IP após 5 tentativas falhadas em 15 minutos
interface FailedAttempt {
  ip: string;
  email: string;
  attempts: number;
  first_attempt: Date;
  blocked_until?: Date;
}
```

#### Credential Stuffing Protection

- Detectar múltiplos logins com emails diferentes do mesmo IP
- Requerer CAPTCHA após 3 falhas
- Bloquear IP por 1 hora após 10 tentativas

#### Account Enumeration Prevention

- Mesma mensagem de erro para credenciais inválidas
- Mesma resposta para email existente/não existente no registro
- Tempo de resposta consistente

---

## Endpoints a Implementar

### 1. POST `/api/v1/auth/login`

**Descrição:** Autentica usuário com email e senha.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "v1.MRjQwMzMwODY2OTg...",
    "token_type": "bearer",
    "expires_in": 3600,
    "expires_at": "2025-12-26T11:00:00Z",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "created_at": "2025-01-01T10:00:00Z"
    }
  },
  "meta": {
    "timestamp": "2025-12-26T10:00:00Z"
  }
}
```

**Erros:**
- 400: Email ou senha inválidos (formato)
- 401: Credenciais incorretas
- 429: Muitas tentativas
- 423: Conta bloqueada

**Validações:**
- Email válido (regex)
- Senha não vazia
- Rate limiting: 5/min por IP

**Segurança:**
- Log de tentativa (sucesso/falha)
- Incrementar contador de falhas
- Bloquear após 5 tentativas falhas

---

### 2. POST `/api/v1/auth/register`

**Descrição:** Cria nova conta de usuário.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "full_name": "João Silva",
  "phone": "+5511999999999"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "newuser@example.com",
      "created_at": "2025-12-26T10:00:00Z"
    },
    "message": "Account created successfully. Please check your email for verification."
  },
  "meta": {
    "timestamp": "2025-12-26T10:00:00Z"
  }
}
```

**Erros:**
- 400: Dados inválidos
- 409: Email já cadastrado
- 429: Muitas tentativas

**Validações:**
- Email único e válido
- Senha forte (min 8 chars, 1 maiúscula, 1 número)
- Nome completo (opcional)
- Telefone válido (opcional)

**Segurança:**
- Enviar email de confirmação
- Não revelar se email já existe
- Rate limiting: 3/min por IP

---

### 3. POST `/api/v1/auth/refresh`

**Descrição:** Renova access token usando refresh token.

**Request:**
```json
{
  "refresh_token": "v1.MRjQwMzMwODY2OTg..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "v1.NewRefreshToken...",
    "token_type": "bearer",
    "expires_in": 3600,
    "expires_at": "2025-12-26T11:00:00Z"
  },
  "meta": {
    "timestamp": "2025-12-26T10:00:00Z"
  }
}
```

**Erros:**
- 400: refresh_token ausente
- 401: refresh_token inválido ou expirado
- 429: Muitas tentativas

**Validações:**
- refresh_token presente
- refresh_token válido no Supabase

**Segurança:**
- Invalidar refresh_token antigo
- Rate limiting: 60/min

---

### 4. POST `/api/v1/auth/logout`

**Descrição:** Invalida sessão atual do usuário.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "revoke_all_sessions": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  },
  "meta": {
    "timestamp": "2025-12-26T10:00:00Z"
  }
}
```

**Erros:**
- 401: Token inválido
- 429: Muitas tentativas

**Validações:**
- access_token válido

**Segurança:**
- Invalidar sessão no Supabase
- Opcionalmente revogar todas as sessões
- Log de logout

---

### 5. GET `/api/v1/auth/me`

**Descrição:** Retorna dados do usuário autenticado.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "email_verified": true,
    "full_name": "João Silva",
    "phone": "+5511999999999",
    "avatar_url": "https://...",
    "role": "user",
    "created_at": "2025-01-01T10:00:00Z",
    "updated_at": "2025-12-20T15:30:00Z",
    "last_sign_in_at": "2025-12-26T10:00:00Z"
  },
  "meta": {
    "timestamp": "2025-12-26T10:00:00Z"
  }
}
```

**Erros:**
- 401: Token inválido
- 429: Muitas tentativas

**Validações:**
- access_token válido

---

### 6. POST `/api/v1/auth/api-keys`

**Descrição:** Gera API Key para autenticação programática.

**Request Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "name": "Production Integration",
  "permissions": {
    "read": ["*"],
    "write": ["clients", "vehicles"],
    "delete": []
  },
  "rate_limit_per_minute": 100,
  "rate_limit_per_day": 50000,
  "expires_at": "2026-12-26T00:00:00Z"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Production Integration",
    "key": "crm_live_abc123xyz789...",
    "key_preview": "...xyz789",
    "permissions": {...},
    "rate_limit_per_minute": 100,
    "rate_limit_per_day": 50000,
    "expires_at": "2026-12-26T00:00:00Z",
    "created_at": "2025-12-26T10:00:00Z",
    "warning": "Save this key securely. It will not be shown again!"
  },
  "meta": {
    "timestamp": "2025-12-26T10:00:00Z"
  }
}
```

**Nota:** Este endpoint já existe em `/api-keys`, mas será movido/duplicado para `/api/v1/auth/api-keys` para consistência da API.

---

### 7. POST `/api/v1/auth/forgot-password`

**Descrição:** Envia email para reset de senha.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "If this email exists, a password reset link has been sent."
  },
  "meta": {
    "timestamp": "2025-12-26T10:00:00Z"
  }
}
```

**Erros:**
- 400: Email inválido
- 429: Muitas tentativas

**Validações:**
- Email válido (formato)

**Segurança:**
- Sempre retornar sucesso (não revelar se email existe)
- Rate limiting: 3/min, 5/hora
- Log de tentativas

---

### 8. POST `/api/v1/auth/reset-password`

**Descrição:** Reseta senha usando token de reset.

**Request:**
```json
{
  "token": "reset_token_from_email",
  "new_password": "NewSecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully. You can now login with your new password."
  },
  "meta": {
    "timestamp": "2025-12-26T10:00:00Z"
  }
}
```

**Erros:**
- 400: Dados inválidos
- 401: Token inválido ou expirado
- 429: Muitas tentativas

**Validações:**
- Token válido
- Senha forte

---

### 9. POST `/api/v1/auth/verify-email`

**Descrição:** Verifica email do usuário.

**Request:**
```json
{
  "token": "verification_token_from_email"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Email verified successfully"
  },
  "meta": {
    "timestamp": "2025-12-26T10:00:00Z"
  }
}
```

---

## Fluxo de Autenticação

### Fluxo 1: Login Normal

```
1. Cliente → POST /auth/login (email + password)
2. Validação de entrada
3. Rate limit check
4. Supabase Auth verifica credenciais
5. Se OK: Retorna access_token + refresh_token
6. Cliente armazena tokens
7. Cliente usa access_token em requisições futuras
```

### Fluxo 2: Refresh Token

```
1. Cliente detecta access_token expirado
2. Cliente → POST /auth/refresh (refresh_token)
3. Supabase valida refresh_token
4. Se OK: Retorna novo access_token + refresh_token
5. Cliente atualiza tokens armazenados
```

### Fluxo 3: Geração de API Key

```
1. Cliente autenticado → POST /auth/api-keys
2. Validação de permissões
3. Geração de API Key (SHA-256 hash)
4. Armazena no banco com hash
5. Retorna key apenas uma vez
6. Cliente usa API Key em integrações programáticas
```

### Fluxo 4: Autenticação com API Key

```
1. Cliente → GET /api/v1/clients
   Header: Authorization: Bearer {API_KEY}
2. Middleware verifica API Key
3. Rate limit check
4. Permissão check
5. Se OK: Processa requisição
```

---

## Estrutura de Implementação

### Arquivos a Criar

```
supabase/functions/
├── _shared/
│   ├── api-auth-helpers.ts          # Helpers de autenticação
│   ├── api-password-validator.ts    # Validação de senha
│   └── api-brute-force.ts          # Proteção contra brute force
│
└── auth-v1/
    └── index.ts                     # Router principal
```

### Estrutura do Router

```typescript
// supabase/functions/auth-v1/index.ts
Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const path = url.pathname.split('/').filter(Boolean);

  // Rotas: /auth-v1/login, /auth-v1/register, etc.
  const action = path[path.length - 1];

  switch (action) {
    case 'login':
      return handleLogin(req);
    case 'register':
      return handleRegister(req);
    case 'refresh':
      return handleRefresh(req);
    case 'logout':
      return handleLogout(req);
    case 'me':
      return handleMe(req);
    case 'api-keys':
      return handleApiKeys(req);
    case 'forgot-password':
      return handleForgotPassword(req);
    case 'reset-password':
      return handleResetPassword(req);
    case 'verify-email':
      return handleVerifyEmail(req);
    default:
      return errorResponse(CommonErrors.notFound('Endpoint'));
  }
});
```

---

## Segurança

### 1. Validação de Senha

```typescript
interface PasswordPolicy {
  minLength: 8;
  requireUppercase: true;
  requireLowercase: true;
  requireNumber: true;
  requireSpecialChar: false;
  maxLength: 128;
}

function validatePassword(password: string): ValidationResult {
  // Implementar regras de senha forte
}
```

### 2. Proteção contra Brute Force

```sql
-- Criar tabela de tentativas de login
CREATE TABLE IF NOT EXISTS crm_auth_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address inet NOT NULL,
  email text,
  success boolean NOT NULL,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_auth_attempts_ip ON crm_auth_attempts(ip_address, created_at);
CREATE INDEX idx_auth_attempts_email ON crm_auth_attempts(email, created_at);
```

### 3. Bloqueio de Conta

```sql
-- Adicionar campos na tabela auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS failed_attempts integer DEFAULT 0;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS locked_until timestamptz;
```

### 4. Logging de Segurança

```typescript
interface SecurityEvent {
  event_type: 'login_success' | 'login_failed' | 'password_reset' | 'api_key_generated';
  user_id?: string;
  ip_address: string;
  user_agent: string;
  metadata?: any;
}
```

---

## Validações

### 1. Email

```typescript
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}
```

### 2. Senha

```typescript
function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
```

### 3. Telefone

```typescript
function isValidPhone(phone: string): boolean {
  // Aceitar formato: +5511999999999 ou (11) 99999-9999
  const phoneRegex = /^(\+\d{1,3}\d{10,11}|\(\d{2}\)\s?\d{4,5}-\d{4})$/;
  return phoneRegex.test(phone);
}
```

---

## Testes

### 1. Testes Unitários

```bash
# Testar validação de email
test_email_validation()

# Testar validação de senha
test_password_validation()

# Testar rate limiting
test_rate_limiting()

# Testar brute force protection
test_brute_force_protection()
```

### 2. Testes de Integração

```bash
# Fluxo completo de registro
test_register_flow()

# Fluxo completo de login
test_login_flow()

# Fluxo de refresh token
test_refresh_flow()

# Fluxo de forgot password
test_forgot_password_flow()

# Geração de API Key
test_api_key_generation()
```

### 3. Testes de Segurança

```bash
# Tentativas de brute force
test_brute_force_attack()

# SQL injection
test_sql_injection()

# XSS
test_xss_attacks()

# CSRF
test_csrf_protection()

# Account enumeration
test_account_enumeration_prevention()
```

### 4. Testes de Performance

```bash
# 100 logins simultâneos
test_concurrent_logins()

# Rate limiting sob carga
test_rate_limit_under_load()

# Refresh token sob carga
test_refresh_under_load()
```

---

## Checklist de Implementação

### Fase 1: Setup (4-6 horas)

- [ ] Criar tabela `crm_auth_attempts`
- [ ] Criar tabela `crm_security_events`
- [ ] Criar helpers de validação (`api-password-validator.ts`)
- [ ] Criar helper de brute force (`api-brute-force.ts`)
- [ ] Criar helper de auth (`api-auth-helpers.ts`)

### Fase 2: Endpoints Básicos (8-10 horas)

- [ ] Implementar POST `/auth/login`
- [ ] Implementar POST `/auth/register`
- [ ] Implementar POST `/auth/refresh`
- [ ] Implementar POST `/auth/logout`
- [ ] Implementar GET `/auth/me`

### Fase 3: Endpoints Avançados (4-6 horas)

- [ ] Implementar POST `/auth/forgot-password`
- [ ] Implementar POST `/auth/reset-password`
- [ ] Implementar POST `/auth/verify-email`
- [ ] Integrar POST `/auth/api-keys`

### Fase 4: Segurança (6-8 horas)

- [ ] Implementar rate limiting específico
- [ ] Implementar brute force protection
- [ ] Implementar bloqueio de conta
- [ ] Implementar logging de segurança
- [ ] Testar account enumeration prevention

### Fase 5: Testes (8-10 horas)

- [ ] Escrever testes unitários
- [ ] Escrever testes de integração
- [ ] Escrever testes de segurança
- [ ] Testes de carga
- [ ] Correção de bugs encontrados

### Fase 6: Documentação (2-3 horas)

- [ ] Atualizar API_STRUCTURE_README.md
- [ ] Criar exemplos de uso
- [ ] Documentar códigos de erro
- [ ] Guia de troubleshooting

### Fase 7: Deploy (1-2 horas)

- [ ] Deploy da edge function
- [ ] Testar em produção
- [ ] Configurar alertas de segurança
- [ ] Monitoramento ativo

---

## Tempo Total Estimado

| Fase | Tempo |
|------|-------|
| Setup | 4-6h |
| Endpoints Básicos | 8-10h |
| Endpoints Avançados | 4-6h |
| Segurança | 6-8h |
| Testes | 8-10h |
| Documentação | 2-3h |
| Deploy | 1-2h |
| **Total** | **33-45h** |

**Estimativa:** 3-4 dias de trabalho intenso ou 5-6 dias de trabalho normal.

---

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Brute force bem-sucedido | Média | Alto | Rate limiting + bloqueio de IP |
| Token leak | Baixa | Crítico | Expiração curta + refresh tokens |
| Account enumeration | Média | Médio | Mensagens genéricas |
| SQL injection | Baixa | Crítico | Prepared statements (Supabase) |
| Rate limiting bypass | Média | Alto | Múltiplas camadas de limite |
| Password weak | Alta | Médio | Validação forte + feedback |

---

## Métricas de Sucesso

### Performance
- [ ] Login < 300ms (P95)
- [ ] Register < 500ms (P95)
- [ ] Refresh < 200ms (P95)
- [ ] Me < 100ms (P95)

### Segurança
- [ ] 0 ataques de brute force bem-sucedidos
- [ ] 100% de tentativas de login logadas
- [ ] Rate limiting < 1% de falsos positivos
- [ ] 0 vazamentos de tokens em logs

### Usabilidade
- [ ] Mensagens de erro claras
- [ ] Documentação completa
- [ ] Exemplos de código funcionais
- [ ] 95%+ de requisições bem-sucedidas

---

## Próximos Passos Após Conclusão

1. **Implementar OAuth 2.0** (Tarefa 3.1)
   - Login com Google
   - Login com GitHub
   - Login com Microsoft

2. **Implementar Webhooks** (Tarefa 2.x)
   - Notificar sobre novos registros
   - Notificar sobre logins suspeitos

3. **Implementar MFA** (Futuro)
   - TOTP (Google Authenticator)
   - SMS
   - Email

4. **Implementar SSO** (Futuro)
   - SAML 2.0
   - OpenID Connect

---

## Referências

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OAuth 2.0 RFC](https://tools.ietf.org/html/rfc6749)

---

**Status:** 📋 PLANO COMPLETO - PRONTO PARA EXECUÇÃO

**Última Atualização:** 26/12/2025

**Próximo Passo:** Aprovar plano e iniciar Fase 1 (Setup)
