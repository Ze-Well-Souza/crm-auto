-- ============================================
-- FASE 1 FINAL: CORREÇÕES DE SEGURANÇA (SÓ TABELAS EXISTENTES)
-- ============================================

-- ============================================
-- HABILITAR RLS EM TABELAS EXISTENTES
-- ============================================

ALTER TABLE public.partner_applications_old ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_subscriptions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CRIAR POLICIES
-- ============================================

-- PARTNER_APPLICATIONS_OLD
CREATE POLICY "Admins can view old applications"
ON public.partner_applications_old FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- SUBSCRIPTION_AUDIT_LOG
CREATE POLICY "Users can view their own subscription audit"
ON public.subscription_audit_log FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all subscription audits"
ON public.subscription_audit_log FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert subscription audit"
ON public.subscription_audit_log FOR INSERT
WITH CHECK (true);

-- PARTNER_SUBSCRIPTIONS
CREATE POLICY "Users can view their own subscription"
ON public.partner_subscriptions FOR SELECT
USING (partner_id = auth.uid());

CREATE POLICY "Admins can view all subscriptions"
ON public.partner_subscriptions FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can manage subscriptions"
ON public.partner_subscriptions FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- CORRIGIR FUNÇÕES SEM search_path
-- ============================================

CREATE OR REPLACE FUNCTION public.reset_subscription_usage()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE partner_subscriptions
  SET 
    current_appointments_count = 0,
    current_clients_count = 0,
    current_reports_count = 0,
    usage_reset_at = NOW()
  WHERE 
    status = 'active'
    AND usage_reset_at < NOW() - INTERVAL '1 month';
END;
$$;

CREATE OR REPLACE FUNCTION public.approve_partner_application(application_id uuid, approver_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    new_code TEXT;
    app_record RECORD;
BEGIN
    SELECT * INTO app_record 
    FROM partner_applications 
    WHERE id = application_id AND status IN ('PENDENTE', 'EM_ANALISE');
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Solicitação não encontrada ou já processada';
    END IF;
    
    new_code := generate_onboarding_code();
    
    UPDATE partner_applications 
    SET 
        status = 'APROVADO',
        onboarding_code = new_code,
        approved_by = approver_id,
        approved_at = NOW(),
        updated_at = NOW()
    WHERE id = application_id;
    
    RETURN new_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_partner_application(application_id uuid, reason text, rejector_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    app_record RECORD;
BEGIN
    SELECT * INTO app_record 
    FROM partner_applications 
    WHERE id = application_id AND status IN ('PENDENTE', 'EM_ANALISE');
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Solicitação não encontrada ou já processada';
    END IF;
    
    UPDATE partner_applications 
    SET 
        status = 'REJEITADO',
        rejection_reason = reason,
        approved_by = rejector_id,
        approved_at = NOW(),
        updated_at = NOW()
    WHERE id = application_id;
    
    RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_onboarding_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    code TEXT;
    exists_check INTEGER;
BEGIN
    LOOP
        code := upper(substring(md5(random()::text) from 1 for 8));
        
        SELECT COUNT(*) INTO exists_check 
        FROM partner_applications 
        WHERE onboarding_code = code;
        
        IF exists_check = 0 THEN
            RETURN code;
        END IF;
    END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    INSERT INTO public.usuarios (id, email, nome, email_verificado)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email_confirmed_at IS NOT NULL
    )
    ON CONFLICT (id) DO UPDATE SET
        email_verificado = (NEW.email_confirmed_at IS NOT NULL),
        updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_subscription_audit_log_user_id ON public.subscription_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_audit_log_created_at ON public.subscription_audit_log(created_at DESC);