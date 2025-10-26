# 🧪 TESTE CRUD EM PRODUÇÃO

## Status Atual
✅ Banco de dados configurado com RLS  
✅ Hooks refatorados para Supabase  
✅ Autenticação via sessão corrigida  

---

## 🔧 PASSOS PARA TESTAR

### 1. **RECARREGAR A APLICAÇÃO**
**IMPORTANTE:** Force um reload completo para atualizar o código:
- Pressione `Ctrl + Shift + R` (Windows/Linux)
- Ou `Cmd + Shift + R` (Mac)
- Ou abra DevTools (F12) → Aba Application → Clear Storage → Clear site data

### 2. **VERIFICAR AUTENTICAÇÃO**
- Verifique se você está logado (deve aparecer "Admin" no canto superior direito)
- Se não estiver, faça login em `/auth`
- Credenciais de teste: `admin@oficina.com` / senha padrão

### 3. **TESTAR MÓDULO CLIENTES** (/clientes)

#### ✅ Teste 1: Listar Clientes
- [ ] Acesse `/clientes`
- [ ] Deve mostrar lista vazia (se for primeira vez)
- [ ] ❌ **NÃO** deve mostrar erro "Usuário não autenticado"
- [ ] ✅ Deve mostrar botão "Novo Cliente"

#### ✅ Teste 2: Criar Cliente
- [ ] Clique em "Novo Cliente"
- [ ] Preencha os campos:
  - Nome: `João Silva`
  - CPF/CNPJ: `123.456.789-00`
  - Email: `joao@teste.com`
  - Telefone: `(11) 98765-4321`
- [ ] Clique em "Salvar"
- [ ] ✅ Deve aparecer toast: "Cliente criado com sucesso"
- [ ] ✅ Cliente deve aparecer na lista imediatamente

#### ✅ Teste 3: Persistência (CRÍTICO)
- [ ] **Recarregue a página** (`F5`)
- [ ] ✅ Cliente criado ainda deve estar na lista
- [ ] ❌ Dados **NÃO** devem sumir

#### ✅ Teste 4: Verificar no Supabase
- [ ] Acesse: https://supabase.com/dashboard/project/simqszeoovjipujuxeus/editor
- [ ] Tabela `clients`
- [ ] ✅ Cliente deve estar salvo no banco
- [ ] ✅ Campo `user_id` deve estar preenchido

---

## 🐛 PROBLEMAS CONHECIDOS E SOLUÇÕES

### ❌ Erro: "Usuário não autenticado"
**Causa:** Código antigo em cache  
**Solução:** Ctrl+Shift+R para forçar reload

### ❌ Dados somem ao recarregar
**Causa:** Ainda usando mock data  
**Solução:** Verificar se hook está usando `supabase.from()`

### ❌ Erro 401 nas requisições
**Causa:** Sessão expirada  
**Solução:** Fazer logout e login novamente

### ❌ Erro: "Row level security policy"
**Causa:** RLS bloqueando acesso  
**Solução:** Verificar se `user_id` está sendo enviado no INSERT

---

## 📊 OUTROS MÓDULOS PARA TESTAR

Após validar Clientes, testar na sequência:

1. **Veículos** (`/veiculos`)
   - Criar veículo vinculado a cliente
   - Verificar join com tabela `clients`

2. **Agendamentos** (`/agendamentos`)
   - Criar agendamento com data/hora
   - Verificar status

3. **Ordens de Serviço** (`/ordens-servico`)
   - Criar OS vinculada a cliente/veículo
   - Verificar `order_number` auto-gerado

4. **Estoque** (`/estoque`)
   - Criar peça
   - Criar fornecedor
   - Verificar stock_quantity

5. **Financeiro** (`/financeiro`)
   - Criar receita
   - Criar despesa
   - Verificar cálculo de totais

---

## ✅ CRITÉRIOS DE SUCESSO

Para considerar o CRUD funcional:

- [ ] ✅ Todos os módulos carregam sem erro de autenticação
- [ ] ✅ Possível criar registros em todos os módulos
- [ ] ✅ Dados persistem após reload da página
- [ ] ✅ Dados aparecem no Supabase Dashboard
- [ ] ✅ RLS funcionando (usuário vê apenas seus dados)
- [ ] ✅ Edição e exclusão funcionam
- [ ] ✅ Joins retornam dados relacionados (ex: veículo mostra nome do cliente)

---

## 🚀 PRÓXIMOS PASSOS

Após validar CRUD básico:

1. **Etapa 3: Limpeza** - Remover duplicações e código não usado
2. **Etapa 4: Testes Avançados** - Performance, múltiplos usuários
3. **Etapa 5: Deploy** - Validar em produção real

---

**Data:** 2025-01-26  
**Status:** ⏳ Aguardando teste pelo usuário
