-- ============================================
-- SETUP AUTOMÁTICO DE USUÁRIOS DE TESTE
-- ============================================
-- 
-- Execute este script APÓS criar os usuários manualmente no Dashboard:
-- 1. admin@oficinasystem.com.br
-- 2. parceiro@teste.com.br
--
-- Este script irá automaticamente:
-- ✅ Atribuir role super_admin ao admin
-- ✅ Criar subscription gratuita para o parceiro
-- ✅ Configurar contadores
--
-- ============================================

DO $$
DECLARE
  admin_user_id UUID;
  parceiro_user_id UUID;
  plano_gratuito_id UUID;
BEGIN
  -- ============================================
  -- 1. BUSCAR UUIDs DOS USUÁRIOS
  -- ============================================
  
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@oficinasystem.com.br';
  
  SELECT id INTO parceiro_user_id
  FROM auth.users
  WHERE email = 'parceiro@teste.com.br';
  
  -- Verificar se os usuários existem
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Usuário admin@oficinasystem.com.br não encontrado! Crie-o primeiro no Dashboard.';
  END IF;
  
  IF parceiro_user_id IS NULL THEN
    RAISE EXCEPTION '❌ Usuário parceiro@teste.com.br não encontrado! Crie-o primeiro no Dashboard.';
  END IF;
  
  RAISE NOTICE '✅ Usuários encontrados no banco de dados';
  
  -- ============================================
  -- 2. CONFIGURAR ADMIN
  -- ============================================
  
  -- Atribuir role de super_admin
  INSERT INTO public.user_roles (user_id, role)
  VALUES (admin_user_id, 'super_admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RAISE NOTICE '✅ Role super_admin atribuída ao admin';
  
  -- ============================================
  -- 3. CONFIGURAR PARCEIRO COM PLANO GRATUITO
  -- ============================================
  
  -- Buscar ID do plano gratuito
  SELECT id INTO plano_gratuito_id
  FROM subscription_plans
  WHERE name = 'free'
  AND is_active = true
  LIMIT 1;
  
  IF plano_gratuito_id IS NULL THEN
    RAISE EXCEPTION '❌ Plano gratuito não encontrado! Verifique a tabela subscription_plans.';
  END IF;
  
  -- Deletar assinaturas existentes do parceiro (se houver)
  DELETE FROM partner_subscriptions
  WHERE partner_id = parceiro_user_id;
  
  -- Criar assinatura gratuita
  INSERT INTO partner_subscriptions (
    partner_id,
    plan_id,
    status,
    current_period_start,
    current_period_end,
    cancel_at_period_end,
    current_usage
  ) VALUES (
    parceiro_user_id,
    plano_gratuito_id,
    'active',
    NOW(),
    NOW() + INTERVAL '10 years', -- Plano gratuito não expira
    false,
    '{"clients": 0, "service_orders": 0, "appointments": 0, "users": 1}'::jsonb
  );
  
  RAISE NOTICE '✅ Subscription gratuita criada para o parceiro';
  
  -- ============================================
  -- 4. VERIFICAR CRIAÇÃO
  -- ============================================
  
  RAISE NOTICE '';
  RAISE NOTICE '==========================================';
  RAISE NOTICE '✅ SETUP CONCLUÍDO COM SUCESSO!';
  RAISE NOTICE '==========================================';
  RAISE NOTICE '';
  RAISE NOTICE '👤 ADMIN:';
  RAISE NOTICE '   Email: admin@oficinasystem.com.br';
  RAISE NOTICE '   Password: Admin@123456';
  RAISE NOTICE '   Role: super_admin';
  RAISE NOTICE '   Acesso: /admin';
  RAISE NOTICE '';
  RAISE NOTICE '👤 PARCEIRO:';
  RAISE NOTICE '   Email: parceiro@teste.com.br';
  RAISE NOTICE '   Password: Parceiro@123';
  RAISE NOTICE '   Plano: Gratuito';
  RAISE NOTICE '   Limites: 40 clientes, 40 agendamentos, 5 relatórios';
  RAISE NOTICE '';
  RAISE NOTICE '🧪 Próximos passos:';
  RAISE NOTICE '   1. Faça login como admin e acesse /admin';
  RAISE NOTICE '   2. Faça login como parceiro e teste os limites';
  RAISE NOTICE '   3. Teste upgrade de plano em /planos';
  RAISE NOTICE '';
  
END $$;

-- ============================================
-- QUERY DE VERIFICAÇÃO
-- ============================================

SELECT 
  u.id,
  u.email,
  COALESCE(ur.role::text, 'user') AS role,
  COALESCE(ps.status::text, 'no subscription') AS subscription_status,
  COALESCE(sp.display_name, 'N/A') AS plan_name,
  COALESCE(sp.max_clients, 0) AS max_clients,
  COALESCE(sp.max_appointments, 0) AS max_appointments,
  COALESCE((ps.current_usage->>'clients')::int, 0) AS current_clients,
  COALESCE((ps.current_usage->>'appointments')::int, 0) AS current_appointments
FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN partner_subscriptions ps ON ps.partner_id = u.id
LEFT JOIN subscription_plans sp ON sp.id = ps.plan_id
WHERE u.email IN ('admin@oficinasystem.com.br', 'parceiro@teste.com.br')
ORDER BY u.email;
