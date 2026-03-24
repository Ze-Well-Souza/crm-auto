# Resumo Executivo - Endpoints de Autenticação

## Visão Geral

Plano completo e seguro para implementar **9 endpoints de autenticação** usando Supabase Auth como backend, com foco em segurança, performance e experiência do desenvolvedor.

---

## Endpoints a Implementar

| # | Método | Endpoint | Função | Prioridade |
|---|--------|----------|--------|------------|
| 1 | POST | `/api/v1/auth/login` | Login email/senha | 🔴 ALTA |
| 2 | POST | `/api/v1/auth/register` | Criar conta | 🔴 ALTA |
| 3 | POST | `/api/v1/auth/refresh` | Renovar token | 🔴 ALTA |
| 4 | POST | `/api/v1/auth/logout` | Encerrar sessão | 🟡 MÉDIA |
| 5 | GET | `/api/v1/auth/me` | Dados do usuário | 🟡 MÉDIA |
| 6 | POST | `/api/v1/auth/api-keys` | Gerar API Key | 🟡 MÉDIA |
| 7 | POST | `/api/v1/auth/forgot-password` | Solicitar reset | 🟢 BAIXA |
| 8 | POST | `/api/v1/auth/reset-password` | Resetar senha | 🟢 BAIXA |
| 9 | POST | `/api/v1/auth/verify-email` | Verificar email | 🟢 BAIXA |

---

## Arquitetura de Segurança

### 4 Camadas de Proteção

```
┌─────────────────────────────┐
│ 1. CORS + Rate Limiting     │  ← 5 tentativas/min para login
├─────────────────────────────┤
│ 2. Validação de Entrada     │  ← Email válido, senha forte
├─────────────────────────────┤
│ 3. Supabase Auth            │  ← JWT tokens, sessões
├─────────────────────────────┤
│ 4. Logging & Auditoria      │  ← Todas as tentativas registradas
└─────────────────────────────┘
```

### Rate Limiting Específico

| Endpoint | Por Minuto | Por Hora | Por Dia |
|----------|------------|----------|---------|
| Login | 5 | 20 | 100 |
| Register | 3 | 10 | 20 |
| Refresh | 60 | 500 | 5000 |
| Forgot Password | 3 | 5 | 10 |

**Motivo:** Endpoints de autenticação são mais sensíveis e alvos de ataques.

---

## Proteções Implementadas

### 🛡️ Contra Brute Force
- Bloqueio após 5 tentativas falhas
- Bloqueio de IP por 15 minutos
- Log de todas as tentativas

### 🛡️ Contra Credential Stuffing
- Detecção de múltiplos emails do mesmo IP
- CAPTCHA após 3 falhas
- Bloqueio de IP por 1 hora após 10 tentativas

### 🛡️ Contra Account Enumeration
- Mesma mensagem para credenciais válidas/inválidas
- Tempo de resposta consistente
- Não revelar se email existe

### 🛡️ Validação de Senha Forte

```
✓ Mínimo 8 caracteres
✓ 1 letra maiúscula
✓ 1 letra minúscula
✓ 1 número
✓ Máximo 128 caracteres
```

---

## Fluxos de Autenticação

### Fluxo 1: Login → API Key → Uso

```
1. POST /auth/login
   ↓
2. Recebe access_token + refresh_token
   ↓
3. POST /auth/api-keys
   ↓
4. Recebe API Key permanente
   ↓
5. Usa API Key em todas as requisições
```

### Fluxo 2: Token Expirado → Refresh

```
1. Requisição falha (401)
   ↓
2. POST /auth/refresh (refresh_token)
   ↓
3. Recebe novo access_token
   ↓
4. Retry requisição original
```

---

## Estrutura de Dados

### Tabelas Novas

**1. crm_auth_attempts**
```sql
- ip_address (inet)
- email (text)
- success (boolean)
- user_agent (text)
- created_at (timestamptz)
```

**2. crm_security_events**
```sql
- event_type (text)
- user_id (uuid)
- ip_address (inet)
- metadata (jsonb)
- created_at (timestamptz)
```

---

## Exemplo de Uso

### 1. Registrar Usuário

```bash
curl -X POST https://simqszeoovjipujuxeus.supabase.co/functions/v1/auth-v1/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "full_name": "João Silva"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    },
    "message": "Account created. Check your email for verification."
  }
}
```

### 2. Login

```bash
curl -X POST https://simqszeoovjipujuxeus.supabase.co/functions/v1/auth-v1/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "v1.MRjQwMzMwODY2OTg...",
    "expires_in": 3600,
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    }
  }
}
```

### 3. Gerar API Key

```bash
curl -X POST https://simqszeoovjipujuxeus.supabase.co/functions/v1/auth-v1/api-keys \
  -H "Authorization: Bearer {access_token}" \
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

### 4. Usar API Key

```bash
curl -X GET https://simqszeoovjipujuxeus.supabase.co/functions/v1/api/v1/clients \
  -H "Authorization: Bearer {api_key}"
