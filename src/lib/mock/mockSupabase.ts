// Serviço Mock de Supabase - CRM Auto MVP
// Substitui Supabase temporariamente para permitir deploy sem custos

import { mockDb } from './mockDatabase';

// Tipos compatíveis com Supabase
type SupabaseClient = any;
type SupabaseAuth = any;
type SupabaseStorage = any;

// Mock Auth Client
class MockAuthClient {
  private currentUser: any = null;

  constructor() {
    // Inicializar com usuário mock
    this.currentUser = mockDb.getCurrentUser();
  }

  async signIn({ email, password }: { email: string; password: string }) {
    // Simular login - sempre retorna usuário mock para MVP
    const user = mockDb.getCurrentUser();
    if (user && user.email === email) {
      this.currentUser = user;
      return { data: { user, session: this.createMockSession() }, error: null };
    }
    
    return { 
      data: { user: null, session: null }, 
      error: { message: 'Credenciais inválidas' } 
    };
  }

  async signUp({ email, password }: { email: string; password: string }) {
    // Simular registro - criar novo usuário mock
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      role: 'user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.currentUser = newUser;
    return { data: { user: newUser, session: this.createMockSession() }, error: null };
  }

  async signOut() {
    this.currentUser = null;
    return { error: null };
  }

  async getSession() {
    return { 
      data: { 
        session: this.currentUser ? this.createMockSession() : null 
      }, 
      error: null 
    };
  }

  async getUser() {
    return { data: { user: this.currentUser } };
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    // Simular mudanças de estado de auth
    callback('SIGNED_IN', this.createMockSession());
    
    return { data: { subscription: { unsubscribe: () => {} } } };
  }

  private createMockSession() {
    return {
      access_token: 'mock_access_token',
      refresh_token: 'mock_refresh_token',
      user: this.currentUser
    };
  }
}

// Mock Storage Client
class MockStorageClient {
  async upload(bucket: string, path: string, file: File) {
    // Simular upload - retornar URL mock
    const mockUrl = `https://mock-storage.com/${bucket}/${path}/${file.name}`;
    
    return { 
      data: { 
        path: `${path}/${file.name}`,
        id: `file_${Date.now()}`,
        fullPath: mockUrl
      }, 
      error: null 
    };
  }

  async download(bucket: string, path: string) {
    // Simular download
    return { 
      data: { 
        publicUrl: `https://mock-storage.com/${bucket}/${path}`
      }, 
      error: null 
    };
  }

  from(bucket: string) {
    return {
      upload: (path: string, file: File) => this.upload(bucket, path, file),
      download: (path: string) => this.download(bucket, path)
    };
  }
}

// Mock Realtime Client
class MockRealtimeClient {
  channel(channelName: string) {
    return {
      on: (event: string, callback: (payload: any) => void) => {
        return {
          subscribe: () => {
            // Simular subscription mock
            console.log(`Subscribed to channel: ${channelName}`);
            return { unsubscribe: () => {} };
          }
        };
      }
    };
  }
}

// Mock Supabase Client Principal
class MockSupabaseClient {
  public auth: MockAuthClient;
  public storage: MockStorageClient;
  public realtime: MockRealtimeClient;

  constructor() {
    this.auth = new MockAuthClient();
    this.storage = new MockStorageClient();
    this.realtime = new MockRealtimeClient();
  }

  // Mock método from() para queries
  from(table: string) {
    return new MockQueryBuilder(table);
  }

  // Mock método channel() para realtime
  channel(channelName: string) {
    return this.realtime.channel(channelName);
  }

  // Mock método getSession() para auth
  async getSession() {
    return this.auth.getSession();
  }

  // Mock functions.invoke para edge functions
  functions = {
    invoke: async (functionName: string, { body }: { body: any }) => {
      console.log(`Mock function invoked: ${functionName}`, body);
      
      // Mock respostas para funções de comunicação
      switch (functionName) {
        case 'send-whatsapp':
          return { 
            data: { 
              success: true, 
              messageId: `whatsapp_${Date.now()}`,
              message: 'Mensagem WhatsApp enviada (mock)' 
            }, 
            error: null 
          };
        
        case 'send-email-smtp':
          return { 
            data: { 
              success: true, 
              messageId: `email_${Date.now()}`,
              message: 'Email enviado (mock)' 
            }, 
            error: null 
          };
        
        default:
          return { 
            data: { 
              success: true, 
              message: `Função ${functionName} executada (mock)` 
            }, 
            error: null 
          };
      }
    }
  };

