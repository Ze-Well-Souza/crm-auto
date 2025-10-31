-- Dropar a função antiga primeiro (se existir com assinaturas diferentes)
DROP FUNCTION IF EXISTS check_subscription_limit(uuid, character varying, integer);
DROP FUNCTION IF EXISTS check_subscription_limit(uuid, text, integer);

-- Criar função auxiliar para verificar limite de assinatura
CREATE OR REPLACE FUNCTION check_subscription_limit(
  p_user_id UUID,
  p_limit_type TEXT,
  p_current_count INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  v_limit INTEGER;
  v_plan_id UUID;
BEGIN
  -- Buscar assinatura ativa do usuário
  SELECT plan_id INTO v_plan_id
  FROM partner_subscriptions
  WHERE partner_id = p_user_id
    AND status = 'active'
  LIMIT 1;
  
  -- Se não tem assinatura, bloquear
  IF v_plan_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Buscar limite do plano
  CASE p_limit_type
    WHEN 'clients' THEN
      SELECT max_active_clients INTO v_limit
      FROM subscription_plans WHERE id = v_plan_id;
    WHEN 'appointments' THEN
      SELECT max_appointments_per_month INTO v_limit
      FROM subscription_plans WHERE id = v_plan_id;
    WHEN 'reports' THEN
      SELECT max_reports_per_month INTO v_limit
      FROM subscription_plans WHERE id = v_plan_id;
    ELSE
      RETURN true;
  END CASE;
  
  -- Se limite é NULL (ilimitado), permitir
  IF v_limit IS NULL THEN
    RETURN true;
  END IF;
  
  -- Verificar se está dentro do limite
  RETURN p_current_count < v_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policy para clients - verificar limite antes de inserir
DROP POLICY IF EXISTS "check_client_limit_on_insert" ON clients;
CREATE POLICY "check_client_limit_on_insert" 
ON clients FOR INSERT 
TO authenticated 
WITH CHECK (
  check_subscription_limit(
    auth.uid(), 
    'clients', 
    (SELECT COUNT(*)::INTEGER FROM clients WHERE user_id = auth.uid())
  )
);

-- RLS Policy para appointments - verificar limite antes de inserir
DROP POLICY IF EXISTS "check_appointment_limit_on_insert" ON appointments;
CREATE POLICY "check_appointment_limit_on_insert" 
ON appointments FOR INSERT 
TO authenticated 
WITH CHECK (
  check_subscription_limit(
    auth.uid(), 
    'appointments', 
    (SELECT COUNT(*)::INTEGER FROM appointments WHERE user_id = auth.uid())
  )
);

-- Habilitar RLS nas tabelas se ainda não estiver
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Garantir que políticas de SELECT existam (para não quebrar leitura)
DROP POLICY IF EXISTS "Users can view own clients" ON clients;
CREATE POLICY "Users can view own clients" 
ON clients FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own clients" ON clients;
CREATE POLICY "Users can update own clients" 
ON clients FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own clients" ON clients;
CREATE POLICY "Users can delete own clients" 
ON clients FOR DELETE 
TO authenticated 
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view own appointments" ON appointments;
CREATE POLICY "Users can view own appointments" 
ON appointments FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own appointments" ON appointments;
CREATE POLICY "Users can update own appointments" 
ON appointments FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own appointments" ON appointments;
CREATE POLICY "Users can delete own appointments" 
ON appointments FOR DELETE 
TO authenticated 
USING (user_id = auth.uid());

-- Criar tabela de audit log para rastrear tentativas de exceder limites
CREATE TABLE IF NOT EXISTS subscription_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_count INTEGER,
  limit_value INTEGER,
  plan_name TEXT,
  success BOOLEAN DEFAULT false,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS na tabela de audit
ALTER TABLE subscription_audit_log ENABLE ROW LEVEL SECURITY;

-- Permitir inserção para usuários autenticados (para log)
DROP POLICY IF EXISTS "Users can insert own audit logs" ON subscription_audit_log;
CREATE POLICY "Users can insert own audit logs" 
ON subscription_audit_log FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

-- Permitir leitura apenas dos próprios logs
DROP POLICY IF EXISTS "Users can view own audit logs" ON subscription_audit_log;
CREATE POLICY "Users can view own audit logs" 
ON subscription_audit_log FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

-- Comentários para documentação
COMMENT ON FUNCTION check_subscription_limit IS 'Verifica se o usuário pode criar mais recursos baseado no limite do plano de assinatura';
COMMENT ON TABLE subscription_audit_log IS 'Log de auditoria para rastrear uso de recursos e tentativas de exceder limites do plano';