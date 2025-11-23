-- =====================================================
-- MIGRATION: MÓDULO DE VEÍCULOS COMPLETO
-- Data: 2025-11-22
-- Descrição: Adiciona campos faltantes e cria tabelas relacionadas
-- =====================================================

-- =====================================================
-- 1. ADICIONAR CAMPOS FALTANTES NA TABELA VEHICLES
-- =====================================================

-- Adicionar campos técnicos e operacionais
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS fuel_type text CHECK (fuel_type IN ('gasoline', 'ethanol', 'diesel', 'flex', 'electric', 'hybrid')),
ADD COLUMN IF NOT EXISTS mileage integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS engine text,
ADD COLUMN IF NOT EXISTS category text CHECK (category IN ('sedan', 'suv', 'hatch', 'pickup', 'van', 'motorcycle', 'truck', 'other')),
ADD COLUMN IF NOT EXISTS transmission text CHECK (transmission IN ('manual', 'automatic', 'cvt', 'automated_manual')),
ADD COLUMN IF NOT EXISTS doors integer CHECK (doors >= 2 AND doors <= 6);

-- Adicionar campos financeiros e de aquisição
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS acquisition_date date,
ADD COLUMN IF NOT EXISTS purchase_value decimal(10,2),
ADD COLUMN IF NOT EXISTS current_fipe_value decimal(10,2),
ADD COLUMN IF NOT EXISTS last_fipe_update timestamptz;

-- Adicionar campos de seguro
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS insurance_company text,
ADD COLUMN IF NOT EXISTS insurance_policy text,
ADD COLUMN IF NOT EXISTS insurance_expiry date;

-- Adicionar campos de manutenção
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS mechanical_notes text,
ADD COLUMN IF NOT EXISTS next_service_date date,
ADD COLUMN IF NOT EXISTS next_service_mileage integer,
ADD COLUMN IF NOT EXISTS last_service_date date,
ADD COLUMN IF NOT EXISTS last_service_mileage integer;

-- Adicionar campos de status
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold', 'maintenance', 'accident'));

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_vehicles_fuel_type ON public.vehicles(fuel_type);
CREATE INDEX IF NOT EXISTS idx_vehicles_category ON public.vehicles(category);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_next_service_date ON public.vehicles(next_service_date);
CREATE INDEX IF NOT EXISTS idx_vehicles_insurance_expiry ON public.vehicles(insurance_expiry);

-- =====================================================
-- 2. CRIAR TABELA PARTNER_FLEET (Gestão de Frota)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.partner_fleet (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  
  -- Snapshot de dados do veículo para busca rápida (JSONB)
  vehicle_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  
  -- Métricas de manutenção
  total_services integer DEFAULT 0,
  total_spent decimal(10,2) DEFAULT 0,
  average_service_cost decimal(10,2) DEFAULT 0,
  
  -- Status de manutenção
  maintenance_status text DEFAULT 'em_dia' CHECK (maintenance_status IN ('em_dia', 'atencao', 'atrasado')),
  days_since_last_service integer,
  
  -- Alertas e lembretes
  has_pending_alerts boolean DEFAULT false,
  alert_count integer DEFAULT 0,
  
  -- Metadados
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  
  -- Constraint única: um veículo só pode estar uma vez na frota de um parceiro
  UNIQUE(partner_id, vehicle_id)
);

