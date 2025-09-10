-- CRM Oficina Mecânica - Módulo 1: Gestão de Entidades Core (Clientes e Veículos)

-- Tabela de clientes da oficina
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  cpf_cnpj VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de veículos dos clientes
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER,
  license_plate VARCHAR(10),
  vin VARCHAR(50),
  color VARCHAR(50),
  fuel_type VARCHAR(20),
  engine VARCHAR(100),
  mileage INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Módulo 2: Gestão Operacional (Ordens de Serviço e Orçamentos)

-- Tabela de tipos de serviço
CREATE TABLE public.service_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  default_price DECIMAL(10,2),
  estimated_duration INTEGER, -- em minutos
  category VARCHAR(100),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de ordens de serviço
CREATE TABLE public.service_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'orcamento' CHECK (status IN ('orcamento', 'aprovado', 'em_servico', 'finalizado', 'cancelado', 'entregue')),
  type VARCHAR(20) DEFAULT 'orcamento' CHECK (type IN ('orcamento', 'ordem_servico')),
  description TEXT,
  total_labor DECIMAL(10,2) DEFAULT 0,
  total_parts DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  mechanic_id VARCHAR(255), -- referencia ao user que é mecânico
  promised_date DATE,
  started_at TIMESTAMP WITH TIME ZONE,
  finished_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de itens da ordem de serviço (serviços e peças)
CREATE TABLE public.service_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_order_id UUID NOT NULL REFERENCES public.service_orders(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('service', 'part')),
  service_type_id UUID REFERENCES public.service_types(id),
  part_id UUID, -- será referenciado quando criarmos a tabela de peças
  description TEXT NOT NULL,
  quantity DECIMAL(10,3) DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Módulo 3: Gestão de Tempo (Agendamentos)

-- Tabela de agendamentos
CREATE TABLE public.workshop_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id),
  service_order_id UUID REFERENCES public.service_orders(id),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  estimated_duration INTEGER, -- em minutos
  status VARCHAR(20) DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'em_andamento', 'finalizado', 'cancelado')),
  service_description TEXT,
  mechanic_id VARCHAR(255), -- referencia ao user que é mecânico
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Módulo 4: Gestão de Recursos (Estoque de Peças)

-- Tabela de fornecedores
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  cnpj VARCHAR(20),
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de peças
CREATE TABLE public.parts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  brand VARCHAR(100),
  supplier_id UUID REFERENCES public.suppliers(id),
  cost_price DECIMAL(10,2),
  sale_price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  max_stock INTEGER,
  location VARCHAR(100), -- localização no estoque
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar referência de peças aos itens da OS
ALTER TABLE public.service_order_items 
ADD CONSTRAINT fk_service_order_items_part_id 
FOREIGN KEY (part_id) REFERENCES public.parts(id);

-- Tabela de movimentação de estoque
CREATE TABLE public.stock_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  part_id UUID NOT NULL REFERENCES public.parts(id),
  movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('entrada', 'saida', 'ajuste', 'transferencia')),
  quantity INTEGER NOT NULL,
  reference_type VARCHAR(50), -- 'service_order', 'purchase', 'adjustment'
  reference_id UUID, -- ID da referência (ex: service_order_id)
  notes TEXT,
  created_by VARCHAR(255), -- user_id
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Módulo 5: Gestão Financeira

-- Tabela de transações financeiras
CREATE TABLE public.financial_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_order_id UUID REFERENCES public.service_orders(id),
  type VARCHAR(20) NOT NULL CHECK (type IN ('receita', 'despesa')),
  category VARCHAR(100),
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  payment_date DATE,
  due_date DATE,
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'vencido', 'cancelado')),
  notes TEXT,
  created_by VARCHAR(255), -- user_id
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de comissões dos mecânicos
CREATE TABLE public.mechanic_commissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mechanic_id VARCHAR(255) NOT NULL, -- user_id
  service_order_id UUID NOT NULL REFERENCES public.service_orders(id),
  commission_percentage DECIMAL(5,2),
  commission_amount DECIMAL(10,2),
  paid BOOLEAN DEFAULT false,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mechanic_commissions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para acesso baseado em roles
-- Assumindo que os usuários têm roles: 'admin', 'manager', 'mechanic'

-- Clientes: Admin e Manager podem tudo, Mecânico pode ver
CREATE POLICY "admin_manager_clients_all" ON public.clients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "mechanic_clients_read" ON public.clients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role = 'mechanic'
    )
  );

-- Veículos: mesma lógica dos clientes
CREATE POLICY "admin_manager_vehicles_all" ON public.vehicles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "mechanic_vehicles_read" ON public.vehicles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role = 'mechanic'
    )
  );

-- Tipos de serviço: todos podem ver, admin/manager podem modificar
CREATE POLICY "all_service_types_read" ON public.service_types
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "admin_manager_service_types_write" ON public.service_types
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('admin', 'manager')
    )
  );

-- Ordens de serviço: Admin/Manager podem tudo, Mecânico pode ver suas ordens
CREATE POLICY "admin_manager_service_orders_all" ON public.service_orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "mechanic_own_service_orders" ON public.service_orders
  FOR ALL USING (
    mechanic_id::text = auth.uid()::text
  );

-- Itens da OS: seguem a mesma lógica da OS
CREATE POLICY "admin_manager_service_order_items_all" ON public.service_order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "mechanic_own_service_order_items" ON public.service_order_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.service_orders so
      WHERE so.id = service_order_id 
      AND so.mechanic_id::text = auth.uid()::text
    )
  );

-- Agendamentos: similar às OS
CREATE POLICY "admin_manager_schedules_all" ON public.workshop_schedules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "mechanic_own_schedules" ON public.workshop_schedules
  FOR ALL USING (
    mechanic_id::text = auth.uid()::text
  );

