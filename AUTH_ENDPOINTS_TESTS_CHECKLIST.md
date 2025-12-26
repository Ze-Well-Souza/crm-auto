# Checklist de Testes - Endpoints de Autenticação

Este documento contém um checklist completo de testes que devem ser executados após a implementação dos endpoints de autenticação.

---

## 📋 Visão Geral

- **Total de Testes:** 50+
- **Categorias:** 7
- **Tempo Estimado:** 4-6 horas
- **Ferramentas:** cURL, Postman, Scripts automatizados

---

## 1. Testes de Registro (POST /auth/register)

### ✅ Casos de Sucesso

- [ ] **1.1** Registrar usuário com email e senha válidos
  ```bash
  curl -X POST $BASE_URL/auth-v1/register \
    -H "Content-Type: application/json" \
    -d '{"email": "test1@example.com", "password": "SecurePass123!"}'
  ```
  - Espera: Status 201, success: true, user.id existe

- [ ] **1.2** Registrar usuário com dados completos (email, senha, nome, telefone)
  ```bash
  curl -X POST $BASE_URL/auth-v1/register \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test2@example.com",
      "password": "SecurePass123!",
      "full_name": "João Silva",
      "phone": "+5511999999999"
    }'
  ```
  - Espera: Status 201, dados completos retornados

### ❌ Casos de Erro

- [ ] **1.3** Registrar com email inválido (sem @)
  - Espera: Status 400, code: VALIDATION_ERROR

- [ ] **1.4** Registrar com email inválido (sem domínio)
  - Espera: Status 400, code: VALIDATION_ERROR

- [ ] **1.5** Registrar com senha muito curta (< 8 caracteres)
  - Espera: Status 400, code: WEAK_PASSWORD

- [ ] **1.6** Registrar com senha sem maiúscula
  - Espera: Status 400, code: WEAK_PASSWORD

- [ ] **1.7** Registrar com senha sem número
  - Espera: Status 400, code: WEAK_PASSWORD

- [ ] **1.8** Registrar com email já existente
  - Espera: Status 409, code: EMAIL_ALREADY_EXISTS

- [ ] **1.9** Registrar sem email
  - Espera: Status 400, code: VALIDATION_ERROR

- [ ] **1.10** Registrar sem senha
  - Espera: Status 400, code: VALIDATION_ERROR

### 🔒 Testes de Segurança

- [ ] **1.11** Exceder rate limit (4+ tentativas em 1 minuto)
  - Espera: Status 429, code: RATE_LIMIT_EXCEEDED

- [ ] **1.12** Verificar que email não é revelado na resposta de erro
  - Espera: Mensagem genérica mesmo se email existe

---

## 2. Testes de Login (POST /auth/login)

### ✅ Casos de Sucesso

- [ ] **2.1** Login com credenciais válidas
  ```bash
  curl -X POST $BASE_URL/auth-v1/login \
    -H "Content-Type: application/json" \
    -d '{"email": "test1@example.com", "password": "SecurePass123!"}'
  ```
  - Espera: Status 200, access_token e refresh_token presentes

