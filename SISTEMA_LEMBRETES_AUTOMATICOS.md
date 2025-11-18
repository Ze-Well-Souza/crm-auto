# Sistema de Lembretes Automáticos de Agendamento

## 📋 Visão Geral

Sistema automatizado que envia emails de lembrete 24 horas antes dos agendamentos usando Supabase pg_cron e Edge Functions.

## 🏗️ Arquitetura

### 1. **Campo reminder_sent**
- Adicionado à tabela `appointments`
- Tipo: `boolean`, default: `false`
- Índice criado para otimizar buscas: `idx_appointments_reminder_search`

### 2. **Template de Email**
📁 `supabase/functions/send-notification-email/_templates/appointment-reminder.tsx`

Template React Email específico para lembretes, incluindo:
- Ícone de sino 🔔 no assunto
- Ênfase em "amanhã"
- Data, horário e serviço
- Informações do veículo (se disponível)
- Valor estimado (se disponível)
- Instruções de chegada antecipada

### 3. **Edge Function de Lembretes**
📁 `supabase/functions/send-appointment-reminders/index.ts`

**Funcionalidade:**
1. Calcula a data de amanhã
2. Busca agendamentos para amanhã com `reminder_sent = false`
3. Filtra apenas status `pending` e `confirmed`
4. Para cada agendamento:
   - Busca dados do cliente e veículo
   - Envia email via `send-notification-email`
   - Marca `reminder_sent = true`
5. Retorna estatísticas (enviados, erros)

**Logs detalhados:**
- 🔔 Início do job
- 📅 Data sendo verificada
- 📧 Quantidade de lembretes a enviar
- ✅ Confirmação de envio por email
- ❌ Erros detalhados
- 🎉 Resumo final

### 4. **Hook Atualizado**
📁 `src/hooks/useNotificationEmail.ts`

Novo método: `sendAppointmentReminder()`
- Mesmo formato do `sendAppointmentConfirmation`
- Usa tipo `appointment_reminder`

### 5. **Edge Function de Email Atualizada**
📁 `supabase/functions/send-notification-email/index.ts`

- Novo tipo: `appointment_reminder`
- Renderiza template `AppointmentReminder`
- Assunto: "🔔 Lembrete: Seu agendamento é amanhã!"

## ⚙️ Configuração do pg_cron

### Passo 1: Habilitar Extensões
Execute no SQL Editor do Supabase:

```sql
-- Habilitar pg_cron (se ainda não estiver habilitado)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Habilitar pg_net para chamadas HTTP
CREATE EXTENSION IF NOT EXISTS pg_net;
```

### Passo 2: Criar o Cron Job
Execute no SQL Editor do Supabase (substitua os valores):

```sql
-- Agendar execução diária às 9h da manhã (horário do servidor)
SELECT cron.schedule(
  'send-appointment-reminders-daily',  -- Nome do job
  '0 9 * * *',                         -- Cron expression: todos os dias às 9h
  $$
  SELECT net.http_post(
    url := 'https://lfsoxururyqknnjhrzxu.supabase.co/functions/v1/send-appointment-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmc294dXJ1cnlxa25uamhyenh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NzMzMDYsImV4cCI6MjA3OTA0OTMwNn0.UjeWdWeFXkwK2OLZZqw98ruNIt_aerkWE6IjhRT6Iao'
    ),
    body := '{}'::jsonb
  ) as request_id;
  $$
);
```

**Cron Expression Explicada:**
- `0 9 * * *` = Todos os dias às 9h00
- Outros exemplos:
  - `0 8 * * *` = 8h da manhã
  - `0 20 * * *` = 8h da noite
  - `30 9 * * *` = 9h30 da manhã

### Passo 3: Verificar Jobs Agendados
```sql
-- Listar todos os cron jobs
SELECT * FROM cron.job;

-- Ver histórico de execuções
SELECT * FROM cron.job_run_details 
ORDER BY start_time DESC 
LIMIT 10;
```

### Passo 4: Remover Job (se necessário)
```sql
-- Deletar o job pelo nome
SELECT cron.unschedule('send-appointment-reminders-daily');
```

## 🧪 Testando o Sistema

### Teste Manual da Edge Function

1. **Teste via Supabase Dashboard:**
   - Vá para Functions → `send-appointment-reminders`
   - Clique em "Invoke Function"
   - Body: `{}`
   - Verifique os logs

