-- =====================================================
-- FASE 1: CONFIGURAÇÃO COMPLETA DO BANCO DE DADOS
-- =====================================================

-- =====================================================
-- 1. CRIAR ENUMS
-- =====================================================

CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'super_admin');
CREATE TYPE public.subscription_status AS ENUM ('trial', 'active', 'past_due', 'cancelled', 'expired');
CREATE TYPE public.subscription_action AS ENUM ('created', 'upgraded', 'downgraded', 'cancelled', 'expired', 'renewed');
CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.service_order_status AS ENUM ('draft', 'in_progress', 'waiting_parts', 'waiting_approval', 'completed', 'cancelled');
CREATE TYPE public.service_order_item_type AS ENUM ('service', 'part');
CREATE TYPE public.movement_type AS ENUM ('entry', 'exit', 'adjustment');
CREATE TYPE public.reference_type AS ENUM ('purchase', 'sale', 'service_order', 'adjustment', 'other');
CREATE TYPE public.transaction_type AS ENUM ('income', 'expense');
CREATE TYPE public.payment_method AS ENUM ('cash', 'credit_card', 'debit_card', 'pix', 'bank_transfer', 'other');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'cancelled');

-- =====================================================
-- 2. CRIAR TABELAS DE AUTENTICAÇÃO E USUÁRIOS
-- =====================================================

-- Tabela de perfis estendidos
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Tabela de roles
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- =====================================================
-- 3. CRIAR TABELAS DE ASSINATURAS E PLANOS
-- =====================================================

-- Planos de assinatura
CREATE TABLE public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  display_name text NOT NULL,
  description text,
  price_monthly decimal(10,2) NOT NULL DEFAULT 0,
  price_yearly decimal(10,2) NOT NULL DEFAULT 0,
  max_clients integer NOT NULL DEFAULT -1,
  max_service_orders integer NOT NULL DEFAULT -1,
  max_appointments integer NOT NULL DEFAULT -1,
  max_users integer NOT NULL DEFAULT 1,
  features jsonb DEFAULT '[]'::jsonb,
  stripe_price_id_monthly text,
  stripe_price_id_yearly text,
  is_active boolean DEFAULT true NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Assinaturas dos parceiros
CREATE TABLE public.partner_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id uuid REFERENCES public.subscription_plans(id) NOT NULL,
  stripe_customer_id text,
  stripe_subscription_id text,
  status public.subscription_status NOT NULL DEFAULT 'trial',
  trial_ends_at timestamptz,
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL DEFAULT (now() + interval '1 month'),
  cancel_at_period_end boolean DEFAULT false,
  current_usage jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(partner_id)
);

-- Log de auditoria de assinaturas
CREATE TABLE public.subscription_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action public.subscription_action NOT NULL,
  old_plan_id uuid REFERENCES public.subscription_plans(id),
  new_plan_id uuid REFERENCES public.subscription_plans(id),
  reason text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- =====================================================
-- 4. CRIAR TABELAS DE CLIENTES E VEÍCULOS
-- =====================================================

-- Clientes
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  cpf_cnpj text,
  address text,
  city text,
  state text,
  zip_code text,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Veículos
CREATE TABLE public.vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  year integer,
  plate text,
  color text,
  chassis text,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- =====================================================
-- 5. CRIAR TABELAS DE AGENDAMENTOS
-- =====================================================

CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE SET NULL,
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  status public.appointment_status NOT NULL DEFAULT 'pending',
  service_type text,
  description text,
  estimated_price decimal(10,2),
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- =====================================================
-- 6. CRIAR TABELAS DE ORDENS DE SERVIÇO
-- =====================================================

-- Ordens de serviço
CREATE TABLE public.service_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL,
  order_number text NOT NULL,
  status public.service_order_status NOT NULL DEFAULT 'draft',
  service_description text,
  diagnosis text,
  total_parts decimal(10,2) DEFAULT 0,
  total_labor decimal(10,2) DEFAULT 0,
  total_discount decimal(10,2) DEFAULT 0,
  total_amount decimal(10,2) DEFAULT 0,
  start_date timestamptz,
  completion_date timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(partner_id, order_number)
);

