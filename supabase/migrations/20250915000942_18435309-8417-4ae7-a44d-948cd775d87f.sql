-- Create suppliers table
CREATE TABLE public.suppliers (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    contact_name VARCHAR,
    email VARCHAR,
    phone VARCHAR,
    address TEXT,
    city VARCHAR,
    state VARCHAR,
    zip_code VARCHAR,
    cnpj VARCHAR,
    notes TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create parts table
CREATE TABLE public.parts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR UNIQUE,
    name VARCHAR NOT NULL,
    description TEXT,
    category VARCHAR,
    brand VARCHAR,
    supplier_id UUID REFERENCES public.suppliers(id),
    cost_price DECIMAL(10,2),
    sale_price DECIMAL(10,2),
    stock_quantity INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 0,
    max_stock INTEGER,
    location VARCHAR,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stock_movements table
CREATE TABLE public.stock_movements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    part_id UUID NOT NULL REFERENCES public.parts(id),
    movement_type VARCHAR NOT NULL CHECK (movement_type IN ('entrada', 'saida', 'ajuste')),
    quantity INTEGER NOT NULL,
    reference_type VARCHAR,
    reference_id UUID,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    notes TEXT,
    created_by VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create financial_transactions table
CREATE TABLE public.financial_transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR NOT NULL CHECK (type IN ('receita', 'despesa')),
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR,
    payment_method VARCHAR,
    due_date DATE,
    payment_date DATE,
    status VARCHAR DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'vencido', 'cancelado')),
    service_order_id UUID,
    client_id UUID REFERENCES public.clients(id),
    notes TEXT,
    created_by VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment_methods table
CREATE TABLE public.payment_methods (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    type VARCHAR CHECK (type IN ('dinheiro', 'cartao_credito', 'cartao_debito', 'pix', 'transferencia', 'cheque')),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Create policies for suppliers
CREATE POLICY "Anyone can manage suppliers" ON public.suppliers FOR ALL USING (true) WITH CHECK (true);

-- Create policies for parts
CREATE POLICY "Anyone can manage parts" ON public.parts FOR ALL USING (true) WITH CHECK (true);

-- Create policies for stock_movements
CREATE POLICY "Anyone can manage stock movements" ON public.stock_movements FOR ALL USING (true) WITH CHECK (true);

-- Create policies for financial_transactions
CREATE POLICY "Anyone can manage financial transactions" ON public.financial_transactions FOR ALL USING (true) WITH CHECK (true);

-- Create policies for payment_methods
CREATE POLICY "Anyone can manage payment methods" ON public.payment_methods FOR ALL USING (true) WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_parts_updated_at BEFORE UPDATE ON public.parts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_financial_transactions_updated_at BEFORE UPDATE ON public.financial_transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default payment methods
INSERT INTO public.payment_methods (name, type) VALUES
('Dinheiro', 'dinheiro'),
('Cartão de Crédito', 'cartao_credito'),
('Cartão de Débito', 'cartao_debito'),
('PIX', 'pix'),
('Transferência Bancária', 'transferencia'),
('Cheque', 'cheque');

-- Create appointments table (real one)
CREATE TABLE public.appointments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.clients(id),
    vehicle_id UUID REFERENCES public.vehicles(id),
    service_type VARCHAR NOT NULL,
    service_description TEXT,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    estimated_duration INTEGER DEFAULT 60,
    estimated_value DECIMAL(10,2),
    final_value DECIMAL(10,2),
    status VARCHAR DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'em_andamento', 'concluido', 'cancelado')),
    notes TEXT,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_by VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can manage appointments" ON public.appointments FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();