-- Índices para partner_fleet
CREATE INDEX IF NOT EXISTS idx_partner_fleet_partner ON public.partner_fleet(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_fleet_client ON public.partner_fleet(client_id);
CREATE INDEX IF NOT EXISTS idx_partner_fleet_vehicle ON public.partner_fleet(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_partner_fleet_maintenance_status ON public.partner_fleet(maintenance_status);
CREATE INDEX IF NOT EXISTS idx_partner_fleet_snapshot ON public.partner_fleet USING gin(vehicle_snapshot);

-- =====================================================
-- 3. CRIAR TABELA VEHICLE_MAINTENANCE_HISTORY
-- =====================================================

CREATE TABLE IF NOT EXISTS public.vehicle_maintenance_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  partner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_order_id uuid REFERENCES public.service_orders(id) ON DELETE SET NULL,
  
  -- Dados do serviço
  service_type text NOT NULL,
  service_description text,
  mileage_at_service integer,
  service_date date NOT NULL,
  
  -- Custos
  labor_cost decimal(10,2) DEFAULT 0,
  parts_cost decimal(10,2) DEFAULT 0,
  total_cost decimal(10,2) NOT NULL,
  
  -- Mecânico responsável
  mechanic_name text,
  mechanic_notes text,
  
  -- Próxima manutenção sugerida
  next_service_suggestion text,
  next_service_mileage integer,
  next_service_date date,
  
  -- Metadados
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Índices para vehicle_maintenance_history
CREATE INDEX IF NOT EXISTS idx_maintenance_history_vehicle ON public.vehicle_maintenance_history(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_history_partner ON public.vehicle_maintenance_history(partner_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_history_date ON public.vehicle_maintenance_history(service_date DESC);
CREATE INDEX IF NOT EXISTS idx_maintenance_history_service_order ON public.vehicle_maintenance_history(service_order_id);

-- =====================================================
-- 4. CRIAR TABELA VEHICLE_PHOTOS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.vehicle_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  partner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Dados da foto
  storage_path text NOT NULL,
  file_name text NOT NULL,
  file_size integer,
  mime_type text,
  
  -- Metadados
  description text,
  is_primary boolean DEFAULT false,
  display_order integer DEFAULT 0,
  
  -- Timestamps
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Índices para vehicle_photos
CREATE INDEX IF NOT EXISTS idx_vehicle_photos_vehicle ON public.vehicle_photos(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_photos_partner ON public.vehicle_photos(partner_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_photos_primary ON public.vehicle_photos(vehicle_id, is_primary) WHERE is_primary = true;

-- =====================================================
-- 5. CRIAR TABELA VEHICLE_DOCUMENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.vehicle_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  partner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Tipo de documento
  document_type text NOT NULL CHECK (document_type IN ('crlv', 'insurance', 'invoice', 'inspection', 'other')),

  -- Dados do arquivo
  storage_path text NOT NULL,
  file_name text NOT NULL,
  file_size integer,
  mime_type text,

  -- Metadados
  description text,
  expiry_date date,

  -- Timestamps
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Índices para vehicle_documents
CREATE INDEX IF NOT EXISTS idx_vehicle_documents_vehicle ON public.vehicle_documents(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_documents_partner ON public.vehicle_documents(partner_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_documents_type ON public.vehicle_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_vehicle_documents_expiry ON public.vehicle_documents(expiry_date);

-- =====================================================
-- 6. HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.partner_fleet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_maintenance_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_documents ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 7. CRIAR POLÍTICAS RLS
-- =====================================================

-- Políticas para partner_fleet
CREATE POLICY "Parceiros podem ver sua própria frota"
  ON public.partner_fleet FOR SELECT
  USING (auth.uid() = partner_id);

CREATE POLICY "Parceiros podem inserir em sua frota"
  ON public.partner_fleet FOR INSERT
  WITH CHECK (auth.uid() = partner_id);

CREATE POLICY "Parceiros podem atualizar sua frota"
  ON public.partner_fleet FOR UPDATE
  USING (auth.uid() = partner_id);

CREATE POLICY "Parceiros podem deletar de sua frota"
  ON public.partner_fleet FOR DELETE
  USING (auth.uid() = partner_id);

-- Políticas para vehicle_maintenance_history
CREATE POLICY "Parceiros podem ver histórico de seus veículos"
  ON public.vehicle_maintenance_history FOR SELECT
  USING (auth.uid() = partner_id);

CREATE POLICY "Parceiros podem inserir histórico"
  ON public.vehicle_maintenance_history FOR INSERT
  WITH CHECK (auth.uid() = partner_id);

CREATE POLICY "Parceiros podem atualizar histórico"
  ON public.vehicle_maintenance_history FOR UPDATE
  USING (auth.uid() = partner_id);

CREATE POLICY "Parceiros podem deletar histórico"
  ON public.vehicle_maintenance_history FOR DELETE
  USING (auth.uid() = partner_id);

-- Políticas para vehicle_photos
CREATE POLICY "Parceiros podem ver fotos de seus veículos"
  ON public.vehicle_photos FOR SELECT
  USING (auth.uid() = partner_id);

CREATE POLICY "Parceiros podem inserir fotos"
  ON public.vehicle_photos FOR INSERT
  WITH CHECK (auth.uid() = partner_id);

CREATE POLICY "Parceiros podem atualizar fotos"
  ON public.vehicle_photos FOR UPDATE
  USING (auth.uid() = partner_id);

CREATE POLICY "Parceiros podem deletar fotos"
  ON public.vehicle_photos FOR DELETE
  USING (auth.uid() = partner_id);

-- Políticas para vehicle_documents
CREATE POLICY "Parceiros podem ver documentos de seus veículos"
  ON public.vehicle_documents FOR SELECT
  USING (auth.uid() = partner_id);

CREATE POLICY "Parceiros podem inserir documentos"
  ON public.vehicle_documents FOR INSERT
  WITH CHECK (auth.uid() = partner_id);

CREATE POLICY "Parceiros podem atualizar documentos"
  ON public.vehicle_documents FOR UPDATE
  USING (auth.uid() = partner_id);

CREATE POLICY "Parceiros podem deletar documentos"
  ON public.vehicle_documents FOR DELETE
  USING (auth.uid() = partner_id);

-- =====================================================
-- 8. CRIAR TRIGGERS PARA UPDATED_AT
-- =====================================================

-- Trigger para partner_fleet
CREATE OR REPLACE FUNCTION update_partner_fleet_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_partner_fleet_updated_at
  BEFORE UPDATE ON public.partner_fleet
  FOR EACH ROW
  EXECUTE FUNCTION update_partner_fleet_updated_at();

-- Trigger para vehicle_maintenance_history
CREATE OR REPLACE FUNCTION update_vehicle_maintenance_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_vehicle_maintenance_history_updated_at
  BEFORE UPDATE ON public.vehicle_maintenance_history
  FOR EACH ROW
  EXECUTE FUNCTION update_vehicle_maintenance_history_updated_at();

-- Trigger para vehicle_photos
CREATE OR REPLACE FUNCTION update_vehicle_photos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_vehicle_photos_updated_at
  BEFORE UPDATE ON public.vehicle_photos
  FOR EACH ROW
  EXECUTE FUNCTION update_vehicle_photos_updated_at();

-- Trigger para vehicle_documents
CREATE OR REPLACE FUNCTION update_vehicle_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_vehicle_documents_updated_at
  BEFORE UPDATE ON public.vehicle_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_vehicle_documents_updated_at();

-- =====================================================
-- 9. COMENTÁRIOS PARA DOCUMENTAÇÃO
-- =====================================================

COMMENT ON TABLE public.partner_fleet IS 'Gestão de frota de veículos por parceiro com métricas e snapshots';
COMMENT ON TABLE public.vehicle_maintenance_history IS 'Histórico completo de manutenções realizadas em cada veículo';
COMMENT ON TABLE public.vehicle_photos IS 'Galeria de fotos dos veículos';
COMMENT ON TABLE public.vehicle_documents IS 'Documentos digitalizados dos veículos (CRLV, seguro, etc)';

COMMENT ON COLUMN public.vehicles.fuel_type IS 'Tipo de combustível: gasoline, ethanol, diesel, flex, electric, hybrid';
COMMENT ON COLUMN public.vehicles.category IS 'Categoria: sedan, suv, hatch, pickup, van, motorcycle, truck, other';
COMMENT ON COLUMN public.vehicles.mechanical_notes IS 'Observações técnicas e mecânicas do veículo';
COMMENT ON COLUMN public.vehicles.next_service_date IS 'Data sugerida para próxima manutenção';
COMMENT ON COLUMN public.vehicles.next_service_mileage IS 'Quilometragem sugerida para próxima manutenção';

COMMENT ON COLUMN public.partner_fleet.vehicle_snapshot IS 'Snapshot JSONB com dados do veículo para busca rápida (placa, modelo, marca, etc)';
COMMENT ON COLUMN public.partner_fleet.maintenance_status IS 'Status: em_dia, atencao, atrasado';

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================

