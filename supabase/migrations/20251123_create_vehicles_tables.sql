-- Criar tabela de clientes (partner_clients)
CREATE TABLE IF NOT EXISTS public.partner_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  cpf VARCHAR(14),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(2),
  zip_code VARCHAR(10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de veículos (vehicles)
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.partner_clients(id) ON DELETE SET NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  plate VARCHAR(20) NOT NULL,
  color VARCHAR(50),
  fuel_type VARCHAR(50),
  vin VARCHAR(50),
  engine VARCHAR(50),
  mileage INTEGER DEFAULT 0,
  notes TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(partner_id, plate)
);

-- Criar tabela de frota (partner_fleet)
CREATE TABLE IF NOT EXISTS public.partner_fleet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.partner_clients(id) ON DELETE SET NULL,
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  vehicle_snapshot JSONB,
  total_services INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  last_service_date TIMESTAMP WITH TIME ZONE,
  last_service_type VARCHAR(255),
  last_service_os VARCHAR(50),
  maintenance_status VARCHAR(50) DEFAULT 'em_dia',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(partner_id, vehicle_id)
);

-- Habilitar RLS
ALTER TABLE public.partner_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_fleet ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para partner_clients
CREATE POLICY "Parceiros podem ver seus próprios clientes"
  ON public.partner_clients FOR SELECT
  USING (auth.uid()::text = partner_id::text);

CREATE POLICY "Parceiros podem inserir clientes"
  ON public.partner_clients FOR INSERT
  WITH CHECK (auth.uid()::text = partner_id::text);

CREATE POLICY "Parceiros podem atualizar seus próprios clientes"
  ON public.partner_clients FOR UPDATE
  USING (auth.uid()::text = partner_id::text);

CREATE POLICY "Parceiros podem deletar seus próprios clientes"
  ON public.partner_clients FOR DELETE
  USING (auth.uid()::text = partner_id::text);

-- Políticas RLS para vehicles
CREATE POLICY "Parceiros podem ver seus próprios veículos"
  ON public.vehicles FOR SELECT
  USING (auth.uid()::text = partner_id::text);

CREATE POLICY "Parceiros podem inserir veículos"
  ON public.vehicles FOR INSERT
  WITH CHECK (auth.uid()::text = partner_id::text);

CREATE POLICY "Parceiros podem atualizar seus próprios veículos"
  ON public.vehicles FOR UPDATE
  USING (auth.uid()::text = partner_id::text);

CREATE POLICY "Parceiros podem deletar seus próprios veículos"
  ON public.vehicles FOR DELETE
  USING (auth.uid()::text = partner_id::text);

-- Políticas RLS para partner_fleet
CREATE POLICY "Parceiros podem ver sua própria frota"
  ON public.partner_fleet FOR SELECT
  USING (auth.uid()::text = partner_id::text);

CREATE POLICY "Parceiros podem inserir na frota"
  ON public.partner_fleet FOR INSERT
  WITH CHECK (auth.uid()::text = partner_id::text);

CREATE POLICY "Parceiros podem atualizar sua própria frota"
  ON public.partner_fleet FOR UPDATE
  USING (auth.uid()::text = partner_id::text);

CREATE POLICY "Parceiros podem deletar da frota"
  ON public.partner_fleet FOR DELETE
  USING (auth.uid()::text = partner_id::text);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_partner_clients_partner_id ON public.partner_clients(partner_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_partner_id ON public.vehicles(partner_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_client_id ON public.vehicles(client_id);
CREATE INDEX IF NOT EXISTS idx_partner_fleet_partner_id ON public.partner_fleet(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_fleet_vehicle_id ON public.partner_fleet(vehicle_id);

-- Inserir alguns clientes de exemplo para o usuário demo
INSERT INTO public.partner_clients (partner_id, name, email, phone, cpf, created_at, updated_at)
VALUES 
  ('0707e717-e9e4-4b2d-9a0c-553401c6deb5', 'João Silva', 'joao.silva@email.com', '(11) 98765-4321', '123.456.789-00', NOW(), NOW()),
  ('0707e717-e9e4-4b2d-9a0c-553401c6deb5', 'Maria Santos', 'maria.santos@email.com', '(11) 97654-3210', '987.654.321-00', NOW(), NOW()),
  ('0707e717-e9e4-4b2d-9a0c-553401c6deb5', 'Carlos Oliveira', 'carlos.oliveira@email.com', '(11) 96543-2109', '456.789.123-00', NOW(), NOW()),
  ('0707e717-e9e4-4b2d-9a0c-553401c6deb5', 'Ana Paula Costa', 'ana.costa@email.com', '(11) 95432-1098', '789.123.456-00', NOW(), NOW()),
  ('0707e717-e9e4-4b2d-9a0c-553401c6deb5', 'Roberto Ferreira', 'roberto.ferreira@email.com', '(11) 94321-0987', '321.654.987-00', NOW(), NOW()),
  ('0707e717-e9e4-4b2d-9a0c-553401c6deb5', 'Juliana Almeida', 'juliana.almeida@email.com', '(11) 93210-9876', '654.987.321-00', NOW(), NOW())
ON CONFLICT DO NOTHING;

