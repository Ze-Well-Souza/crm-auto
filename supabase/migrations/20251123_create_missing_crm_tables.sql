-- ==========================================
-- CRIAR TABELAS FALTANTES DO CRM COM PREFIXO crm_
-- Data: 2025-11-23
-- Objetivo: Criar tabelas que não existiam no banco
-- ==========================================

BEGIN;

-- =====================================================
-- 1. CRIAR ENUMS NECESSÁRIOS
-- =====================================================

-- Enum para status de ordem de serviço
DO $$ BEGIN
  CREATE TYPE service_order_status AS ENUM (
    'draft',
    'pending',
    'in_progress',
    'completed',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- 2. CRIAR TABELA DE ORDENS DE SERVIÇO
-- =====================================================

CREATE TABLE IF NOT EXISTS public.crm_service_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id varchar NOT NULL,
  client_id uuid REFERENCES public.crm_clients(id) ON DELETE CASCADE NOT NULL,
  vehicle_id uuid REFERENCES public.crm_vehicles(id) ON DELETE CASCADE NOT NULL,
  appointment_id uuid REFERENCES public.crm_appointments(id) ON DELETE SET NULL,
  order_number varchar NOT NULL,
  status service_order_status NOT NULL DEFAULT 'draft',
  service_description text,
  diagnosis text,
  total_parts decimal(10,2) DEFAULT 0,
  total_labor decimal(10,2) DEFAULT 0,
  total_discount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) DEFAULT 0,
  start_date timestamptz,
  completion_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(partner_id, order_number)
);

-- =====================================================
-- 3. CRIAR TABELA DE ITENS DE ORDEM DE SERVIÇO
-- =====================================================

CREATE TABLE IF NOT EXISTS public.crm_service_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id uuid REFERENCES public.crm_service_orders(id) ON DELETE CASCADE NOT NULL,
  part_id uuid REFERENCES public.crm_parts(id) ON DELETE SET NULL,
  item_type varchar NOT NULL CHECK (item_type IN ('part', 'service')),
  description text NOT NULL,
  quantity decimal(10,2) NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL DEFAULT 0,
  discount decimal(10,2) DEFAULT 0,
  total decimal(10,2) NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- =====================================================
-- 4. CRIAR TABELA DE PEÇAS/ESTOQUE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.crm_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id varchar NOT NULL,
  code varchar NOT NULL,
  name varchar NOT NULL,
  description text,
  category varchar,
  brand varchar,
  supplier varchar,
  cost_price decimal(10,2) DEFAULT 0,
  sale_price decimal(10,2) DEFAULT 0,
  current_stock decimal(10,2) DEFAULT 0,
  min_stock decimal(10,2) DEFAULT 0,
  max_stock decimal(10,2),
  location varchar,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(partner_id, code)
);

-- =====================================================
-- 5. CRIAR TABELA DE MOVIMENTAÇÕES DE ESTOQUE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.crm_stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id varchar NOT NULL,
  part_id uuid REFERENCES public.crm_parts(id) ON DELETE CASCADE NOT NULL,
  movement_type varchar NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment')),
  quantity decimal(10,2) NOT NULL,
  unit_cost decimal(10,2),
  total_cost decimal(10,2),
  reference_type varchar,
  reference_id uuid,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  created_by varchar
);

-- =====================================================
-- 6. CRIAR TABELA DE LOG DE EMAILS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.crm_email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id varchar NOT NULL,
  recipient varchar NOT NULL,
  subject varchar NOT NULL,
  template varchar,
  status varchar NOT NULL,
  sent_at timestamptz DEFAULT now() NOT NULL,
  error_message text
);

-- =====================================================
-- 7. CRIAR TABELA DE LOG DE WHATSAPP
-- =====================================================

CREATE TABLE IF NOT EXISTS public.crm_whatsapp_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id varchar NOT NULL,
  recipient varchar NOT NULL,
  message text NOT NULL,
  status varchar NOT NULL,
  sent_at timestamptz DEFAULT now() NOT NULL,
  error_message text,
  message_id varchar
);

COMMIT;