-- Itens da ordem de serviço
CREATE TABLE public.service_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id uuid REFERENCES public.service_orders(id) ON DELETE CASCADE NOT NULL,
  type public.service_order_item_type NOT NULL,
  description text NOT NULL,
  quantity decimal(10,2) NOT NULL DEFAULT 1,
  unit_price decimal(10,2) NOT NULL,
  discount decimal(10,2) DEFAULT 0,
  subtotal decimal(10,2) NOT NULL,
  part_id uuid,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- =====================================================
-- 7. CRIAR TABELAS DE ESTOQUE
-- =====================================================

-- Peças e produtos
CREATE TABLE public.parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  code text NOT NULL,
  name text NOT NULL,
  description text,
  category text,
  brand text,
  supplier text,
  cost_price decimal(10,2) DEFAULT 0,
  sale_price decimal(10,2) DEFAULT 0,
  current_stock decimal(10,2) DEFAULT 0,
  min_stock decimal(10,2) DEFAULT 0,
  max_stock decimal(10,2),
  location text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(partner_id, code)
);

-- Movimentações de estoque
CREATE TABLE public.stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id uuid REFERENCES public.parts(id) ON DELETE CASCADE NOT NULL,
  movement_type public.movement_type NOT NULL,
  quantity decimal(10,2) NOT NULL,
  reference_type public.reference_type NOT NULL,
  reference_id uuid,
  cost_price decimal(10,2),
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- =====================================================
-- 8. CRIAR TABELAS FINANCEIRAS
-- =====================================================

CREATE TABLE public.financial_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type public.transaction_type NOT NULL,
  category text,
  description text NOT NULL,
  amount decimal(10,2) NOT NULL,
  payment_method public.payment_method NOT NULL,
  status public.transaction_status NOT NULL DEFAULT 'pending',
  due_date date,
  payment_date date,
  reference_type public.reference_type,
  reference_id uuid,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- =====================================================
-- 9. CRIAR TABELAS DE COMUNICAÇÃO
-- =====================================================

-- Log de emails
CREATE TABLE public.email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipient text NOT NULL,
  subject text NOT NULL,
  template text,
  status text NOT NULL,
  sent_at timestamptz DEFAULT now() NOT NULL,
  error_message text
);

-- Log de WhatsApp
CREATE TABLE public.whatsapp_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  status text NOT NULL,
  sent_at timestamptz DEFAULT now() NOT NULL,
  error_message text
);

-- =====================================================
-- 10. CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_partner_subscriptions_partner_id ON public.partner_subscriptions(partner_id);
CREATE INDEX idx_partner_subscriptions_status ON public.partner_subscriptions(status);
CREATE INDEX idx_clients_partner_id ON public.clients(partner_id);
CREATE INDEX idx_vehicles_partner_id ON public.vehicles(partner_id);
CREATE INDEX idx_vehicles_client_id ON public.vehicles(client_id);
CREATE INDEX idx_appointments_partner_id ON public.appointments(partner_id);
CREATE INDEX idx_appointments_client_id ON public.appointments(client_id);
CREATE INDEX idx_appointments_scheduled_date ON public.appointments(scheduled_date);
CREATE INDEX idx_service_orders_partner_id ON public.service_orders(partner_id);
CREATE INDEX idx_service_orders_client_id ON public.service_orders(client_id);
CREATE INDEX idx_parts_partner_id ON public.parts(partner_id);
CREATE INDEX idx_financial_transactions_partner_id ON public.financial_transactions(partner_id);

-- =====================================================
-- 11. CRIAR FUNÇÕES DE SEGURANÇA
-- =====================================================

-- Função para verificar se usuário tem role específica
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Função para verificar se é admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id 
    AND role IN ('admin', 'super_admin')
  )
$$;

