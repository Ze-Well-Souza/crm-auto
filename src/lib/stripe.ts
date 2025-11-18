// Sistema Mock de Pagamentos - CRM Auto MVP
// Remove dependência do Stripe para deploy gratuito

// Mock do Stripe - sempre retorna null/simulação
export const stripePromise = null;

// Configurações mock do Stripe
export const stripeConfig = {
  publicKey: 'mock_stripe_key',
  currency: 'brl',
  locale: 'pt-BR' as const,
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0570de',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  },
};

// Tipos para pagamentos (mantidos para compatibilidade)
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'pix' | 'boleto';
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, string>;
  payment_method_types: string[];
}

// Funções mock de pagamento
export const mockStripe = {
  // Simular criação de checkout session
  createCheckoutSession: async (planId: string, userEmail: string) => {
    console.log(`[MOCK STRIPE] Criando checkout session para plano: ${planId}, usuário: ${userEmail}`);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      sessionId: `mock_session_${Date.now()}`,
      url: '#mock-checkout-url'
    };
  },

  // Simular confirmação de pagamento
  confirmPayment: async (sessionId: string) => {
    console.log(`[MOCK STRIPE] Confirmando pagamento da sessão: ${sessionId}`);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      paymentIntent: {
        id: `mock_payment_${Date.now()}`,
        status: 'succeeded',
        amount: 9900 // R$ 99,00 em centavos
      }
    };
  },

  // Simular criação de payment intent
  createPaymentIntent: async (amount: number, currency: string = 'brl') => {
    console.log(`[MOCK STRIPE] Criando payment intent: ${amount} ${currency}`);
    
    return {
      success: true,
      clientSecret: `mock_client_secret_${Date.now()}`,
      paymentIntent: {
        id: `mock_pi_${Date.now()}`,
        amount,
        currency,
        status: 'requires_payment_method'
      }
    };
  },

  // Simular processamento de webhook
  processWebhook: async (event: string, data: any) => {
    console.log(`[MOCK STRIPE] Processando webhook: ${event}`, data);
    
    return {
      success: true,
      processed: true
    };
  }
};

// Serviço mock de assinaturas
export const mockSubscriptionService = {
  // Criar assinatura mock
  createSubscription: async (userId: string, planId: string) => {
    console.log(`[MOCK SUBSCRIPTION] Criando assinatura para usuário: ${userId}, plano: ${planId}`);
    
    return {
      success: true,
      subscription: {
        id: `mock_sub_${Date.now()}`,
        user_id: userId,
        plan_id: planId,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 dias
        cancel_at_period_end: false
      }
    };
  },

  // Cancelar assinatura mock
  cancelSubscription: async (subscriptionId: string) => {
    console.log(`[MOCK SUBSCRIPTION] Cancelando assinatura: ${subscriptionId}`);
    
    return {
      success: true,
      subscription: {
        id: subscriptionId,
        status: 'cancelled',
        cancel_at_period_end: true
      }
    };
  },

  // Atualizar assinatura mock
  updateSubscription: async (subscriptionId: string, planId: string) => {
    console.log(`[MOCK SUBSCRIPTION] Atualizando assinatura: ${subscriptionId} para plano: ${planId}`);
    
    return {
      success: true,
      subscription: {
        id: subscriptionId,
        plan_id: planId,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    };
  },

  // Obter assinatura do usuário
  getUserSubscription: async (userId: string) => {
    console.log(`[MOCK SUBSCRIPTION] Buscando assinatura do usuário: ${userId}`);
    
    return {
      success: true,
      subscription: {
        id: `mock_user_sub_${userId}`,
        user_id: userId,
        plan_id: 'plan_professional',
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancel_at_period_end: false
      }
    };
  }
};

// Helper para simular loading states
export const simulateStripeLoading = () => {
  return new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
};

// Exportar funções úteis
export const stripeHelpers = {
  formatCurrency: (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount / 100); // Converter centavos para reais
  },

  getPlanPrice: (planId: string) => {
    const prices: Record<string, number> = {
      'plan_free': 0,
      'plan_basic': 9900, // R$ 99,00
      'plan_professional': 24900, // R$ 249,00
      'plan_enterprise': 49900 // R$ 499,00
    };
    return prices[planId] || 0;
  }
};