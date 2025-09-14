-- Fix the Security Definer View issue
-- Replace the view with a regular function

-- 1. Drop the problematic view
DROP VIEW IF EXISTS public.partner_directory;

-- 2. Create a regular function instead (not SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_partner_directory()
RETURNS TABLE (
    id bigint,
    business_name text,
    average_rating numeric,
    total_reviews bigint,
    is_available boolean
)
LANGUAGE sql
STABLE
AS $$
    SELECT 
        p.id,
        p.nome_empresa as business_name,
        COALESCE(p.nota_media_avaliacoes, 0.0) as average_rating,
        (SELECT COUNT(*) FROM parceiro_avaliacoes pa WHERE pa.parceiro_id = p.id) as total_reviews,
        p.ativo as is_available
    FROM parceiros p
    WHERE p.status::text = 'aprovado' 
    AND p.ativo = true;
$$;

-- 3. Grant permissions appropriately
REVOKE ALL ON FUNCTION public.get_partner_directory() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_partner_directory() TO PUBLIC;

-- 4. Add comment
COMMENT ON FUNCTION public.get_partner_directory() IS 'Public partner directory - NO sensitive data exposed';

-- 5. Test security - verify no direct table access
-- This should return 0 indicating no public access to sensitive data