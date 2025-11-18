# Sistema de Email de Reativação de Clientes Inativos

## 📋 Visão Geral

Sistema automatizado que identifica clientes sem agendamentos nos últimos 60 dias e envia emails de reativação personalizados com ofertas especiais e incentivo para retorno.

## 🏗️ Arquitetura

### 1. **Template de Email de Reativação**
📁 `supabase/functions/send-notification-email/_templates/reactivation-email.tsx`

**Conteúdo do Email:**
- 💙 Mensagem emotiva "Sentimos sua falta"
- 📅 Informações do último atendimento (data e serviço)
- ✓ Benefícios de manter manutenção em dia:
  - Segurança
  - Economia
  - Valorização do veículo
  - Desempenho
- 🎁 Oferta especial de retorno (desconto/condição especial)
- 🔧 Lista de principais serviços oferecidos
- 📞 Call-to-action claro para reagendar

**Design:**
- Layout warm e acolhedor
- Cores:
  - Azul para confiança
  - Amarelo para oferta especial
  - Verde para benefícios
- Tom amigável e não agressivo
- Foco em benefícios, não pressão

### 2. **Edge Function - send-reactivation-emails**
📁 `supabase/functions/send-reactivation-emails/index.ts`

**Funcionalidade:**
1. Calcula data de 60 dias atrás
2. Busca clientes com último agendamento há 60+ dias
3. Agrupa por cliente (considera apenas último agendamento)
4. Filtra clientes com email
5. Verifica se já recebeu email de reativação nos últimos 60 dias
6. Busca nome do parceiro (oficina)
7. Envia email personalizado
8. Registra envio no `email_log`

**Query de Clientes Inativos:**
```sql
-- Busca appointments de mais de 60 dias atrás
-- Agrupa por cliente
-- Pega o mais recente de cada cliente
-- Filtra apenas com email
```

**Prevenção de Spam:**
- ✅ Não envia se cliente já recebeu nos últimos 60 dias
- ✅ Um email por cliente mesmo com múltiplos appointments
- ✅ Considera apenas último agendamento de cada cliente

**Logs Detalhados:**
- 📧 Início do job
- 📅 Data de corte (60 dias atrás)
- 📊 Quantidade de clientes inativos encontrados
- ⏭️ Clientes ignorados (já receberam email recentemente)
- ✅ Confirmação de envio por email
- ❌ Erros detalhados
- 🎉 Resumo final (enviados vs erros)

### 3. **Edge Function Atualizada - send-notification-email**
📁 `supabase/functions/send-notification-email/index.ts`

Novo tipo suportado: `'reactivation'`
- Renderiza template `ReactivationEmail`
- Assunto: "💙 Sentimos sua falta! Que tal voltar?"
- Loga no `email_log` como template `'reactivation'`

### 4. **Hook Frontend - useNotificationEmail**
📁 `src/hooks/useNotificationEmail.ts`

Novo método: `sendReactivationEmail()`
- Interface: `ReactivationEmailData`
- Permite envio manual de emails de reativação
- Útil para testar ou enviar para cliente específico

**Interface:**
```typescript
interface ReactivationEmailData {
  clientName: string;
  daysSinceLastAppointment: number;
  lastAppointmentDate: string;
  lastServiceType?: string;
  partnerName?: string;
}
```

## ⚙️ Configuração do pg_cron

### Passo 1: Habilitar Extensões (se ainda não estiverem)

```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
```

### Passo 2: Criar o Cron Job

Execute no SQL Editor do Supabase:

```sql
-- Executar semanalmente às segundas-feiras às 10h
SELECT cron.schedule(
  'send-reactivation-emails-weekly',
  '0 10 * * 1',  -- Toda segunda-feira às 10h
  $$
  SELECT net.http_post(
    url := 'https://lfsoxururyqknnjhrzxu.supabase.co/functions/v1/send-reactivation-emails',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxmc294dXJ1cnlxa25uamhyenh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NzMzMDYsImV4cCI6MjA3OTA0OTMwNn0.UjeWdWeFXkwK2OLZZqw98ruNIt_aerkWE6IjhRT6Iao'
    ),
    body := '{}'::jsonb
  ) as request_id;
  $$
);
```

**Frequências Recomendadas:**

```sql
-- OPÇÃO 1: Semanal (Recomendado)
'0 10 * * 1'  -- Toda segunda às 10h

-- OPÇÃO 2: Quinzenal
'0 10 1,15 * *'  -- Dias 1 e 15 de cada mês às 10h

-- OPÇÃO 3: Mensal
'0 10 1 * *'  -- Todo dia 1º do mês às 10h

-- OPÇÃO 4: Teste diário (apenas para testes)
'0 10 * * *'  -- Todos os dias às 10h
```

**⚠️ Importante:** Não execute com muita frequência! 
- Recomendado: **Semanal ou quinzenal**
- Clientes já filtrados (não recebem se já receberam nos últimos 60 dias)
- Evite spam e desinteresse

