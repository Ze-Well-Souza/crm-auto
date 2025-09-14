-- FINALIZAÇÃO DA CORREÇÃO DE SEGURANÇA - ÚLTIMAS FUNÇÕES
-- Corrigir Function Search Path Mutable nas funções finais

-- Restantes das funções que precisam do search_path

-- Função get_hourly_performance
CREATE OR REPLACE FUNCTION public.get_hourly_performance()
RETURNS TABLE(hora timestamp with time zone, total_tarefas bigint, concluidas bigint, falhadas bigint, taxa_sucesso_pct numeric, tempo_medio_processamento numeric)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
    SELECT 
        date_trunc('hour', f.created_at) AS hora,
        count(*) AS total_tarefas,
        count(*) FILTER (WHERE f.status = 'concluido') AS concluidas,
        count(*) FILTER (WHERE f.status = 'falhou') AS falhadas,
        round(((count(*) FILTER (WHERE f.status = 'concluido'))::numeric / count(*)::numeric) * 100, 2) AS taxa_sucesso_pct,
        avg(EXTRACT(epoch FROM (f.updated_at - f.created_at))) FILTER (WHERE f.status = 'concluido') AS tempo_medio_processamento
    FROM fila_de_tarefas f
    WHERE f.created_at >= (now() - interval '7 days')
    AND auth.uid() IS NOT NULL
    GROUP BY date_trunc('hour', f.created_at)
    ORDER BY date_trunc('hour', f.created_at) DESC;
$function$;

-- Função get_problematic_tasks
CREATE OR REPLACE FUNCTION public.get_problematic_tasks()
RETURNS TABLE(id bigint, tipo_tarefa text, status text, tentativas integer, created_at timestamp with time zone, updated_at timestamp with time zone, ultima_falha text, payload jsonb)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
    SELECT 
        f.id,
        f.tipo_tarefa,
        f.status,
        f.tentativas,
        f.created_at,
        f.updated_at,
        f.ultima_falha,
        f.payload
    FROM fila_de_tarefas f
    WHERE ((f.tentativas >= 3 AND f.status != 'concluido') 
           OR (f.status = 'falhou' AND f.updated_at >= (now() - interval '24 hours')))
    AND auth.uid() IS NOT NULL
    ORDER BY f.tentativas DESC, f.updated_at DESC;
$function$;

