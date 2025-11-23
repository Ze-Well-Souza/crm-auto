-- ==========================================
-- RENOMEAR TABELAS DO CRM COM PREFIXO crm_
-- Data: 2025-11-23
-- Objetivo: Separar tabelas do CRM das tabelas do Marketplace
-- ==========================================

-- IMPORTANTE: Esta migration renomeia as tabelas principais do CRM
-- para evitar conflitos com o sistema de marketplace automotivo

BEGIN;

-- =====================================================
-- 1. RENOMEAR TABELAS PRINCIPAIS
-- =====================================================

-- Tabela de clientes do parceiro
ALTER TABLE IF EXISTS public.partner_clients RENAME TO crm_clients;

-- Tabela de veículos
ALTER TABLE IF EXISTS public.vehicles RENAME TO crm_vehicles;

-- Tabela de frota do parceiro
ALTER TABLE IF EXISTS public.partner_fleet RENAME TO crm_fleet;

-- Tabela de agendamentos
ALTER TABLE IF EXISTS public.appointments RENAME TO crm_appointments;

-- Tabela de ordens de serviço
ALTER TABLE IF EXISTS public.service_orders RENAME TO crm_service_orders;

-- Tabela de itens de ordens de serviço
ALTER TABLE IF EXISTS public.service_order_items RENAME TO crm_service_order_items;

-- Tabela de peças/estoque
ALTER TABLE IF EXISTS public.parts RENAME TO crm_parts;

-- Tabela de movimentações de estoque
ALTER TABLE IF EXISTS public.stock_movements RENAME TO crm_stock_movements;

-- Tabela de transações financeiras
ALTER TABLE IF EXISTS public.financial_transactions RENAME TO crm_financial_transactions;

-- Tabela de log de emails
ALTER TABLE IF EXISTS public.email_log RENAME TO crm_email_log;

-- Tabela de log de WhatsApp
ALTER TABLE IF EXISTS public.whatsapp_log RENAME TO crm_whatsapp_log;

-- Tabela de mensagens de chat
ALTER TABLE IF EXISTS public.chat_messages RENAME TO crm_chat_messages;

-- =====================================================
-- 2. RENOMEAR ÍNDICES (se existirem)
-- =====================================================

-- Índices de clients
ALTER INDEX IF EXISTS idx_clients_partner_id RENAME TO idx_crm_clients_partner_id;
ALTER INDEX IF EXISTS idx_clients_email RENAME TO idx_crm_clients_email;

-- Índices de vehicles
ALTER INDEX IF EXISTS idx_vehicles_partner_id RENAME TO idx_crm_vehicles_partner_id;
ALTER INDEX IF EXISTS idx_vehicles_client_id RENAME TO idx_crm_vehicles_client_id;

-- Índices de appointments
ALTER INDEX IF EXISTS idx_appointments_partner_id RENAME TO idx_crm_appointments_partner_id;
ALTER INDEX IF EXISTS idx_appointments_client_id RENAME TO idx_crm_appointments_client_id;
ALTER INDEX IF EXISTS idx_appointments_scheduled_date RENAME TO idx_crm_appointments_scheduled_date;

-- Índices de service_orders
ALTER INDEX IF EXISTS idx_service_orders_partner_id RENAME TO idx_crm_service_orders_partner_id;
ALTER INDEX IF EXISTS idx_service_orders_client_id RENAME TO idx_crm_service_orders_client_id;

-- Índices de parts
ALTER INDEX IF EXISTS idx_parts_partner_id RENAME TO idx_crm_parts_partner_id;

-- Índices de financial_transactions
ALTER INDEX IF EXISTS idx_financial_transactions_partner_id RENAME TO idx_crm_financial_transactions_partner_id;

-- =====================================================
-- 3. COMENTÁRIOS NAS TABELAS
-- =====================================================

COMMENT ON TABLE public.crm_clients IS 'Clientes cadastrados pelos parceiros no CRM';
COMMENT ON TABLE public.crm_vehicles IS 'Veículos dos clientes do CRM';
COMMENT ON TABLE public.crm_fleet IS 'Frota de veículos gerenciada pelos parceiros';
COMMENT ON TABLE public.crm_appointments IS 'Agendamentos de serviços no CRM';
COMMENT ON TABLE public.crm_service_orders IS 'Ordens de serviço do CRM';
COMMENT ON TABLE public.crm_service_order_items IS 'Itens das ordens de serviço';
COMMENT ON TABLE public.crm_parts IS 'Peças e produtos do estoque do CRM';
COMMENT ON TABLE public.crm_stock_movements IS 'Movimentações de estoque do CRM';
COMMENT ON TABLE public.crm_financial_transactions IS 'Transações financeiras do CRM';
COMMENT ON TABLE public.crm_email_log IS 'Log de emails enviados pelo CRM';
COMMENT ON TABLE public.crm_whatsapp_log IS 'Log de mensagens WhatsApp do CRM';
COMMENT ON TABLE public.crm_chat_messages IS 'Mensagens de chat do CRM';

COMMIT;

-- =====================================================
-- 4. VERIFICAÇÃO
-- =====================================================

-- Listar todas as tabelas com prefixo crm_
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'crm_%'
ORDER BY table_name;

