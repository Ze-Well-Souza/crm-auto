# 🎯 FASE 3: CONFIGURAÇÃO COMPLETA DO STRIPE

## Status: 📋 EM PROGRESSO

Data de Início: 2025-01-18

---

## 🎯 Objetivos da Fase 3

1. ✅ Criar produtos no Stripe Dashboard
2. ✅ Configurar preços mensais e anuais
3. ✅ Copiar Price IDs do Stripe
4. ✅ Atualizar tabela `subscription_plans` com IDs
5. ✅ Configurar Webhook do Stripe
6. ✅ Testar fluxo completo de pagamento

---

## 📦 PARTE 1: CRIAR PRODUTOS NO STRIPE

### Acesse o Stripe Dashboard

**URL:** https://dashboard.stripe.com/test/products

### Criar 4 Produtos (Planos de Assinatura)

#### 🆓 **Produto 1: Plano Gratuito**
```
Nome: CRM Auto - Plano Gratuito
Descrição: Plano básico gratuito para começar

✅ Não criar preços para este plano (é gratuito)
```

#### 💼 **Produto 2: Plano Básico**
```
Nome: CRM Auto - Plano Básico
Descrição: Para oficinas pequenas

Criar 2 Preços:

1️⃣ Preço Mensal:
   - Tipo: Recorrente
   - Valor: R$ 99,00 (ou 9900 centavos)
   - Moeda: BRL
   - Período de cobrança: Mensal
   - Metadata (Opcional):
     * plan_name: basic
     * plan_type: monthly

2️⃣ Preço Anual:
   - Tipo: Recorrente
   - Valor: R$ 950,00 (ou 95000 centavos)
   - Moeda: BRL
   - Período de cobrança: Anual
   - Metadata (Opcional):
     * plan_name: basic
     * plan_type: yearly
```

#### 🚀 **Produto 3: Plano Profissional**
```
Nome: CRM Auto - Plano Profissional
Descrição: Para oficinas em crescimento

Criar 2 Preços:

1️⃣ Preço Mensal:
   - Tipo: Recorrente
   - Valor: R$ 249,00 (ou 24900 centavos)
   - Moeda: BRL
   - Período de cobrança: Mensal
   - Metadata (Opcional):
     * plan_name: professional
     * plan_type: monthly

2️⃣ Preço Anual:
   - Tipo: Recorrente
   - Valor: R$ 2.390,00 (ou 239000 centavos)
   - Moeda: BRL
   - Período de cobrança: Anual
   - Metadata (Opcional):
     * plan_name: professional
     * plan_type: yearly
```

#### 🏢 **Produto 4: Plano Enterprise**
```
Nome: CRM Auto - Plano Enterprise
Descrição: Para grandes redes de oficinas

Criar 2 Preços:

1️⃣ Preço Mensal:
   - Tipo: Recorrente
   - Valor: R$ 499,00 (ou 49900 centavos)
   - Moeda: BRL
   - Período de cobrança: Mensal
   - Metadata (Opcional):
     * plan_name: enterprise
     * plan_type: monthly

2️⃣ Preço Anual:
   - Tipo: Recorrente
   - Valor: R$ 4.790,00 (ou 479000 centavos)
   - Moeda: BRL
   - Período de cobrança: Anual
   - Metadata (Opcional):
     * plan_name: enterprise
     * plan_type: yearly
```

---

## 📝 PARTE 2: COPIAR PRICE IDs

### Onde Encontrar os Price IDs

1. Acesse cada produto no Stripe Dashboard
2. Clique no preço que você criou
3. Na URL você verá algo como: `https://dashboard.stripe.com/test/prices/price_xxxxxxxxxxxxx`
4. Copie o ID que começa com `price_`

### Template para Anotar os IDs

```
📋 PRICE IDs COPIADOS:

Plano Básico:
  - Monthly Price ID: price_________________
  - Yearly Price ID:  price_________________

Plano Profissional:
  - Monthly Price ID: price_________________
  - Yearly Price ID:  price_________________

Plano Enterprise:
  - Monthly Price ID: price_________________
  - Yearly Price ID:  price_________________
```

---

