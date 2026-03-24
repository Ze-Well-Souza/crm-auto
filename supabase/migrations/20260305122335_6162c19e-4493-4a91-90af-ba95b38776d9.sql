
CREATE TABLE public.crm_partners (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name character varying NOT NULL,
  cnpj character varying,
  email character varying,
  phone character varying,
  address text,
  city character varying,
  state character varying,
  zip_code character varying,
  category character varying,
  status character varying DEFAULT 'ativo',
  rating numeric,
  orders_count integer DEFAULT 0,
  total_revenue numeric DEFAULT 0,
  marketplace_id character varying,
  notes text,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own partners" ON public.crm_partners
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own partners" ON public.crm_partners
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own partners" ON public.crm_partners
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own partners" ON public.crm_partners
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
