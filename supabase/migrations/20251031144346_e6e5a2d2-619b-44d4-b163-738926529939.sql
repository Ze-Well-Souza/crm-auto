
-- Adicionar plano gratuito
INSERT INTO subscription_plans (
  name,
  display_name,
  description,
  price_monthly,
  price_yearly,
  max_appointments_per_month,
  max_active_clients,
  max_team_members,
  max_reports_per_month,
  features,
  is_active,
  sort_order
) VALUES (
  'gratuito',
  'Gratuito',
  'Plano gratuito para experimentar o sistema - ideal para começar',
  0.00,
  0.00,
  5,
  10,
  1,
  3,
  '{
    "crm_clients": true,
    "crm_vehicles": true,
    "crm_appointments": true,
    "crm_service_orders": false,
    "crm_parts": false,
    "crm_financial": false,
    "reports_basic": true,
    "reports_advanced": false,
    "dashboard": "basic",
    "multi_units": false,
    "api_access": false,
    "automations": false,
    "priority_support": false
  }'::jsonb,
  true,
  0
)
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  max_appointments_per_month = EXCLUDED.max_appointments_per_month,
  max_active_clients = EXCLUDED.max_active_clients,
  features = EXCLUDED.features,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();
