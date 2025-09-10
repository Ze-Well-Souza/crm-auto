-- Corrigir problemas de segurança detectados pelo linter

-- 1. Habilitar RLS nas tabelas antigas que não tinham
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.establishment_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 2. Corrigir search_path nas funções existentes
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql' 
SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_user_role(user_id_param character varying)
RETURNS character varying
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN (SELECT role FROM users WHERE id = user_id_param);
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS character varying
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN get_user_role(auth.uid()::VARCHAR);
END;
$function$;

CREATE OR REPLACE FUNCTION public.temp_disable_rls()
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  ALTER TABLE users DISABLE ROW LEVEL SECURITY;
  ALTER TABLE partners DISABLE ROW LEVEL SECURITY;
END;
$function$;

CREATE OR REPLACE FUNCTION public.temp_enable_rls()
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  ALTER TABLE users ENABLE ROW LEVEL SECURITY;
  ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
END;
$function$;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    next_number INTEGER;
    year_suffix VARCHAR(4);
BEGIN
    -- Pega o ano atual
    year_suffix := EXTRACT(YEAR FROM NOW())::VARCHAR;
    
    -- Busca o próximo número sequencial para o ano
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM '^OS(\d+)-' || year_suffix || '$') AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.service_orders
    WHERE order_number ~ ('^OS\d+-' || year_suffix || '$');
    
    -- Gera o número da OS no formato OS001-2024
    NEW.order_number := 'OS' || LPAD(next_number::VARCHAR, 3, '0') || '-' || year_suffix;
    
    RETURN NEW;
END;
$$ language 'plpgsql'
SET search_path = public;

CREATE OR REPLACE FUNCTION update_service_order_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualiza os totais da ordem de serviço
    UPDATE public.service_orders 
    SET 
        total_labor = (
            SELECT COALESCE(SUM(total_price), 0) 
            FROM public.service_order_items 
            WHERE service_order_id = COALESCE(NEW.service_order_id, OLD.service_order_id)
            AND type = 'service'
        ),
        total_parts = (
            SELECT COALESCE(SUM(total_price), 0) 
            FROM public.service_order_items 
            WHERE service_order_id = COALESCE(NEW.service_order_id, OLD.service_order_id)
            AND type = 'part'
        )
    WHERE id = COALESCE(NEW.service_order_id, OLD.service_order_id);
    
    -- Atualiza o total geral
    UPDATE public.service_orders 
    SET total_amount = total_labor + total_parts - COALESCE(discount, 0)
    WHERE id = COALESCE(NEW.service_order_id, OLD.service_order_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql'
SET search_path = public;

CREATE OR REPLACE FUNCTION handle_stock_movement()
RETURNS TRIGGER AS $$
BEGIN
    -- Se é uma peça sendo adicionada/atualizada em uma OS finalizada
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.type = 'part' AND NEW.part_id IS NOT NULL THEN
        -- Verifica se a OS está finalizada
        IF EXISTS (SELECT 1 FROM public.service_orders WHERE id = NEW.service_order_id AND status = 'finalizado') THEN
            -- Registra saída do estoque
            INSERT INTO public.stock_movements (
                part_id, movement_type, quantity, reference_type, reference_id, 
                notes, created_by
            ) VALUES (
                NEW.part_id, 'saida', NEW.quantity::INTEGER, 'service_order', 
                NEW.service_order_id, 'Saída automática por OS finalizada', auth.uid()::text
            );
            
            -- Atualiza estoque da peça
            UPDATE public.parts 
            SET stock_quantity = stock_quantity - NEW.quantity::INTEGER
            WHERE id = NEW.part_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql'
SET search_path = public;

-- 3. Adicionar políticas RLS básicas para as tabelas que não tinham
-- Para a sessões, apenas os próprios usuários podem acessar
CREATE POLICY "users_own_sessions" ON public.sessions
  FOR ALL USING (false); -- Sessions são gerenciadas pelo sistema

-- Para appointment_ratings, usuários podem ver e criar suas próprias
CREATE POLICY "users_own_appointment_ratings" ON public.appointment_ratings
  FOR ALL USING (user_id::text = auth.uid()::text);

-- Para appointment_status_history, seguir mesma lógica dos appointments
CREATE POLICY "admin_manager_appointment_status_all" ON public.appointment_status_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('admin', 'manager')
    )
  );

-- Para availability_slots, admin/manager podem gerenciar
CREATE POLICY "admin_manager_availability_slots_all" ON public.availability_slots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('admin', 'manager')
    )
  );

-- Para blocked_slots, admin/manager podem gerenciar  
CREATE POLICY "admin_manager_blocked_slots_all" ON public.blocked_slots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('admin', 'manager')
    )
  );

-- Para bookings, similar aos appointments
CREATE POLICY "admin_manager_bookings_all" ON public.bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('admin', 'manager')
    )
  );

-- Para chat_messages, usuários podem ver mensagens onde são sender ou receiver
CREATE POLICY "users_own_chat_messages" ON public.chat_messages
  FOR ALL USING (
    sender_id::text = auth.uid()::text OR receiver_id::text = auth.uid()::text
  );

-- Para establishment_services, seguir lógica dos establishments
CREATE POLICY "admin_manager_establishment_services_all" ON public.establishment_services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('admin', 'manager')
    )
  );

-- Para notification_queue, apenas sistema pode acessar
CREATE POLICY "system_only_notification_queue" ON public.notification_queue
  FOR ALL USING (false);

-- Para partner_applications, admin pode ver todas, usuários suas próprias
CREATE POLICY "admin_partner_applications_all" ON public.partner_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- Para review_metrics, todos podem ver
CREATE POLICY "all_review_metrics_read" ON public.review_metrics
  FOR SELECT USING (auth.role() = 'authenticated');

-- Admin pode modificar
CREATE POLICY "admin_review_metrics_write" ON public.review_metrics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- Para service_reviews, todos podem ver, usuários podem criar suas próprias
CREATE POLICY "all_service_reviews_read" ON public.service_reviews
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "users_create_service_reviews" ON public.service_reviews
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "users_update_own_service_reviews" ON public.service_reviews
  FOR UPDATE USING (user_id::text = auth.uid()::text);

-- Para service_categories, todos podem ver, admin pode modificar
CREATE POLICY "all_service_categories_read" ON public.service_categories
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admin_service_categories_write" ON public.service_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- Para user_profiles, usuários podem ver e modificar seus próprios perfis
CREATE POLICY "users_own_profiles" ON public.user_profiles
  FOR ALL USING (user_id::text = auth.uid()::text);