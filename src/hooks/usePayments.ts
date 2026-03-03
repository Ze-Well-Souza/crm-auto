import { useState, useCallback } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentIntent, PaymentMethod } from '@stripe/stripe-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, string>;
}

interface PaymentResult {
  success: boolean;
  paymentIntent?: PaymentIntent;
  error?: string;
}

interface UsePaymentsReturn {
  processCardPayment: (paymentData: PaymentData) => Promise<PaymentResult>;
  processPIXPayment: (paymentData: PaymentData) => Promise<PaymentResult>;
  processBoletoPayment: (paymentData: PaymentData) => Promise<PaymentResult>;
  createPaymentIntent: (paymentData: PaymentData) => Promise<{ clientSecret: string; paymentIntentId: string }>;
  confirmPayment: (clientSecret: string, paymentMethod: PaymentMethod) => Promise<PaymentResult>;
  isProcessing: boolean;
  error: string | null;
}

export const usePayments = (): UsePaymentsReturn => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntent = useCallback(async (paymentData: PaymentData) => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke('create-checkout-session', {
        body: paymentData,
      });

      if (fnError) throw fnError;

      return {
        clientSecret: data.client_secret,
        paymentIntentId: data.id
      };
    } catch (err) {
      logger.error('Error creating payment intent:', err);
      throw new Error('Falha ao criar Payment Intent');
    }
  }, []);

  const confirmPayment = useCallback(async (
    clientSecret: string, 
    paymentMethod: PaymentMethod
  ): Promise<PaymentResult> => {
    if (!stripe) {
      return { success: false, error: 'Stripe não foi carregado' };
    }

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          payment_method: paymentMethod.id,
        },
        redirect: 'if_required'
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, paymentIntent };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Erro desconhecido' 
      };
    }
  }, [stripe]);

  const processCardPayment = useCallback(async (paymentData: PaymentData): Promise<PaymentResult> => {
    if (!stripe || !elements) {
      return { success: false, error: 'Stripe não foi carregado' };
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { clientSecret } = await createPaymentIntent(paymentData);

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required'
      });

      if (error) {
        setError(error.message || 'Erro no pagamento');
        return { success: false, error: error.message };
      }

      return { success: true, paymentIntent };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  }, [stripe, elements, createPaymentIntent]);

  const processPIXPayment = useCallback(async (paymentData: PaymentData): Promise<PaymentResult> => {
    setIsProcessing(true);
    setError(null);

    try {
      const { clientSecret, paymentIntentId } = await createPaymentIntent({
        ...paymentData,
        metadata: {
          ...paymentData.metadata,
          payment_method: 'pix'
        }
      });

      // PIX code would be returned from server via webhook
      return { 
        success: true, 
        paymentIntent: {
          id: paymentIntentId,
          status: 'requires_action',
        } as unknown as PaymentIntent
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro no pagamento PIX';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  }, [createPaymentIntent]);

  const processBoletoPayment = useCallback(async (paymentData: PaymentData): Promise<PaymentResult> => {
    setIsProcessing(true);
    setError(null);

    try {
      const { clientSecret, paymentIntentId } = await createPaymentIntent({
        ...paymentData,
        metadata: {
          ...paymentData.metadata,
          payment_method: 'boleto'
        }
      });

      return { 
        success: true, 
        paymentIntent: {
          id: paymentIntentId,
          status: 'requires_action',
        } as unknown as PaymentIntent
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro na geração do boleto';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  }, [createPaymentIntent]);

  return {
    processCardPayment,
    processPIXPayment,
    processBoletoPayment,
    createPaymentIntent,
    confirmPayment,
    isProcessing,
    error
  };
};
