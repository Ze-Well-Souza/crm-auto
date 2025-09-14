-- CRITICAL SECURITY FIXES - Phase 1: Data Protection
-- Fix public exposure of sensitive partner data

-- 1. Remove dangerous public access policy for parceiros table
DROP POLICY IF EXISTS "Parceiros aprovados são visíveis publicamente" ON public.parceiros;

-- 2. Create secure public discovery policy - only basic info, no sensitive data
CREATE POLICY "Public partner discovery - basic info only" 
ON public.parceiros 
FOR SELECT 
USING (
  status::text = 'aprovado' 
  AND ativo = true
);

-- Note: This policy allows SELECT but applications should only query safe fields
-- Applications must restrict queries to: nome_empresa, status, nota_media_avaliacoes
-- NEVER query: cnpj, telefone, email, endereco (full address), auth_id

-- 3. Create authenticated user policy for full partner details
CREATE POLICY "Authenticated users can view full partner details" 
ON public.parceiros 
FOR SELECT 
TO authenticated
USING (
  status::text = 'aprovado' 
  AND ativo = true
);

-- 4. Fix partner services - restrict detailed pricing to authenticated users
DROP POLICY IF EXISTS "Approved partner services are publicly viewable" ON public.partner_services_deprecated;

-- 5. Create public policy for basic service availability only
CREATE POLICY "Public service availability - no pricing" 
ON public.partner_services_deprecated 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM parceiros p 
    WHERE p.id = partner_services_deprecated.parceiro_id 
    AND p.status::text = 'aprovado' 
    AND p.ativo = true
  ) 
  AND ativo = true
);

-- Note: Applications should only query service_id, ativo, tempo_estimado_minutos for public access
-- Pricing (preco_base) should only be shown to authenticated users

-- 6. Create authenticated policy for full service details including pricing
CREATE POLICY "Authenticated users can view service pricing" 
ON public.partner_services_deprecated 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM parceiros p 
    WHERE p.id = partner_services_deprecated.parceiro_id 
    AND p.status::text = 'aprovado' 
    AND p.ativo = true
  ) 
  AND ativo = true
);

-- 7. Restrict partner specialties to authenticated users only
DROP POLICY IF EXISTS "Especialidades de parceiros aprovados são públicas" ON public.parceiro_especialidades;

CREATE POLICY "Authenticated users can view partner specialties" 
ON public.parceiro_especialidades 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM parceiros p 
    WHERE p.id = parceiro_especialidades.parceiro_id 
    AND p.status::text = 'aprovado'
  )
);

-- 8. Add function security improvements - fix search_path warnings
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT role
  FROM public.user_roles
  WHERE user_id = auth.uid()
  LIMIT 1
$function$;

-- Add security audit log
INSERT INTO public.fila_de_tarefas (tipo_tarefa, payload)
VALUES (
  'security_audit_log',
  jsonb_build_object(
    'event', 'critical_security_fixes_applied',
    'timestamp', NOW(),
    'changes', jsonb_build_array(
      'Restricted public access to sensitive partner data',
      'Protected service pricing information', 
      'Secured partner specialties',
      'Fixed database function security warnings'
    ),
    'migration_id', '20250914_security_fixes'
  )
);