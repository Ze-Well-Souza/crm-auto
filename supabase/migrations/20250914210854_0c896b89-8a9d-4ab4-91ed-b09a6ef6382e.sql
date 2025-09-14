-- CONTINUAÇÃO DA CORREÇÃO DE SEGURANÇA - FUNÇÕES RESTANTES
-- Corrigir Function Search Path Mutable nas funções restantes

-- 9. Função handle_stock_movement
CREATE OR REPLACE FUNCTION public.handle_stock_movement()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

-- 10. Função update_partner_documents_updated_at
CREATE OR REPLACE FUNCTION public.update_partner_documents_updated_at()
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

-- 11. Função update_partner_documents_reviewed_at
CREATE OR REPLACE FUNCTION public.update_partner_documents_reviewed_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF OLD.status = 'pending' AND NEW.status IN ('approved', 'rejected') THEN
    NEW.reviewed_at = NOW();
    IF NEW.reviewed_by IS NULL THEN
      NEW.reviewed_by = auth.uid();
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- 12. Função update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
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

-- 13. Função reprocessar_notificacoes_agendamento
CREATE OR REPLACE FUNCTION public.reprocessar_notificacoes_agendamento(agendamento_id bigint)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    agendamento_record RECORD;
    resultado BOOLEAN := FALSE;
BEGIN
    -- Buscar o agendamento
    SELECT * INTO agendamento_record
    FROM public.appointments
    WHERE id = agendamento_id;
    
    IF FOUND THEN
        -- Executar a função de notificação manualmente
        PERFORM public.handle_new_agendamento_notification()
        FROM (SELECT agendamento_record.*) AS NEW;
        
        resultado := TRUE;
        RAISE NOTICE 'Notificações reprocessadas para agendamento ID: %', agendamento_id;
    ELSE
        RAISE WARNING 'Agendamento ID % não encontrado', agendamento_id;
    END IF;
    
    RETURN resultado;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Erro ao reprocessar notificações para agendamento ID %: %', agendamento_id, SQLERRM;
        RETURN FALSE;
END;
$function$;

-- 14. Função get_task_queue_metrics
CREATE OR REPLACE FUNCTION public.get_task_queue_metrics()
RETURNS TABLE(total_tarefas bigint, tarefas_pendentes bigint, tarefas_processando bigint, tarefas_concluidas bigint, tarefas_falhadas bigint, tarefas_ultima_hora bigint, tarefas_ultimo_dia bigint, tempo_medio_processamento_segundos numeric)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
    SELECT 
        count(*) AS total_tarefas,
        count(*) FILTER (WHERE status = 'pendente') AS tarefas_pendentes,
        count(*) FILTER (WHERE status = 'processando') AS tarefas_processando,
        count(*) FILTER (WHERE status = 'concluido') AS tarefas_concluidas,
        count(*) FILTER (WHERE status = 'falhou') AS tarefas_falhadas,
        count(*) FILTER (WHERE created_at >= (now() - interval '1 hour')) AS tarefas_ultima_hora,
        count(*) FILTER (WHERE created_at >= (now() - interval '24 hours')) AS tarefas_ultimo_dia,
        avg(EXTRACT(epoch FROM (updated_at - created_at))) FILTER (WHERE status = 'concluido') AS tempo_medio_processamento_segundos
    FROM fila_de_tarefas
    WHERE auth.uid() IS NOT NULL;
$function$;

-- 15. Função get_metrics_by_task_type
CREATE OR REPLACE FUNCTION public.get_metrics_by_task_type()
RETURNS TABLE(tipo_tarefa text, total bigint, pendentes bigint, processando bigint, concluidas bigint, falhadas bigint, media_tentativas numeric, max_tentativas integer, tempo_medio_processamento numeric)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
    SELECT 
        f.tipo_tarefa,
        count(*) AS total,
        count(*) FILTER (WHERE f.status = 'pendente') AS pendentes,
        count(*) FILTER (WHERE f.status = 'processando') AS processando,
        count(*) FILTER (WHERE f.status = 'concluido') AS concluidas,
        count(*) FILTER (WHERE f.status = 'falhou') AS falhadas,
        round(avg(f.tentativas), 2) AS media_tentativas,
        max(f.tentativas) AS max_tentativas,
        avg(EXTRACT(epoch FROM (f.updated_at - f.created_at))) FILTER (WHERE f.status = 'concluido') AS tempo_medio_processamento
    FROM fila_de_tarefas f
    WHERE auth.uid() IS NOT NULL
    GROUP BY f.tipo_tarefa
    ORDER BY count(*) DESC;
$function$;

-- Log do progresso das correções
INSERT INTO public.fila_de_tarefas (tipo_tarefa, payload)
VALUES (
  'security_fix_progress',
  jsonb_build_object(
    'fase', 'FASE_1_SEGURANCA_CONTINUACAO',
    'functions_fixed_batch_2', 7,
    'total_functions_fixed', 15,
    'status', 'IN_PROGRESS',
    'timestamp', NOW(),
    'remaining_functions', 'Aproximadamente 2-3 funções restantes'
  )
);