### Passo 3: Verificar Jobs Agendados

```sql
-- Listar todos os cron jobs
SELECT * FROM cron.job;

-- Ver histórico de execuções
SELECT * FROM cron.job_run_details 
WHERE jobid = (
  SELECT jobid FROM cron.job 
  WHERE jobname = 'send-reactivation-emails-weekly'
)
ORDER BY start_time DESC 
LIMIT 10;
```

### Passo 4: Remover Job (se necessário)

```sql
SELECT cron.unschedule('send-reactivation-emails-weekly');
```

## 🧪 Testando o Sistema

### 1. Teste Manual da Edge Function

```bash
curl -X POST \
  https://lfsoxururyqknnjhrzxu.supabase.co/functions/v1/send-reactivation-emails \
  -H "Content-Type: application/json" \
  -d '{}'
```

### 2. Criar Cliente Inativo de Teste

```sql
-- 1. Criar cliente de teste
INSERT INTO clients (partner_id, name, email, phone)
VALUES (
  'seu-partner-id',
  'Cliente Teste Inativo',
  'seu-email@teste.com',
  '11999999999'
) RETURNING id;

-- 2. Criar agendamento antigo (70 dias atrás)
INSERT INTO appointments (
  partner_id,
  client_id,
  scheduled_date,
  scheduled_time,
  service_type,
  status
) VALUES (
  'seu-partner-id',
  'client-id-do-passo-1',
  (CURRENT_DATE - INTERVAL '70 days'),
  '10:00',
  'Revisão Completa',
  'completed'
);

-- 3. Executar função manualmente e verificar email
```

### 3. Consultar Clientes Inativos

```sql
-- Query para encontrar clientes inativos (igual à lógica da function)
WITH last_appointments AS (
  SELECT DISTINCT ON (a.client_id)
    a.client_id,
    c.name as client_name,
    c.email as client_email,
    c.partner_id,
    a.scheduled_date as last_appointment_date,
    a.service_type as last_service_type,
    CURRENT_DATE - a.scheduled_date as days_since_last
  FROM appointments a
  INNER JOIN clients c ON a.client_id = c.id
  WHERE c.email IS NOT NULL
    AND a.scheduled_date <= CURRENT_DATE - INTERVAL '60 days'
  ORDER BY a.client_id, a.scheduled_date DESC
)
SELECT 
  client_name,
  client_email,
  last_appointment_date,
  last_service_type,
  days_since_last
FROM last_appointments
WHERE days_since_last >= 60
ORDER BY days_since_last DESC;
```

## 📊 Monitoramento

### 1. Logs da Edge Function
🔗 [Ver Logs - send-reactivation-emails](https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/functions/send-reactivation-emails/logs)

### 2. Emails de Reativação Enviados

```sql
-- Emails de reativação enviados hoje
SELECT 
  recipient,
  subject,
  status,
  sent_at,
  error_message
FROM email_log 
WHERE template = 'reactivation'
  AND DATE(sent_at) = CURRENT_DATE
ORDER BY sent_at DESC;

-- Estatísticas de reativação (últimos 90 dias)
SELECT 
  DATE_TRUNC('week', sent_at) as semana,
  COUNT(*) as total_enviados,
  COUNT(*) FILTER (WHERE status = 'sent') as sucesso,
  COUNT(*) FILTER (WHERE status != 'sent') as falhas
FROM email_log 
WHERE template = 'reactivation'
  AND sent_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY DATE_TRUNC('week', sent_at)
ORDER BY semana DESC;
```

### 3. Taxa de Retorno (Clientes que Agendaram Após Email)

```sql
-- Clientes que receberam email e agendaram depois
WITH reactivation_emails AS (
  SELECT 
    recipient,
    sent_at,
    partner_id
  FROM email_log
  WHERE template = 'reactivation'
    AND status = 'sent'
    AND sent_at >= CURRENT_DATE - INTERVAL '90 days'
),
subsequent_appointments AS (
  SELECT 
    c.email,
    MIN(a.scheduled_date) as first_appointment_after
  FROM appointments a
  INNER JOIN clients c ON a.client_id = c.id
  WHERE a.scheduled_date >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY c.email
)
SELECT 
  COUNT(re.*) as total_emails_enviados,
  COUNT(sa.email) as clientes_reagendaram,
  ROUND(100.0 * COUNT(sa.email) / COUNT(re.*), 2) as taxa_retorno_pct
FROM reactivation_emails re
LEFT JOIN subsequent_appointments sa 
  ON re.recipient = sa.email 
  AND sa.first_appointment_after > re.sent_at;
```

### 4. Histórico do Cron

```sql
SELECT 
  jobid,
  runid,
  start_time,
  end_time,
  status,
  return_message
FROM cron.job_run_details
WHERE jobid = (
  SELECT jobid FROM cron.job 
  WHERE jobname = 'send-reactivation-emails-weekly'
)
ORDER BY start_time DESC
LIMIT 20;
```

