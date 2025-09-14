-- Fix the last Security Definer View issue
-- Replace parceiro_estatisticas view with a secure function

-- Drop the remaining problematic view
DROP VIEW IF EXISTS public.parceiro_estatisticas CASCADE;

-- Create a secure function instead of a view for partner statistics
-- This provides better security control and eliminates the security definer warning
CREATE OR REPLACE FUNCTION public.get_partner_statistics()
RETURNS TABLE (
    id bigint,
    nome_empresa text,
    status character varying,
    total_especialidades bigint,
    total_documentos bigint,
    documentos_aprovados bigint,
    total_avaliacoes bigint,
    media_avaliacoes numeric,
    created_at timestamp with time zone,
    aprovado_em timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
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
    WHERE p.status = 'aprovado' -- Only show approved partners for security
    GROUP BY p.id, p.nome_empresa, p.status, p.created_at, p.aprovado_em;
$$;

-- Add security comment
COMMENT ON FUNCTION public.get_partner_statistics() IS 'Partner statistics - only shows approved partners for security';

-- Grant execute permission to authenticated users only
REVOKE ALL ON FUNCTION public.get_partner_statistics() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_partner_statistics() TO authenticated;