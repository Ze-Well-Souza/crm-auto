-- =====================================================
-- SEED: 6 Clientes Fictícios para Demonstração
-- Data: 2025-01-21
-- Objetivo: Popular banco com dados variados para teste
-- =====================================================

-- IMPORTANTE: Substitua 'SEU_PARTNER_ID_AQUI' pelo ID do parceiro logado
-- Para obter o ID: SELECT id FROM auth.users WHERE email = 'seu_email@exemplo.com';

DO $$
DECLARE
  v_partner_id uuid;
  v_client_id uuid;
BEGIN
  -- Buscar o primeiro parceiro disponível (ajuste conforme necessário)
  SELECT id INTO v_partner_id FROM auth.users LIMIT 1;
  
  IF v_partner_id IS NULL THEN
    RAISE EXCEPTION 'Nenhum parceiro encontrado. Faça login primeiro.';
  END IF;

  -- ========================================
  -- CLIENTE 1: VIP - Cadastro Perfeito (Score 100%)
  -- ========================================
  INSERT INTO public.clients (
    partner_id, name, email, phone, cpf_cnpj, address, city, state, zip_code, notes,
    tags, total_spent, service_count, vehicle_count, quality_score, is_vip, is_active
  ) VALUES (
    v_partner_id,
    'Carlos Eduardo Silva',
    'carlos.silva@email.com',
    '(11) 98765-4321',
    '123.456.789-00',
    'Rua das Flores, 123',
    'São Paulo',
    'SP',
    '01234-567',
    'Cliente VIP - Sempre pontual nos pagamentos',
    ARRAY['VIP', 'Preferencial'],
    8500.00,
    15,
    2,
    100,
    true,
    true
  ) RETURNING id INTO v_client_id;
  
  RAISE NOTICE 'Cliente VIP criado: %', v_client_id;

  -- ========================================
  -- CLIENTE 2: NOVO - Cadastro Recente (Score 75%)
  -- ========================================
  INSERT INTO public.clients (
    partner_id, name, email, phone, cpf_cnpj, address, city, state, zip_code,
    tags, total_spent, service_count, vehicle_count, quality_score, is_vip, is_active,
    created_at
  ) VALUES (
    v_partner_id,
    'Ana Paula Oliveira',
    'ana.oliveira@email.com',
    '(21) 99876-5432',
    '987.654.321-00',
    'Av. Atlântica, 456',
    'Rio de Janeiro',
    'RJ',
    '22021-001',
    ARRAY['Novo'],
    0,
    0,
    1,
    75,
    false,
    true,
    NOW() - INTERVAL '3 days'
  ) RETURNING id INTO v_client_id;
  
  RAISE NOTICE 'Cliente NOVO criado: %', v_client_id;

  -- ========================================
  -- CLIENTE 3: REGULAR - Cadastro Incompleto (Score 40%)
  -- ========================================
  INSERT INTO public.clients (
    partner_id, name, email, phone,
    tags, total_spent, service_count, vehicle_count, quality_score, is_vip, is_active
  ) VALUES (
    v_partner_id,
    'João Pedro Santos',
    'joao.santos@email.com',
    '(31) 98765-1234',
    ARRAY['Regular'],
    1200.00,
    3,
    0,
    40,
    false,
    true
  ) RETURNING id INTO v_client_id;
  
  RAISE NOTICE 'Cliente REGULAR (incompleto) criado: %', v_client_id;

  -- ========================================
  -- CLIENTE 4: VIP - Alto Gasto (Score 90%)
  -- ========================================
  INSERT INTO public.clients (
    partner_id, name, email, phone, cpf_cnpj, address, city, state, zip_code, notes,
    tags, total_spent, service_count, vehicle_count, quality_score, is_vip, is_active
  ) VALUES (
    v_partner_id,
    'Maria Fernanda Costa',
    'maria.costa@email.com',
    '(41) 99123-4567',
    '456.789.123-00',
    'Rua XV de Novembro, 789',
    'Curitiba',
    'PR',
    '80020-310',
    'Possui frota de 3 veículos',
    ARRAY['VIP', 'Frota'],
    12000.00,
    8,
    3,
    90,
    true,
    true
  ) RETURNING id INTO v_client_id;
  
  RAISE NOTICE 'Cliente VIP (alto gasto) criado: %', v_client_id;

  -- ========================================
  -- CLIENTE 5: REGULAR - Sem Email (Score 55%)
  -- ========================================
  INSERT INTO public.clients (
    partner_id, name, phone, cpf_cnpj, address, city, state,
    tags, total_spent, service_count, vehicle_count, quality_score, is_vip, is_active
  ) VALUES (
    v_partner_id,
    'Roberto Almeida',
    '(51) 98234-5678',
    '789.123.456-00',
    'Rua Voluntários da Pátria, 321',
    'Porto Alegre',
    'RS',
    ARRAY['Regular'],
    800.00,
    2,
    1,
    55,
    false,
    true
  ) RETURNING id INTO v_client_id;
  
  RAISE NOTICE 'Cliente REGULAR (sem email) criado: %', v_client_id;

  -- ========================================
  -- CLIENTE 6: NOVO - Cadastro Mínimo (Score 20%)
  -- ========================================
  INSERT INTO public.clients (
    partner_id, name, phone,
    tags, total_spent, service_count, vehicle_count, quality_score, is_vip, is_active,
    created_at
  ) VALUES (
    v_partner_id,
    'Patrícia Lima',
    '(85) 99345-6789',
    ARRAY['Novo'],
    0,
    0,
    0,
    20,
    false,
    true,
    NOW() - INTERVAL '2 days'
  ) RETURNING id INTO v_client_id;
  
  RAISE NOTICE 'Cliente NOVO (cadastro mínimo) criado: %', v_client_id;

  RAISE NOTICE '✅ Seed concluído! 6 clientes criados com sucesso.';
END $$;