## 🗄️ PARTE 3: ATUALIZAR TABELA NO SUPABASE

### Método 1: Via Supabase SQL Editor

Acesse: https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/sql/new

**Execute o SQL abaixo substituindo os Price IDs:**

```sql
-- =====================================================
-- ATUALIZAR PRICE IDs DO STRIPE NOS PLANOS
-- =====================================================

-- Atualizar Plano Básico
UPDATE public.subscription_plans
SET 
  stripe_price_id_monthly = 'price_XXXXXXXXXXXXXXXXXX',  -- Substituir pelo ID real
  stripe_price_id_yearly = 'price_YYYYYYYYYYYYYYYYYY',   -- Substituir pelo ID real
  updated_at = now()
WHERE name = 'basic';

-- Atualizar Plano Profissional
UPDATE public.subscription_plans
SET 
  stripe_price_id_monthly = 'price_XXXXXXXXXXXXXXXXXX',  -- Substituir pelo ID real
  stripe_price_id_yearly = 'price_YYYYYYYYYYYYYYYYYY',   -- Substituir pelo ID real
  updated_at = now()
WHERE name = 'professional';

-- Atualizar Plano Enterprise
UPDATE public.subscription_plans
SET 
  stripe_price_id_monthly = 'price_XXXXXXXXXXXXXXXXXX',  -- Substituir pelo ID real
  stripe_price_id_yearly = 'price_YYYYYYYYYYYYYYYYYY',   -- Substituir pelo ID real
  updated_at = now()
WHERE name = 'enterprise';

-- Verificar se foi atualizado corretamente
SELECT 
  name, 
  display_name, 
  stripe_price_id_monthly, 
  stripe_price_id_yearly,
  price_monthly,
  price_yearly
FROM public.subscription_plans
ORDER BY sort_order;
```

### Método 2: Via Lovable (Insira os Price IDs Reais)

**Exemplo de SQL com IDs fictícios (SUBSTITUIR):**

```sql
-- Exemplo - SUBSTITUA pelos IDs reais copiados do Stripe
UPDATE public.subscription_plans
SET 
  stripe_price_id_monthly = 'price_1QRStUV2XY3Z4abc5def',
  stripe_price_id_yearly = 'price_1QRStWX2YZ3A4bcd5efg'
WHERE name = 'basic';
```

---

## 🔗 PARTE 4: CONFIGURAR WEBHOOK DO STRIPE

### 4.1. Obter URL do Webhook

Sua URL de webhook do Stripe é:
```
https://lfsoxururyqknnjhrzxu.supabase.co/functions/v1/stripe-webhook
```

### 4.2. Configurar no Stripe Dashboard

1. Acesse: https://dashboard.stripe.com/test/webhooks
2. Clique em **"Add endpoint"**
3. Cole a URL do webhook acima
4. Selecione os seguintes eventos:

```
✅ customer.subscription.created
✅ customer.subscription.updated
✅ customer.subscription.deleted
✅ invoice.paid
✅ invoice.payment_failed
✅ invoice.payment_action_required
✅ checkout.session.completed
✅ checkout.session.expired
```

5. Clique em **"Add endpoint"**

### 4.3. Copiar Webhook Secret

Após criar o endpoint:
1. Clique no endpoint criado
2. Na seção "Signing secret", clique em **"Reveal"**
3. Copie o secret que começa com `whsec_`
4. **IMPORTANTE:** Guarde esse secret, você precisará dele

---

## 🔐 PARTE 5: CONFIGURAR SECRETS NO SUPABASE

### 5.1. Secrets Necessários

Você precisa configurar 3 secrets no Supabase:

```
1. STRIPE_SECRET_KEY
   Formato: sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Onde encontrar: https://dashboard.stripe.com/test/apikeys

2. STRIPE_WEBHOOK_SECRET
   Formato: whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Você copiou isso na Parte 4.3

3. STRIPE_PUBLISHABLE_KEY (já deve existir)
   Formato: pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Onde encontrar: https://dashboard.stripe.com/test/apikeys
```

### 5.2. Como Adicionar Secrets