- [ ] **2.2** Verificar formato do access_token (JWT)
  - Espera: Formato `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

- [ ] **2.3** Verificar formato do refresh_token
  - Espera: Token válido do Supabase

- [ ] **2.4** Verificar campo expires_in
  - Espera: Valor em segundos (geralmente 3600)

- [ ] **2.5** Verificar campo user retornado
  - Espera: id, email, created_at presentes

### ❌ Casos de Erro

- [ ] **2.6** Login com email inexistente
  - Espera: Status 401, code: INVALID_CREDENTIALS

- [ ] **2.7** Login com senha incorreta
  - Espera: Status 401, code: INVALID_CREDENTIALS

- [ ] **2.8** Login com email vazio
  - Espera: Status 400, code: VALIDATION_ERROR

- [ ] **2.9** Login com senha vazia
  - Espera: Status 400, code: VALIDATION_ERROR

- [ ] **2.10** Login com formato de email inválido
  - Espera: Status 400, code: VALIDATION_ERROR

### 🔒 Testes de Segurança

- [ ] **2.11** Brute force: 5 tentativas com senha errada
  - Espera: Status 423 na 6ª tentativa, code: ACCOUNT_LOCKED

- [ ] **2.12** Verificar bloqueio de IP após 5 tentativas falhas
  - Espera: IP bloqueado por 15 minutos

- [ ] **2.13** Exceder rate limit (6+ tentativas em 1 minuto)
  - Espera: Status 429, code: RATE_LIMIT_EXCEEDED

- [ ] **2.14** Verificar que mensagens de erro não revelam se email existe
  - Espera: Mesma mensagem para email inexistente e senha errada

- [ ] **2.15** Verificar logging de tentativa de login
  - Espera: Registro em crm_auth_attempts

- [ ] **2.16** SQL Injection: tentar injetar SQL no email
  ```bash
  {"email": "' OR '1'='1", "password": "any"}
  ```
  - Espera: Tratado como string normal, login falha

---

## 3. Testes de Refresh (POST /auth/refresh)

### ✅ Casos de Sucesso

- [ ] **3.1** Refresh com token válido
  ```bash
  curl -X POST $BASE_URL/auth-v1/refresh \
    -H "Content-Type: application/json" \
    -d '{"refresh_token": "VALID_REFRESH_TOKEN"}'
  ```
  - Espera: Status 200, novo access_token e refresh_token

- [ ] **3.2** Verificar que novo access_token é diferente do anterior
  - Espera: Tokens diferentes

- [ ] **3.3** Verificar que novo refresh_token é diferente do anterior
  - Espera: Tokens diferentes

- [ ] **3.4** Verificar que token antigo foi invalidado
  - Espera: Tentativa de usar token antigo falha

### ❌ Casos de Erro

- [ ] **3.5** Refresh sem token
  - Espera: Status 400, code: VALIDATION_ERROR

- [ ] **3.6** Refresh com token inválido
  - Espera: Status 401, code: INVALID_TOKEN

- [ ] **3.7** Refresh com token expirado
  - Espera: Status 401, code: INVALID_TOKEN

- [ ] **3.8** Refresh com token já usado (replay attack)
  - Espera: Status 401, code: INVALID_TOKEN

### 🔒 Testes de Segurança

- [ ] **3.9** Exceder rate limit (61+ tentativas em 1 minuto)
  - Espera: Status 429

- [ ] **3.10** Verificar logging de refresh
  - Espera: Registro em crm_api_logs

---

## 4. Testes de Logout (POST /auth/logout)

### ✅ Casos de Sucesso

- [ ] **4.1** Logout com token válido
  ```bash
  curl -X POST $BASE_URL/auth-v1/logout \
    -H "Authorization: Bearer ACCESS_TOKEN"
  ```
  - Espera: Status 200, message: "Logged out successfully"

- [ ] **4.2** Verificar que token foi invalidado após logout
  - Espera: Tentativa de usar token falha com 401

- [ ] **4.3** Logout com opção revoke_all_sessions: true
  - Espera: Todas as sessões do usuário invalidadas

### ❌ Casos de Erro

- [ ] **4.4** Logout sem token
  - Espera: Status 401, code: UNAUTHORIZED

- [ ] **4.5** Logout com token inválido
  - Espera: Status 401, code: INVALID_TOKEN

- [ ] **4.6** Logout com token já invalidado
  - Espera: Status 401, code: INVALID_TOKEN

---

## 5. Testes de Me (GET /auth/me)

### ✅ Casos de Sucesso

- [ ] **5.1** Obter dados do usuário com token válido
  ```bash
  curl -X GET $BASE_URL/auth-v1/me \
    -H "Authorization: Bearer ACCESS_TOKEN"
  ```
  - Espera: Status 200, dados completos do usuário

- [ ] **5.2** Verificar campos retornados
  - Espera: id, email, email_verified, full_name, phone, avatar_url, role, created_at, updated_at, last_sign_in_at

- [ ] **5.3** Verificar que senhas não são retornadas
  - Espera: Nenhum campo de senha no response

### ❌ Casos de Erro

- [ ] **5.4** Obter dados sem token
  - Espera: Status 401, code: UNAUTHORIZED

- [ ] **5.5** Obter dados com token inválido
  - Espera: Status 401, code: INVALID_TOKEN

- [ ] **5.6** Obter dados com token expirado
  - Espera: Status 401, code: INVALID_TOKEN

---

## 6. Testes de API Keys (POST /auth/api-keys)

### ✅ Casos de Sucesso

- [ ] **6.1** Gerar API Key com permissões básicas
  ```bash
  curl -X POST $BASE_URL/auth-v1/api-keys \
    -H "Authorization: Bearer ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Test Key",
      "permissions": {"read": ["*"], "write": [], "delete": []}
    }'
  ```
  - Espera: Status 201, key retornada apenas uma vez

- [ ] **6.2** Verificar formato da API Key gerada
  - Espera: String hexadecimal de 64 caracteres

- [ ] **6.3** Verificar que key_preview contém últimos 8 caracteres
  - Espera: Preview correto

- [ ] **6.4** Gerar API Key com rate limits customizados
  - Espera: Limites aplicados corretamente

- [ ] **6.5** Gerar API Key com expiração
  - Espera: expires_at configurado corretamente

- [ ] **6.6** Usar API Key gerada para fazer requisição
  ```bash
  curl -X GET $BASE_URL/api-test \
    -H "Authorization: Bearer API_KEY"
  ```
  - Espera: Status 200, autenticação bem-sucedida

### ❌ Casos de Erro

- [ ] **6.7** Gerar API Key sem autenticação
  - Espera: Status 401, code: UNAUTHORIZED

- [ ] **6.8** Gerar API Key com nome muito curto (< 3 chars)
  - Espera: Status 400, code: VALIDATION_ERROR

- [ ] **6.9** Gerar API Key com permissões inválidas
  - Espera: Status 400, code: VALIDATION_ERROR

### 🔒 Testes de Segurança

- [ ] **6.10** Verificar que API Key é hasheada no banco (SHA-256)
  ```sql
  SELECT key_hash FROM crm_api_keys WHERE key_preview = 'xyz789';
  ```
  - Espera: Hash diferente da key original

- [ ] **6.11** Tentar listar API Keys de outro usuário
  - Espera: Acesso negado (RLS)

---

## 7. Testes de Forgot/Reset Password

### ✅ Casos de Sucesso - Forgot Password

- [ ] **7.1** Solicitar reset com email válido
  ```bash
  curl -X POST $BASE_URL/auth-v1/forgot-password \
    -H "Content-Type: application/json" \
    -d '{"email": "test1@example.com"}'
  ```
  - Espera: Status 200, mensagem genérica

- [ ] **7.2** Solicitar reset com email inexistente
  - Espera: Status 200, mesma mensagem (não revelar)

- [ ] **7.3** Verificar que email foi enviado (se email existe)
  - Espera: Email recebido com link de reset

### ❌ Casos de Erro - Forgot Password

- [ ] **7.4** Solicitar reset com email inválido (formato)
  - Espera: Status 400, code: VALIDATION_ERROR

- [ ] **7.5** Exceder rate limit (4+ tentativas em 1 minuto)
  - Espera: Status 429

### ✅ Casos de Sucesso - Reset Password

- [ ] **7.6** Resetar senha com token válido
  ```bash
  curl -X POST $BASE_URL/auth-v1/reset-password \
    -H "Content-Type: application/json" \
    -d '{
      "token": "RESET_TOKEN",
      "new_password": "NewSecurePass123!"
    }'
  ```
  - Espera: Status 200, mensagem de sucesso

- [ ] **7.7** Fazer login com nova senha
  - Espera: Login bem-sucedido

- [ ] **7.8** Tentar login com senha antiga
  - Espera: Login falha

### ❌ Casos de Erro - Reset Password

- [ ] **7.9** Reset com token inválido
  - Espera: Status 401, code: INVALID_TOKEN

- [ ] **7.10** Reset com token expirado
  - Espera: Status 401, code: INVALID_TOKEN

- [ ] **7.11** Reset com senha fraca
  - Espera: Status 400, code: WEAK_PASSWORD

- [ ] **7.12** Reset com token já usado
  - Espera: Status 401, code: INVALID_TOKEN

---

## 8. Testes de Integração (Fluxos Completos)

### Fluxo 1: Registro → Login → API Key → Uso

- [ ] **8.1** Executar fluxo completo
  ```bash
  # 1. Registrar
  # 2. Login
  # 3. Gerar API Key
  # 4. Usar API Key
  # 5. Logout
  ```
  - Espera: Todos os passos bem-sucedidos

### Fluxo 2: Login → Token Expira → Refresh → Continua

- [ ] **8.2** Simular expiração de token
  ```bash
  # 1. Login
  # 2. Esperar expiração (ou usar token expirado)
  # 3. Fazer requisição (falha 401)
  # 4. Refresh token
  # 5. Retry requisição (sucesso)
  ```
  - Espera: Refresh automático funciona

### Fluxo 3: Forgot Password → Reset → Login

- [ ] **8.3** Executar fluxo de reset
  ```bash
  # 1. Forgot password
  # 2. Pegar token do email
  # 3. Reset password
  # 4. Login com nova senha
  ```
  - Espera: Processo completo funcional

---

## 9. Testes de Performance

### Load Testing

- [ ] **9.1** 100 logins simultâneos
  ```bash
  seq 1 100 | xargs -P 10 -I {} curl -X POST $BASE_URL/auth-v1/login \
    -H "Content-Type: application/json" \
    -d '{"email": "user{}@test.com", "password": "SecurePass123!"}'
  ```
  - Espera: < 500ms P95, taxa de sucesso > 95%

- [ ] **9.2** 1000 requests de /auth/me
  - Espera: < 200ms P95

- [ ] **9.3** Rate limiting sob carga
  - Espera: Limites aplicados corretamente mesmo sob carga

### Stress Testing

- [ ] **9.4** Teste de stress: 10000 requests/segundo
  - Espera: Sistema permanece estável, rate limiting funciona

---

## 10. Testes de Segurança Avançados

### Penetration Testing

- [ ] **10.1** SQL Injection em todos os campos
  - Espera: Nenhum sucesso

- [ ] **10.2** XSS em campos de texto (nome, email)
  - Espera: Sanitização correta

- [ ] **10.3** CSRF attacks
  - Espera: Tokens protegem contra CSRF

- [ ] **10.4** JWT tampering
  - Espera: Tokens modificados rejeitados

- [ ] **10.5** Timing attacks (account enumeration)
  - Espera: Tempo de resposta consistente

### Token Security

- [ ] **10.6** Tentar usar access_token de outro usuário
  - Espera: Acesso negado

- [ ] **10.7** Tentar usar API Key de outro usuário
  - Espera: Acesso negado

- [ ] **10.8** Verificar que tokens não são logados
  - Espera: Logs não contêm tokens completos

---

## 11. Testes de Logging e Auditoria

### Verificar Logs

- [ ] **11.1** Login bem-sucedido é logado
  ```sql
  SELECT * FROM crm_auth_attempts WHERE success = true;
  ```
  - Espera: Registro presente

- [ ] **11.2** Login falho é logado
  ```sql
  SELECT * FROM crm_auth_attempts WHERE success = false;
  ```
  - Espera: Registro presente com motivo

- [ ] **11.3** Geração de API Key é logada
  ```sql
  SELECT * FROM crm_security_events WHERE event_type = 'api_key_generated';
  ```
  - Espera: Registro presente

- [ ] **11.4** Password reset é logado
  - Espera: Evento registrado

- [ ] **11.5** Verificar que IP e User-Agent são capturados
  - Espera: Dados presentes nos logs

---

## 12. Testes de Documentação

### Verificar Consistência

- [ ] **12.1** Todos os endpoints documentados existem
  - Espera: Nenhum 404

- [ ] **12.2** Todos os campos de request estão corretos
  - Espera: Validações correspondem à documentação

- [ ] **12.3** Todos os códigos de erro estão documentados
  - Espera: Nenhum código desconhecido

- [ ] **12.4** Exemplos de código funcionam
  - Espera: Todos os exemplos executam sem erro

---

## Script de Teste Automatizado

```bash
#!/bin/bash

