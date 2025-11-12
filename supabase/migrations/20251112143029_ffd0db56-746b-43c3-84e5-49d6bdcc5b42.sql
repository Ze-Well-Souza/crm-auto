-- ============================================
-- FASE 1: CORREÇÕES CRÍTICAS DE SEGURANÇA (CORRIGIDA)
-- Habilitar RLS e Corrigir search_path
-- ============================================

-- ============================================
-- PARTE 1: HABILITAR RLS EM TABELAS EXISTENTES
-- ============================================

-- Tabelas verificadas como existentes
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PARTE 2: CRIAR POLICIES SEGURAS
-- ============================================

-- ADDRESSES: Usuários podem gerenciar seus próprios endereços
CREATE POLICY "Users can view their own addresses"
ON public.addresses FOR SELECT
USING ((auth.uid())::text = user_id);

CREATE POLICY "Users can insert their own addresses"
ON public.addresses FOR INSERT
WITH CHECK ((auth.uid())::text = user_id);

CREATE POLICY "Users can update their own addresses"
ON public.addresses FOR UPDATE
USING ((auth.uid())::text = user_id);

CREATE POLICY "Users can delete their own addresses"
ON public.addresses FOR DELETE
USING ((auth.uid())::text = user_id);

-- MARKETPLACE_COMPARISONS: Usuários podem gerenciar suas comparações
CREATE POLICY "Users can view their own comparisons"
ON public.marketplace_comparisons FOR SELECT
USING ((auth.uid())::text = user_id);

CREATE POLICY "Users can insert their own comparisons"
ON public.marketplace_comparisons FOR INSERT
WITH CHECK ((auth.uid())::text = user_id);

CREATE POLICY "Users can update their own comparisons"
ON public.marketplace_comparisons FOR UPDATE
USING ((auth.uid())::text = user_id);

CREATE POLICY "Users can delete their own comparisons"
ON public.marketplace_comparisons FOR DELETE
USING ((auth.uid())::text = user_id);

-- Public shared comparisons (readonly)
CREATE POLICY "Anyone can view shared comparisons"
ON public.marketplace_comparisons FOR SELECT
USING (is_shared = true);

-- FAVORITES: Usuários podem gerenciar seus favoritos
CREATE POLICY "Users can view their own favorites"
ON public.favorites FOR SELECT
USING ((auth.uid())::text = user_id);

CREATE POLICY "Users can insert their own favorites"
ON public.favorites FOR INSERT
WITH CHECK ((auth.uid())::text = user_id);

CREATE POLICY "Users can update their own favorites"
ON public.favorites FOR UPDATE
USING ((auth.uid())::text = user_id);

CREATE POLICY "Users can delete their own favorites"
ON public.favorites FOR DELETE
USING ((auth.uid())::text = user_id);

-- SUBSCRIPTION_PLANS: Todos podem ver planos ativos (público)
CREATE POLICY "Anyone can view active subscription plans"
ON public.subscription_plans FOR SELECT
USING (is_active = true);

-- Apenas admins podem gerenciar planos
CREATE POLICY "Admins can manage subscription plans"
ON public.subscription_plans FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- PARTE 3: CORRIGIR search_path EM FUNÇÕES
-- ============================================

-- Atualizar função has_role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Atualizar função get_user_role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = auth.uid()
  LIMIT 1
$$;

-- Atualizar check_subscription_limit
CREATE OR REPLACE FUNCTION public.check_subscription_limit(p_user_id uuid, p_limit_type text, p_current_count integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_limit INTEGER;
  v_plan_id UUID;
BEGIN
  SELECT plan_id INTO v_plan_id
  FROM partner_subscriptions
  WHERE partner_id = p_user_id
    AND status = 'active'
  LIMIT 1;
  
  IF v_plan_id IS NULL THEN
    RETURN false;
  END IF;
  
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
  
  IF v_limit IS NULL THEN
    RETURN true;
  END IF;
  
  RETURN p_current_count < v_limit;
END;
$$;

-- Atualizar increment_image_usage
CREATE OR REPLACE FUNCTION public.increment_image_usage(image_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE image_library
  SET 
    usage_count = usage_count + 1,
    last_used_at = NOW()
  WHERE id = image_uuid;
END;
$$;

-- Atualizar is_partner_approved
CREATE OR REPLACE FUNCTION public.is_partner_approved(partner_id bigint)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM parceiros 
        WHERE parceiros.id = partner_id 
        AND parceiros.status = 'aprovado'
    );
END;
$$;

-- Atualizar is_partner_owner
CREATE OR REPLACE FUNCTION public.is_partner_owner(partner_id bigint)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM parceiros 
        WHERE parceiros.id = partner_id 
        AND parceiros.auth_id = auth.uid()
    );
