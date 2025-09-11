-- Resolução final dos problemas críticos de segurança

-- Verificar e habilitar RLS nas tabelas que ainda precisam
-- Appointments já deve ter RLS, mas vamos garantir
DO $$ 
BEGIN
    -- Verificar se appointments precisa de RLS
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE n.nspname = 'public' AND c.relname = 'appointments' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Verificar se appointment_ratings precisa de RLS
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE n.nspname = 'public' AND c.relname = 'appointment_ratings' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE public.appointment_ratings ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Adicionar dados de exemplo para teste
-- Inserir alguns clientes de exemplo
INSERT INTO public.clients (name, email, phone, cpf_cnpj, address, city, state, zip_code, notes) VALUES
('João Silva', 'joao.silva@email.com', '(11) 99999-1111', '123.456.789-01', 'Rua das Flores, 123', 'São Paulo', 'SP', '01234-567', 'Cliente desde 2020'),
('Maria Santos', 'maria.santos@email.com', '(11) 99999-2222', '987.654.321-09', 'Av. Paulista, 456', 'São Paulo', 'SP', '01311-000', 'Cliente VIP'),
('Pedro Oliveira', 'pedro.oliveira@email.com', '(11) 99999-3333', '456.789.123-45', 'Rua do Comércio, 789', 'Guarulhos', 'SP', '07012-345', 'Mecânico conhece bem o carro')
ON CONFLICT DO NOTHING;

-- Inserir alguns veículos de exemplo (associados aos clientes)
INSERT INTO public.vehicles (client_id, brand, model, year, license_plate, vin, color, fuel_type, engine, mileage, notes)
SELECT 
    c.id,
    'Honda',
    'Civic',
    2018,
    'ABC-1234',
    '1HGBH41JXMN109186',
    'Prata',
    'Flex',
    '1.8 16V',
    45000,
    'Veículo em bom estado'
FROM public.clients c WHERE c.email = 'joao.silva@email.com'
UNION ALL
SELECT 
    c.id,
    'Toyota',
    'Corolla',
    2020,
    'XYZ-5678',
    '2T1BURHE0LC123456',
    'Branco',
    'Flex',
    '2.0 16V',
    25000,
    'Revisões em dia'
FROM public.clients c WHERE c.email = 'maria.santos@email.com'
UNION ALL
SELECT 
    c.id,
    'Volkswagen',
    'Gol',
    2015,
    'DEF-9012',
    '9BWZZZ377VT012345',
    'Azul',
    'Flex',
    '1.0 8V',
    80000,
    'Precisa de manutenção preventiva'
FROM public.clients c WHERE c.email = 'pedro.oliveira@email.com'
ON CONFLICT DO NOTHING;

-- Inserir algumas peças de exemplo
INSERT INTO public.parts (code, name, description, category, brand, cost_price, sale_price, stock_quantity, min_stock, max_stock, location, active) VALUES
('FO001', 'Filtro de Óleo', 'Filtro de óleo para motores 1.0 a 2.0', 'Filtros', 'Tecfil', 15.00, 25.00, 50, 10, 100, 'Estante A1', true),
('OL001', 'Óleo Motor 5W30', 'Óleo sintético 5W30 para motores', 'Lubrificantes', 'Castrol', 35.00, 55.00, 30, 5, 60, 'Estante B2', true),
('PA001', 'Pastilha Freio Diant.', 'Pastilha de freio dianteira', 'Freios', 'Bosch', 80.00, 140.00, 20, 5, 40, 'Estante C3', true),
('CO001', 'Correia Dentada', 'Correia dentada para motores 1.0 a 1.6', 'Motor', 'Gates', 120.00, 200.00, 15, 3, 30, 'Estante D4', true),
('BA001', 'Bateria 60Ah', 'Bateria automotiva 60Ah', 'Elétrica', 'Moura', 280.00, 450.00, 10, 2, 20, 'Estante E5', true)
ON CONFLICT (code) DO NOTHING;

-- Inserir alguns fornecedores de exemplo
INSERT INTO public.suppliers (name, contact_name, email, phone, address, cnpj, notes, active) VALUES
('Auto Peças Central', 'Carlos Mendes', 'vendas@autopecascentral.com', '(11) 3333-4444', 'Rua do Comércio, 100', '12.345.678/0001-90', 'Fornecedor principal de peças', true),
('Distribuidora Automotiva', 'Ana Costa', 'contato@distautomotiva.com', '(11) 3333-5555', 'Av. Industrial, 500', '98.765.432/0001-01', 'Ótimos preços em filtros e óleos', true),
('Peças e Acessórios São Paulo', 'Roberto Lima', 'roberto@pecassp.com', '(11) 3333-6666', 'Rua das Oficinas, 250', '45.678.901/0001-23', 'Especialista em peças originais', true)
ON CONFLICT DO NOTHING;