-- =====================================================
-- 12. CRIAR TRIGGERS E FUNÇÕES DE VALIDAÇÃO
-- =====================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Aplicar trigger em todas as tabelas relevantes
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partner_subscriptions_updated_at BEFORE UPDATE ON public.partner_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_orders_updated_at BEFORE UPDATE ON public.service_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parts_updated_at BEFORE UPDATE ON public.parts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_financial_transactions_updated_at BEFORE UPDATE ON public.financial_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Função para criar profile automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para criar assinatura trial automaticamente
CREATE OR REPLACE FUNCTION public.create_trial_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_plan_id uuid;
BEGIN
  -- Buscar plano Gratuito
  SELECT id INTO v_plan_id
  FROM public.subscription_plans
  WHERE name = 'free'
  AND is_active = true
  LIMIT 1;
  
  IF v_plan_id IS NOT NULL THEN
    INSERT INTO public.partner_subscriptions (
      partner_id, 
      plan_id, 
      status, 
      current_period_start, 
      current_period_end,
      current_usage
    ) VALUES (
      NEW.user_id,
      v_plan_id,
      'active',
      now(),
      now() + interval '10 years',
      '{"clients": 0, "service_orders": 0, "appointments": 0, "users": 1}'::jsonb
    );
    
    -- Adicionar role de user
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_trial_subscription();

-- =====================================================
-- 13. CONFIGURAR RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_log ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

-- Políticas para user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Políticas para subscription_plans (leitura pública)
CREATE POLICY "Anyone can view active plans" ON public.subscription_plans
  FOR SELECT TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage plans" ON public.subscription_plans
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Políticas para partner_subscriptions
CREATE POLICY "Users can view own subscription" ON public.partner_subscriptions
  FOR SELECT TO authenticated
  USING (partner_id = auth.uid());

CREATE POLICY "Admins can view all subscriptions" ON public.partner_subscriptions
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "System can manage subscriptions" ON public.partner_subscriptions
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Políticas para clients
CREATE POLICY "Users can view own clients" ON public.clients
  FOR SELECT TO authenticated
  USING (partner_id = auth.uid());

CREATE POLICY "Users can insert own clients" ON public.clients
  FOR INSERT TO authenticated
  WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Users can update own clients" ON public.clients
  FOR UPDATE TO authenticated
  USING (partner_id = auth.uid())
  WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Users can delete own clients" ON public.clients
  FOR DELETE TO authenticated
  USING (partner_id = auth.uid());

CREATE POLICY "Admins can view all clients" ON public.clients
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

-- Políticas para vehicles
CREATE POLICY "Users can view own vehicles" ON public.vehicles
  FOR SELECT TO authenticated
  USING (partner_id = auth.uid());

CREATE POLICY "Users can insert own vehicles" ON public.vehicles
  FOR INSERT TO authenticated
  WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Users can update own vehicles" ON public.vehicles
  FOR UPDATE TO authenticated
  USING (partner_id = auth.uid())
  WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Users can delete own vehicles" ON public.vehicles
  FOR DELETE TO authenticated
  USING (partner_id = auth.uid());

-- Políticas para appointments
CREATE POLICY "Users can view own appointments" ON public.appointments
  FOR SELECT TO authenticated
  USING (partner_id = auth.uid());

CREATE POLICY "Users can insert own appointments" ON public.appointments
  FOR INSERT TO authenticated
  WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Users can update own appointments" ON public.appointments
  FOR UPDATE TO authenticated
  USING (partner_id = auth.uid())
  WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Users can delete own appointments" ON public.appointments
  FOR DELETE TO authenticated
  USING (partner_id = auth.uid());

-- Políticas para service_orders
CREATE POLICY "Users can view own service orders" ON public.service_orders
  FOR SELECT TO authenticated
  USING (partner_id = auth.uid());

CREATE POLICY "Users can insert own service orders" ON public.service_orders
  FOR INSERT TO authenticated
  WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Users can update own service orders" ON public.service_orders
  FOR UPDATE TO authenticated
  USING (partner_id = auth.uid())
  WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Users can delete own service orders" ON public.service_orders
  FOR DELETE TO authenticated
  USING (partner_id = auth.uid());

-- Políticas para service_order_items (via service_orders)
CREATE POLICY "Users can view own service order items" ON public.service_order_items
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.service_orders
    WHERE service_orders.id = service_order_items.service_order_id
    AND service_orders.partner_id = auth.uid()
  ));

