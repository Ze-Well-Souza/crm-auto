-- Adicionar política faltante para subscription_audit_log
CREATE POLICY "System can insert audit logs" ON public.subscription_audit_log
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Adicionar política para admins gerenciarem audit logs
CREATE POLICY "Admins can view all audit logs" ON public.subscription_audit_log
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));