  // Mock funções RPC
  async rpc(functionName: string, params?: any) {
    // Simular chamadas de função
    switch (functionName) {
      case 'get_user_role':
        const user = mockDb.getCurrentUser();
        return { data: user?.role || 'user', error: null };
      
      case 'check_subscription_limit':
        const { user_id, resource, current_count } = params;
        const canCreate = mockDb.checkPlanLimit(user_id, resource, current_count);
        return { data: canCreate, error: null };
      
      default:
        return { data: null, error: { message: 'Função não encontrada' } };
    }
  }
}

// Mock Query Builder
class MockQueryBuilder {
  private table: string;
  private filters: Record<string, any> = {};
  private orderByField: string = '';
  private orderDirection: 'asc' | 'desc' = 'asc';
  private limitValue: number = -1;
  private selectedColumns: string = '*';
  private countOptions?: { count?: 'exact' | 'planned' | 'estimated'; head?: boolean };

  constructor(table: string) {
    this.table = table;
  }

  select(columns: string = '*', options?: { count?: 'exact' | 'planned' | 'estimated'; head?: boolean }) {
    this.selectedColumns = columns;
    this.countOptions = options;
    return this;
  }

  eq(column: string, value: any) {
    const mappedColumn = this.columnAlias(column);
    this.filters[mappedColumn] = value;
    return this;
  }

  neq(column: string, value: any) {
    this.filters[`${column}_neq`] = value;
    return this;
  }

  gt(column: string, value: any) {
    this.filters[`${column}_gt`] = value;
    return this;
  }

  gte(column: string, value: any) {
    this.filters[`${column}_gte`] = value;
    return this;
  }

  lt(column: string, value: any) {
    this.filters[`${column}_lt`] = value;
    return this;
  }

  lte(column: string, value: any) {
    this.filters[`${column}_lte`] = value;
    return this;
  }

  like(column: string, pattern: string) {
    this.filters[`${column}_like`] = pattern;
    return this;
  }

  ilike(column: string, pattern: string) {
    this.filters[`${column}_ilike`] = pattern;
    return this;
  }

  in(column: string, values: any[]) {
    const mappedColumn = this.columnAlias(column);
    this.filters[`${mappedColumn}_in`] = values;
    return this;
  }

  or(conditions: string, options?: { foreignTable?: string }) {
    // Mock implementação do método OR - simplificado para MVP
    this.filters['_or'] = conditions;
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderByField = column;
    this.orderDirection = options?.ascending !== false ? 'asc' : 'desc';
    return this;
  }

  limit(count: number) {
    this.limitValue = count;
    return this;
  }

