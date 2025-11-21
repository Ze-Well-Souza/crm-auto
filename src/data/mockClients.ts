import type { Client } from "@/types";

/**
 * Clientes fictícios para demonstração do módulo de Gestão de Clientes
 * Variação de scores, tags e status para testar todos os recursos
 */
export const mockClients: Omit<Client, 'partner_id'>[] = [
  // CLIENTE 1: VIP - Cadastro Perfeito (Score 100%)
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Carlos Eduardo Silva',
    email: 'carlos.silva@email.com',
    phone: '(11) 98765-4321',
    cpf_cnpj: '123.456.789-00',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zip_code: '01234-567',
    notes: 'Cliente VIP - Sempre pontual nos pagamentos',
    tags: ['VIP', 'Preferencial'],
    total_spent: 8500.00,
    service_count: 15,
    vehicle_count: 2,
    quality_score: 100,
    is_vip: true,
    is_active: true,
    last_service_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },

  // CLIENTE 2: NOVO - Cadastro Recente (Score 75%)
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Ana Paula Oliveira',
    email: 'ana.oliveira@email.com',
    phone: '(21) 99876-5432',
    cpf_cnpj: '987.654.321-00',
    address: 'Av. Atlântica, 456',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zip_code: '22021-001',
    notes: null,
    tags: ['Novo'],
    total_spent: 0,
    service_count: 0,
    vehicle_count: 1,
    quality_score: 75,
    is_vip: false,
    is_active: true,
    last_service_date: null,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },

  // CLIENTE 3: REGULAR - Cadastro Incompleto (Score 40%)
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'João Pedro Santos',
    email: 'joao.santos@email.com',
    phone: '(31) 98765-1234',
    cpf_cnpj: null,
    address: null,
    city: null,
    state: null,
    zip_code: null,
    notes: null,
    tags: ['Regular'],
    total_spent: 1200.00,
    service_count: 3,
    vehicle_count: 0,
    quality_score: 40,
    is_vip: false,
    is_active: true,
    last_service_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },

  // CLIENTE 4: VIP - Alto Gasto (Score 90%)
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Maria Fernanda Costa',
    email: 'maria.costa@email.com',
    phone: '(41) 99123-4567',
    cpf_cnpj: '456.789.123-00',
    address: 'Rua XV de Novembro, 789',
    city: 'Curitiba',
    state: 'PR',
    zip_code: '80020-310',
    notes: 'Possui frota de 3 veículos',
    tags: ['VIP', 'Frota'],
    total_spent: 12000.00,
    service_count: 8,
    vehicle_count: 3,
    quality_score: 90,
    is_vip: true,
    is_active: true,
    last_service_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },

  // CLIENTE 5: REGULAR - Sem Email (Score 55%)
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Roberto Almeida',
    email: null,
    phone: '(51) 98234-5678',
    cpf_cnpj: '789.123.456-00',
    address: 'Rua Voluntários da Pátria, 321',
    city: 'Porto Alegre',
    state: 'RS',
    zip_code: null,
    notes: null,
    tags: ['Regular'],
    total_spent: 800.00,
    service_count: 2,
    vehicle_count: 1,
    quality_score: 55,
    is_vip: false,
    is_active: true,
    last_service_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  },

  // CLIENTE 6: NOVO - Cadastro Mínimo (Score 20%)
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'Patrícia Lima',
    email: null,
    phone: '(85) 99345-6789',
    cpf_cnpj: null,
    address: null,
    city: null,
    state: null,
    zip_code: null,
    notes: null,
    tags: ['Novo'],
    total_spent: 0,
    service_count: 0,
    vehicle_count: 0,
    quality_score: 20,
    is_vip: false,
    is_active: true,
    last_service_date: null,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

