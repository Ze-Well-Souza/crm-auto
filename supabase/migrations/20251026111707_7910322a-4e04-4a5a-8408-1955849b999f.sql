-- ==========================================
-- ETAPA 1: LIMPEZA DE BANCO DE DADOS
-- Deletar tabelas duplicadas crm_* e preparar para RLS adequado
-- ==========================================

-- 1. DROP tabelas CRM duplicadas (todas vazias - confirmado 0 registros)
DROP TABLE IF EXISTS public.crm_vehicles CASCADE;
DROP TABLE IF EXISTS public.crm_suppliers CASCADE;
DROP TABLE IF EXISTS public.crm_service_orders CASCADE;
DROP TABLE IF EXISTS public.crm_payment_methods CASCADE;
DROP TABLE IF EXISTS public.crm_parts CASCADE;
DROP TABLE IF EXISTS public.crm_financial_transactions CASCADE;
DROP TABLE IF EXISTS public.crm_clients CASCADE;
DROP TABLE IF EXISTS public.crm_appointments CASCADE;

-- 2. Adicionar coluna user_id nas tabelas principais para RLS adequado
-- (nullable por enquanto para não quebrar dados existentes)

-- Tabela clients
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);

-- Tabela vehicles  
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON public.vehicles(user_id);

-- Tabela appointments
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);

-- Tabela service_orders
ALTER TABLE public.service_orders 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_service_orders_user_id ON public.service_orders(user_id);

-- Tabela parts
ALTER TABLE public.parts 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_parts_user_id ON public.parts(user_id);

-- Tabela suppliers
ALTER TABLE public.suppliers 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON public.suppliers(user_id);

-- Tabela financial_transactions (já tem created_by, adicionar user_id também)
ALTER TABLE public.financial_transactions 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_financial_transactions_user_id ON public.financial_transactions(user_id);

-- 3. Atualizar RLS policies para usar user_id (substituir policies permissivas existentes)

-- CLIENTS: Remover policy permissiva e criar baseada em user_id
DROP POLICY IF EXISTS "Anyone can manage clients" ON public.clients;

CREATE POLICY "Users can view their own clients"
  ON public.clients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients"
  ON public.clients FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients"
  ON public.clients FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients"
  ON public.clients FOR DELETE
  USING (auth.uid() = user_id);

-- VEHICLES: Remover policy permissiva e criar baseada em user_id
DROP POLICY IF EXISTS "Anyone can manage vehicles" ON public.vehicles;

CREATE POLICY "Users can view their own vehicles"
  ON public.vehicles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vehicles"
  ON public.vehicles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vehicles"
  ON public.vehicles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vehicles"
  ON public.vehicles FOR DELETE
  USING (auth.uid() = user_id);

-- APPOINTMENTS: Remover policy permissiva e criar baseada em user_id
DROP POLICY IF EXISTS "Anyone can manage appointments" ON public.appointments;

CREATE POLICY "Users can view their own appointments"
  ON public.appointments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments"
  ON public.appointments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own appointments"
  ON public.appointments FOR DELETE
  USING (auth.uid() = user_id);

-- SERVICE_ORDERS: Remover policy permissiva e criar baseada em user_id
DROP POLICY IF EXISTS "Anyone can manage service orders" ON public.service_orders;

CREATE POLICY "Users can view their own service orders"
  ON public.service_orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own service orders"
  ON public.service_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own service orders"
  ON public.service_orders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own service orders"
  ON public.service_orders FOR DELETE
  USING (auth.uid() = user_id);

-- PARTS: Remover policy permissiva e criar baseada em user_id
DROP POLICY IF EXISTS "Anyone can manage parts" ON public.parts;

CREATE POLICY "Users can view their own parts"
  ON public.parts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own parts"
  ON public.parts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own parts"
  ON public.parts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own parts"
  ON public.parts FOR DELETE
  USING (auth.uid() = user_id);

-- SUPPLIERS: Remover policy permissiva e criar baseada em user_id
DROP POLICY IF EXISTS "Anyone can manage suppliers" ON public.suppliers;

CREATE POLICY "Users can view their own suppliers"
  ON public.suppliers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own suppliers"
  ON public.suppliers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own suppliers"
  ON public.suppliers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own suppliers"
  ON public.suppliers FOR DELETE
  USING (auth.uid() = user_id);

-- FINANCIAL_TRANSACTIONS: Remover policy permissiva e criar baseada em user_id
DROP POLICY IF EXISTS "Anyone can manage financial transactions" ON public.financial_transactions;

CREATE POLICY "Users can view their own transactions"
  ON public.financial_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON public.financial_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON public.financial_transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON public.financial_transactions FOR DELETE
  USING (auth.uid() = user_id);