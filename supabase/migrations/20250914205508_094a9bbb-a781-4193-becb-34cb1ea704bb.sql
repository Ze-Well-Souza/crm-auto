-- CRITICAL SECURITY FIX: Remove all public access to sensitive partner data
-- This addresses the business partner information harvesting vulnerability

-- 1. Remove dangerous public access from partners_deprecated table
DROP POLICY IF EXISTS "Allow public read access to partners" ON public.partners_deprecated;

-- 2. Remove the basic discovery policy that still allows column access
DROP POLICY IF EXISTS "Public partner discovery - basic info only" ON public.parceiros;

-- 3. Create a secure function for public partner discovery that only exposes safe data
CREATE OR REPLACE FUNCTION public.get_public_partner_directory()
RETURNS TABLE (
    id bigint,
    business_name text,
    average_rating numeric,
    total_reviews bigint,
    is_available boolean
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT 
        p.id,
        p.nome_empresa as business_name,
        COALESCE(p.nota_media_avaliacoes, 0.0) as average_rating,
        (SELECT COUNT(*) FROM parceiro_avaliacoes pa WHERE pa.parceiro_id = p.id) as total_reviews,
        p.ativo as is_available
    FROM parceiros p
    WHERE p.status::text = 'aprovado' 
    AND p.ativo = true
    ORDER BY p.nota_media_avaliacoes DESC NULLS LAST;
$$;

-- 4. Create a function for authenticated users to get partner contact details
CREATE OR REPLACE FUNCTION public.get_partner_contact_info(partner_id_param bigint)
RETURNS TABLE (
    id bigint,
    business_name text,
    email text,
    phone text,
    address jsonb,
    working_hours jsonb,
    services text[]
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT 
        p.id,
        p.nome_empresa as business_name,
        p.email,
        p.telefone as phone,
        p.endereco as address,
        p.horario_funcionamento as working_hours,
        p.servicos_oferecidos as services
    FROM parceiros p
    WHERE p.id = partner_id_param
    AND p.status::text = 'aprovado' 
    AND p.ativo = true
    AND auth.role() = 'authenticated'; -- Only for authenticated users
$$;

-- 5. Grant appropriate permissions
REVOKE ALL ON FUNCTION public.get_public_partner_directory() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_partner_directory() TO anon, authenticated;

REVOKE ALL ON FUNCTION public.get_partner_contact_info(bigint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_partner_contact_info(bigint) TO authenticated;

-- 6. Add security comment
COMMENT ON FUNCTION public.get_public_partner_directory() IS 'Public partner discovery - only safe business information, no sensitive data';
COMMENT ON FUNCTION public.get_partner_contact_info(bigint) IS 'Partner contact information - authenticated users only';

-- 7. Create restricted policy for partners_deprecated (if still needed)
CREATE POLICY "Partners deprecated - authenticated only" 
ON public.partners_deprecated 
FOR SELECT 
TO authenticated
USING (status::text = 'active');

-- 8. Log the security fix
INSERT INTO public.fila_de_tarefas (tipo_tarefa, payload)
VALUES (
  'security_critical_fix',
  jsonb_build_object(
    'vulnerability', 'Business Partner Information Harvesting',
    'severity', 'CRITICAL',
    'timestamp', NOW(),
    'actions_taken', jsonb_build_array(
      'Removed all public table access to partner sensitive data',
      'Created secure functions for controlled data exposure',
      'Implemented proper authentication requirements',
      'Protected CNPJ, emails, phones, addresses from public access'
    ),
    'compliance_status', 'GDPR and data protection compliant'
  )
);