// Centralized mock data for development and testing
import { generateId } from './formatters';
import type { 
  Client, 
  Vehicle, 
  ServiceOrder, 
  Appointment, 
  Part, 
  Supplier, 
  FinancialTransaction, 
  PaymentMethod 
} from '@/types';

export const mockClients: Client[] = [
  {
    id: generateId(),
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-1111',
    cpf_cnpj: '123.456.789-00',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zip_code: '01234-567',
    notes: 'Cliente preferencial',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '(11) 99999-2222',
    cpf_cnpj: '987.654.321-00',
    address: 'Av. Principal, 456',
    city: 'São Paulo',
    state: 'SP',
    zip_code: '01234-890',
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const mockSuppliers: Supplier[] = [
  {
    id: generateId(),
    name: 'Fornecedor ABC',
    contact_name: 'João Silva',
    email: 'contato@abc.com',
    phone: '(11) 99999-0001',
    address: 'Rua das Peças, 123',
    city: 'São Paulo',
    state: 'SP',
    zip_code: '01234-567',
    cnpj: '12.345.678/0001-90',
    notes: 'Fornecedor principal de filtros e peças de motor',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: 'Peças XYZ Ltda',
    contact_name: 'Maria Santos',
    email: 'vendas@xyz.com',
    phone: '(11) 99999-0002',
    address: 'Av. dos Fornecedores, 456',
    city: 'São Paulo',
    state: 'SP',
    zip_code: '01234-890',
    cnpj: '98.765.432/0001-10',
    notes: 'Especialista em freios e suspensão',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const mockParts: Part[] = [
  {
    id: generateId(),
    code: 'FO001',
    name: 'Filtro de Óleo',
    description: 'Filtro de óleo para motor',
    category: 'Filtros',
    brand: 'Mann',
    supplier_id: mockSuppliers[0].id,
    cost_price: 25.90,
    sale_price: 35.90,
    stock_quantity: 15,
    min_stock: 5,
    max_stock: 50,
    location: 'Prateleira A1',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    suppliers: {
      name: mockSuppliers[0].name,
      contact_name: mockSuppliers[0].contact_name
    }
  },
  {
    id: generateId(),
    code: 'PF001',
    name: 'Pastilha de Freio Dianteira',
    description: 'Pastilha de freio para veículos populares',
    category: 'Freios',
    brand: 'TRW',
    supplier_id: mockSuppliers[1].id,
    cost_price: 85.00,
    sale_price: 120.00,
    stock_quantity: 3,
    min_stock: 5,
    max_stock: 30,
    location: 'Prateleira B2',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    suppliers: {
      name: mockSuppliers[1].name,
      contact_name: mockSuppliers[1].contact_name
    }
  }
];

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: generateId(),
    name: 'Dinheiro',
    type: 'dinheiro',
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: 'Cartão de Crédito',
    type: 'cartao_credito',
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: 'PIX',
    type: 'pix',
    active: true,
    created_at: new Date().toISOString(),
  }
];

export const mockTransactions: FinancialTransaction[] = [
  {
    id: generateId(),
    type: 'receita',
    description: 'Troca de óleo - Cliente João',
    amount: 150.00,
    category: 'Serviços Automotivos',
    payment_method: 'Dinheiro',
    due_date: null,
    payment_date: '2025-01-15',
    status: 'pago',
    service_order_id: null,
    client_id: mockClients[0].id,
    notes: 'Pagamento à vista',
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    clients: {
      name: mockClients[0].name,
      email: mockClients[0].email
    }
  },
  {
    id: generateId(),
    type: 'despesa',
    description: 'Compra de filtros de óleo',
    amount: 300.00,
    category: 'Compra de Peças',
    payment_method: 'Cartão de Crédito',
    due_date: null,
    payment_date: '2025-01-14',
    status: 'pago',
    service_order_id: null,
    client_id: null,
    notes: 'Estoque mensal',
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    clients: null
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: generateId(),
    client_id: mockClients[0].id,
    vehicle_id: generateId(),
    service_type: 'Troca de Óleo',
    service_description: 'Troca de óleo e filtro do motor',
    scheduled_date: '2025-01-20',
    scheduled_time: '09:00',
    estimated_duration: 60,
    estimated_value: 150.00,
    final_value: null,
    status: 'agendado',
    notes: 'Cliente preferencial',
    cancellation_reason: null,
    cancelled_at: null,
    cancelled_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    clients: {
      name: mockClients[0].name,
      email: mockClients[0].email,
      phone: mockClients[0].phone
    },
    vehicles: {
      brand: 'Toyota',
      model: 'Corolla',
      year: 2020,
      license_plate: 'ABC-1234'
    }
  },
  {
    id: generateId(),
    client_id: mockClients[1].id,
    vehicle_id: generateId(),
    service_type: 'Revisão Geral',
    service_description: 'Revisão completa dos 60.000 km',
    scheduled_date: '2025-01-21',
    scheduled_time: '14:00',
    estimated_duration: 180,
    estimated_value: 450.00,
    final_value: null,
    status: 'confirmado',
    notes: 'Revisão programada',
    cancellation_reason: null,
    cancelled_at: null,
    cancelled_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    clients: {
      name: mockClients[1].name,
      email: mockClients[1].email,
      phone: mockClients[1].phone
    },
    vehicles: {
      brand: 'Honda',
      model: 'Civic',
      year: 2019,
      license_plate: 'DEF-5678'
    }
  }
];