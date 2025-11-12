import { supabase } from '@/integrations/supabase/client';

// Chave pública do Stripe (seguro expor no frontend)
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RQRqBD6M8ZNfEdA4AIsE065FQLHccGhPaYLdsF6ibJMB2hlCOlooO4n8DPLSG9yp2qQwaUECmoevU3Nx3WPPOhU0043jrGAJd';

export interface CheckoutSessionParams {
  planId: string;
  billingCycle: 'monthly' | 'yearly';
}

export const createCheckoutSession = async ({ planId, billingCycle }: CheckoutSessionParams) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { planId, billingCycle }
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Erro ao criar checkout session:', error);
    throw error;
  }
};

export const createPortalSession = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase.functions.invoke('create-portal-session');

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Erro ao criar portal session:', error);
    throw error;
  }
};
