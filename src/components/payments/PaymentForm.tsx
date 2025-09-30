import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, QrCode, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

interface PaymentFormProps {
  amount: number;
  description: string;
  orderId?: string;
  onSuccess?: (paymentIntent: any) => void;
  onError?: (error: string) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  description,
  orderId,
  onSuccess,
  onError
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix' | 'boleto'>('card');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const handleCardPayment = async () => {
    if (!stripe || !elements) {
      toast.error('Stripe não foi carregado corretamente');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error('Elemento do cartão não encontrado');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Criar Payment Intent no backend (simulado)
      const paymentIntent = await createPaymentIntent({
        amount: amount * 100, // Stripe usa centavos
        currency: 'brl',
        description,
        payment_method_types: ['card'],
        metadata: { orderId: orderId || '' }
      });

      // Confirmar pagamento
      const { error, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
        paymentIntent.client_secret,
        {
          payment_method: {
            card: cardElement,
          }
        }
      );

      if (error) {
        setPaymentStatus('error');
        onError?.(error.message || 'Erro no pagamento');
        toast.error(error.message || 'Erro no pagamento');
      } else {
        setPaymentStatus('success');
        onSuccess?.(confirmedPayment);
        toast.success('Pagamento realizado com sucesso!');
      }
    } catch (error) {
      setPaymentStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePixPayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Criar Payment Intent para PIX
      const paymentIntent = await createPaymentIntent({
        amount: amount * 100,
        currency: 'brl',
        description,
        payment_method_types: ['pix'],
        metadata: { orderId: orderId || '' }
      });

      // Simular geração de QR Code PIX
      toast.success('QR Code PIX gerado! Escaneie para pagar.');
      setPaymentStatus('success');
      onSuccess?.(paymentIntent);
    } catch (error) {
      setPaymentStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar PIX';
      onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBoletoPayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // Criar Payment Intent para Boleto
      const paymentIntent = await createPaymentIntent({
        amount: amount * 100,
        currency: 'brl',
        description,
        payment_method_types: ['boleto'],
        metadata: { orderId: orderId || '' }
      });

      toast.success('Boleto gerado! Verifique o link para download.');
      setPaymentStatus('success');
      onSuccess?.(paymentIntent);
    } catch (error) {
      setPaymentStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar boleto';
      onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Função simulada para criar Payment Intent (em produção seria uma chamada para o backend)
  const createPaymentIntent = async (data: any) => {
    // Simular chamada para o backend
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({
          id: `pi_${Math.random().toString(36).substr(2, 9)}`,
          client_secret: `pi_${Math.random().toString(36).substr(2, 9)}_secret_${Math.random().toString(36).substr(2, 9)}`,
          amount: data.amount,
          currency: data.currency,
          status: 'requires_payment_method'
        });
      }, 1000);
    });
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Pagamento
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total:</span>
          <span className="text-lg font-semibold">{formatCurrency(amount)}</span>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="card" className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              Cartão
            </TabsTrigger>
            <TabsTrigger value="pix" className="flex items-center gap-1">
              <QrCode className="h-4 w-4" />
              PIX
            </TabsTrigger>
            <TabsTrigger value="boleto" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Boleto
            </TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="space-y-4">
            <div className="space-y-2">
              <Label>Dados do Cartão</Label>
              <div className="p-3 border rounded-md">
                <CardElement options={cardElementOptions} />
              </div>
            </div>
            <Button 
              onClick={handleCardPayment} 
              disabled={!stripe || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                `Pagar ${formatCurrency(amount)}`
              )}
            </Button>
          </TabsContent>

          <TabsContent value="pix" className="space-y-4">
            <div className="text-center space-y-2">
              <QrCode className="h-16 w-16 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Clique para gerar o QR Code PIX
              </p>
            </div>
            <Button 
              onClick={handlePixPayment} 
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando PIX...
                </>
              ) : (
                `Gerar PIX ${formatCurrency(amount)}`
              )}
            </Button>
          </TabsContent>

          <TabsContent value="boleto" className="space-y-4">
            <div className="text-center space-y-2">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Clique para gerar o boleto bancário
              </p>
            </div>
            <Button 
              onClick={handleBoletoPayment} 
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando Boleto...
                </>
              ) : (
                `Gerar Boleto ${formatCurrency(amount)}`
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {paymentStatus === 'success' && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-800">Pagamento processado com sucesso!</span>
          </div>
        )}

        {paymentStatus === 'error' && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-800">Erro no processamento do pagamento</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};