## 🎨 Personalização

### Alterar Período de Inatividade

Para considerar clientes inativos após 90 dias em vez de 60:

**No código da edge function:**
```typescript
// Linha ~25
const ninetyDaysAgo = new Date();
ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

// E ajustar filtros para >= 90
```

**No cron job:**
```sql
-- Ajustar frequência se mudar período
-- Ex: 90 dias = rodar mensalmente
'0 10 1 * *'  -- Mensal
```

### Personalizar Oferta Especial

Edite `reactivation-email.tsx`:

```typescript
<Text style={offerText}>
  Para receber você de volta, estamos oferecendo 
  <strong>20% de desconto</strong> no seu próximo serviço!
</Text>
```

### Adicionar Mais Serviços

```typescript
<Text style={serviceItem}>
  <strong>Novo Serviço</strong><br />
  Descrição do serviço aqui
</Text>
```

### Alterar Tom da Mensagem

Você pode ajustar o tom de acordo com seu negócio:
- **Formal:** "Prezado cliente..."
- **Casual:** "E aí, tudo bem? Faz tempo..."
- **Promocional:** "OFERTA IMPERDÍVEL..."

## 💡 Melhores Práticas

### 1. Frequência de Envio
- ✅ **Recomendado:** Semanal ou quinzenal
- ⚠️ **Evitar:** Diário (spam)
- ❌ **Nunca:** Múltiplos emails para mesmo cliente em curto período

### 2. Segmentação
Considere criar diferentes emails para:
- Clientes premium (serviços mais caros)
- Clientes básicos (manutenção simples)
- Clientes VIP (oferta exclusiva)

### 3. A/B Testing
Teste diferentes abordagens:
- Assunto do email
- Oferta (desconto vs brinde)
- Tom da mensagem
- Horário de envio

### 4. Métricas a Acompanhar
- Taxa de abertura (Resend fornece)
- Taxa de clique (se adicionar links)
- **Taxa de retorno** (mais importante!)
- ROI do email marketing

### 5. Compliance
- ✅ Mencione opt-out no rodapé
- ✅ Respeite se cliente pedir para parar
- ✅ Não envie para clientes que cancelaram serviço
- ✅ Mantenha registro de consentimento

## 🔧 Troubleshooting

### Poucos Clientes Sendo Encontrados

```sql
-- Verificar quantos clientes têm appointments antigos
SELECT 
  COUNT(DISTINCT client_id) as total_clientes_com_appointments,
  COUNT(DISTINCT CASE 
    WHEN scheduled_date <= CURRENT_DATE - INTERVAL '60 days' 
    THEN client_id 
  END) as clientes_com_appointments_antigos
FROM appointments;

-- Verificar quantos têm email
SELECT 
  COUNT(*) as total_clientes,
  COUNT(*) FILTER (WHERE email IS NOT NULL) as com_email,
  COUNT(*) FILTER (WHERE email IS NULL) as sem_email
FROM clients;
```

### Email Não Está Sendo Enviado

1. **Verificar logs da edge function**
2. **Verificar se cliente tem email**
3. **Verificar se não foi enviado recentemente:**

```sql
SELECT * FROM email_log
WHERE recipient = 'email-do-cliente@teste.com'
  AND template = 'reactivation'
ORDER BY sent_at DESC;
```

### Taxa de Retorno Baixa

**Possíveis causas:**
- Email indo para spam (verificar domínio no Resend)
- Oferta não atrativa
- Cliente mudou de oficina
- Email genérico demais
- Horário de envio ruim

**Soluções:**
- Melhorar oferta
- Personalizar mais o email
- Testar diferentes horários
- Adicionar depoimentos/avaliações
- Incluir fotos da oficina/equipe

## 📝 Próximos Passos

- [ ] Configurar pg_cron com frequência semanal
- [ ] Testar com clientes reais
- [ ] Monitorar taxa de abertura no Resend
- [ ] Acompanhar taxa de retorno por 3 meses
- [ ] Ajustar oferta com base em resultados
- [ ] Considerar segmentação por tipo de cliente
- [ ] Implementar A/B testing de emails

## 🚀 Melhorias Futuras

- **Segmentação avançada:** Diferentes emails por perfil de cliente
- **Recomendações personalizadas:** Sugerir serviços com base em histórico
- **Integração WhatsApp:** Complementar email com mensagem
- **Dashboard de métricas:** Visualizar taxa de retorno
- **Automação de ofertas:** Gerar cupons únicos por cliente
- **Follow-up:** Segunda tentativa após X dias sem resposta

## 🔗 Links Úteis

- [Edge Function - send-reactivation-emails](https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/functions/send-reactivation-emails)
- [Edge Function - send-notification-email](https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/functions/send-notification-email)
- [Tabela email_log](https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/editor)
- [Resend Analytics](https://resend.com/emails)
- [pg_cron Documentation](https://github.com/citusdata/pg_cron)
