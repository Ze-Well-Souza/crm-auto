// Sistema Mock de Banco de Dados - CRM Auto MVP
// Substitui Supabase temporariamente para permitir deploy sem custos

export interface MockUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface MockClient {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  address?: string;
  status: 'active' | 'inactive';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MockVehicle {
  id: string;
  user_id: string;
  client_id: string;
  brand: string;
  model: string;
  year: number;
  license_plate: string;
  color?: string;
  chassis?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MockAppointment {
  id: string;
  client_id: string;
  vehicle_id: string;
  service_type: string;
  scheduled_date: string;
  duration: number; // em minutos
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MockServiceOrder {
  id: string;
  client_id: string;
  vehicle_id: string;
  order_number: string;
  problem_description?: string;
  diagnosis?: string;
  services_performed?: string[];
  parts_used?: string[];
  labor_cost?: number;
  total_cost: number;
  status: 'open' | 'in_progress' | 'waiting_parts' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface MockPart {
  id: string;
  user_id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  min_quantity: number;
  cost_price: number;
  sale_price: number;
  supplier?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface MockUserRole {
  id: string;
  user_id: string;
  role: 'user' | 'admin' | 'super_admin';
  created_at: string;
  updated_at: string;
}

export interface MockFinancialTransaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  due_date: string;
  payment_date?: string;
  status: 'pending' | 'paid' | 'overdue';
  client_id?: string;
  service_order_id?: string;
  created_at: string;
  updated_at: string;
}

export interface MockSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'past_due';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface MockPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: {
    max_clients: number;
    max_appointments: number;
    max_parts: number;
    max_transactions: number;
    max_reports: number;
    max_storage_gb: number;
    max_emails: number;
    max_users: number;
  };
  created_at: string;
}

// Mock Database Storage
class MockDatabase {
  private static instance: MockDatabase;
  private storage: {
    users: MockUser[];
    clients: MockClient[];
    vehicles: MockVehicle[];
    appointments: MockAppointment[];
    service_orders: MockServiceOrder[];
    parts: MockPart[];
    financial_transactions: MockFinancialTransaction[];
    subscriptions: MockSubscription[];
    plans: MockPlan[];
    user_roles: MockUserRole[];
  };

  private constructor() {
    this.storage = {
      users: [],
      clients: [],
      vehicles: [],
      appointments: [],
      service_orders: [],
      parts: [],
      financial_transactions: [],
      subscriptions: [],
      plans: [],
      user_roles: []
    };
    this.initializeMockData();
  }

  static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  private initializeMockData() {
    // Inicializar planos de assinatura
    this.storage.plans = [
      {
        id: 'plan_free',
        name: 'Gratuito',
        price: 0,
        currency: 'BRL',
        interval: 'month',
        features: {
          max_clients: 50,
          max_appointments: 50,
          max_parts: 200,
          max_transactions: 100,
          max_reports: 5,
          max_storage_gb: 1,
          max_emails: 50,
          max_users: 1
        },
        // Features como array de strings para o sistema esperar
        features_array: ['crm_clients', 'crm_vehicles', 'crm_appointments', 'crm_service_orders', 'crm_parts', 'crm_basic_reports'],
        created_at: new Date().toISOString()
      },
      {
        id: 'plan_basic',
        name: 'Básico',
        price: 99,
        currency: 'BRL',
        interval: 'month',
        features: {
          max_clients: 200,
          max_appointments: 100,
          max_parts: 1000,
          max_transactions: 500,
          max_reports: 20,
          max_storage_gb: 10,
          max_emails: 200,
          max_users: 1
        },
        // Features como array de strings para o sistema esperar
        features_array: ['crm_clients', 'crm_vehicles', 'crm_appointments', 'crm_service_orders', 'crm_parts', 'crm_financial', 'crm_reports'],
        created_at: new Date().toISOString()
      },
      {
        id: 'plan_professional',
        name: 'Profissional',
        price: 249,
        currency: 'BRL',
        interval: 'month',
        features: {
          max_clients: 1000,
          max_appointments: 500,
          max_parts: 5000,
          max_transactions: 2000,
          max_reports: 50,
          max_storage_gb: 50,
          max_emails: 1000,
          max_users: 5
        },
        // Features como array de strings para o sistema esperar
        features_array: ['crm_clients', 'crm_vehicles', 'crm_appointments', 'crm_service_orders', 'crm_parts', 'crm_financial', 'crm_reports', 'crm_communication', 'crm_advanced_reports'],
        created_at: new Date().toISOString()
      },
      {
        id: 'plan_enterprise',
        name: 'Enterprise',
        price: 499,
        currency: 'BRL',
        interval: 'month',
        features: {
          max_clients: -1, // ilimitado
          max_appointments: -1,
          max_parts: -1,
          max_transactions: -1,
          max_reports: -1,
          max_storage_gb: -1,
          max_emails: -1,
          max_users: -1
        },
        // Features como array de strings para o sistema esperar - todas as features
        features_array: ['crm_clients', 'crm_vehicles', 'crm_appointments', 'crm_service_orders', 'crm_parts', 'crm_financial', 'crm_reports', 'crm_communication', 'crm_advanced_reports', 'crm_admin', 'crm_unlimited'],
        created_at: new Date().toISOString()
      }
    ];

    // Criar usuário admin mock
    const mockUser: MockUser = {
      id: 'user_001',
      email: 'admin@crmauto.com',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.storage.users.push(mockUser);

    // Criar role admin para o usuário mock
    const mockUserRole: MockUserRole = {
      id: 'role_001',
      user_id: mockUser.id,
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.storage.user_roles.push(mockUserRole);

    // Criar assinatura mock para usuário admin (plano profissional grátis)
    const mockSubscription: MockSubscription = {
      id: 'sub_001',
      user_id: mockUser.id,
      plan_id: 'plan_professional',
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // +1 ano
      cancel_at_period_end: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Campos de contagem atual para o sistema
      current_clients_count: 3,
      current_appointments_count: 5,
      current_service_orders_count: 2,
      current_parts_count: 10,
      current_transactions_count: 8
    };
    this.storage.subscriptions.push(mockSubscription);

    // Criar dados mock iniciais
    this.createInitialMockData(mockUser.id);
  }

  private createInitialMockData(userId: string) {
    // Clientes mock
    const mockClients: MockClient[] = [
      {
        id: 'client_001',
        user_id: userId,
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '(11) 99999-9999',
        cpf: '123.456.789-00',
        address: 'Rua Principal, 123, São Paulo - SP',
        status: 'active',
        notes: 'Cliente VIP, sempre paga em dia',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'client_002',
        user_id: userId,
        name: 'Maria Santos',
        email: 'maria@email.com',
        phone: '(11) 98888-8888',
        cpf: '987.654.321-00',
        address: 'Av. Central, 456, São Paulo - SP',
        status: 'active',
        notes: 'Prefere agendar pela manhã',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    this.storage.clients.push(...mockClients);

    // Veículos mock
    const mockVehicles: MockVehicle[] = [
      {
        id: 'vehicle_001',
        user_id: userId,
        client_id: 'client_001',
        brand: 'Volkswagen',
        model: 'Gol',
        year: 2020,
        license_plate: 'ABC-1234',
        color: 'Prata',
        chassis: '9BWZZZ377VT004352',
        notes: 'Última revisão: 15.000km',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'vehicle_002',
        user_id: userId,
        client_id: 'client_002',
        brand: 'Fiat',
        model: 'Uno',
        year: 2019,
        license_plate: 'DEF-5678',
        color: 'Branco',
        chassis: '9BGLAD7T4KB123456',
        notes: 'Troca de óleo atrasada',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    this.storage.vehicles.push(...mockVehicles);

    // Peças mock
    const mockParts: MockPart[] = [
      {
        id: 'part_001',
        user_id: userId,
        sku: 'OLEO-5W30-1L',
        name: 'Óleo Motor 5W30 1L',
        category: 'Lubrificantes',
        quantity: 20,
        min_quantity: 5,
        cost_price: 25.0,
        sale_price: 45.0,
        supplier: 'Lubrificantes Brasil',
        location: 'Prateleira A1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'part_002',
        user_id: userId,
        sku: 'FILT-AR-123',
        name: 'Filtro de Ar',
        category: 'Filtros',
        quantity: 15,
        min_quantity: 3,
        cost_price: 15.0,
        sale_price: 30.0,
        supplier: 'Filtros Ltda',
        location: 'Prateleira B2',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    this.storage.parts.push(...mockParts);

    // Transações financeiras mock
    const mockTransactions: MockFinancialTransaction[] = [
      {
        id: 'transaction_001',
        user_id: userId,
        type: 'income',
        category: 'Serviços',
        description: 'Troca de óleo completa',
        amount: 150.0,
        due_date: new Date().toISOString(),
        payment_date: new Date().toISOString(),
        status: 'paid',
        client_id: 'client_001',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'transaction_002',
        user_id: userId,
        type: 'expense',
        category: 'Fornecedores',
        description: 'Compra de óleo e filtros',
        amount: 500.0,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 dias
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    this.storage.financial_transactions.push(...mockTransactions);
  }

  // Métodos genéricos CRUD
  async create(table: string, data: any): Promise<any> {
    const id = `${table}_${Date.now()}`;
    const now = new Date().toISOString();
    const newRecord = {
      ...data,
      id,
      created_at: now,
      updated_at: now
    };
    
    (this.storage as any)[table].push(newRecord);
    return newRecord;
  }

  async find(table: string, filters: Record<string, any> = {}): Promise<any[]> {
    const records = (this.storage as any)[table] || [];
    
    if (Object.keys(filters).length === 0) {
      return records;
    }

    return records.filter((record: any) => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === null || value === undefined) return true;
        
        // Handle _in filter (e.g., status_in: ['trial', 'active'])
        if (key.endsWith('_in') && Array.isArray(value)) {
          const field = key.replace('_in', '');
          return value.includes(record[field]);
        }
        
        // Handle regular equality filter
        return record[key] === value;
      });
    });
  }

  async findOne(table: string, filters: Record<string, any>): Promise<any | null> {
    const results = await this.find(table, filters);
    return results[0] || null;
  }

  async update(table: string, id: string, data: any): Promise<any | null> {
    const records = (this.storage as any)[table] || [];
    const index = records.findIndex((record: any) => record.id === id);
    
    if (index === -1) return null;
    
    const updatedRecord = {
      ...records[index],
      ...data,
      id,
      updated_at: new Date().toISOString()
    };
    
    records[index] = updatedRecord;
    return updatedRecord;
  }

  async delete(table: string, id: string): Promise<boolean> {
    const records = (this.storage as any)[table] || [];
    const index = records.findIndex((record: any) => record.id === id);
    
    if (index === -1) return false;
    
    records.splice(index, 1);
    return true;
  }

  // Métodos específicos
  getCurrentUser(): MockUser | null {
    return this.storage.users[0] || null;
  }

  getUserSubscription(userId: string): MockSubscription | null {
    return this.storage.subscriptions.find(sub => sub.user_id === userId) || null;
  }

  getPlan(planId: string): MockPlan | null {
    return this.storage.plans.find(plan => plan.id === planId) || null;
  }

  getUserRole(userId: string): MockUserRole | null {
    return this.storage.user_roles.find(role => role.user_id === userId) || null;
  }

  checkPlanLimit(userId: string, resource: string, currentCount: number): boolean {
    const subscription = this.getUserSubscription(userId);
    if (!subscription) return false;
    
    const plan = this.getPlan(subscription.plan_id);
    if (!plan) return false;

    const limit = (plan.features as any)[`max_${resource}`];
    if (limit === -1) return true; // ilimitado
    
    return currentCount < limit;
  }
}

export const mockDb = MockDatabase.getInstance();

// Exportar tipos para uso nos hooks
export type {
  MockUser,
  MockClient,
  MockVehicle,
  MockAppointment,
  MockServiceOrder,
  MockPart,
  MockFinancialTransaction,
  MockSubscription,
  MockPlan
};