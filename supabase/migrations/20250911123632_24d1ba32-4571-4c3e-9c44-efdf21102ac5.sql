-- Corrigir problemas de segurança - versão com sintaxe corrigida

-- 1. Habilitar RLS nas tabelas que ainda não têm
DO $$ 
BEGIN
    -- Verificar e habilitar RLS apenas se não estiver já habilitado
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' AND tablename = 'appointment_ratings' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE public.appointment_ratings ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Continuar com outras tabelas
ALTER TABLE public.appointment_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.establishment_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 2. Criar políticas RLS com sintaxe correta

-- Sessions: sistema apenas
CREATE POLICY "system_only_sessions" ON public.sessions
  FOR ALL USING (false);

-- Appointment ratings: usuários suas próprias
CREATE POLICY "users_own_appointment_ratings" ON public.appointment_ratings
  FOR ALL USING (user_id::text = auth.uid()::text);

-- Appointment status history: admin/manager
CREATE POLICY "admin_manager_appointment_status_all" ON public.appointment_status_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('admin', 'manager')
    )
  );

-- Availability slots: admin/manager
CREATE POLICY "admin_manager_availability_slots_all" ON public.availability_slots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('admin', 'manager')
    )
  );

-- Blocked slots: admin/manager  
CREATE POLICY "admin_manager_blocked_slots_all" ON public.blocked_slots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('admin', 'manager')
    )
  );

-- Chat messages: sender/receiver
CREATE POLICY "users_own_chat_messages" ON public.chat_messages
  FOR ALL USING (
    sender_id::text = auth.uid()::text OR receiver_id::text = auth.uid()::text
  );

-- Establishment services: admin/manager
CREATE POLICY "admin_manager_establishment_services_all" ON public.establishment_services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('admin', 'manager')
    )
  );

-- Notification queue: admin apenas
CREATE POLICY "admin_only_notification_queue" ON public.notification_queue
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- Partner applications: admin apenas
CREATE POLICY "admin_partner_applications_all" ON public.partner_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- Review metrics: ler todos, escrever admin
CREATE POLICY "all_review_metrics_read" ON public.review_metrics
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admin_review_metrics_write" ON public.review_metrics
  FOR INSERT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

CREATE POLICY "admin_review_metrics_update" ON public.review_metrics
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

CREATE POLICY "admin_review_metrics_delete" ON public.review_metrics
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- Service reviews: ler todos, criar/editar próprias
CREATE POLICY "all_service_reviews_read" ON public.service_reviews
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "users_create_service_reviews" ON public.service_reviews
  FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "users_update_own_service_reviews" ON public.service_reviews
  FOR UPDATE USING (user_id::text = auth.uid()::text);

-- Service categories: ler todos, escrever admin
CREATE POLICY "all_service_categories_read" ON public.service_categories
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admin_service_categories_write" ON public.service_categories
  FOR INSERT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

CREATE POLICY "admin_service_categories_update" ON public.service_categories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

CREATE POLICY "admin_service_categories_delete" ON public.service_categories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- User profiles: usuários seus próprios
CREATE POLICY "users_own_profiles" ON public.user_profiles
  FOR ALL USING (user_id::text = auth.uid()::text);