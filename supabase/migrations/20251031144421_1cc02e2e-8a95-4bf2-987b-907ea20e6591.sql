
-- Atualizar função para criar assinatura gratuita ao invés de trial
CREATE OR REPLACE FUNCTION create_free_subscription()
RETURNS TRIGGER AS $$
DECLARE
  free_plan_id UUID;
BEGIN
  -- Buscar plano Gratuito
  SELECT id INTO free_plan_id 
  FROM subscription_plans 
  WHERE name = 'gratuito' 
  LIMIT 1;
  
  -- Criar assinatura gratuita permanente
  INSERT INTO partner_subscriptions (
    partner_id,
    plan_id,
    status,
    started_at,
    expires_at,
    billing_cycle,
    current_appointments_count,
    current_clients_count,
    current_reports_count
  ) VALUES (
    NEW.id,
    free_plan_id,
    'active',
    NOW(),
    NULL, -- Sem expiração para plano gratuito
    'monthly',
    0, 0, 0
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS on_user_created_trial ON auth.users;

-- Criar novo trigger para plano gratuito
CREATE TRIGGER on_user_created_free_plan
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_free_subscription();
