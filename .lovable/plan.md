

## Plano Completo de Finalização do Projeto CRM Automotivo

### Diagnóstico Atual

O projeto tem **problemas críticos** que impedem uso em produção:

1. **Módulos inteiros usando dados MOCK em vez de dados reais do Supabase**
2. **293 console.log** espalhados pelo código
3. **209 usos de Math.random()** gerando métricas falsas nos dashboards
4. **Sentry ainda importado** em 2 arquivos (removido do monitoring mas não dos hooks)
5. **Build error** no edge function por dependência `openai` não declarada
6. **Hooks usando localStorage** em vez de Supabase (usePartners, useCollectionState)
7. **Stripe completamente mockado** em `src/lib/stripe.ts`
8. **CommunicationContext** simulando envio de mensagens com setTimeout

---

### FASE 1: Corrigir Build Error e Sentry Residual
**Arquivos:** `supabase/functions/*`, `src/hooks/usePlanLimits.ts`, `src/hooks/usePayments.ts`

1. Resolver erro de build do edge function (dependência `openai` no `@supabase/functions-js`)
2. Remover `import * as Sentry from '@sentry/react'` dos 2 hooks que ainda importam
3. Substituir chamadas `Sentry.captureException` por `logger.error`

---

### FASE 2: Corrigir useServiceOrders (100% MOCK)
**Arquivo:** `src/hooks/useServiceOrders.ts`

O hook `fetchServiceOrders` está **completamente mockado** (linhas 159-163): retorna `MOCK_SERVICE_ORDERS` com dados hardcoded e um `setTimeout` de 800ms. O código real do Supabase está **comentado**.

1. Remover os 145 linhas de `MOCK_SERVICE_ORDERS`
2. Descomentar o código real do Supabase (linhas 166-192)
3. Remover `setTimeout` artificial
4. Adicionar `partner_id` filter como nos outros hooks

---

### FASE 3: Corrigir usePartners (100% localStorage)
**Arquivos:** `src/hooks/usePartners.ts`, `src/hooks/useCollectionState.ts`

O hook `usePartners` usa `useCollectionState` que persiste em **localStorage**, sem nenhuma integração com Supabase.

1. Reescrever `usePartners` para buscar/criar/atualizar/deletar em `crm_partners` via Supabase
2. Remover dependência de `useCollectionState` (que é um wrapper de localStorage)

---

### FASE 4: Remover Métricas Fake (Math.random)
**20 arquivos afetados** com `Math.random()` gerando dados falsos em dashboards

Componentes críticos:
- `ClientDashboard.tsx` — métricas fake de gastos, score, tier
- `VehicleDashboard.tsx` — métricas fake de manutenção
- `ServiceOrderDashboard.tsx` — margem, eficiência fake
- `AppointmentDashboard.tsx` — satisfação, complexidade fake
- `PartsDashboard.tsx` — vendas, turnover fake
- `PartsCard.tsx` — uso mensal, lucro fake
- `FinancialCard.tsx` — impacto fake
- `FinancialDashboard.tsx` — taxa de crescimento fake
- `ServiceOrderCard.tsx` — isOverdue() baseado em Math.random
- `InteractiveAnalyticsDashboard.tsx` — dados completos de gráficos fake
- `ClientMetrics.tsx` — VIP/premium fake
- `OrdensServico.tsx` — filtro "urgente" baseado em Math.random

Para cada componente:
1. Remover `Math.random()` e dados mock
2. Usar dados reais vindos das props ou calcular a partir de dados do banco
3. Onde dados reais não existem ainda, mostrar "—" ou 0 em vez de dados falsos

---

### FASE 5: Remover Mocks Restantes
**Arquivos diversos:**

1. `src/lib/stripe.ts` — **inteiro arquivo é mock**. Substituir por integração real usando `src/lib/stripe-client.ts` (que já existe e é real)
2. `src/hooks/useFinancialTransactionsNew.ts` — `fetchPaymentMethods` usa mock hardcoded (linhas 42-48). Criar tabela ou usar constantes tipadas
3. `src/contexts/CommunicationContext.tsx` — `sendMessage` simula envio com setTimeout. Conectar com tabela `crm_communication_logs` real
4. `src/pages/Configuracoes.tsx` — save usa `setTimeout` mock (linha 100)
5. `src/components/parts/PartsActions.tsx` — delete usa `setTimeout` mock (linha 42)
6. `src/hooks/useOfflineStorage.ts` — sync simula com setTimeout

---

### FASE 6: Remover console.log (293 instâncias em 25 arquivos)
**Todos os arquivos com console.log**

1. Remover todos os `console.log` de produção
2. Manter apenas os do `logger.ts` (que já é condicional)
3. Substituir logs informativos importantes por `logger.info/debug`

---

### FASE 7: Corrigir TODOs e Funcionalidades Incompletas
**Arquivos com TODO:**

1. `src/pages/Clientes.tsx` — `handleSchedule` e `handleNewService` apenas fazem console.log. Implementar navegação real
2. `src/pages/Relatorios.tsx` — geração de PDF usa `alert()`. Implementar export real com jspdf
3. `src/pages/OrdensServico.tsx` — `handleQuickAction` apenas faz console.log
4. `src/pages/Veiculos.tsx` — `handleQuickAction` apenas faz console.log

---

### FASE 8: Limpeza e Validação Final

1. Remover `src/lib/stripe.ts` (mock) — manter apenas `src/lib/stripe-client.ts` (real)
2. Verificar se `useCollectionState.ts` ainda é usado após reescrita de usePartners; se não, remover
3. Remover `src/hooks/useOfflineStorage.ts` se não estiver sendo usado ativamente
4. Remover `src/lib/performance.ts` (contém console.log e observers não utilizados)
5. Verificar todas as rotas funcionando com dados reais
6. Testar fluxo completo: login → dashboard → cada módulo → CRUD

---

### Resumo de Impacto

| Categoria | Qtd Arquivos | Status |
|-----------|-------------|--------|
| Hooks 100% Mock | 2 (ServiceOrders, Partners) | Reescrever |
| Métricas Math.random | 12 componentes | Limpar |
| console.log | 25 arquivos, 293 instâncias | Remover |
| Sentry residual | 2 arquivos | Remover import |
| setTimeout fake | 8 arquivos | Remover |
| TODOs não implementados | 4 páginas | Implementar |
| Arquivo mock inteiro | 1 (stripe.ts) | Deletar |
| Build error | 1 edge function | Corrigir |

### Ordem de Execução Recomendada
1. Fase 1 (Build error + Sentry) — Desbloqueio
2. Fase 2 (ServiceOrders real) — Módulo crítico
3. Fase 3 (Partners real) — Módulo crítico
4. Fase 4 (Math.random) — Integridade de dados
5. Fase 5 (Mocks restantes) — Limpeza
6. Fase 6 (console.log) — Produção
7. Fase 7 (TODOs) — Funcionalidades completas
8. Fase 8 (Validação) — Entrega final