END;
$$;

-- Atualizar create_free_subscription
CREATE OR REPLACE FUNCTION public.create_free_subscription()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  free_plan_id UUID;
BEGIN
  SELECT id INTO free_plan_id 
  FROM subscription_plans 
  WHERE name = 'gratuito' 
  LIMIT 1;
  
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
    NULL,
    'monthly',
    0, 0, 0
  );
  
  RETURN NEW;
END;
$$;

-- Atualizar generate_order_number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    next_number INTEGER;
    year_suffix VARCHAR(4);
BEGIN
    year_suffix := EXTRACT(YEAR FROM NOW())::VARCHAR;
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM '^OS(\d+)-' || year_suffix || '$') AS INTEGER)), 0) + 1
    INTO next_number
    FROM service_orders
    WHERE order_number ~ ('^OS\d+-' || year_suffix || '$');
    
    NEW.order_number := 'OS' || LPAD(next_number::VARCHAR, 3, '0') || '-' || year_suffix;
    
    RETURN NEW;
END;
$$;

-- Atualizar handle_stock_movement
CREATE OR REPLACE FUNCTION public.handle_stock_movement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.type = 'part' AND NEW.part_id IS NOT NULL THEN
        IF EXISTS (SELECT 1 FROM service_orders WHERE id = NEW.service_order_id AND status = 'finalizado') THEN
            INSERT INTO stock_movements (
                part_id, movement_type, quantity, reference_type, reference_id, 
                notes, created_by
            ) VALUES (
                NEW.part_id, 'saida', NEW.quantity::INTEGER, 'service_order', 
                NEW.service_order_id, 'Saída automática por OS finalizada', auth.uid()::text
            );
            
            UPDATE parts 
            SET stock_quantity = stock_quantity - NEW.quantity::INTEGER
            WHERE id = NEW.part_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Atualizar update_service_order_totals
CREATE OR REPLACE FUNCTION public.update_service_order_totals()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE service_orders 
    SET 
        total_labor = (
            SELECT COALESCE(SUM(total_price), 0) 
            FROM service_order_items 
            WHERE service_order_id = COALESCE(NEW.service_order_id, OLD.service_order_id)
            AND type = 'service'
        ),
        total_parts = (
            SELECT COALESCE(SUM(total_price), 0) 
            FROM service_order_items 
            WHERE service_order_id = COALESCE(NEW.service_order_id, OLD.service_order_id)
            AND type = 'part'
        )
    WHERE id = COALESCE(NEW.service_order_id, OLD.service_order_id);
    
    UPDATE service_orders 
    SET total_amount = total_labor + total_parts - COALESCE(discount, 0)
    WHERE id = COALESCE(NEW.service_order_id, OLD.service_order_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Atualizar calculate_service_order_total
CREATE OR REPLACE FUNCTION public.calculate_service_order_total()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.total_amount := COALESCE(NEW.total_labor, 0) + COALESCE(NEW.total_parts, 0) - COALESCE(NEW.discount, 0);
  RETURN NEW;
END;
$$;

-- Atualizar generate_service_order_number
CREATE OR REPLACE FUNCTION public.generate_service_order_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  next_number INTEGER;
  year_suffix VARCHAR(4);
BEGIN
  year_suffix := EXTRACT(YEAR FROM NOW())::VARCHAR;
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM '^OS(\d+)-' || year_suffix || '$') AS INTEGER)), 0) + 1
  INTO next_number
  FROM service_orders
  WHERE order_number ~ ('^OS\d+-' || year_suffix || '$');
  
  NEW.order_number := 'OS' || LPAD(next_number::VARCHAR, 3, '0') || '-' || year_suffix;
  
  RETURN NEW;
END;
$$;

-- Funções de triggers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_user_roles_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- ============================================
-- PARTE 4: CRIAR ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_comparisons_user_id ON public.marketplace_comparisons(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_is_active ON public.subscription_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_status ON public.partner_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_partner_id ON public.partner_subscriptions(partner_id);