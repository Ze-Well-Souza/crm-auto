-- ============================================
-- FASE 2: TABELAS PARA DADOS REAIS
-- Substituir dados mock por dados do Supabase
-- ============================================

-- Tabela para eventos de webhook do Stripe
CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text UNIQUE NOT NULL,
  event_type text NOT NULL,
  event_data jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  attempts integer DEFAULT 0,
  error_message text,
  next_retry_at timestamp with time zone,
  processed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- Policies: Apenas admins podem ver eventos
CREATE POLICY "Admins can view webhook events"
ON public.stripe_webhook_events FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Sistema pode gerenciar eventos
CREATE POLICY "System can manage webhook events"
ON public.stripe_webhook_events FOR ALL
USING (true)
WITH CHECK (true);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_stripe_events_type ON public.stripe_webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_stripe_events_status ON public.stripe_webhook_events(status);
CREATE INDEX IF NOT EXISTS idx_stripe_events_created ON public.stripe_webhook_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stripe_events_event_id ON public.stripe_webhook_events(event_id);

-- Trigger para updated_at
CREATE TRIGGER update_stripe_webhook_events_updated_at
  BEFORE UPDATE ON public.stripe_webhook_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Comentário
COMMENT ON TABLE public.stripe_webhook_events IS 'Armazena eventos de webhook recebidos do Stripe para auditoria e reprocessamento';