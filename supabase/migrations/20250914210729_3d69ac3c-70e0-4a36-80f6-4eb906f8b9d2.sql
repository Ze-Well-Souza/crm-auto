-- FASE 1: CORREÇÕES DE SEGURANÇA CRÍTICAS
-- Corrigir Function Search Path Mutable em todas as funções

-- 1. Função update_user_roles_updated_at
CREATE OR REPLACE FUNCTION public.update_user_roles_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

-- 2. Função set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 3. Função is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.raw_user_meta_data->>'role' = 'admin'
    );
END;
$function$;

-- 4. Função generate_order_number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    next_number INTEGER;
    year_suffix VARCHAR(4);
BEGIN
    year_suffix := EXTRACT(YEAR FROM NOW())::VARCHAR;
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM '^OS(\d+)-' || year_suffix || '$') AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.service_orders
    WHERE order_number ~ ('^OS\d+-' || year_suffix || '$');
    
    NEW.order_number := 'OS' || LPAD(next_number::VARCHAR, 3, '0') || '-' || year_suffix;
    
    RETURN NEW;
END;
$function$;

-- 5. Função is_partner_owner
CREATE OR REPLACE FUNCTION public.is_partner_owner(partner_id bigint)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM parceiros 
        WHERE parceiros.id = partner_id 
        AND parceiros.auth_id = auth.uid()
    );
END;
$function$;

-- 6. Função is_partner_approved
CREATE OR REPLACE FUNCTION public.is_partner_approved(partner_id bigint)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM parceiros 
        WHERE parceiros.id = partner_id 
        AND parceiros.status = 'aprovado'
    );
END;
$function$;

-- 7. Função update_email_logs_updated_at
CREATE OR REPLACE FUNCTION public.update_email_logs_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- 8. Função update_service_order_totals
CREATE OR REPLACE FUNCTION public.update_service_order_totals()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
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
    
    UPDATE public.service_orders 
    SET total_amount = total_labor + total_parts - COALESCE(discount, 0)
    WHERE id = COALESCE(NEW.service_order_id, OLD.service_order_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Log da correção de segurança
INSERT INTO public.fila_de_tarefas (tipo_tarefa, payload)
VALUES (
  'security_fix_function_search_path',
  jsonb_build_object(
    'fase', 'FASE_1_SEGURANCA',
    'fix_type', 'Function Search Path Mutable',
    'functions_fixed', 8,
    'status', 'COMPLETED',
    'timestamp', NOW(),
    'next_step', 'Migrar tabelas deprecated para definitivas'
  )
);