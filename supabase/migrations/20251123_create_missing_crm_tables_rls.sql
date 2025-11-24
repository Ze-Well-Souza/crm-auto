-- ==========================================
-- RLS E ÍNDICES PARA TABELAS CRM
-- Data: 2025-11-23
-- ==========================================

BEGIN;

-- =====================================================
-- 1. HABILITAR RLS
-- =====================================================

ALTER TABLE public.crm_service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_service_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_email_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_whatsapp_log ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. POLÍTICAS RLS - ORDENS DE SERVIÇO
-- =====================================================

CREATE POLICY "Parceiros podem inserir ordens de serviço"
  ON public.crm_service_orders FOR INSERT
  WITH CHECK (partner_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Parceiros podem ver suas próprias ordens"
  ON public.crm_service_orders FOR SELECT
  USING (partner_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Parceiros podem atualizar suas próprias ordens"
  ON public.crm_service_orders FOR UPDATE
  USING (partner_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Parceiros podem deletar suas próprias ordens"
  ON public.crm_service_orders FOR DELETE
  USING (partner_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- =====================================================
-- 3. POLÍTICAS RLS - ITENS DE ORDEM DE SERVIÇO
-- =====================================================

CREATE POLICY "Parceiros podem inserir itens de ordem"
  ON public.crm_service_order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM crm_service_orders 
      WHERE id = service_order_id 
      AND partner_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Parceiros podem ver itens de suas ordens"
  ON public.crm_service_order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM crm_service_orders 
      WHERE id = service_order_id 
      AND partner_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Parceiros podem atualizar itens de suas ordens"
  ON public.crm_service_order_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM crm_service_orders 
      WHERE id = service_order_id 
      AND partner_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Parceiros podem deletar itens de suas ordens"
  ON public.crm_service_order_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM crm_service_orders 
      WHERE id = service_order_id 
      AND partner_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- =====================================================
-- 4. POLÍTICAS RLS - PEÇAS
-- =====================================================

CREATE POLICY "Parceiros podem inserir peças"
  ON public.crm_parts FOR INSERT
  WITH CHECK (partner_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Parceiros podem ver suas próprias peças"
  ON public.crm_parts FOR SELECT
  USING (partner_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Parceiros podem atualizar suas próprias peças"
  ON public.crm_parts FOR UPDATE
  USING (partner_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Parceiros podem deletar suas próprias peças"
  ON public.crm_parts FOR DELETE
  USING (partner_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- =====================================================
-- 5. POLÍTICAS RLS - MOVIMENTAÇÕES DE ESTOQUE
-- =====================================================

CREATE POLICY "Parceiros podem inserir movimentações"
  ON public.crm_stock_movements FOR INSERT
  WITH CHECK (partner_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Parceiros podem ver suas próprias movimentações"
  ON public.crm_stock_movements FOR SELECT
  USING (partner_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- =====================================================
-- 6. POLÍTICAS RLS - EMAIL LOG
-- =====================================================

CREATE POLICY "Parceiros podem inserir logs de email"
  ON public.crm_email_log FOR INSERT
  WITH CHECK (partner_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Parceiros podem ver seus próprios logs de email"
  ON public.crm_email_log FOR SELECT
  USING (partner_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- =====================================================
-- 7. POLÍTICAS RLS - WHATSAPP LOG
-- =====================================================

CREATE POLICY "Parceiros podem inserir logs de WhatsApp"
  ON public.crm_whatsapp_log FOR INSERT
  WITH CHECK (partner_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Parceiros podem ver seus próprios logs de WhatsApp"
  ON public.crm_whatsapp_log FOR SELECT
  USING (partner_id = current_setting('request.jwt.claims', true)::json->>'sub');

COMMIT;