**Opção A: Via Supabase Dashboard**
1. Acesse: https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/settings/functions
2. Role até "Secrets"
3. Adicione cada secret:
   - Nome: `STRIPE_SECRET_KEY`
   - Valor: Cole o valor da sua chave secreta
   - Repita para `STRIPE_WEBHOOK_SECRET`

**Opção B: Via Supabase CLI**
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_xxxxx
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

---

## 🧪 PARTE 6: TESTAR CONFIGURAÇÃO

### 6.1. Verificar Planos Atualizados

Execute no SQL Editor:
```sql
SELECT 
  name,
  display_name,
  price_monthly,
  price_yearly,
  stripe_price_id_monthly,
  stripe_price_id_yearly,
  is_active
FROM public.subscription_plans
WHERE stripe_price_id_monthly IS NOT NULL
ORDER BY sort_order;
```

**Resultado Esperado:**
- 3 planos com Price IDs preenchidos (basic, professional, enterprise)
- Plano free sem Price IDs (é gratuito)

### 6.2. Testar Edge Function de Checkout

Teste se a Edge Function está funcionando:

1. Abra o console do navegador
2. Execute:
```javascript
const planId = '[UUID-DO-PLANO-BASIC]'; // Copie do resultado da query acima
const response = await fetch('https://lfsoxururyqknnjhrzxu.supabase.co/functions/v1/create-checkout-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer [SEU-TOKEN-DE-AUTENTICACAO]'
  },
  body: JSON.stringify({
    planId: planId,
    billingCycle: 'monthly'
  })
});
const data = await response.json();
console.log(data);
```

**Resultado Esperado:**
- Status 200
- Objeto com `url` apontando para Stripe Checkout

### 6.3. Testar Webhook

No Stripe Dashboard:
1. Acesse: https://dashboard.stripe.com/test/webhooks
2. Clique no seu webhook
3. Clique em "Send test webhook"
4. Selecione `customer.subscription.created`
5. Clique em "Send test webhook"

**Verificar Logs:**
- Acesse: https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/functions/stripe-webhook/logs
- Você deve ver o evento sendo processado

### 6.4. Fluxo Completo de Teste

**Cenário 1: Novo Usuário → Plano Pago**

1. ✅ Criar conta nova
2. ✅ Receber plano gratuito automaticamente
3. ✅ Clicar em "Fazer Upgrade"
4. ✅ Escolher plano (Básico/Profissional/Enterprise)
5. ✅ Redirect para Stripe Checkout
6. ✅ Usar cartão de teste: `4242 4242 4242 4242`
7. ✅ Completar pagamento
8. ✅ Webhook atualiza subscription no banco
9. ✅ Usuário é redirecionado de volta
10. ✅ Dashboard mostra novo plano ativo

**Cartões de Teste do Stripe:**
- Sucesso: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requer autenticação: `4000 0025 0000 3155`

---

## 📊 PARTE 7: MONITORAMENTO

### 7.1. Logs a Monitorar

**Edge Function Logs:**
- create-checkout-session: https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/functions/create-checkout-session/logs
- stripe-webhook: https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/functions/stripe-webhook/logs
- handle-subscription-change: https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/functions/handle-subscription-change/logs

**Stripe Dashboard:**
- Eventos: https://dashboard.stripe.com/test/events
- Pagamentos: https://dashboard.stripe.com/test/payments
- Assinaturas: https://dashboard.stripe.com/test/subscriptions
- Logs de Webhook: https://dashboard.stripe.com/test/webhooks

### 7.2. Métricas Importantes

```sql
-- Total de assinaturas por plano
SELECT 
  sp.display_name,
  ps.status,
  COUNT(*) as total
FROM public.partner_subscriptions ps
JOIN public.subscription_plans sp ON sp.id = ps.plan_id
GROUP BY sp.display_name, ps.status
ORDER BY sp.sort_order;

-- Assinaturas ativas pagas (com Stripe)
SELECT COUNT(*) as total_paid_subscriptions
FROM public.partner_subscriptions
WHERE status = 'active'
AND stripe_subscription_id IS NOT NULL;

-- Receita mensal recorrente (MRR)
SELECT 
  SUM(sp.price_monthly) as mrr_total
FROM public.partner_subscriptions ps
JOIN public.subscription_plans sp ON sp.id = ps.plan_id
WHERE ps.status = 'active'
AND ps.stripe_subscription_id IS NOT NULL;
```

