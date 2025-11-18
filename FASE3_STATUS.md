# ✅ FASE 3: Configuração Stripe - STATUS

## 🎯 Progresso Atual

### ✅ Concluído

1. **Cliente Supabase Real Ativado**
   - ✅ Removido sistema mock completamente
   - ✅ Ativado cliente Supabase real em `src/integrations/supabase/client.ts`
   - ✅ Removidos todos arquivos mock: `mockAuth.ts`, `mockCommunication.ts`, `mockDatabase.ts`, `mockSupabase.ts`

2. **Secrets Configurados**
   - ✅ `STRIPE_SECRET_KEY` - adicionado
   - ✅ `STRIPE_WEBHOOK_SECRET` - adicionado
   - ✅ `STRIPE_PUBLISHABLE_KEY` - já estava configurado

3. **Edge Functions Criadas**
   - ✅ `create-checkout-session` - criada e pronta
   - ✅ `create-portal-session` - criada e pronta
   - ✅ `stripe-webhook` - criada e pronta

4. **Infraestrutura**
   - ✅ Tabela `subscription_plans` criada
   - ✅ Componente `PlanSelector` implementado
   - ✅ Hook `useSubscription` criado
   - ✅ Biblioteca `@stripe/react-stripe-js` instalada

### ⏳ Pendente - Ações do Usuário

Para habilitar pagamentos reais, você precisa executar os seguintes passos manualmente:

#### 1️⃣ Criar Produtos no Stripe Dashboard

Acesse: https://dashboard.stripe.com/test/products

**Plano Básico**
- Nome: "CRM Auto - Básico"
- Preço Mensal: R$ 99,00 (intervalo: mês)
- Preço Anual: R$ 950,00 (intervalo: ano)

**Plano Profissional**
- Nome: "CRM Auto - Profissional"
- Preço Mensal: R$ 249,00 (intervalo: mês)
- Preço Anual: R$ 2.390,00 (intervalo: ano)

**Plano Enterprise**
- Nome: "CRM Auto - Enterprise"
- Preço Mensal: R$ 499,00 (intervalo: mês)
- Preço Anual: R$ 4.790,00 (intervalo: ano)

#### 2️⃣ Copiar Price IDs

Após criar cada preço, copie os Price IDs que começam com `price_...`

#### 3️⃣ Atualizar Tabela subscription_plans

Execute no SQL Editor do Supabase:

```sql
-- Atualizar plano Básico
UPDATE public.subscription_plans 
SET stripe_price_id_monthly = 'price_SEU_ID_MENSAL_BASICO',
    stripe_price_id_yearly = 'price_SEU_ID_ANUAL_BASICO'
WHERE name = 'basic';

-- Atualizar plano Profissional
UPDATE public.subscription_plans 
SET stripe_price_id_monthly = 'price_SEU_ID_MENSAL_PRO',
    stripe_price_id_yearly = 'price_SEU_ID_ANUAL_PRO'
WHERE name = 'professional';

-- Atualizar plano Enterprise
UPDATE public.subscription_plans 
SET stripe_price_id_monthly = 'price_SEU_ID_MENSAL_ENTERPRISE',
    stripe_price_id_yearly = 'price_SEU_ID_ANUAL_ENTERPRISE'
WHERE name = 'enterprise';
```

#### 4️⃣ Configurar Webhook no Stripe

1. Acesse: https://dashboard.stripe.com/test/webhooks
2. Clique em "Add endpoint"
3. URL do endpoint: `https://lfsoxururyqknnjhrzxu.supabase.co/functions/v1/stripe-webhook`
4. Eventos para ouvir:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `invoice.payment_action_required`
   - `checkout.session.completed`
   - `checkout.session.expired`

5. Copie o "Signing secret" (começa com `whsec_...`)
6. Atualize o secret `STRIPE_WEBHOOK_SECRET` no Supabase com esse valor

## 🔍 Verificação Atual

Executei query no banco e confirmei:

| Plano | Mensal | Anual | Price ID Mensal | Price ID Anual |
|-------|--------|-------|-----------------|----------------|
| Gratuito | R$ 0 | R$ 0 | ❌ null | ❌ null |
| Básico | R$ 99 | R$ 950 | ❌ null | ❌ null |
| Profissional | R$ 249 | R$ 2.390 | ❌ null | ❌ null |
| Enterprise | R$ 499 | R$ 4.790 | ❌ null | ❌ null |

## 📋 Próximos Passos Após Configuração

1. ✅ Testar checkout de plano Básico
2. ✅ Testar upgrade de plano
3. ✅ Testar webhook de pagamento
4. ✅ Verificar criação de subscription no banco

## 🚀 Para Avançar

Quando tiver os Price IDs do Stripe, me informe que atualizo automaticamente a tabela! Ou execute os comandos SQL acima diretamente no Supabase SQL Editor.

## 📚 Documentação

- Guia completo: `FASE3_STRIPE_CONFIGURACAO.md`
- Edge Functions disponíveis em: `supabase/functions/`
- Cliente Stripe: `src/lib/stripe-client.ts`
