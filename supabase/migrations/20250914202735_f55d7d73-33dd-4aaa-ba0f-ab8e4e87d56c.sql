-- CRITICAL SECURITY FIXES - Phase 2: Fix Database Function Security Issues

-- Fix all database functions to include proper search_path configuration
-- This addresses the Function Search Path Mutable warnings

-- 1. Fix set_updated_at function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. Fix is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.raw_user_meta_data->>'role' = 'admin'
    );
END;
$$;

-- 3. Fix generate_order_number function
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- 4. Fix is_partner_owner function
CREATE OR REPLACE FUNCTION public.is_partner_owner(partner_id bigint)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM parceiros 
        WHERE parceiros.id = partner_id 
        AND parceiros.auth_id = auth.uid()
    );
END;
$$;

-- 5. Fix is_partner_approved function
CREATE OR REPLACE FUNCTION public.is_partner_approved(partner_id bigint)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM parceiros 
        WHERE parceiros.id = partner_id 
        AND parceiros.status = 'aprovado'
    );
END;
$$;

-- 6. Fix update_email_logs_updated_at function
CREATE OR REPLACE FUNCTION public.update_email_logs_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 7. Fix update_service_order_totals function
CREATE OR REPLACE FUNCTION public.update_service_order_totals()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- 8. Fix handle_stock_movement function
CREATE OR REPLACE FUNCTION public.handle_stock_movement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.type = 'part' AND NEW.part_id IS NOT NULL THEN
        IF EXISTS (SELECT 1 FROM public.service_orders WHERE id = NEW.service_order_id AND status = 'finalizado') THEN
            INSERT INTO public.stock_movements (
                part_id, movement_type, quantity, reference_type, reference_id, 
                notes, created_by
            ) VALUES (
                NEW.part_id, 'saida', NEW.quantity::INTEGER, 'service_order', 
                NEW.service_order_id, 'Saída automática por OS finalizada', auth.uid()::text
            );
            
            UPDATE public.parts 
            SET stock_quantity = stock_quantity - NEW.quantity::INTEGER
            WHERE id = NEW.part_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- 9. Fix update_partner_documents_updated_at function
CREATE OR REPLACE FUNCTION public.update_partner_documents_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 10. Fix update_partner_documents_reviewed_at function
CREATE OR REPLACE FUNCTION public.update_partner_documents_reviewed_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status = 'pending' AND NEW.status IN ('approved', 'rejected') THEN
    NEW.reviewed_at = NOW();
    IF NEW.reviewed_by IS NULL THEN
      NEW.reviewed_by = auth.uid();
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 11. Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- 12. Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- 13. Fix handle_new_agendamento_notification function
CREATE OR REPLACE FUNCTION public.handle_new_agendamento_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    parceiro_email TEXT;
    cliente_email TEXT;
    parceiro_nome TEXT;
    cliente_nome TEXT;
    servico_nome TEXT;
    agendamento_data TIMESTAMP;
BEGIN
    parceiro_email := 'ricardojsbueno@gmail.com';
    cliente_email := 'wellington.0301@hotmail.com';
    
    SELECT nome_fantasia INTO parceiro_nome 
    FROM public.parceiros 
    WHERE id = NEW.parceiro_id;
    
    IF parceiro_nome IS NULL THEN
        parceiro_nome := 'Oficina Teste';
    END IF;
    
    cliente_nome := 'Cliente Teste Sistema';
    
    SELECT name INTO servico_nome 
    FROM public.services 
    WHERE id = NEW.service_id;
    
    IF servico_nome IS NULL THEN
        servico_nome := 'Serviço de Teste';
    END IF;
    
    agendamento_data := COALESCE(NEW.date::timestamp + NEW.time::interval, NOW());
    
    INSERT INTO public.fila_de_tarefas (tipo_tarefa, payload)
    VALUES (
        'notificar_parceiro_novo_agendamento',
        jsonb_build_object(
            'agendamento_id', NEW.id,
            'email_destinatario', parceiro_email,
            'parceiro_nome', parceiro_nome,
            'cliente_nome', cliente_nome,
            'servico_nome', servico_nome,
            'data_agendamento', agendamento_data,
            'template_type', 'novo_agendamento_parceiro'
        )
    );
    
    INSERT INTO public.fila_de_tarefas (tipo_tarefa, payload)
    VALUES (
        'enviar_email_confirmacao_cliente',
        jsonb_build_object(
            'agendamento_id', NEW.id,
            'email_destinatario', cliente_email,
            'cliente_nome', cliente_nome,
            'parceiro_nome', parceiro_nome,
            'servico_nome', servico_nome,
            'data_agendamento', agendamento_data,
            'template_type', 'confirmacao_agendamento_cliente'
        )
    );
    
    RETURN NEW;
END;
$$;