---

## ✅ CHECKLIST DE CONCLUSÃO

### Configuração Stripe
- [ ] 4 produtos criados no Stripe Dashboard
- [ ] 6 preços configurados (2 por plano pago)
- [ ] Price IDs copiados e anotados
- [ ] Tabela `subscription_plans` atualizada com Price IDs
- [ ] Query de verificação executada com sucesso

### Webhook
- [ ] Endpoint webhook criado no Stripe
- [ ] 8 eventos selecionados
- [ ] Webhook secret copiado
- [ ] Secret adicionado ao Supabase

### Secrets
- [ ] `STRIPE_SECRET_KEY` configurado
- [ ] `STRIPE_WEBHOOK_SECRET` configurado
- [ ] `STRIPE_PUBLISHABLE_KEY` verificado (já existe)
- [ ] Edge Functions podem acessar secrets

### Testes
- [ ] Query de planos retorna Price IDs
- [ ] Edge Function de checkout responde corretamente
- [ ] Webhook recebe e processa eventos
- [ ] Fluxo completo: cadastro → upgrade → pagamento → ativação
- [ ] Logs sem erros críticos

---

## 🚨 PROBLEMAS COMUNS E SOLUÇÕES

### Problema 1: Edge Function retorna erro 401
**Causa:** Secret `STRIPE_SECRET_KEY` não configurado
**Solução:** Adicionar secret no Supabase Dashboard

### Problema 2: Webhook não recebe eventos
**Causa:** URL do webhook incorreta ou eventos não selecionados
**Solução:** Verificar URL e eventos no Stripe Dashboard

### Problema 3: Checkout redireciona mas não ativa plano
**Causa:** Webhook não está processando o evento `checkout.session.completed`
**Solução:** Verificar logs do webhook e garantir que o evento está selecionado

### Problema 4: Price ID não encontrado
**Causa:** Price ID copiado incorretamente ou não atualizado no banco
**Solução:** Executar query de verificação e corrigir Price IDs

### Problema 5: Erro CORS ao chamar Edge Function
**Causa:** CORS headers não configurados corretamente
**Solução:** Já configurado em `_shared/cors.ts`, verificar se está sendo usado

---

## 📚 RECURSOS ÚTEIS

### Documentação Oficial
- Stripe Checkout: https://stripe.com/docs/payments/checkout
- Stripe Webhooks: https://stripe.com/docs/webhooks
- Stripe Testing: https://stripe.com/docs/testing
- Supabase Edge Functions: https://supabase.com/docs/guides/functions

### Links Rápidos do Projeto
- Stripe Dashboard: https://dashboard.stripe.com/test
- Supabase Dashboard: https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu
- Edge Functions Logs: https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/functions

---

## 🎯 PRÓXIMOS PASSOS (FASE 4)

Após concluir a FASE 3, você estará pronto para:

1. **FASE 4: Autenticação e Onboarding**
   - Configurar templates de email
   - Personalizar fluxo de cadastro
   - Implementar wizard de onboarding
   - Criar tour do sistema

2. **FASE 5: Conectar Hooks ao Banco Real**
   - Remover todos os mocks
   - Conectar hooks ao Supabase
   - Testar CRUD completo em produção

---

## 📝 ANOTAÇÕES

Use este espaço para anotar os Price IDs e outras informações importantes:

```
Data de Configuração: _____/_____/_____

Price IDs Configurados:
- Básico Mensal: price_________________________
- Básico Anual: price_________________________
- Profissional Mensal: price_________________________
- Profissional Anual: price_________________________
- Enterprise Mensal: price_________________________
- Enterprise Anual: price_________________________

Webhook Secret: whsec_________________________

Stripe Account ID: acct_________________________

Observações:
________________________________________________
________________________________________________
________________________________________________
```

---

**Última Atualização:** 2025-01-18
**Status:** Aguardando Configuração no Stripe Dashboard