2. **Teste via cURL:**
```bash
curl -X POST \
  https://lfsoxururyqknnjhrzxu.supabase.co/functions/v1/send-appointment-reminders \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmc294dXJ1cnlxa25uamhyenh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NzMzMDYsImV4cCI6MjA3OTA0OTMwNn0.UjeWdWeFXkwK2OLZZqw98ruNIt_aerkWE6IjhRT6Iao" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Criar Agendamento de Teste

```sql
-- Inserir agendamento para amanhã
INSERT INTO appointments (
  partner_id,
  client_id,
  scheduled_date,
  scheduled_time,
  service_type,
  description,
  status,
  reminder_sent
) VALUES (
  'seu-partner-id',
  'seu-client-id',
  (CURRENT_DATE + INTERVAL '1 day'),
  '10:00',
  'Manutenção Preventiva',
  'Troca de óleo e filtros',
  'confirmed',
  false
);
```

## 📊 Monitoramento

### 1. Logs da Edge Function
🔗 [Ver Logs - send-appointment-reminders](https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/functions/send-appointment-reminders/logs)

### 2. Logs de Email
```sql
-- Ver emails de lembrete enviados
SELECT * FROM email_log 
WHERE template = 'appointment_reminder'
ORDER BY sent_at DESC;

-- Estatísticas de lembretes
SELECT 
  DATE(sent_at) as data,
  status,
  COUNT(*) as total
FROM email_log 
WHERE template = 'appointment_reminder'
  AND sent_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(sent_at), status
ORDER BY data DESC;
```

### 3. Histórico do Cron
```sql
-- Ver execuções do cron
SELECT 
  jobid,
  runid,
  job_pid,
  start_time,
  end_time,
  status,
  return_message
FROM cron.job_run_details
WHERE jobid = (
  SELECT jobid FROM cron.job 
  WHERE jobname = 'send-appointment-reminders-daily'
)
ORDER BY start_time DESC
LIMIT 20;
```

### 4. Verificar Agendamentos sem Lembrete
```sql
-- Agendamentos de amanhã que ainda não receberam lembrete
SELECT 
  a.id,
  a.scheduled_date,
  a.scheduled_time,
  c.name as client_name,
  c.email,
  a.service_type,
  a.reminder_sent
FROM appointments a
JOIN clients c ON a.client_id = c.id
WHERE a.scheduled_date = (CURRENT_DATE + INTERVAL '1 day')
  AND a.reminder_sent = false
  AND a.status IN ('pending', 'confirmed');
```

## 🔧 Configurações

### Ajustar Horário de Envio

Edite a expressão cron:
```sql
-- Alterar para outro horário (exemplo: 20h)
SELECT cron.schedule(
  'send-appointment-reminders-daily',
  '0 20 * * *',  -- 20h em vez de 9h
  $$ ... $$
);
```

### Desabilitar Temporariamente

```sql
-- Pausar o job
SELECT cron.unschedule('send-appointment-reminders-daily');

-- Reativar depois
-- Execute novamente o SELECT cron.schedule(...)
```

## 🎯 Fluxo Completo

1. **Criação de Agendamento**
   - Cliente agenda via sistema
   - `reminder_sent = false` (padrão)
   - Email de confirmação é enviado imediatamente

2. **24h Antes (9h da manhã)**
   - pg_cron dispara a Edge Function
   - Function busca agendamentos de amanhã
   - Verifica se `reminder_sent = false`
   - Envia email de lembrete
   - Marca `reminder_sent = true`

3. **No Dia do Agendamento**
   - Cliente comparece informado
   - `reminder_sent` permanece `true`

## 🚨 Tratamento de Erros

- **Cliente sem email:** Ignora e continua com próximos
- **Erro no envio:** Loga erro, não marca como enviado, tentará novamente
- **Edge Function falha:** Cron tentará na próxima execução agendada
- **Múltiplas execuções:** Campo `reminder_sent` previne envios duplicados

## 📝 Próximos Passos

- [ ] Configurar pg_cron no Supabase
- [ ] Testar envio manual de lembretes
- [ ] Verificar timezone do servidor
- [ ] Monitorar primeira execução automática
- [ ] Ajustar horário se necessário
- [ ] Considerar adicionar lembrete de 1 hora antes (opcional)

## 🔗 Links Úteis

- [Dashboard Supabase - Cron Jobs](https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/database/extensions)
- [Edge Function Logs](https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/functions/send-appointment-reminders/logs)
- [Email Logs](https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/editor)
- [Documentação pg_cron](https://github.com/citusdata/pg_cron)
