-- Corrigir problemas de segurança - versão ajustada

-- 1. Habilitar RLS apenas nas tabelas reais (não views)
ALTER TABLE public.appointment_ratings ENABLE ROW LEVEL SECURITY;
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

-- 2. Adicionar políticas RLS básicas para as tabelas
-- Para a sessões, apenas o sistema pode acessar
CREATE POLICY "system_only_sessions" ON public.sessions
  FOR ALL USING (false); -- Sessions são gerenciadas pelo sistema

-- Para appointment_ratings, usuários podem ver e criar suas próprias
CREATE POLICY "users_own_appointment_ratings" ON public.appointment_ratings
  FOR ALL USING (user_id::text = auth.uid()::text);

-- Para appointment_status_history, admin/manager podem ver tudo
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

-- Para notification_queue, apenas admin pode acessar
CREATE POLICY "admin_only_notification_queue" ON public.notification_queue
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- Para partner_applications, admin pode ver todas
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
  FOR INSERT, UPDATE, DELETE USING (
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
  FOR INSERT, UPDATE, DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role = 'admin'
    )
  );

-- Para user_profiles, usuários podem ver e modificar seus próprios perfis
CREATE POLICY "users_own_profiles" ON public.user_profiles
  FOR ALL USING (user_id::text = auth.uid()::text);