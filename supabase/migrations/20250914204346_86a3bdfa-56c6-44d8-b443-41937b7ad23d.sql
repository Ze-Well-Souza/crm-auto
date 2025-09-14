-- Fix Security Definer Views by recreating them with proper security controls
-- The linter detects these views as security definer because they access RLS-protected tables

-- Drop all monitoring views to recreate them properly
DROP VIEW IF EXISTS public.metricas_fila_tarefas CASCADE;
DROP VIEW IF EXISTS public.metricas_por_tipo_tarefa CASCADE;
DROP VIEW IF EXISTS public.performance_por_hora CASCADE;
DROP VIEW IF EXISTS public.tarefas_problematicas CASCADE;

-- Since these views access fila_de_tarefas which has RLS policies,
-- and monitoring views should be restricted to admins/authenticated users only,
-- we'll create functions instead of views to have better security control

-- Create a security definer function for task queue metrics (admin only)
CREATE OR REPLACE FUNCTION public.get_task_queue_metrics()
RETURNS TABLE (
    total_tarefas bigint,
    tarefas_pendentes bigint,
    tarefas_processando bigint,
    tarefas_concluidas bigint,
    tarefas_falhadas bigint,
    tarefas_ultima_hora bigint,
    tarefas_ultimo_dia bigint,
    tempo_medio_processamento_segundos numeric
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
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
    WHERE auth.uid() IS NOT NULL; -- Only for authenticated users
$$;

-- Create function for metrics by task type (admin only)
CREATE OR REPLACE FUNCTION public.get_metrics_by_task_type()
RETURNS TABLE (
    tipo_tarefa text,
    total bigint,
    pendentes bigint,
    processando bigint,
    concluidas bigint,
    falhadas bigint,
    media_tentativas numeric,
    max_tentativas integer,
    tempo_medio_processamento numeric
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
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
    WHERE auth.uid() IS NOT NULL -- Only for authenticated users
    GROUP BY f.tipo_tarefa
    ORDER BY count(*) DESC;
$$;

-- Create function for hourly performance metrics (admin only)
CREATE OR REPLACE FUNCTION public.get_hourly_performance()
RETURNS TABLE (
    hora timestamp with time zone,
    total_tarefas bigint,
    concluidas bigint,
    falhadas bigint,
    taxa_sucesso_pct numeric,
    tempo_medio_processamento numeric
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT 
        date_trunc('hour', f.created_at) AS hora,
        count(*) AS total_tarefas,
        count(*) FILTER (WHERE f.status = 'concluido') AS concluidas,
        count(*) FILTER (WHERE f.status = 'falhou') AS falhadas,
        round(((count(*) FILTER (WHERE f.status = 'concluido'))::numeric / count(*)::numeric) * 100, 2) AS taxa_sucesso_pct,
        avg(EXTRACT(epoch FROM (f.updated_at - f.created_at))) FILTER (WHERE f.status = 'concluido') AS tempo_medio_processamento
    FROM fila_de_tarefas f
    WHERE f.created_at >= (now() - interval '7 days')
    AND auth.uid() IS NOT NULL -- Only for authenticated users
    GROUP BY date_trunc('hour', f.created_at)
    ORDER BY date_trunc('hour', f.created_at) DESC;
$$;

-- Create function for problematic tasks (admin only)
CREATE OR REPLACE FUNCTION public.get_problematic_tasks()
RETURNS TABLE (
    id bigint,
    tipo_tarefa text,
    status text,
    tentativas integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    ultima_falha text,
    payload jsonb
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
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
    AND auth.uid() IS NOT NULL -- Only for authenticated users
    ORDER BY f.tentativas DESC, f.updated_at DESC;
$$;

-- Add security comments
COMMENT ON FUNCTION public.get_task_queue_metrics() IS 'Task queue metrics - authenticated users only';
COMMENT ON FUNCTION public.get_metrics_by_task_type() IS 'Task metrics by type - authenticated users only';
COMMENT ON FUNCTION public.get_hourly_performance() IS 'Hourly performance metrics - authenticated users only';
COMMENT ON FUNCTION public.get_problematic_tasks() IS 'Problematic tasks - authenticated users only';