-- Função verificar_status_cron_jobs
CREATE OR REPLACE FUNCTION public.verificar_status_cron_jobs()
RETURNS TABLE(job_name text, schedule text, active boolean, last_run timestamp with time zone, next_run timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        cj.jobname::TEXT,
        cj.schedule::TEXT,
        cj.active,
        cj.last_run,
        cj.next_run
    FROM cron.job cj
    WHERE cj.jobname IN (
        'processar-fila-tarefas',
        'limpeza-tarefas-antigas', 
        'monitoramento-tarefas-falhas'
    )
    ORDER BY cj.jobname;
END;
$function$;

-- Função gerenciar_cron_job
CREATE OR REPLACE FUNCTION public.gerenciar_cron_job(job_name text, acao text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    resultado BOOLEAN := FALSE;
BEGIN
    IF acao = 'pause' THEN
        UPDATE cron.job 
        SET active = FALSE 
        WHERE jobname = job_name;
        
        GET DIAGNOSTICS resultado = ROW_COUNT;
        
        IF resultado THEN
            RAISE NOTICE 'Cron job % pausado com sucesso', job_name;
        ELSE
            RAISE WARNING 'Cron job % não encontrado', job_name;
        END IF;
        
    ELSIF acao = 'resume' THEN
        UPDATE cron.job 
        SET active = TRUE 
        WHERE jobname = job_name;
        
        GET DIAGNOSTICS resultado = ROW_COUNT;
        
        IF resultado THEN
            RAISE NOTICE 'Cron job % retomado com sucesso', job_name;
        ELSE
            RAISE WARNING 'Cron job % não encontrado', job_name;
        END IF;
        
    ELSE
        RAISE WARNING 'Ação inválida: %. Use "pause" ou "resume"', acao;
    END IF;
    
    RETURN resultado;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Erro ao gerenciar cron job %: %', job_name, SQLERRM;
        RETURN FALSE;
END;
$function$;

-- Função processar_fila_manual
CREATE OR REPLACE FUNCTION public.processar_fila_manual()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    resultado JSONB;
    response_data JSONB;
BEGIN
    -- Executar a Edge Function manualmente
    SELECT 
        net.http_post(
            url := 'https://your-project-ref.supabase.co/functions/v1/processar-fila-de-tarefas',
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
            ),
            body := '{}'
        ) INTO resultado;
    
    -- Retornar resultado da execução
    RETURN jsonb_build_object(
        'status', 'executado',
        'timestamp', NOW(),
        'request_id', resultado->>'id',
        'response', resultado
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'status', 'erro',
            'timestamp', NOW(),
            'erro', SQLERRM
        );
END;
$function$;

-- Função obter_estatisticas_sistema
CREATE OR REPLACE FUNCTION public.obter_estatisticas_sistema()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    stats JSONB;
    cron_stats JSONB;
BEGIN
    -- Estatísticas da fila de tarefas
    SELECT jsonb_build_object(
        'metricas_gerais', (
            SELECT jsonb_build_object(
                'total_tarefas', total_tarefas,
                'tarefas_pendentes', tarefas_pendentes,
                'tarefas_processando', tarefas_processando,
                'tarefas_concluidas', tarefas_concluidas,
                'tarefas_falhadas', tarefas_falhadas,
                'tarefas_ultima_hora', tarefas_ultima_hora,
                'tarefas_ultimo_dia', tarefas_ultimo_dia,
                'tempo_medio_processamento_segundos', tempo_medio_processamento_segundos
            )
            FROM public.metricas_fila_tarefas
        ),
        'por_tipo_tarefa', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'tipo_tarefa', tipo_tarefa,
                    'total', total,
                    'pendentes', pendentes,
                    'processando', processando,
                    'concluidas', concluidas,
                    'falhadas', falhadas,
                    'media_tentativas', media_tentativas,
                    'max_tentativas', max_tentativas,
                    'tempo_medio_processamento', tempo_medio_processamento
                )
            )
            FROM public.metricas_por_tipo_tarefa
        ),
        'tarefas_problematicas', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'tipo_tarefa', tipo_tarefa,
                    'status', status,
                    'tentativas', tentativas,
                    'created_at', created_at,
                    'ultima_falha', ultima_falha
                )
            )
            FROM public.tarefas_problematicas
            LIMIT 10
        )
    ) INTO stats;
    
    -- Estatísticas dos cron jobs
    SELECT jsonb_build_object(
        'cron_jobs', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'job_name', job_name,
                    'schedule', schedule,
                    'active', active,
                    'last_run', last_run,
                    'next_run', next_run
                )
            )
            FROM public.verificar_status_cron_jobs()
        )
    ) INTO cron_stats;
    
    -- Combinar todas as estatísticas
    RETURN stats || cron_stats || jsonb_build_object(
        'timestamp_consulta', NOW(),
        'sistema_status', 'ativo'
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'erro', SQLERRM,
            'timestamp_consulta', NOW(),
            'sistema_status', 'erro'
        );
END;
$function$;

-- Log da finalização das correções
INSERT INTO public.fila_de_tarefas (tipo_tarefa, payload)
VALUES (
  'security_fix_completed',
  jsonb_build_object(
    'fase', 'FASE_1_SEGURANCA_FINALIZADA',
    'functions_fixed_batch_3', 6,
    'total_functions_fixed', 21,
    'status', 'COMPLETED',
    'timestamp', NOW(),
    'next_phase', 'Migração das tabelas deprecated'
  )
);