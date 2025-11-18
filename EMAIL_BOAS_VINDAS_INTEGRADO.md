# Sistema de Email de Boas-Vindas

## 📋 Visão Geral

Sistema automático que envia email de boas-vindas para novos usuários após o cadastro, incluindo informações sobre o plano escolhido e primeiros passos na plataforma.

## 🏗️ Arquitetura

### 1. **Template de Email de Boas-Vindas**
📁 `supabase/functions/send-notification-email/_templates/welcome-email.tsx`

**Conteúdo do Email:**
- 🎉 Mensagem de boas-vindas personalizada
- 📦 Detalhes do plano escolhido
- 📊 Limites do plano (clientes, agendamentos, OS, usuários)
- ✓ Recursos incluídos no plano
- 🚀 5 primeiros passos para começar:
  1. Complete seu perfil
  2. Cadastre seus primeiros clientes
  3. Configure seus serviços
  4. Crie seu primeiro agendamento
  5. Gerencie seu estoque
- 💡 Dicas importantes sobre recursos automáticos
- 💎 Incentivo de upgrade (apenas para plano gratuito)

**Design:**
- Layout responsivo e profissional
- Cores específicas por seção:
  - Azul para informações do plano
  - Amarelo para dicas
  - Roxo para sugestões de upgrade
- Ícones visuais para melhor escaneabilidade

### 2. **Edge Function - send-welcome-email**
📁 `supabase/functions/send-welcome-email/index.ts`

**Funcionalidade:**
1. Recebe o `userId` do novo usuário
2. Busca dados do perfil (nome completo)
3. Busca email do usuário via Supabase Auth Admin
4. Busca assinatura e plano do usuário
5. Prepara dados estruturados do email
6. Chama `send-notification-email` com tipo `welcome`
7. Retorna sucesso/erro

**Dados Enviados:**
```typescript
{
  userName: string,          // Nome do usuário ou parte do email
  planName: string,          // Nome interno (free, basic, pro, etc)
  planDisplayName: string,   // Nome de exibição (Gratuito, Básico, etc)
  planLimits: {
    clients: number,         // -1 = ilimitado
    appointments: number,
    serviceOrders: number,
    users: number
  },
  features: string[]         // Lista de recursos incluídos
}
```

**Segurança:**
- `verify_jwt = false` (permite chamada via trigger do banco)
- Usa Service Role Key internamente
- Validação de parâmetros obrigatórios

### 3. **Trigger Automático no Banco de Dados**
📁 Migração SQL

**Função:** `public.send_welcome_email()`
- Dispara após INSERT na tabela `profiles`
- Usa `pg_net.http_post` para chamar edge function
- Executa de forma assíncrona (não bloqueia cadastro)
- Passa `userId` como parâmetro

**Trigger:** `on_profile_created_send_welcome`
- Tabela: `public.profiles`
- Evento: AFTER INSERT
- Para cada linha inserida

**Fluxo Completo:**
```
Novo Usuário Cadastra
       ↓
handle_new_user() cria perfil
       ↓
on_profile_created_send_welcome trigger dispara
       ↓
send_welcome_email() função
       ↓
Chama edge function send-welcome-email
       ↓
Busca dados do usuário e plano
       ↓
Envia email via send-notification-email
       ↓
Email entregue ao usuário
```

### 4. **Edge Function Atualizada - send-notification-email**
📁 `supabase/functions/send-notification-email/index.ts`

Novo tipo suportado: `'welcome'`
- Renderiza template `WelcomeEmail`
- Assunto: "🎉 Bem-vindo ao CRM Auto! Sua conta está pronta"
- Loga no `email_log` como template `'welcome'`

### 5. **Hook Frontend - useNotificationEmail**
📁 `src/hooks/useNotificationEmail.ts`

Novo método: `sendWelcomeEmail()`
- Permite envio manual de emails de boas-vindas (se necessário)
- Interface typescript `WelcomeEmailData`
- Feedback via toast

## ⚙️ Configuração

### Pré-requisito: Extensão pg_net

O trigger usa `pg_net.http_post` para chamar a edge function. Verifique se a extensão está habilitada:

```sql
-- Verificar se pg_net está habilitado
SELECT * FROM pg_extension WHERE extname = 'pg_net';

-- Se não estiver, habilitar:
CREATE EXTENSION IF NOT EXISTS pg_net;
```

### Verificar Triggers e Funções

```sql
-- Listar triggers na tabela profiles
SELECT * FROM pg_trigger 
WHERE tgrelid = 'public.profiles'::regclass;

-- Ver detalhes da função
\df public.send_welcome_email

-- Ver código da função
SELECT prosrc FROM pg_proc 
WHERE proname = 'send_welcome_email';
```

## 🧪 Testando o Sistema

### 1. Teste Manual via Edge Function

```bash
curl -X POST \
  https://lfsoxururyqknnjhrzxu.supabase.co/functions/v1/send-welcome-email \
  -H "Content-Type: application/json" \
  -d '{"userId": "seu-user-id-aqui"}'
```

### 2. Teste Criando Novo Usuário

1. **Cadastre um novo usuário** na página `/auth`
2. **Verifique os logs:**
   - Console do navegador
   - Logs da edge function `send-welcome-email`
   - Logs da edge function `send-notification-email`
   - Tabela `email_log`