```

---

## Checklist de Implementação

### ✅ Fase 1: Setup (4-6h)
- [ ] Tabela `crm_auth_attempts`
- [ ] Tabela `crm_security_events`
- [ ] Helper de validação de senha
- [ ] Helper de brute force protection
- [ ] Helper de auth

### ✅ Fase 2: Endpoints Básicos (8-10h)
- [ ] POST `/auth/login`
- [ ] POST `/auth/register`
- [ ] POST `/auth/refresh`
- [ ] POST `/auth/logout`
- [ ] GET `/auth/me`

### ✅ Fase 3: Endpoints Avançados (4-6h)
- [ ] POST `/auth/forgot-password`
- [ ] POST `/auth/reset-password`
- [ ] POST `/auth/verify-email`
- [ ] POST `/auth/api-keys`

### ✅ Fase 4: Segurança (6-8h)
- [ ] Rate limiting específico
- [ ] Brute force protection
- [ ] Bloqueio de conta
- [ ] Logging de segurança

### ✅ Fase 5: Testes (8-10h)
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Testes de segurança
- [ ] Testes de carga

### ✅ Fase 6: Documentação (2-3h)
- [ ] Atualizar docs
- [ ] Exemplos de uso
- [ ] Troubleshooting

### ✅ Fase 7: Deploy (1-2h)
- [ ] Deploy function
- [ ] Testes em produção
- [ ] Monitoramento

---

## Tempo Estimado

| Item | Horas |
|------|-------|
| Setup | 4-6 |
| Endpoints Básicos | 8-10 |
| Endpoints Avançados | 4-6 |
| Segurança | 6-8 |
| Testes | 8-10 |
| Documentação | 2-3 |
| Deploy | 1-2 |
| **TOTAL** | **33-45h** |

**Prazo:** 3-4 dias (trabalho intenso) ou 5-6 dias (trabalho normal)

---

## Métricas de Sucesso

### Performance ⚡
- [ ] Login < 300ms (P95)
- [ ] Register < 500ms (P95)
- [ ] Refresh < 200ms (P95)

### Segurança 🔒
- [ ] 0 brute force bem-sucedidos
- [ ] 100% tentativas logadas
- [ ] Rate limiting < 1% falsos positivos

### Usabilidade 👥
- [ ] Mensagens de erro claras
- [ ] Documentação completa
- [ ] 95%+ requisições bem-sucedidas

---

## Códigos de Erro

| Código | Status | Quando |
|--------|--------|--------|
| INVALID_CREDENTIALS | 401 | Email/senha incorretos |
| ACCOUNT_LOCKED | 423 | Conta bloqueada por tentativas |
| RATE_LIMIT_EXCEEDED | 429 | Muitas tentativas |
| WEAK_PASSWORD | 400 | Senha não atende requisitos |
| EMAIL_ALREADY_EXISTS | 409 | Email já cadastrado |
| INVALID_TOKEN | 401 | Token inválido/expirado |
| EMAIL_NOT_VERIFIED | 403 | Email não verificado |

---

## Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Brute force | Rate limiting + bloqueio |
| Token leak | Expiração curta + refresh |
| Account enumeration | Mensagens genéricas |
| SQL injection | Prepared statements |
| Weak passwords | Validação forte |

---

## Arquivos a Criar

```
supabase/
├── migrations/
│   ├── create_auth_attempts_table.sql
│   └── create_security_events_table.sql
├── functions/
│   ├── _shared/
│   │   ├── api-password-validator.ts
│   │   ├── api-brute-force.ts
│   │   └── api-auth-helpers.ts
│   └── auth-v1/
│       └── index.ts (router principal)
```

---

## Próximos Passos Após Conclusão

1. ✅ **Endpoints de Recursos** (Tarefa 1.3+)
   - Clientes, Veículos, Ordens, etc.

2. ✅ **OAuth 2.0** (Tarefa 3.1)
   - Google, GitHub, Microsoft

3. ✅ **Webhooks** (Tarefa 2.x)
   - Notificações de eventos

4. ✅ **Documentação Swagger**
   - Spec OpenAPI 3.0

---

## Diferencial de Segurança

### O que este sistema oferece:

✅ **4 camadas de segurança** (CORS, Validação, Auth, Logging)
✅ **Rate limiting agressivo** para auth endpoints
✅ **Brute force protection** com bloqueio automático
✅ **Account enumeration prevention**
✅ **Validação forte de senha** com feedback
✅ **Logging completo** de tentativas
✅ **Token refresh** automático
✅ **API Keys** para integrações programáticas

### Compliance:

✅ OWASP Top 10
✅ LGPD (dados pessoais protegidos)
✅ GDPR ready (se necessário)
✅ PCI DSS considerations

---

## Conclusão

Este plano oferece uma **implementação completa, segura e escalável** de endpoints de autenticação, seguindo as melhores práticas de segurança da indústria.

### Destaques:

1. **Segurança Robusta** - 4 camadas de proteção
2. **Rate Limiting Inteligente** - Limites específicos por endpoint
3. **Proteção Completa** - Brute force, credential stuffing, enumeration
4. **Logging Detalhado** - Auditoria completa
5. **Performance** - < 300ms para login
6. **Documentação** - Guias completos com exemplos

---

**Status:** 📋 PLANO APROVADO - PRONTO PARA EXECUÇÃO

**Documentação Completa:** Ver `PLANO_AUTH_ENDPOINTS.md`

**Última Atualização:** 26/12/2025

**Autor:** Claude Agent

**Próximo Passo:** Iniciar Fase 1 - Setup das tabelas e helpers
