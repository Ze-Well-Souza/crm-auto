-- ============================================
-- SCRIPT PARA CRIAR USUÁRIOS DE TESTE
-- ============================================
-- 
-- Este script cria:
-- 1. Usuário ADMIN (super_admin)
-- 2. Usuário PARCEIRO (user + plano gratuito)
--
-- ATENÇÃO: Execute este script MANUALMENTE no Supabase SQL Editor
-- NÃO execute em produção! Apenas para ambiente de desenvolvimento/teste
--
-- ============================================

-- ============================================
-- PASSO 1: CRIAR USUÁRIO ADMIN
-- ============================================

-- 1.1. Criar usuário no Auth
-- IMPORTANTE: Você precisa fazer isso via interface do Supabase:
-- Dashboard > Authentication > Users > Add User
-- Email: admin@oficinasystem.com.br
-- Password: Admin@123456
-- Confirmar email automaticamente: SIM

-- 1.2. Após criar o usuário, copie o UUID do usuário e execute:
-- (Substitua 'COLE_O_UUID_AQUI' pelo UUID real do usuário admin)

INSERT INTO public.user_roles (user_id, role)
VALUES ('COLE_O_UUID_AQUI', 'super_admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- 1.3. Verificar se foi criado:
SELECT 
  u.id,
  u.email,
  ur.role
FROM auth.users u
JOIN user_roles ur ON ur.user_id = u.id
WHERE u.email = 'admin@oficinasystem.com.br';

-- ============================================
-- PASSO 2: CRIAR USUÁRIO PARCEIRO
-- ============================================

-- 2.1. Criar usuário no Auth
-- Dashboard > Authentication > Users > Add User
-- Email: parceiro@teste.com.br
-- Password: Parceiro@123
-- Confirmar email automaticamente: SIM

-- 2.2. Após criar, o sistema automaticamente criará:
-- - Assinatura trial de 14 dias (Plano Profissional)
-- - Após trial expirar, downgrade para Plano Gratuito

-- 2.3. Se quiser forçar o usuário para Plano Gratuito imediatamente:
-- (Substitua 'COLE_O_UUID_AQUI' pelo UUID do usuário parceiro)

DO $$
DECLARE
  parceiro_user_id UUID := 'COLE_O_UUID_AQUI';
  plano_gratuito_id UUID;
BEGIN
  -- Buscar ID do plano gratuito
  SELECT id INTO plano_gratuito_id
  FROM subscription_plans
  WHERE LOWER(name) LIKE '%gratuito%'
  LIMIT 1;

  -- Deletar assinaturas existentes
  DELETE FROM partner_subscriptions
  WHERE partner_id = parceiro_user_id;

  -- Criar assinatura gratuita
  INSERT INTO partner_subscriptions (
    partner_id,
    plan_id,
    status,
    started_at,
    current_period_start,
    current_period_end,
    cancel_at_period_end,
    current_appointments_count,
    current_clients_count,
    current_reports_count
  ) VALUES (
    parceiro_user_id,
    plano_gratuito_id,
    'active',
    NOW(),
    NOW(),
    NOW() + INTERVAL '30 days',
    false,
    0,
    0,
    0
  );

  RAISE NOTICE 'Usuário parceiro criado com plano gratuito';
END $$;

-- 2.4. Verificar assinatura do parceiro:
SELECT 
  u.email,
  ps.status,
  sp.name AS plano,
  ps.current_clients_count,
  ps.current_appointments_count,
  ps.current_reports_count,
  ps.current_period_end
FROM auth.users u
JOIN partner_subscriptions ps ON ps.partner_id = u.id
JOIN subscription_plans sp ON sp.id = ps.plan_id
WHERE u.email = 'parceiro@teste.com.br';

-- ============================================
-- PASSO 3: TESTAR FUNCIONALIDADES
-- ============================================

-- 3.1. Testar limite de clientes (Gratuito = 40 clientes)
-- Login como parceiro@teste.com.br
-- Criar 40 clientes via UI
-- Tentar criar 41º → Deve bloquear ✅

-- 3.2. Testar upgrade
-- Login como parceiro@teste.com.br
-- Ir em /planos
-- Selecionar Plano Profissional
-- Usar cartão de teste do Stripe:
--   Número: 4242 4242 4242 4242
--   CVV: Qualquer 3 dígitos
--   Data: Qualquer data futura
-- Após pagamento, limites devem aumentar ✅

-- 3.3. Testar painel admin
-- Login como admin@oficinasystem.com.br
-- Acessar /admin
-- Verificar:
--   ✅ Aba Usuários: Ver todos os usuários
--   ✅ Aba Assinaturas: Ver uso de recursos
--   ✅ Aba Sistema: Health checks
--   ✅ Aba Logs: Logs de auditoria

-- 3.4. Testar toggle "Ver todos" (Admin)
-- Login como admin@oficinasystem.com.br
-- Ir em /clientes
-- Ativar toggle "Ver todos os usuários"
-- Deve mostrar clientes de TODOS os usuários ✅

-- ============================================
-- QUERIES ÚTEIS PARA TESTES
-- ============================================

-- Ver todos os usuários e suas roles
SELECT 
  u.id,
  u.email,
  u.created_at,
  COALESCE(ur.role::text, 'user') AS role
FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
ORDER BY u.created_at DESC;

-- Ver todas as assinaturas
SELECT 
  u.email,
  ps.status,
  sp.name AS plano,
  sp.max_active_clients,
  sp.max_appointments_per_month,
  ps.current_clients_count,
  ps.current_appointments_count,
  ps.current_period_start,
  ps.current_period_end,
  ps.cancel_at_period_end
FROM partner_subscriptions ps
JOIN auth.users u ON u.id = ps.partner_id
JOIN subscription_plans sp ON sp.id = ps.plan_id
ORDER BY ps.created_at DESC;

-- Forçar expiração de trial (para testes)
UPDATE partner_subscriptions
SET 
  status = 'expired',
  current_period_end = NOW() - INTERVAL '1 day'
WHERE partner_id = (
  SELECT id FROM auth.users WHERE email = 'parceiro@teste.com.br'
);

-- Resetar contadores de uso (para testes)
UPDATE partner_subscriptions
SET 
  current_clients_count = 0,
  current_appointments_count = 0,
  current_reports_count = 0
WHERE partner_id = (
  SELECT id FROM auth.users WHERE email = 'parceiro@teste.com.br'
);

-- Ver logs de auditoria
SELECT 
  sal.created_at,
  u.email,
  sal.action,
  sal.resource_type,
  sal.details
FROM subscription_audit_log sal
JOIN auth.users u ON u.id = sal.user_id::uuid
ORDER BY sal.created_at DESC
LIMIT 20;

-- ============================================
-- CENÁRIOS DE TESTE COMPLETOS
-- ============================================

-- CENÁRIO 1: Teste de Limite (Plano Gratuito)
-- 1. Login como parceiro@teste.com.br
-- 2. Criar 40 clientes via UI
-- 3. Tentar criar 41º cliente
-- 4. Resultado esperado: Toast de erro + redirect para /planos

-- CENÁRIO 2: Teste de Upgrade
-- 1. Login como parceiro@teste.com.br (Plano Gratuito)
-- 2. Criar 40 clientes (atingir limite)
-- 3. Clicar em "Ver Planos"
-- 4. Selecionar "Plano Profissional"
-- 5. Completar checkout no Stripe (cartão teste)
-- 6. Aguardar webhook processar
-- 7. Resultado esperado: Limite aumenta para 1000 clientes ✅
-- 8. Consegue criar novos clientes ✅

-- CENÁRIO 3: Teste de Downgrade
-- 1. Login como parceiro@teste.com.br (Plano Profissional)
-- 2. Criar 100 clientes
-- 3. Ir em Configurações > Assinatura
-- 4. Clicar "Gerenciar no Stripe"
-- 5. Cancelar assinatura
-- 6. Resultado esperado: cancel_at_period_end = true
-- 7. Continua usando até fim do período ✅
-- 8. Após expiração, downgrade para Gratuito
-- 9. Pode VER os 100 clientes existentes ✅
-- 10. NÃO pode criar novo cliente (limite 40) ❌

-- CENÁRIO 4: Teste Admin
-- 1. Login como admin@oficinasystem.com.br
-- 2. Acessar /admin
-- 3. Verificar todas as abas funcionando
-- 4. Promover um usuário comum para admin
-- 5. Verificar logs de auditoria registraram ação

-- CENÁRIO 5: Teste "Ver Todos"
-- 1. Login como admin@oficinasystem.com.br
-- 2. Ir em /clientes
-- 3. Ativar toggle "Ver todos os usuários"
-- 4. Resultado esperado: Ver clientes de TODOS ✅
-- 5. Desativar toggle
-- 6. Resultado esperado: Ver apenas próprios clientes

-- ============================================
-- LIMPEZA (SE NECESSÁRIO)
-- ============================================

-- Deletar usuário admin de teste
-- DELETE FROM user_roles WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@oficinasystem.com.br');
-- Depois deletar o usuário no Dashboard do Supabase

-- Deletar usuário parceiro de teste
-- DELETE FROM partner_subscriptions WHERE partner_id = (SELECT id FROM auth.users WHERE email = 'parceiro@teste.com.br');
-- Depois deletar o usuário no Dashboard do Supabase

-- ============================================
-- FIM DO SCRIPT
-- ============================================