3. **Verifique o email:**
   - Caixa de entrada do email cadastrado
   - Se não chegou, verifique spam

### 3. Simular Cadastro no Banco

```sql
-- 1. Criar usuário de teste (se necessário)
-- Faça isso via interface do Supabase Auth

-- 2. Buscar user_id do usuário teste
SELECT id, email FROM auth.users 
WHERE email = 'teste@example.com';

-- 3. Criar perfil (dispara trigger automaticamente)
INSERT INTO public.profiles (user_id, full_name)
VALUES ('user-id-aqui', 'João Teste');

-- 4. Verificar se email foi registrado
SELECT * FROM email_log 
WHERE recipient = 'teste@example.com'
AND template = 'welcome'
ORDER BY sent_at DESC;
```

## 📊 Monitoramento

### 1. Logs da Edge Function send-welcome-email
🔗 [Ver Logs](https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/functions/send-welcome-email/logs)

### 2. Logs da Edge Function send-notification-email
🔗 [Ver Logs](https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/functions/send-notification-email/logs)

### 3. Verificar Emails Enviados

```sql
-- Emails de boas-vindas enviados hoje
SELECT 
  recipient,
  subject,
  status,
  sent_at,
  error_message
FROM email_log 
WHERE template = 'welcome'
  AND DATE(sent_at) = CURRENT_DATE
ORDER BY sent_at DESC;

-- Estatísticas de boas-vindas (últimos 30 dias)
SELECT 
  DATE(sent_at) as data,
  COUNT(*) as total_enviados,
  COUNT(*) FILTER (WHERE status = 'sent') as sucesso,
  COUNT(*) FILTER (WHERE status != 'sent') as falhas
FROM email_log 
WHERE template = 'welcome'
  AND sent_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(sent_at)
ORDER BY data DESC;
```

### 4. Verificar Chamadas do Trigger

```sql
-- Se pg_net armazena logs (depende da configuração)
-- Consultar histórico de chamadas HTTP
SELECT * FROM net.http_request_queue
WHERE url LIKE '%send-welcome-email%'
ORDER BY id DESC
LIMIT 10;
```

## 🎨 Personalização do Template

### Alterar Cores do Plano

Edite `welcome-email.tsx`:

```typescript
const planBox = {
  backgroundColor: '#f0f7ff',  // Cor de fundo
  border: '2px solid #3b82f6', // Cor da borda
};
```

### Adicionar Mais Passos

```typescript
<Text style={stepItem}>
  <strong>6. Configure integrações</strong><br />
  Conecte WhatsApp e outras ferramentas externas.
</Text>
```

### Alterar Mensagem para Plano Gratuito

```typescript
{planName === 'free' && (
  <Section style={upgradeBox}>
    <Text style={upgradeText}>
      💎 Sua mensagem customizada aqui
    </Text>
  </Section>
)}
```

## 🔧 Troubleshooting

### Email não está sendo enviado

**1. Verificar se trigger está ativo:**
```sql
SELECT * FROM pg_trigger 
WHERE tgrelid = 'public.profiles'::regclass
  AND tgname = 'on_profile_created_send_welcome';
```

**2. Verificar se pg_net está funcionando:**
```sql
-- Testar chamada HTTP direta
SELECT net.http_post(
  url := 'https://httpbin.org/post',
  body := '{"test": true}'::jsonb
);
```

**3. Verificar logs da edge function:**
- Acesse o dashboard do Supabase
- Functions → send-welcome-email → Logs
- Procure por erros

**4. Verificar se usuário tem email:**
```sql
SELECT u.id, u.email, p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE u.id = 'user-id-problema';
```

### Email vai para spam

- Verifique se domínio está verificado no Resend
- Configure SPF, DKIM e DMARC
- Veja: https://resend.com/docs/dashboard/domains/introduction

### Erro de permissão no trigger

Se trigger falhar com erro de permissão, verifique:

```sql
-- Garantir que função tem SECURITY DEFINER
ALTER FUNCTION public.send_welcome_email() 
SECURITY DEFINER;

-- Garantir search_path correto
ALTER FUNCTION public.send_welcome_email()
SET search_path = 'public', 'pg_temp';
```

## 🚨 Importante: Cadastro não deve falhar

O trigger `send_welcome_email()` usa `PERFORM` (não `RETURN`), o que significa:
- ✅ Se email falhar, cadastro continua normalmente
- ✅ Usuário consegue acessar a plataforma mesmo se email não for enviado
- ⚠️ Email pode falhar silenciosamente - monitore logs

Para ter certeza de que emails críticos sejam enviados, considere:
1. Monitoramento ativo dos logs
2. Retry automático (implementação futura)
3. Notificação para administradores quando emails falharem

## 📝 Próximos Passos

- [ ] Verificar se pg_net está habilitado
- [ ] Testar com novo cadastro
- [ ] Validar domínio no Resend
- [ ] Monitorar logs por 1 semana
- [ ] Ajustar conteúdo do email conforme feedback
- [ ] Considerar adicionar retry automático
- [ ] Implementar dashboard de métricas de email

## 🔗 Links Úteis

- [Edge Function - send-welcome-email](https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/functions/send-welcome-email)
- [Edge Function - send-notification-email](https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/functions/send-notification-email)
- [Tabela email_log](https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/editor)
- [Resend Dashboard](https://resend.com/emails)
- [Documentação pg_net](https://github.com/supabase/pg_net)
