# 📊 Relatório de Migração - Prefixo CRM nas Tabelas

**Data:** 2025-11-23  
**Objetivo:** Renomear todas as tabelas do CRM com prefixo `crm_` para evitar conflitos com o marketplace automotivo

---

## ✅ RESUMO EXECUTIVO

### **Status:** 🟡 PARCIALMENTE CONCLUÍDO

- ✅ **Código TypeScript:** 100% atualizado (19 arquivos)
- ✅ **Migration SQL:** Criada e pronta para aplicação
- ✅ **Scripts de Teste:** Atualizados
- ⏳ **Banco de Dados:** Aguardando aplicação da migration

---

## 📝 ALTERAÇÕES REALIZADAS

### 1. **Migration SQL Criada**

**Arquivo:** `supabase/migrations/20251123_rename_tables_to_crm_prefix.sql`

**Tabelas Renomeadas:**
```sql
partner_clients          → crm_clients
vehicles                 → crm_vehicles
partner_fleet            → crm_fleet
appointments             → crm_appointments
service_orders           → crm_service_orders
service_order_items      → crm_service_order_items
parts                    → crm_parts
stock_movements          → crm_stock_movements
financial_transactions   → crm_financial_transactions
email_log                → crm_email_log
whatsapp_log             → crm_whatsapp_log
chat_messages            → crm_chat_messages
```

**Total:** 12 tabelas renomeadas

---

### 2. **Código TypeScript Atualizado**

**Script Criado:** `scripts/update-table-names.cjs`

**Arquivos Modificados (19):**

#### **Hooks (16 arquivos):**
1. ✅ `src/hooks/useAppointmentsNew.ts`
2. ✅ `src/hooks/useClientMetrics.ts`
3. ✅ `src/hooks/useClients.ts`
4. ✅ `src/hooks/useClientTimeline.ts`
5. ✅ `src/hooks/useFinancialTransactionsNew.ts`
6. ✅ `src/hooks/useMetrics.ts`
7. ✅ `src/hooks/usePartsNew.ts`
8. ✅ `src/hooks/usePartsTimeline.ts`
9. ✅ `src/hooks/useRecentActivities.ts`
10. ✅ `src/hooks/useServiceOrderMetrics.ts`
11. ✅ `src/hooks/useServiceOrders.ts`
12. ✅ `src/hooks/useServiceOrderTimeline.ts`
13. ✅ `src/hooks/useStripeTransactions.ts`
14. ✅ `src/hooks/useVehicleMetrics.ts`
15. ✅ `src/hooks/useVehicles.ts`
16. ✅ `src/hooks/useVehicleTimeline.ts`

#### **Páginas (1 arquivo):**
17. ✅ `src/pages/Pagamentos.tsx`

#### **Contextos (1 arquivo):**
18. ✅ `src/contexts/CommunicationContext.tsx`

#### **Tipos (1 arquivo):**
19. ✅ `src/integrations/supabase/types.ts`

---

### 3. **Scripts Atualizados**

1. ✅ `scripts/test-db-connection.js` - Atualizado para usar tabelas `crm_*`
2. ✅ `scripts/update-table-names.cjs` - Script de atualização automática criado
3. ✅ `scripts/apply-crm-migration.js` - Script para aplicar migration (opcional)

---

### 4. **Documentação Criada**

1. ✅ `INSTRUCOES_MIGRACAO_CRM.md` - Instruções detalhadas para aplicar a migration
2. ✅ `RELATORIO_MIGRACAO_CRM_PREFIX.md` - Este relatório

---

## 🔍 EXEMPLOS DE ALTERAÇÕES

### **Antes:**
```typescript
const { data, error } = await supabase
  .from('vehicles')
  .select('*')
  .eq('partner_id', session.user.id);
```

### **Depois:**
```typescript
const { data, error } = await supabase
  .from('crm_vehicles')
  .select('*')
  .eq('partner_id', session.user.id);
```

---

## 📋 PRÓXIMOS PASSOS

### **1. Aplicar Migration no Banco de Dados** ⏳

**Opção A: SQL Editor do Supabase (RECOMENDADO)**
1. Acesse: https://app.supabase.com/project/simqszeoovjipujuxeus
2. Navegue até: **SQL Editor**
3. Copie o conteúdo de: `supabase/migrations/20251123_rename_tables_to_crm_prefix.sql`
4. Cole e execute no SQL Editor

**Opção B: Supabase CLI**
```bash
npx supabase db push
```

### **2. Testar o Sistema** ⏳

```bash
# 1. Testar conexão com banco
node scripts/test-db-connection.js

# 2. Compilar o projeto
npm run build

# 3. Iniciar servidor de desenvolvimento
npm run dev
```

### **3. Validar Funcionalidades** ⏳

- [ ] Login e autenticação
- [ ] Dashboard com métricas
- [ ] Módulo de Clientes (CRUD)
- [ ] Módulo de Veículos (CRUD)
- [ ] Módulo de Agendamentos
- [ ] Módulo de Ordens de Serviço
- [ ] Módulo de Estoque
- [ ] Módulo Financeiro

---

## ⚠️ AVISOS IMPORTANTES

1. **Backup:** Faça backup do banco de dados antes de aplicar a migration
2. **Ambiente:** Aplique primeiro em desenvolvimento, depois em produção
3. **RLS:** As políticas de Row Level Security serão mantidas automaticamente
4. **Índices:** Os índices serão renomeados automaticamente pela migration
5. **Foreign Keys:** As chaves estrangeiras serão mantidas automaticamente

---

## 🎯 BENEFÍCIOS

1. ✅ **Separação Clara:** Tabelas do CRM separadas das tabelas do Marketplace
2. ✅ **Sem Conflitos:** Evita edição acidental de tabelas erradas
3. ✅ **Organização:** Facilita identificação de tabelas por módulo
4. ✅ **Manutenção:** Simplifica futuras migrações e atualizações
5. ✅ **Escalabilidade:** Permite crescimento independente dos dois sistemas

---

## 📊 ESTATÍSTICAS

- **Tabelas Renomeadas:** 12
- **Arquivos TypeScript Modificados:** 19
- **Scripts Criados:** 3
- **Documentos Criados:** 2
- **Linhas de Código Alteradas:** ~200+

---

## 🔧 TROUBLESHOOTING

### **Erro: "relation does not exist"**
- **Causa:** Migration não aplicada no banco
- **Solução:** Execute a migration no SQL Editor

### **Erro de Compilação TypeScript**
- **Causa:** Arquivo não atualizado pelo script
- **Solução:** Procure referências antigas:
  ```bash
  grep -r "\.from('vehicles')" src/
  ```

### **Erro de RLS**
- **Causa:** Políticas RLS podem precisar ser recriadas
- **Solução:** Verifique políticas no Supabase Dashboard

---

## ✅ CONCLUSÃO

A migração de prefixo `crm_` foi preparada com sucesso. Todos os arquivos de código foram atualizados automaticamente. O próximo passo é aplicar a migration SQL no banco de dados Supabase e testar todas as funcionalidades.

**Tempo Estimado para Conclusão:** 15-30 minutos