# test-auth-endpoints.sh

BASE_URL="https://simqszeoovjipujuxeus.supabase.co/functions/v1"
PASSED=0
FAILED=0

function test_endpoint() {
  local name=$1
  local command=$2
  local expected_status=$3

  echo "Testing: $name"

  response=$(eval $command)
  status=$(echo $response | jq -r '.status // 200')

  if [ "$status" == "$expected_status" ]; then
    echo "✅ PASSED: $name"
    ((PASSED++))
  else
    echo "❌ FAILED: $name (Expected: $expected_status, Got: $status)"
    ((FAILED++))
  fi
  echo ""
}

# Registro
test_endpoint "Register with valid data" \
  "curl -s -X POST $BASE_URL/auth-v1/register -H 'Content-Type: application/json' -d '{\"email\":\"test@example.com\",\"password\":\"SecurePass123!\"}'" \
  "201"

# Login
test_endpoint "Login with valid credentials" \
  "curl -s -X POST $BASE_URL/auth-v1/login -H 'Content-Type: application/json' -d '{\"email\":\"test@example.com\",\"password\":\"SecurePass123!\"}'" \
  "200"

# ... mais testes

echo "========================================="
echo "Test Summary:"
echo "Passed: $PASSED"
echo "Failed: $FAILED"
echo "Total: $((PASSED + FAILED))"
echo "Success Rate: $(echo "scale=2; $PASSED * 100 / ($PASSED + $FAILED)" | bc)%"
echo "========================================="

