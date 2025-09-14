-- CRITICAL SECURITY FIXES - Phase 1: RLS Policy Cleanup

-- 1. Remove overly permissive policies on parceiros table
DROP POLICY IF EXISTS "Autenticado pode atualizar" ON public.parceiros;
DROP POLICY IF EXISTS "Autenticado pode deletar" ON public.parceiros;
DROP POLICY IF EXISTS "Autenticado pode inserir" ON public.parceiros;
DROP POLICY IF EXISTS "Autenticado pode selecionar" ON public.parceiros;

-- 2. Fix the dangerous "Allow all operations" policy on notifications_deprecated
DROP POLICY IF EXISTS "Allow all operations" ON public.notifications_deprecated;

-- 3. Remove public access to sensitive partner data
DROP POLICY IF EXISTS "Allow public read access to partner_services" ON public.partner_services_deprecated;
DROP POLICY IF EXISTS "Permitir leitura de parceiros ativos" ON public.parceiros;
DROP POLICY IF EXISTS "Permitir leitura de partner_services ativos" ON public.partner_services_deprecated;

-- 4. Remove overly broad authenticated access policies
DROP POLICY IF EXISTS "Autenticado pode atualizar partner_services" ON public.partner_services_deprecated;
DROP POLICY IF EXISTS "Autenticado pode deletar partner_services" ON public.partner_services_deprecated;
DROP POLICY IF EXISTS "Autenticado pode inserir partner_services" ON public.partner_services_deprecated;
DROP POLICY IF EXISTS "Autenticado pode selecionar partner_services" ON public.partner_services_deprecated;

-- 5. Create proper role-based access control
-- Create user roles enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'partner', 'client');
    END IF;
END $$;

-- Create user roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role user_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles safely
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = auth.uid()
  LIMIT 1
$$;

-- 6. Create secure RLS policies for parceiros table
CREATE POLICY "Admin can manage all partners"
ON public.parceiros
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Partners can view own data"
ON public.parceiros
FOR SELECT
TO authenticated
USING (auth_id = auth.uid());

CREATE POLICY "Partners can update own pending data"
ON public.parceiros
FOR UPDATE
TO authenticated
USING (auth_id = auth.uid() AND status = 'pendente')
WITH CHECK (auth_id = auth.uid() AND status = 'pendente');

CREATE POLICY "Authenticated users can create partner applications"
ON public.parceiros
FOR INSERT
TO authenticated
WITH CHECK (auth_id = auth.uid());

-- 7. Create secure policies for user_roles table
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 8. Create secure policies for notifications_deprecated
CREATE POLICY "Users can view own notifications"
ON public.notifications_deprecated
FOR SELECT
TO authenticated
USING (user_id::uuid = auth.uid());

CREATE POLICY "Users can update own notifications"
ON public.notifications_deprecated
FOR UPDATE
TO authenticated
USING (user_id::uuid = auth.uid())
WITH CHECK (user_id::uuid = auth.uid());

-- 9. Create secure policies for partner_services_deprecated
CREATE POLICY "Partners can manage own services"
ON public.partner_services_deprecated
FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.parceiros 
    WHERE id = partner_services_deprecated.parceiro_id 
    AND auth_id = auth.uid()
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.parceiros 
    WHERE id = partner_services_deprecated.parceiro_id 
    AND auth_id = auth.uid()
));

CREATE POLICY "Approved partner services are publicly viewable"
ON public.partner_services_deprecated
FOR SELECT
USING (EXISTS (
    SELECT 1 FROM public.parceiros 
    WHERE id = partner_services_deprecated.parceiro_id 
    AND status = 'aprovado'
    AND ativo = true
) AND ativo = true);

-- 10. Insert default admin role for testing (using first authenticated user)
-- This will be replaced with proper user management
DO $$
DECLARE
    first_user_id uuid;
BEGIN
    SELECT id INTO first_user_id 
    FROM auth.users 
    ORDER BY created_at 
    LIMIT 1;
    
    IF first_user_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role) 
        VALUES (first_user_id, 'admin'::user_role)
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;
END $$;

-- 11. Add updated_at trigger for user_roles
CREATE OR REPLACE FUNCTION public.update_user_roles_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_user_roles_updated_at();