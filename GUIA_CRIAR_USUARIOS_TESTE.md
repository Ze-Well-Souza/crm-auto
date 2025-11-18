# 🧪 Guia: Criar Usuários de Teste

## 📋 Passo a Passo

### **PASSO 1: Criar Usuários no Dashboard Supabase**

1. Acesse: [Supabase Dashboard - Users](https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/auth/users)

2. Clique em **"Add User"** (ou "Invite")

3. **Criar ADMIN:**
   - **Email:** `admin@oficinasystem.com.br`
   - **Password:** `Admin@123456`
   - ✅ **Marque:** "Auto Confirm User" (confirmar email automaticamente)
   - Clique em **"Create User"**

4. **Criar PARCEIRO:**
   - **Email:** `parceiro@teste.com.br`
   - **Password:** `Parceiro@123`
   - ✅ **Marque:** "Auto Confirm User"
   - Clique em **"Create User"**

---

### **PASSO 2: Executar Script SQL Automatizado**

Após criar os 2 usuários acima, execute o script abaixo no SQL Editor:

1. Acesse: [Supabase SQL Editor](https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/sql/new)

2. Copie e cole o conteúdo do arquivo: `SETUP_USUARIOS_TESTE.sql`

3. Clique em **"Run"**

4. O script irá automaticamente:
   - ✅ Atribuir role `super_admin` ao admin
   - ✅ Criar subscription gratuita para o parceiro
   - ✅ Configurar contadores em zero
   - ✅ Exibir confirmação dos usuários criados

---

### **PASSO 3: Verificar Criação**

Após executar o script, você verá no console do SQL Editor:

```
✅ ADMIN criado com sucesso!
   Email: admin@oficinasystem.com.br
   Role: super_admin

✅ PARCEIRO criado com sucesso!
   Email: parceiro@teste.com.br
   Plano: Gratuito
   Status: active
```

---

## 🧪 Testar Funcionalidades

### **Teste 1: Login como Admin**
1. Acesse: `/auth`
2. Login: `admin@oficinasystem.com.br` / `Admin@123456`
3. Acesse: `/admin`
4. ✅ Deve ver painel administrativo completo

### **Teste 2: Login como Parceiro**
1. Acesse: `/auth`
2. Login: `parceiro@teste.com.br` / `Parceiro@123`
3. Acesse: `/clientes`
4. Crie alguns clientes de teste
5. ✅ Verificar contadores e limites funcionando

### **Teste 3: Limites do Plano Gratuito**
1. Logado como parceiro
2. Tente criar 41 clientes
3. ✅ Deve bloquear no 41º (limite: 40)

### **Teste 4: Upgrade de Plano**
1. Logado como parceiro
2. Acesse: `/planos`
3. Selecione plano "Profissional"
4. Use cartão de teste Stripe:
   - **Número:** `4242 4242 4242 4242`
   - **CVV:** Qualquer 3 dígitos
   - **Data:** Qualquer data futura
5. ✅ Após pagamento, limites devem aumentar

---

## 🔍 Queries Úteis

### Ver todos os usuários e roles:
```sql
SELECT 
  u.id,
  u.email,
  u.created_at,
  ur.role,
  ps.status AS subscription_status,
  sp.name AS plan_name
FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN partner_subscriptions ps ON ps.partner_id = u.id
LEFT JOIN subscription_plans sp ON sp.id = ps.plan_id
ORDER BY u.created_at DESC;
```

### Ver subscription do parceiro:
```sql
SELECT 
  u.email,
  ps.status,
  sp.display_name AS plano,
  sp.max_clients,
  sp.max_appointments,
  ps.current_usage->>'clients' AS clientes_criados,
  ps.current_usage->>'appointments' AS agendamentos_criados
FROM auth.users u
JOIN partner_subscriptions ps ON ps.partner_id = u.id
JOIN subscription_plans sp ON sp.id = ps.plan_id
WHERE u.email = 'parceiro@teste.com.br';
```

---

## 🗑️ Limpar Usuários de Teste

Quando quiser remover os usuários de teste:

1. Acesse: [Users Dashboard](https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/auth/users)
2. Encontre os usuários: `admin@oficinasystem.com.br` e `parceiro@teste.com.br`
3. Clique nos três pontos (...) e selecione **"Delete user"**
4. As tabelas relacionadas (roles, subscriptions) serão deletadas automaticamente (CASCADE)

---

## ⚠️ Avisos Importantes

- ⚠️ **NÃO use estes usuários em produção!**
- ⚠️ Senhas são apenas para testes
- ⚠️ Crie usuários reais com senhas fortes para produção
- ✅ Este processo é apenas para **ambiente de desenvolvimento/teste**
