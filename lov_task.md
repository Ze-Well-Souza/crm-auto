# 🔍 AUDITORIA COMPLETA DO SISTEMA CRM - PLANO DE IMPLEMENTAÇÃO

## 📊 RESUMO EXECUTIVO

### ✅ O QUE JÁ FUNCIONA (85%)
- Autenticação Supabase + RLS
- CRUD completo: Clientes, Veículos, Ordens, Agendamentos, Financeiro, Estoque
- Sistema de Planos com Stripe (hooks, componentes, edge functions)
- Sidebar inteligente com proteção de features

### ❌ PROBLEMAS CRÍTICOS
1. **Parceiros/Pedidos**: Ainda usam mock (localStorage)
2. **Sistema de Planos**: Trial automático não funciona, campos desalinhados
3. **Comunicação**: WhatsApp/Email sem integração real
4. **Tabelas Duplicadas**: agendamentos, pagamentos, usuarios
5. **Relatórios**: Exportação apenas mock

---

## 🎯 PLANO DE IMPLEMENTAÇÃO (34-44h)

### SPRINT 1: Sistema de Planos (6-8h) 🔥 CRÍTICO
- Alinhar useSubscription.ts com campos do banco
- Criar trigger para trial automático (14 dias)
- Implementar verificação de limites em todos os hooks

### SPRINT 2: Parceiros/Pedidos Real (8-10h) 🔥 ALTA
- Criar usePartnersNew.ts com Supabase
- Criar useMarketplaceOrdersNew.ts
- Deletar hooks mock antigos

### SPRINT 3: Comunicação Real (10-12h) 🟡 MÉDIA
- Configurar SMTP para emails
- Integrar WhatsApp Business API
- Chat interno com realtime
- Push notifications

### SPRINT 4: Limpar Duplicadas (2-3h) 🟢 BAIXA
- Migrar dados se necessário
- Dropar tabelas: agendamentos, pagamentos, usuarios, sessions

### SPRINT 5: Relatórios Reais (6-8h) 🟢 BAIXA
- Implementar exportação PDF/Excel/CSV real
- Analytics com dados do Supabase

### SPRINT 6: Stripe Produção (2-3h) 🔥 CRÍTICO
- Configurar secrets live
- Criar produtos no Stripe
- Testar checkout + webhooks

---

## 🛍️ INTEGRAÇÃO COM MARKETPLACE

### Visão Geral
Este CRM é um produto white-label integrado em um marketplace maior.

### Fluxo de Cadastro
```
1. Cliente acessa: marketplace.com/produtos/crm
2. Escolhe: Plano Profissional (R$ 249/mês)
3. Clica: "Começar trial grátis"
4. Redireciona: crm.marketplace.com/auth?plan=profissional
5. Cria conta → Trigger cria trial de 14 dias automaticamente
6. Acessa dashboard com todos os módulos liberados
```

### URLs de Integração
- **Página pública**: `/pricing` (exibir planos)
- **Cadastro com plano**: `/auth?plan=profissional&source=marketplace`
- **SSO**: `/sso?token=JWT_MARKETPLACE` (a implementar)

### Parâmetros Suportados
- `plan`: basico | profissional | enterprise
- `source`: marketplace | organico | referral
- `trial`: true | false

### Trial Automático (14 dias)
```sql
-- Trigger no Supabase (a implementar)
CREATE TRIGGER on_user_created_trial
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_trial_subscription();
```

### Timeline do Trial
- **Dia 1**: Trial ativo (14 dias)
- **Dia 7**: Notificação "7 dias restantes"
- **Dia 12**: Alerta "Escolha seu plano"
- **Dia 14**: Status → 'expired', acesso bloqueado
- **Dia 15+**: Redireciona para /planos

### API para Marketplace
```typescript
// Endpoint de métricas (a implementar)
GET /api/marketplace/metrics
Headers: x-api-key: MARKETPLACE_API_KEY
Body: { user_id: "uuid" }

Response: {
  plan: "profissional",
  status: "trial",
  trial_days_remaining: 10,
  usage: {
    clients: { current: 45, limit: 1000 },
    appointments: { current: 120, limit: 500 }
  }
}
```

### Webhooks Marketplace → CRM
- `subscription.created`: Cria assinatura no CRM
- `subscription.updated`: Atualiza plano
- `subscription.cancelled`: Cancela assinatura

### Opções de Integração

**Opção A: Iframe**
```html
<iframe src="https://crm.marketplace.com?token=JWT" />
```

**Opção B: SSO (Recomendado)**
```
marketplace.com → gera JWT → crm.com/sso?token=JWT
→ valida token → login automático
```

### White-Label
```typescript
// src/config/marketplace.ts
export const marketplaceConfig = {
  name: 'Seu Marketplace',
  logo: 'https://marketplace.com/logo.png',
  primaryColor: '#3B82F6',
  supportEmail: 'suporte@marketplace.com'
};
```

---

## ✅ CHECKLIST DE INTEGRAÇÃO

### Para o Marketplace
- [ ] Adicionar CRM no catálogo
- [ ] Criar página com planos
- [ ] Configurar redirect: `/auth?plan=X`
- [ ] Implementar SSO (opcional)
- [ ] Configurar webhooks (opcional)
- [ ] Adicionar iframe no portal do cliente

### Para o CRM
- [x] Página `/pricing` pública
- [x] Página `/auth` detecta `?plan=X`
- [x] Stripe integrado
- [ ] Trigger trial automático
- [ ] Edge function SSO
- [ ] API de métricas
- [ ] Cron job expiração trials

---

## 🚀 PRÓXIMOS PASSOS

1. Implementar **Sprint 1** (Sistema de Planos)
2. Implementar **Sprint 6** (Stripe Produção)
3. Criar edge function SSO
4. Implementar cron job para trials
5. Criar API de métricas
6. Testar fluxo completo
7. Deploy em produção

**Status:** 85% completo → 100% após Sprints 1 e 6! 🎉
