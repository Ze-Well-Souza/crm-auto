import { useState, useCallback } from 'react';
import * as Sentry from '@sentry/react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { PaymentIntent, PaymentMethod } from '@stripe/stripe-js';

// Interface para o resultado mock de PaymentIntent
interface MockPaymentIntent extends Partial<PaymentIntent> {
  id: string;
  status: PaymentIntent.Status;
  metadata?: {
    [key: string]: string;
  };
}

interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, string>;
}

interface PaymentResult {
  success: boolean;
  paymentIntent?: MockPaymentIntent;
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

  // Simular criação de Payment Intent no backend
  const createPaymentIntent = useCallback(async (paymentData: PaymentData) => {
    try {
      // Em um ambiente real, isso seria uma chamada para seu backend
      // que criaria o Payment Intent usando a Stripe Secret Key
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar Payment Intent');
      }

      const data = await response.json();
      return {
        clientSecret: data.client_secret,
        paymentIntentId: data.id
      };
    } catch (err) {
      // Simulação para desenvolvimento
      const mockClientSecret = `pi_mock_${Date.now()}_secret_mock`;
      const mockPaymentIntentId = `pi_mock_${Date.now()}`;
      
      return {
        clientSecret: mockClientSecret,
        paymentIntentId: mockPaymentIntentId
      };
    }
  }, []);

  // Confirmar pagamento com método de pagamento
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

  // Processar pagamento com cartão
  const processCardPayment = useCallback(async (paymentData: PaymentData): Promise<PaymentResult> => {
    if (!stripe || !elements) {
      return { success: false, error: 'Stripe não foi carregado' };
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Criar Payment Intent
      const { clientSecret } = await createPaymentIntent(paymentData);

      // Confirmar pagamento
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

  // Processar pagamento PIX
  const processPIXPayment = useCallback(async (paymentData: PaymentData): Promise<PaymentResult> => {
    setIsProcessing(true);
    setError(null);

    try {
      // Criar Payment Intent para PIX
      const { clientSecret, paymentIntentId } = await createPaymentIntent({
        ...paymentData,
        metadata: {
          ...paymentData.metadata,
          payment_method: 'pix'
        }
      });

      // Simular criação de código PIX
      // Em um ambiente real, você criaria o código PIX através da API do seu provedor
      const pixCode = `00020126580014BR.GOV.BCB.PIX0136${paymentIntentId}5204000053039865802BR5925NOME DO BENEFICIARIO6009SAO PAULO62070503***6304`;
      
      // Simular sucesso do PIX (em produção, isso seria confirmado via webhook)
      setTimeout(() => {
        // Aqui você atualizaria o status do pagamento
        console.log('PIX payment confirmed:', paymentIntentId);
      }, 5000);

      return { 
        success: true, 
        paymentIntent: {
          id: paymentIntentId,
          status: 'requires_action',
          metadata: { pix_code: pixCode }
        }
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro no pagamento PIX';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  }, [createPaymentIntent]);

  // Processar pagamento com boleto
  const processBoletoPayment = useCallback(async (paymentData: PaymentData): Promise<PaymentResult> => {
    setIsProcessing(true);
    setError(null);

    try {
      // Criar Payment Intent para boleto
      const { clientSecret, paymentIntentId } = await createPaymentIntent({
        ...paymentData,
        metadata: {
          ...paymentData.metadata,
          payment_method: 'boleto'
        }
      });

      // Simular geração de boleto
      const boletoUrl = `https://example.com/boleto/${paymentIntentId}.pdf`;
      const boletoCode = `34191.79001 01043.510047 91020.150008 1 84770000${Math.floor(paymentData.amount * 100).toString().padStart(8, '0')}`;

      return { 
        success: true, 
        paymentIntent: {
          id: paymentIntentId,
          status: 'requires_action',
          metadata: { 
            boleto_url: boletoUrl,
            boleto_code: boletoCode
          }
        }
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