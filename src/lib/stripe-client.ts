import { supabase } from '@/integrations/supabase/client';

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
