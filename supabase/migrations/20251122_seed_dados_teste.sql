-- =====================================================
-- SEED: DADOS DE TESTE - MÓDULO DE VEÍCULOS
-- Data: 2025-11-22
-- Descrição: Insere 3 veículos realistas para teste
-- =====================================================

-- =====================================================
-- 1. CRIAR PARCEIRO DE TESTE (se não existir)
-- =====================================================

-- Inserir um usuário de teste na tabela auth.users (simulado)
-- Nota: Em produção, isso seria feito via Supabase Auth
DO $$
DECLARE
  test_partner_id uuid := '00000000-0000-0000-0000-000000000001';
BEGIN
  -- Verificar se já existe um usuário
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = test_partner_id) THEN
    -- Inserir usuário de teste (apenas para desenvolvimento)
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      email_change_token_new,
      recovery_token
    ) VALUES (
      test_partner_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'parceiro.teste@uautos.com.br',
      crypt('senha123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Parceiro Teste"}',
      false,
      '',
      '',
      ''
    );
  END IF;
END $$;

-- =====================================================
-- 2. CRIAR CLIENTES DE TESTE
-- =====================================================

INSERT INTO public.clients (id, partner_id, name, email, phone, cpf, created_at, updated_at)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'João Silva',
    'joao.silva@email.com',
    '(11) 98765-4321',
    '123.456.789-01',
    now(),
    now()
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Maria Santos',
    'maria.santos@email.com',
    '(11) 97654-3210',
    '234.567.890-12',
    now(),
    now()
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Carlos Oliveira',
    'carlos.oliveira@email.com',
    '(11) 96543-2109',
    '345.678.901-23',
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 3. CRIAR VEÍCULOS DE TESTE
-- =====================================================

INSERT INTO public.vehicles (
  id,
  partner_id,
  client_id,
  brand,
  model,
  year,
  plate,
  color,
  chassis,
  fuel_type,
  mileage,
  engine,
  category,
  transmission,
  doors,
  mechanical_notes,
  next_service_date,
  next_service_mileage,
  is_active,
  status,
  created_at,
  updated_at
)
VALUES
  -- Veículo 1: Honda Civic 2020
  (
    '20000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Honda',
    'Civic',
    2020,
    'ABC-1234',
    'Prata',
    '9BWZZZ377VT004251',
    'flex',
    45000,
    '2.0 16V',
    'sedan',
    'automatic',
    4,
    'Veículo em excelente estado. Última revisão realizada em 15/10/2025.',
    '2026-04-15',
    50000,
    true,
    'active',
    now(),
    now()
  ),
  
  -- Veículo 2: Toyota Corolla 2023
  (
    '20000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    'Toyota',
    'Corolla',
    2023,
    'XYZ-5678',
    'Branco',
    '9BR53ZEC1P4123456',
    'hybrid',
    12000,
    '1.8 Hybrid',
    'sedan',
    'cvt',
    4,
    'Veículo híbrido, economia de combustível excelente. Próxima revisão aos 15.000 km.',
    '2026-02-20',
    15000,
    true,
    'active',
    now(),
    now()
  ),
  
  -- Veículo 3: Volkswagen Gol 2019
  (
    '20000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000003',
    'Volkswagen',
    'Gol',
    2019,
    'DEF-9012',
    'Vermelho',
    '9BWAA05U8KP042789',
    'flex',
    68000,
    '1.0 12V',
    'hatch',
    'manual',
    4,
    'Necessita troca de pastilhas de freio. Barulho no motor ao acelerar.',
    '2025-12-10',
    70000,
    true,
    'maintenance',
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 4. VINCULAR VEÍCULOS À FROTA DO PARCEIRO
-- =====================================================

INSERT INTO public.partner_fleet (
  id,
  partner_id,
  client_id,
  vehicle_id,
  vehicle_snapshot,
  total_services,
  total_spent,
  average_service_cost,
  maintenance_status,
  days_since_last_service,
  has_pending_alerts,
  alert_count,
  created_at,
  updated_at
)
VALUES
  -- Frota 1: Honda Civic (em dia)
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '{"brand": "Honda", "model": "Civic", "year": 2020, "plate": "ABC-1234", "color": "Prata", "fuel_type": "flex", "mileage": 45000}'::jsonb,
    5,
    2500.00,
    500.00,
    'em_dia',
    38,
    false,
    0,
    now(),
    now()
  ),
  
  -- Frota 2: Toyota Corolla (em dia)
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000002',
    '{"brand": "Toyota", "model": "Corolla", "year": 2023, "plate": "XYZ-5678", "color": "Branco", "fuel_type": "hybrid", "mileage": 12000}'::jsonb,
    2,
    800.00,
    400.00,
    'em_dia',
    15,
    false,
    0,
    now(),
    now()
  ),
  
  -- Frota 3: VW Gol (atenção - manutenção pendente)
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000003',
    '{"brand": "Volkswagen", "model": "Gol", "year": 2019, "plate": "DEF-9012", "color": "Vermelho", "fuel_type": "flex", "mileage": 68000}'::jsonb,
    8,
    3200.00,
    400.00,
    'atencao',
    92,
    true,
    2,
    now(),
    now()
  )
ON CONFLICT DO NOTHING;

-- =====================================================
-- FIM DO SEED
-- =====================================================