  async then(callback: (result: any) => void) {
    try {
      // Buscar dados do mock database com alias de tabelas/colunas
      const table = this.tableAlias(this.table);
      const filters = this.mapFilters(this.filters);
      let data = await mockDb.find(table, filters);

      // Handle count queries (head: true)
      if (this.countOptions?.head === true) {
        const count = data.length;
        callback({ data: [], count, error: null });
        return { data: [], count, error: null };
      }

      // Handle count queries (count: 'exact')
      if (this.countOptions?.count === 'exact') {
        const count = data.length;
        callback({ data, count, error: null });
        return { data, count, error: null };
      }

      // Aplicar ordenação
      if (this.orderByField) {
        data.sort((a, b) => {
          const aVal = a[this.orderByField];
          const bVal = b[this.orderByField];
          
          if (this.orderDirection === 'asc') {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        });
      }

      // Aplicar limite
      if (this.limitValue > 0) {
        data = data.slice(0, this.limitValue);
      }

      // Transformar dados conforme a tabela solicitada
      data = data.map((record: any) => this.transformRecord(this.table, record));

      callback({ data, error: null });
    } catch (error) {
      callback({ data: null, error });
    }
    
    return { data: [], error: null };
  }

  // Métodos de modificação
  async insert(data: any) {
    try {
      const table = this.tableAlias(this.table);
      const result = await mockDb.create(table, data);
      return { data: result, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async update(data: any) {
    try {
      // Para updates, precisamos de um filtro específico (geralmente id)
      const idFilter = this.filters['id'];
      if (!idFilter) {
        throw new Error('ID necessário para update');
      }
      
      const table = this.tableAlias(this.table);
      const result = await mockDb.update(table, idFilter, data);
      return { data: result, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async delete() {
    try {
      // Para deletes, precisamos de um filtro específico (geralmente id)
      const idFilter = this.filters['id'];
      if (!idFilter) {
        throw new Error('ID necessário para delete');
      }
      
      const table = this.tableAlias(this.table);
      const success = await mockDb.delete(table, idFilter);
      return { data: success, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Single row operations
  async single() {
    try {
      const table = this.tableAlias(this.table);
      const filters = this.mapFilters(this.filters);
      const results = await mockDb.find(table, filters);
      const first = results[0] || null;
      const transformed = first ? this.transformRecord(this.table, first) : null;
      return { data: transformed, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async maybeSingle() {
    return this.single();
  }

  // Helpers de alias e transformação
  private tableAlias(table: string): string {
    const map: Record<string, string> = {
      partner_subscriptions: 'subscriptions',
      subscription_plans: 'plans',
      financial_transactions: 'financial_transactions',
      service_orders: 'service_orders',
      appointments: 'appointments',
      clients: 'clients',
      vehicles: 'vehicles',
      suppliers: 'suppliers',
      user_roles: 'user_roles',
    };
    return map[table] || table;
  }

  private columnAlias(column: string): string {
    const map: Record<string, string> = {
      partner_id: 'user_id',
      // license_plate já está correto no mock, não precisa mapear
    };
    return map[column] || column;
  }

  private mapFilters(filters: Record<string, any>): Record<string, any> {
    const mapped: Record<string, any> = {};
    for (const [key, value] of Object.entries(filters)) {
      const baseKey = key.replace(/_(in|gt|gte|lt|lte|like|ilike)$/i, '');
      const suffix = key.substring(baseKey.length);
      const aliased = this.columnAlias(baseKey);
      mapped[aliased + suffix] = value;
    }
    return mapped;
  }

  private transformRecord(originalTable: string, record: any): any {
    // Transformar planos para formato esperado pelo hook useSubscription
    if (originalTable === 'subscription_plans') {
      const featuresObj = record.features || {};
      const toLimit = (v: number) => (v === -1 ? null : v);

      return {
        id: record.id,
        name: record.name,
        price: record.price,
        billing_cycle: record.interval === 'year' ? 'yearly' : 'monthly',
        max_appointments_per_month: toLimit(featuresObj.max_appointments ?? null),
        max_active_clients: toLimit(featuresObj.max_clients ?? null),
        max_reports_per_month: toLimit(featuresObj.max_reports ?? null),
        features: record.features_array || [], // Usar o array de features que adicionamos
        is_active: true,
      };
    }

    // Incluir plano dentro da assinatura quando solicitado
    if (originalTable === 'partner_subscriptions') {
      const planRaw = mockDb.getPlan(record.plan_id);
      const plan = planRaw ? this.transformRecord('subscription_plans', planRaw) : null;
      return {
        id: record.id,
        user_id: record.user_id,
        plan_id: record.plan_id,
        status: record.status || 'active',
        trial_ends_at: record.trial_ends_at || null,
        current_period_start: record.current_period_start,
        current_period_end: record.current_period_end,
        cancel_at_period_end: !!record.cancel_at_period_end,
        current_appointments_count: record.current_appointments_count ?? 0,
        current_clients_count: record.current_clients_count ?? 0,
        current_reports_count: record.current_reports_count ?? 0,
        plan,
      };
    }

    return record;
  }
}

// Criar e exportar cliente mock
const mockSupabaseClient = new MockSupabaseClient();

// Exportar função de criação compatível com Supabase
export const createClient = (url: string, key: string) => {
  return mockSupabaseClient;
};

export { mockSupabaseClient };
export { MockSupabaseClient };