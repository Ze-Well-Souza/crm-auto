
-- Atualizar limites do plano gratuito para ser mais vantajoso
UPDATE subscription_plans 
SET 
  max_active_clients = 40,
  max_appointments_per_month = 40,
  max_reports_per_month = 5,
  updated_at = NOW()
WHERE name = 'gratuito';
