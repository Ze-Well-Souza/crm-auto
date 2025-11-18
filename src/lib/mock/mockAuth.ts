// Serviço Mock de Autenticação - CRM Auto MVP
// Substitui Supabase Auth temporariamente para permitir deploy sem custos

import { mockDb } from './mockDatabase';

export interface MockAuthUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface MockAuthSession {
  access_token: string;
  refresh_token: string;
  user: MockAuthUser;
  expires_at?: number;
}

class MockAuthService {
  private currentUser: MockAuthUser | null = null;
  private currentSession: MockAuthSession | null = null;
  private authListeners: Array<(event: string, session: MockAuthSession | null) => void> = [];

  constructor() {
    // Inicializar com usuário mock do banco de dados
    this.initializeFromMockDb();
  }

  private initializeFromMockDb() {
    const mockUser = mockDb.getCurrentUser();
    if (mockUser) {
      this.currentUser = mockUser;
      this.currentSession = this.createSession(mockUser);
    }
  }

  private createSession(user: MockAuthUser): MockAuthSession {
    return {
      access_token: `mock_access_token_${user.id}_${Date.now()}`,
      refresh_token: `mock_refresh_token_${user.id}_${Date.now()}`,
      user,
      expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    };
  }

  private generateToken(): string {
    return `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private notifyAuthStateChange(event: string, session: MockAuthSession | null) {
    this.authListeners.forEach(listener => {
      try {
        listener(event, session);
      } catch (error) {
        console.error('Erro ao notificar listener de auth:', error);
      }
    });
  }

  // Métodos de autenticação
  async signIn(credentials: { email: string; password: string }): Promise<{
    data: { user: MockAuthUser | null; session: MockAuthSession | null };
    error: Error | null;
  }> {
    try {
      // Para MVP: aceitar qualquer email/password e usar usuário mock
      // Em produção, isso seria substituído por validação real
      
      const mockUser = mockDb.getCurrentUser();
      
      if (!mockUser) {
        return {
          data: { user: null, session: null },
          error: new Error('Nenhum usuário mock disponível')
        };
      }

      // Simular validação básica
      if (credentials.email !== mockUser.email) {
        // Criar novo usuário mock se email diferente
        const newUser = {
          id: `user_${Date.now()}`,
          email: credentials.email,
          role: 'user' as const,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        this.currentUser = newUser;
        this.currentSession = this.createSession(newUser);
      } else {
        // Usar usuário existente
        this.currentUser = mockUser;
        this.currentSession = this.createSession(mockUser);
      }

      this.notifyAuthStateChange('SIGNED_IN', this.currentSession);

      return {
        data: {
          user: this.currentUser,
          session: this.currentSession
        },
        error: null
      };

    } catch (error) {
      return {
        data: { user: null, session: null },
        error: error as Error
      };
    }
  }

  async signUp(userData: { email: string; password: string; [key: string]: any }): Promise<{
    data: { user: MockAuthUser | null; session: MockAuthSession | null };
    error: Error | null;
  }> {
    try {
      // Criar novo usuário mock
      const newUser: MockAuthUser = {
        id: `user_${Date.now()}`,
        email: userData.email,
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      this.currentUser = newUser;
      this.currentSession = this.createSession(newUser);

      // Adicionar ao mock database
      // Note: Isso é apenas para consistência, o usuário principal ainda será o mock
      await mockDb.create('users', newUser);

      this.notifyAuthStateChange('SIGNED_UP', this.currentSession);

      return {
        data: {
          user: this.currentUser,
          session: this.currentSession
        },
        error: null
      };

    } catch (error) {
      return {
        data: { user: null, session: null },
        error: error as Error
      };
    }
  }

  async signOut(): Promise<{ error: Error | null }> {
    try {
      const previousSession = this.currentSession;
      
      this.currentUser = null;
      this.currentSession = null;

      this.notifyAuthStateChange('SIGNED_OUT', null);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  async getUser(): Promise<{ data: { user: MockAuthUser | null } }> {
    return {
      data: {
        user: this.currentUser
      }
    };
  }

  async getSession(): Promise<{ data: { session: MockAuthSession | null } }> {
    return {
      data: {
        session: this.currentSession
      }
    };
  }

  // Gerenciamento de sessão
  async refreshSession(): Promise<{
    data: { user: MockAuthUser | null; session: MockAuthSession | null };
    error: Error | null;
  }> {
    try {
      if (!this.currentUser) {
        return {
          data: { user: null, session: null },
          error: new Error('Nenhum usuário autenticado')
        };
      }

      // Verificar se a sessão expirou
      if (this.currentSession?.expires_at && Date.now() > this.currentSession.expires_at) {
        // Criar nova sessão
        this.currentSession = this.createSession(this.currentUser);
      }

      return {
        data: {
          user: this.currentUser,
          session: this.currentSession
        },
        error: null
      };

    } catch (error) {
      return {
        data: { user: null, session: null },
        error: error as Error
      };
    }
  }

  // Observadores de estado
  onAuthStateChange(callback: (event: string, session: MockAuthSession | null) => void): {
    data: { subscription: { unsubscribe: () => void } };
  } {
    this.authListeners.push(callback);

    // Notificar estado atual imediatamente
    if (this.currentSession) {
      callback('INITIAL_SESSION', this.currentSession);
    } else {
      callback('INITIAL_SESSION', null);
    }

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            const index = this.authListeners.indexOf(callback);
            if (index > -1) {
              this.authListeners.splice(index, 1);
            }
          }
        }
      }
    };
  }

  // Métodos utilitários
  isAuthenticated(): boolean {
    return !!this.currentSession && !!this.currentUser;
  }

  getCurrentUserRole(): 'admin' | 'user' | null {
    return this.currentUser?.role || null;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  // Simular recuperação de senha
  async resetPasswordForEmail(email: string): Promise<{ error: Error | null }> {
    try {
      // Simular envio de email de recuperação
      console.log(`Email de recuperação enviado para: ${email}`);
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  // Simular atualização de senha
  async updateUser(attributes: { password?: string; [key: string]: any }): Promise<{
    data: { user: MockAuthUser | null };
    error: Error | null;
  }> {
    try {
      if (!this.currentUser) {
        return {
          data: { user: null },
          error: new Error('Nenhum usuário autenticado')
        };
      }

      // Atualizar usuário mock
      this.currentUser = {
        ...this.currentUser,
        ...attributes,
        updated_at: new Date().toISOString()
      };

      // Atualizar sessão se necessário
      if (this.currentSession) {
        this.currentSession.user = this.currentUser;
      }

      return {
        data: { user: this.currentUser },
        error: null
      };

    } catch (error) {
      return {
        data: { user: null },
        error: error as Error
      };
    }
  }
}

// Criar instância singleton
const mockAuthService = new MockAuthService();

// Exportar tipos e serviço
export type { MockAuthUser, MockAuthSession };
export { mockAuthService };

// Exportar funções compatíveis com Supabase Auth
export const mockAuth = {
  signIn: (credentials: { email: string; password: string }) => mockAuthService.signIn(credentials),
  signUp: (userData: { email: string; password: string }) => mockAuthService.signUp(userData),
  signOut: () => mockAuthService.signOut(),
  getUser: () => mockAuthService.getUser(),
  getSession: () => mockAuthService.getSession(),
  refreshSession: () => mockAuthService.refreshSession(),
  onAuthStateChange: (callback: (event: string, session: any) => void) => mockAuthService.onAuthStateChange(callback),
  resetPasswordForEmail: (email: string) => mockAuthService.resetPasswordForEmail(email),
  updateUser: (attributes: any) => mockAuthService.updateUser(attributes)
};