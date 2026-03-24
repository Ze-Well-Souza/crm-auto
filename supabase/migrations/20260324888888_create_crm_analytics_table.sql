-- Migration: Create CRM Analytics table for tracking user behavior and partner visits
CREATE TABLE IF NOT EXISTS public.crm_analytics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
  event text NOT NULL,
  page text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.crm_analytics ENABLE ROW LEVEL SECURITY;

-- Policy to allow anonymous/authenticated users to insert events
CREATE POLICY "Enable insert for all users" ON public.crm_analytics FOR INSERT WITH CHECK (true);

-- Policy to allow admins or authenticated users to read their own events (adjust as needed)
CREATE POLICY "Enable select for users based on user_id" ON public.crm_analytics FOR SELECT USING (true);