-- Fornecedores e Peças: Admin/Manager podem tudo, Mecânico pode ver
CREATE POLICY "admin_manager_suppliers_all" ON public.suppliers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "mechanic_suppliers_read" ON public.suppliers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role = 'mechanic'
    )
  );

CREATE POLICY "admin_manager_parts_all" ON public.parts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "mechanic_parts_read" ON public.parts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role = 'mechanic'
    )
  );

-- Movimentação estoque: Admin/Manager podem tudo
CREATE POLICY "admin_manager_stock_movements_all" ON public.stock_movements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('admin', 'manager')
    )
  );

-- Transações financeiras: Admin/Manager podem tudo
CREATE POLICY "admin_manager_financial_all" ON public.financial_transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('admin', 'manager')
    )
  );

-- Comissões: Admin/Manager podem tudo, Mecânico vê suas próprias
CREATE POLICY "admin_manager_commissions_all" ON public.mechanic_commissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id::text = auth.uid()::text 
      AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "mechanic_own_commissions" ON public.mechanic_commissions
  FOR SELECT USING (
    mechanic_id::text = auth.uid()::text
  );

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_types_updated_at BEFORE UPDATE ON public.service_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_orders_updated_at BEFORE UPDATE ON public.service_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workshop_schedules_updated_at BEFORE UPDATE ON public.workshop_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parts_updated_at BEFORE UPDATE ON public.parts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_transactions_updated_at BEFORE UPDATE ON public.financial_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para gerar número sequencial da OS
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    next_number INTEGER;
    year_suffix VARCHAR(4);
BEGIN
    -- Pega o ano atual
    year_suffix := EXTRACT(YEAR FROM NOW())::VARCHAR;
    
    -- Busca o próximo número sequencial para o ano
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM '^OS(\d+)-' || year_suffix || '$') AS INTEGER)), 0) + 1
    INTO next_number
    FROM public.service_orders
    WHERE order_number ~ ('^OS\d+-' || year_suffix || '$');
    
    -- Gera o número da OS no formato OS001-2024
    NEW.order_number := 'OS' || LPAD(next_number::VARCHAR, 3, '0') || '-' || year_suffix;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_service_order_number 
    BEFORE INSERT ON public.service_orders 
    FOR EACH ROW 
    WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
    EXECUTE FUNCTION generate_order_number();

-- Função para atualizar totais da OS
CREATE OR REPLACE FUNCTION update_service_order_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualiza os totais da ordem de serviço
    UPDATE public.service_orders 
    SET 
        total_labor = (
            SELECT COALESCE(SUM(total_price), 0) 
            FROM public.service_order_items 
            WHERE service_order_id = COALESCE(NEW.service_order_id, OLD.service_order_id)
            AND type = 'service'
        ),
        total_parts = (
            SELECT COALESCE(SUM(total_price), 0) 
            FROM public.service_order_items 
            WHERE service_order_id = COALESCE(NEW.service_order_id, OLD.service_order_id)
            AND type = 'part'
        )
    WHERE id = COALESCE(NEW.service_order_id, OLD.service_order_id);
    
    -- Atualiza o total geral
    UPDATE public.service_orders 
    SET total_amount = total_labor + total_parts - COALESCE(discount, 0)
    WHERE id = COALESCE(NEW.service_order_id, OLD.service_order_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_service_order_totals_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.service_order_items
    FOR EACH ROW EXECUTE FUNCTION update_service_order_totals();

-- Função para movimentar estoque automaticamente
CREATE OR REPLACE FUNCTION handle_stock_movement()
RETURNS TRIGGER AS $$
BEGIN
    -- Se é uma peça sendo adicionada/atualizada em uma OS finalizada
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.type = 'part' AND NEW.part_id IS NOT NULL THEN
        -- Verifica se a OS está finalizada
        IF EXISTS (SELECT 1 FROM public.service_orders WHERE id = NEW.service_order_id AND status = 'finalizado') THEN
            -- Registra saída do estoque
            INSERT INTO public.stock_movements (
                part_id, movement_type, quantity, reference_type, reference_id, 
                notes, created_by
            ) VALUES (
                NEW.part_id, 'saida', NEW.quantity::INTEGER, 'service_order', 
                NEW.service_order_id, 'Saída automática por OS finalizada', auth.uid()::text
            );
            
            -- Atualiza estoque da peça
            UPDATE public.parts 
            SET stock_quantity = stock_quantity - NEW.quantity::INTEGER
            WHERE id = NEW.part_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER handle_stock_movement_trigger
    AFTER INSERT OR UPDATE ON public.service_order_items
    FOR EACH ROW 
    WHEN (NEW.type = 'part' AND NEW.part_id IS NOT NULL)
    EXECUTE FUNCTION handle_stock_movement();

-- Inserir alguns tipos de serviço padrão
INSERT INTO public.service_types (name, description, default_price, estimated_duration, category) VALUES
('Troca de Óleo', 'Troca de óleo do motor', 80.00, 30, 'Manutenção'),
('Revisão Geral', 'Revisão completa do veículo', 250.00, 180, 'Manutenção'),
('Alinhamento', 'Alinhamento das rodas', 120.00, 60, 'Suspensão'),
('Balanceamento', 'Balanceamento das rodas', 100.00, 45, 'Suspensão'),
('Troca de Pastilhas', 'Troca de pastilhas de freio', 200.00, 90, 'Freios'),
('Troca de Correia Dentada', 'Substituição da correia dentada', 350.00, 240, 'Motor'),
('Diagnóstico Eletrônico', 'Diagnóstico com scanner', 150.00, 60, 'Elétrica'),
('Troca de Bateria', 'Substituição da bateria', 300.00, 20, 'Elétrica');