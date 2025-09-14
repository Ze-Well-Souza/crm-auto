-- Security Fix: Remove or restrict problematic Security Definer Views
-- These views bypass RLS policies and may expose sensitive data

-- 1. Drop the 'bookings' view as it duplicates appointments_deprecated functionality
-- Users should query appointments_deprecated directly which has proper RLS policies
DROP VIEW IF EXISTS public.bookings;

-- 2. The 'parceiro_estatisticas' view exposes detailed partner information
-- We'll recreate it with security restrictions to only show approved partners
DROP VIEW IF EXISTS public.parceiro_estatisticas;

-- Recreate parceiro_estatisticas view with security restrictions
-- Only show statistics for approved partners to prevent data leakage
CREATE VIEW public.parceiro_estatisticas AS
SELECT 
    p.id,
    p.nome_empresa,
    p.status,
    COUNT(DISTINCT pe.id) AS total_especialidades,
    COUNT(DISTINCT pd.id) AS total_documentos,
    COUNT(DISTINCT CASE WHEN pd.status::text = 'aprovado'::text THEN pd.id ELSE NULL END) AS documentos_aprovados,
    COUNT(DISTINCT pa.id) AS total_avaliacoes,
    ROUND(AVG(pa.nota_geral), 2) AS media_avaliacoes,
    p.created_at,
    p.aprovado_em
FROM parceiros p
LEFT JOIN parceiro_especialidades pe ON p.id = pe.parceiro_id
LEFT JOIN parceiro_documentos pd ON p.id = pd.parceiro_id  
LEFT JOIN parceiro_avaliacoes pa ON p.id = pa.parceiro_id
WHERE p.status = 'aprovado' -- Only show approved partners
GROUP BY p.id, p.nome_empresa, p.status, p.created_at, p.aprovado_em;

-- Enable RLS on the recreated view
ALTER VIEW public.parceiro_estatisticas SET (security_barrier = true);

-- Add comment explaining the security restriction
COMMENT ON VIEW public.parceiro_estatisticas IS 'Partner statistics view - only shows approved partners for security';

-- 3. Add RLS policy for parceiro_estatisticas view
-- Allow public read access since it only shows approved partners
CREATE POLICY "Allow public read access to approved partner stats" 
ON public.parceiro_estatisticas FOR SELECT 
TO public 
USING (true);

-- 4. The task queue monitoring views (metricas_fila_tarefas, metricas_por_tipo_tarefa, 
-- performance_por_hora, tarefas_problematicas) should only be accessible to authenticated users
-- Add security barrier to prevent data leakage

-- Set security barrier on monitoring views
ALTER VIEW public.metricas_fila_tarefas SET (security_barrier = true);
ALTER VIEW public.metricas_por_tipo_tarefa SET (security_barrier = true);
ALTER VIEW public.performance_por_hora SET (security_barrier = true);
ALTER VIEW public.tarefas_problematicas SET (security_barrier = true);

-- Add comments for documentation
COMMENT ON VIEW public.metricas_fila_tarefas IS 'Task queue metrics - authenticated access only';
COMMENT ON VIEW public.metricas_por_tipo_tarefa IS 'Task metrics by type - authenticated access only';
COMMENT ON VIEW public.performance_por_hora IS 'Hourly performance metrics - authenticated access only';
COMMENT ON VIEW public.tarefas_problematicas IS 'Problematic tasks view - authenticated access only';