CREATE POLICY "Users can manage own service order items" ON public.service_order_items
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.service_orders
    WHERE service_orders.id = service_order_items.service_order_id
    AND service_orders.partner_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.service_orders
    WHERE service_orders.id = service_order_items.service_order_id
    AND service_orders.partner_id = auth.uid()
  ));

-- Políticas para parts
CREATE POLICY "Users can view own parts" ON public.parts
  FOR SELECT TO authenticated
  USING (partner_id = auth.uid());

CREATE POLICY "Users can insert own parts" ON public.parts
  FOR INSERT TO authenticated
  WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Users can update own parts" ON public.parts
  FOR UPDATE TO authenticated
  USING (partner_id = auth.uid())
  WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Users can delete own parts" ON public.parts
  FOR DELETE TO authenticated
  USING (partner_id = auth.uid());

-- Políticas para stock_movements (via parts)
CREATE POLICY "Users can view own stock movements" ON public.stock_movements
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.parts
    WHERE parts.id = stock_movements.part_id
    AND parts.partner_id = auth.uid()
  ));

CREATE POLICY "Users can manage own stock movements" ON public.stock_movements
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.parts
    WHERE parts.id = stock_movements.part_id
    AND parts.partner_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.parts
    WHERE parts.id = stock_movements.part_id
    AND parts.partner_id = auth.uid()
  ));

-- Políticas para financial_transactions
CREATE POLICY "Users can view own transactions" ON public.financial_transactions
  FOR SELECT TO authenticated
  USING (partner_id = auth.uid());

CREATE POLICY "Users can insert own transactions" ON public.financial_transactions
  FOR INSERT TO authenticated
  WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Users can update own transactions" ON public.financial_transactions
  FOR UPDATE TO authenticated
  USING (partner_id = auth.uid())
  WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Users can delete own transactions" ON public.financial_transactions
  FOR DELETE TO authenticated
  USING (partner_id = auth.uid());

-- Políticas para logs de comunicação
CREATE POLICY "Users can view own email logs" ON public.email_log
  FOR SELECT TO authenticated
  USING (partner_id = auth.uid());

CREATE POLICY "Users can view own whatsapp logs" ON public.whatsapp_log
  FOR SELECT TO authenticated
  USING (partner_id = auth.uid());

-- =====================================================
-- 14. POPULAR DADOS INICIAIS
-- =====================================================

-- Inserir planos de assinatura
INSERT INTO public.subscription_plans (
  name, display_name, description, 
  price_monthly, price_yearly, 
  max_clients, max_service_orders, max_appointments, max_users,
  features, sort_order, is_active
) VALUES
(
  'free', 'Gratuito', 'Plano básico gratuito para começar',
  0, 0,
  40, 40, 40, 1,
  '["Até 40 clientes ativos", "40 ordens de serviço/mês", "40 agendamentos/mês", "1 usuário", "Suporte por email"]'::jsonb,
  1, true
),
(
  'basic', 'Básico', 'Para oficinas pequenas',
  99, 950,
  100, 200, 200, 2,
  '["Até 100 clientes ativos", "200 ordens de serviço/mês", "200 agendamentos/mês", "2 usuários", "Controle de estoque", "Suporte prioritário"]'::jsonb,
  2, true
),
(
  'professional', 'Profissional', 'Para oficinas em crescimento',
  249, 2390,
  500, 1000, 1000, 5,
  '["Até 500 clientes ativos", "1000 ordens de serviço/mês", "1000 agendamentos/mês", "5 usuários", "Todos os módulos", "API de integração", "Suporte 24/7"]'::jsonb,
  3, true
),
(
  'enterprise', 'Enterprise', 'Para grandes redes',
  499, 4790,
  -1, -1, -1, -1,
  '["Clientes ilimitados", "Ordens de serviço ilimitadas", "Agendamentos ilimitados", "Usuários ilimitados", "Personalização completa", "Gerente de conta dedicado", "SLA garantido"]'::jsonb,
  4, true
);