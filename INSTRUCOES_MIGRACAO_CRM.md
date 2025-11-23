# 🔄 Instruções para Migração de Tabelas CRM

## 📋 Resumo

Este documento contém as instruções para renomear todas as tabelas do CRM com o prefixo `crm_` para evitar conflitos com as tabelas do marketplace automotivo.

---

## ✅ Arquivos Já Atualizados

### 1. **Código TypeScript (19 arquivos)**
Todos os arquivos foram atualizados automaticamente pelo script `update-table-names.cjs`:

- ✅ `src/hooks/useAppointmentsNew.ts`
- ✅ `src/hooks/useClientMetrics.ts`
- ✅ `src/hooks/useClients.ts`
- ✅ `src/hooks/useClientTimeline.ts`
- ✅ `src/hooks/useFinancialTransactionsNew.ts`
- ✅ `src/hooks/useMetrics.ts`
- ✅ `src/hooks/usePartsNew.ts`
- ✅ `src/hooks/usePartsTimeline.ts`
- ✅ `src/hooks/useRecentActivities.ts`
- ✅ `src/hooks/useServiceOrderMetrics.ts`
- ✅ `src/hooks/useServiceOrders.ts`
- ✅ `src/hooks/useServiceOrderTimeline.ts`
- ✅ `src/hooks/useStripeTransactions.ts`
- ✅ `src/hooks/useVehicleMetrics.ts`
- ✅ `src/hooks/useVehicles.ts`
- ✅ `src/hooks/useVehicleTimeline.ts`
- ✅ `src/pages/Pagamentos.tsx`
- ✅ `src/contexts/CommunicationContext.tsx`
- ✅ `src/integrations/supabase/types.ts`

### 2. **Scripts de Teste**
- ✅ `scripts/test-db-connection.js` - Atualizado para usar tabelas com prefixo `crm_`

---

## 🗄️ Aplicar Migration no Banco de Dados

### **Opção 1: SQL Editor do Supabase (RECOMENDADO)**

1. **Acesse o Supabase Dashboard:**
   - URL: https://app.supabase.com/project/simqszeoovjipujuxeus
   - Navegue até: **SQL Editor**

2. **Copie o conteúdo do arquivo:**
   - Arquivo: `supabase/migrations/20251123_rename_tables_to_crm_prefix.sql`

3. **Cole no SQL Editor e execute**

4. **Verifique se as tabelas foram renomeadas:**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
     AND table_name LIKE 'crm_%'
   ORDER BY table_name;
   ```

### **Opção 2: Supabase CLI (se configurado)**

```bash
npx supabase db push
```

---

## 📊 Tabelas Renomeadas

| Tabela Antiga | Tabela Nova |
|--------------|-------------|
| `partner_clients` | `crm_clients` |
| `vehicles` | `crm_vehicles` |
| `partner_fleet` | `crm_fleet` |
| `appointments` | `crm_appointments` |
| `service_orders` | `crm_service_orders` |
| `service_order_items` | `crm_service_order_items` |
| `parts` | `crm_parts` |
| `stock_movements` | `crm_stock_movements` |
| `financial_transactions` | `crm_financial_transactions` |
| `email_log` | `crm_email_log` |
| `whatsapp_log` | `crm_whatsapp_log` |
| `chat_messages` | `crm_chat_messages` |

---

## 🧪 Testar Após Migração

### 1. **Verificar Conexão com Banco**
```bash
node scripts/test-db-connection.js
```

### 2. **Compilar o Projeto**
```bash
npm run build
```

### 3. **Iniciar o Servidor de Desenvolvimento**
```bash
npm run dev
```

### 4. **Testar Funcionalidades**
- ✅ Login
- ✅ Dashboard
- ✅ Módulo de Clientes
- ✅ Módulo de Veículos
- ✅ Módulo de Agendamentos
- ✅ Módulo de Ordens de Serviço
- ✅ Módulo de Estoque
- ✅ Módulo Financeiro

---

## ⚠️ Importante

- **Backup:** Certifique-se de ter um backup do banco de dados antes de aplicar a migration
- **Ambiente:** Esta migration deve ser aplicada primeiro no ambiente de desenvolvimento
- **Testes:** Teste todas as funcionalidades antes de aplicar em produção
- **RLS:** As políticas de Row Level Security (RLS) serão mantidas automaticamente

---

## 🔧 Troubleshooting

### Erro: "relation does not exist"
- **Causa:** A migration ainda não foi aplicada no banco de dados
- **Solução:** Execute a migration usando o SQL Editor do Supabase

### Erro de compilação TypeScript
- **Causa:** Algum arquivo não foi atualizado pelo script
- **Solução:** Procure por referências antigas usando:
  ```bash
  grep -r "\.from('vehicles')" src/
  grep -r "\.from('clients')" src/
  ```

### Erro de RLS
- **Causa:** As políticas RLS podem precisar ser recriadas
- **Solução:** Verifique as políticas no Supabase Dashboard

---

## 📝 Próximos Passos

1. ✅ Aplicar migration no banco de dados
2. ✅ Testar todas as funcionalidades
3. ✅ Verificar se não há erros no console
4. ✅ Fazer commit das alterações
5. ✅ Documentar as mudanças no README


