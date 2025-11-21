-- =====================================================
-- MIGRAÇÃO: Adicionar Métricas e Tags aos Clientes
-- Data: 2025-01-21
-- Objetivo: Suportar funcionalidades avançadas do CRM
-- =====================================================

-- 1. Adicionar campos de métricas e tags à tabela clients
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS total_spent decimal(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS service_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS vehicle_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_service_date timestamptz,
ADD COLUMN IF NOT EXISTS quality_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_vip boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- 2. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_clients_tags ON public.clients USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_clients_is_vip ON public.clients(is_vip) WHERE is_vip = true;
CREATE INDEX IF NOT EXISTS idx_clients_total_spent ON public.clients(total_spent DESC);
CREATE INDEX IF NOT EXISTS idx_clients_last_service ON public.clients(last_service_date DESC);
CREATE INDEX IF NOT EXISTS idx_clients_quality_score ON public.clients(quality_score DESC);

-- 3. Criar função para calcular qualidade dos dados do cliente
CREATE OR REPLACE FUNCTION calculate_client_quality_score(client_row public.clients)
RETURNS integer AS $$
DECLARE
  score integer := 0;
BEGIN
  -- Nome preenchido (obrigatório, não conta)
  
  -- Email preenchido (+20 pontos)
  IF client_row.email IS NOT NULL AND client_row.email != '' THEN
    score := score + 20;
  END IF;
  
  -- Telefone preenchido (+20 pontos)
  IF client_row.phone IS NOT NULL AND client_row.phone != '' THEN
    score := score + 20;
  END IF;
  
  -- CPF/CNPJ preenchido (+15 pontos)
  IF client_row.cpf_cnpj IS NOT NULL AND client_row.cpf_cnpj != '' THEN
    score := score + 15;
  END IF;
  
  -- Endereço completo (+15 pontos)
  IF client_row.address IS NOT NULL AND client_row.address != '' 
     AND client_row.city IS NOT NULL AND client_row.city != ''
     AND client_row.state IS NOT NULL AND client_row.state != '' THEN
    score := score + 15;
  END IF;
  
  -- CEP preenchido (+10 pontos)
  IF client_row.zip_code IS NOT NULL AND client_row.zip_code != '' THEN
    score := score + 10;
  END IF;
  
  -- Tem veículos cadastrados (+10 pontos)
  IF client_row.vehicle_count > 0 THEN
    score := score + 10;
  END IF;
  
  -- Tem histórico de serviços (+10 pontos)
  IF client_row.service_count > 0 THEN
    score := score + 10;
  END IF;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 4. Criar função para atualizar métricas do cliente
CREATE OR REPLACE FUNCTION update_client_metrics(client_id_param uuid)
RETURNS void AS $$
DECLARE
  v_total_spent decimal(10,2);
  v_service_count integer;
  v_vehicle_count integer;
  v_last_service_date timestamptz;
  v_quality_score integer;
  v_is_vip boolean;
  client_record public.clients;
BEGIN
  -- Buscar totais de serviços
  SELECT 
    COALESCE(SUM(total_amount), 0),
    COUNT(*)
  INTO v_total_spent, v_service_count
  FROM public.service_orders
  WHERE client_id = client_id_param
    AND status IN ('completed', 'paid');
  
  -- Buscar total de veículos
  SELECT COUNT(*)
  INTO v_vehicle_count
  FROM public.vehicles
  WHERE client_id = client_id_param;
  
  -- Buscar data do último serviço
  SELECT MAX(completed_at)
  INTO v_last_service_date
  FROM public.service_orders
  WHERE client_id = client_id_param
    AND status IN ('completed', 'paid');
  
  -- Determinar se é VIP (mais de R$ 5000 gastos OU mais de 10 serviços)
  v_is_vip := (v_total_spent >= 5000 OR v_service_count >= 10);
  
  -- Atualizar métricas
  UPDATE public.clients
  SET 
    total_spent = v_total_spent,
    service_count = v_service_count,
    vehicle_count = v_vehicle_count,
    last_service_date = v_last_service_date,
    is_vip = v_is_vip,
    updated_at = now()
  WHERE id = client_id_param
  RETURNING * INTO client_record;
  
  -- Calcular e atualizar quality score
  v_quality_score := calculate_client_quality_score(client_record);
  
  UPDATE public.clients
  SET quality_score = v_quality_score
  WHERE id = client_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Criar trigger para atualizar métricas automaticamente
CREATE OR REPLACE FUNCTION trigger_update_client_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar métricas do cliente quando uma ordem de serviço for modificada
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    PERFORM update_client_metrics(NEW.client_id);
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM update_client_metrics(OLD.client_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em service_orders
DROP TRIGGER IF EXISTS update_client_metrics_on_service_order ON public.service_orders;
CREATE TRIGGER update_client_metrics_on_service_order
  AFTER INSERT OR UPDATE OR DELETE ON public.service_orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_client_metrics();

-- Aplicar trigger em vehicles
DROP TRIGGER IF EXISTS update_client_metrics_on_vehicle ON public.vehicles;
CREATE TRIGGER update_client_metrics_on_vehicle
  AFTER INSERT OR DELETE ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_client_metrics();

-- 6. Atualizar métricas de todos os clientes existentes
DO $$
DECLARE
  client_rec RECORD;
BEGIN
  FOR client_rec IN SELECT id FROM public.clients LOOP
    PERFORM update_client_metrics(client_rec.id);
  END LOOP;
END $$;

-- 7. Comentários para documentação
COMMENT ON COLUMN public.clients.tags IS 'Tags do cliente (VIP, Novo, Recente, etc)';
COMMENT ON COLUMN public.clients.total_spent IS 'Total gasto pelo cliente em serviços';
COMMENT ON COLUMN public.clients.service_count IS 'Quantidade de serviços realizados';
COMMENT ON COLUMN public.clients.vehicle_count IS 'Quantidade de veículos cadastrados';
COMMENT ON COLUMN public.clients.last_service_date IS 'Data do último serviço realizado';
COMMENT ON COLUMN public.clients.quality_score IS 'Score de qualidade dos dados (0-100)';
COMMENT ON COLUMN public.clients.is_vip IS 'Cliente VIP (alto valor ou frequência)';
COMMENT ON COLUMN public.clients.is_active IS 'Cliente ativo no sistema';

