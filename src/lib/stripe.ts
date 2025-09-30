import { loadStripe } from '@stripe/stripe-js';

// Configuração do Stripe
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Inicializar Stripe
export const stripePromise = loadStripe(stripePublishableKey);

// Configurações do Stripe
export const stripeConfig = {
  publicKey: stripePublishableKey,
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

// Tipos para pagamentos
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