if [ $FAILED -eq 0 ]; then
  echo "✅ All tests passed!"
  exit 0
else
  echo "❌ Some tests failed!"
  exit 1
fi
```

---

## Relatório de Testes

Após executar todos os testes, preencher:

### Resumo

- **Data:** ___________
- **Executado por:** ___________
- **Versão:** ___________

### Estatísticas

- **Total de Testes:** 50+
- **Passou:** ___ / 50
- **Falhou:** ___ / 50
- **Taxa de Sucesso:** ____%

### Performance

- **Login P95:** ___ ms
- **Refresh P95:** ___ ms
- **Me P95:** ___ ms

### Segurança

- [ ] Brute force protection funciona
- [ ] Rate limiting funciona
- [ ] Account enumeration prevenção funciona
- [ ] SQL injection não é possível
- [ ] XSS não é possível
- [ ] Tokens são seguros

### Issues Encontradas

1. ___________
2. ___________
3. ___________

### Próximos Passos

1. ___________
2. ___________
3. ___________

---

## Conclusão

Este checklist garante que todos os aspectos dos endpoints de autenticação foram testados:

✅ Funcionalidade básica
✅ Casos de erro
✅ Segurança
✅ Performance
✅ Logging
✅ Documentação

**Status:** Pronto para produção quando todos os testes passarem.

**Última Atualização:** 26/12/2025
