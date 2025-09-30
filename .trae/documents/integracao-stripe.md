# 💳 Documentação Técnica - Integração Stripe

**Versão:** 1.0.0  
**Data:** Janeiro 2025  
**Público-alvo:** Desenvolvedores e administradores técnicos

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Configuração Inicial](#configuração-inicial)
3. [Arquitetura da Integração](#arquitetura-da-integração)
4. [Implementação Frontend](#implementação-frontend)
5. [Implementação Backend](#implementação-backend)
6. [Webhooks](#webhooks)
7. [Segurança](#segurança)
8. [Testes](#testes)
9. [Monitoramento](#monitoramento)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

A integração com Stripe permite processar pagamentos de forma segura no CRM Parceiro, oferecendo múltiplas formas de pagamento e controle completo das transações.

### Funcionalidades Implementadas

- ✅ **Pagamentos únicos** - Cartão de crédito/débito
- ✅ **Pagamentos recorrentes** - Assinaturas e planos
- ✅ **PIX** - Pagamento instantâneo brasileiro
- ✅ **Boleto bancário** - Para clientes sem cartão
- ✅ **Webhooks** - Notificações em tempo real
- ✅ **Reembolsos** - Estornos automáticos
- ✅ **Multi-currency** - Suporte a múltiplas moedas
- ✅ **3D Secure** - Autenticação adicional

### Configuração Atual

Baseado na imagem fornecida, o sistema está configurado com:

```
Environment: Sandbox
Secret Key: sk_test****NKf9
Public Key: pk_test****GAJd
Status: Configured ✅
```

---

## ⚙️ Configuração Inicial

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Stripe Configuration
STRIPE_PUBLIC_KEY=pk_test_51234567890abcdef
STRIPE_SECRET_KEY=sk_test_51234567890abcdef
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef

# Environment
NODE_ENV=development
STRIPE_ENVIRONMENT=sandbox

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/crm_parceiro

# Application
APP_URL=http://localhost:3000
API_URL=http://localhost:3001
```

### 2. Instalação de Dependências

**Frontend (React):**
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
npm install axios react-query
```

**Backend (Node.js):**
```bash
npm install stripe express cors helmet
npm install @types/stripe @types/express
```

### 3. Configuração do Stripe Dashboard

1. **Acesse** [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Configure webhooks** para sua URL
3. **Ative produtos** necessários (PIX, boleto)
4. **Configure** métodos de pagamento
5. **Defina** regras de negócio

---

## 🏗️ Arquitetura da Integração

### Fluxo de Pagamento

```mermaid
sequenceDiagram
    participant C as Cliente
    participant F as Frontend
    participant B as Backend
    participant S as Stripe
    participant DB as Database

    C->>F: Inicia pagamento
    F->>B: Cria Payment Intent
    B->>S: Cria Payment Intent
    S->>B: Retorna client_secret
    B->>DB: Salva transação (pending)
    B->>F: Retorna client_secret
    F->>S: Confirma pagamento
    S->>F: Retorna resultado
    F->>B: Notifica resultado
    S->>B: Webhook (confirmação)
    B->>DB: Atualiza status
    B->>C: Notifica sucesso
```

### Estrutura de Arquivos

```
src/
├── components/
│   ├── payments/
│   │   ├── PaymentForm.tsx
│   │   ├── PaymentMethods.tsx
│   │   ├── PaymentStatus.tsx
│   │   └── StripeProvider.tsx
│   └── common/
├── services/
│   ├── stripe.service.ts
│   ├── payment.service.ts
│   └── api.service.ts
├── hooks/
│   ├── useStripe.ts
│   ├── usePayment.ts
│   └── usePaymentMethods.ts
├── types/
│   ├── payment.types.ts
│   └── stripe.types.ts
└── utils/
    ├── stripe.utils.ts
    └── payment.utils.ts
```

---

## 💻 Implementação Frontend

### 1. Configuração do Stripe Provider

```typescript
// src/components/payments/StripeProvider.tsx
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

interface StripeProviderProps {
  children: React.ReactNode;
}

export const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  const options = {
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
    locale: 'pt-BR' as const,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};
```

### 2. Componente de Pagamento

```typescript
// src/components/payments/PaymentForm.tsx
import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from '@stripe/react-stripe-js';
import { Button, Alert, Spinner } from '../common';
import { usePayment } from '../../hooks/usePayment';

interface PaymentFormProps {
  amount: number;
  currency: string;
  orderId: string;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency,
  orderId,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { createPaymentIntent, isLoading } = usePayment();
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Criar Payment Intent no backend
      const { clientSecret } = await createPaymentIntent({
        amount,
        currency,
        orderId,
      });

      // Confirmar pagamento
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        setError(stripeError.message || 'Erro no pagamento');
        onError(stripeError.message || 'Erro no pagamento');
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent);
      }
    } catch (err: any) {
      setError(err.message || 'Erro interno');
      onError(err.message || 'Erro interno');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert type="error" message={error} />
      )}

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">
          Informações de Pagamento
        </h3>
        
        <PaymentElement
          options={{
            layout: 'tabs',
            paymentMethodOrder: ['card', 'pix', 'boleto'],
          }}
        />
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">
          Endereço de Cobrança
        </h3>
        
        <AddressElement
          options={{
            mode: 'billing',
            allowedCountries: ['BR'],
          }}
        />
      </div>

      <Button
        type="submit"
        disabled={!stripe || processing || isLoading}
        className="w-full"
        size="lg"
      >
        {processing || isLoading ? (
          <>
            <Spinner size="sm" />
            Processando...
          </>
        ) : (
          `Pagar R$ ${(amount / 100).toFixed(2)}`
        )}
      </Button>
    </form>
  );
};
```

### 3. Hook de Pagamento

```typescript
// src/hooks/usePayment.ts
import { useMutation, useQuery } from 'react-query';
import { paymentService } from '../services/payment.service';
import { PaymentIntent, PaymentMethod } from '../types/payment.types';

export const usePayment = () => {
  const createPaymentIntentMutation = useMutation(
    paymentService.createPaymentIntent,
    {
      onSuccess: (data) => {
        console.log('Payment Intent criado:', data);
      },
      onError: (error) => {
        console.error('Erro ao criar Payment Intent:', error);
      },
    }
  );

  const confirmPaymentMutation = useMutation(
    paymentService.confirmPayment,
    {
      onSuccess: (data) => {
        console.log('Pagamento confirmado:', data);
      },
      onError: (error) => {
        console.error('Erro ao confirmar pagamento:', error);
      },
    }
  );

  const { data: paymentMethods, isLoading: loadingMethods } = useQuery(
    'paymentMethods',
    paymentService.getPaymentMethods,
    {
      staleTime: 5 * 60 * 1000, // 5 minutos
    }
  );

  return {
    createPaymentIntent: createPaymentIntentMutation.mutateAsync,
    confirmPayment: confirmPaymentMutation.mutateAsync,
    paymentMethods,
    isLoading: createPaymentIntentMutation.isLoading || confirmPaymentMutation.isLoading,
    loadingMethods,
  };
};
```

### 4. Serviço de Pagamento

```typescript
// src/services/payment.service.ts
import { apiService } from './api.service';
import { 
  CreatePaymentIntentRequest,
  PaymentIntentResponse,
  PaymentMethod,
  PaymentStatus 
} from '../types/payment.types';

class PaymentService {
  async createPaymentIntent(data: CreatePaymentIntentRequest): Promise<PaymentIntentResponse> {
    const response = await apiService.post('/payments/create-intent', data);
    return response.data;
  }

  async confirmPayment(paymentIntentId: string): Promise<PaymentStatus> {
    const response = await apiService.post(`/payments/${paymentIntentId}/confirm`);
    return response.data;
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await apiService.get('/payments/methods');
    return response.data;
  }

  async getPaymentStatus(paymentIntentId: string): Promise<PaymentStatus> {
    const response = await apiService.get(`/payments/${paymentIntentId}/status`);
    return response.data;
  }

  async refundPayment(paymentIntentId: string, amount?: number): Promise<any> {
    const response = await apiService.post(`/payments/${paymentIntentId}/refund`, {
      amount,
    });
    return response.data;
  }

  async getPaymentHistory(filters?: any): Promise<any> {
    const response = await apiService.get('/payments/history', { params: filters });
    return response.data;
  }
}

export const paymentService = new PaymentService();
```

---

## 🔧 Implementação Backend

### 1. Configuração do Stripe

```typescript
// src/config/stripe.config.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export const stripeConfig = {
  publicKey: process.env.STRIPE_PUBLIC_KEY!,
  secretKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  environment: process.env.STRIPE_ENVIRONMENT || 'sandbox',
};
```

### 2. Controller de Pagamentos

```typescript
// src/controllers/payment.controller.ts
import { Request, Response } from 'express';
import { stripe } from '../config/stripe.config';
import { PaymentService } from '../services/payment.service';
import { DatabaseService } from '../services/database.service';

export class PaymentController {
  private paymentService = new PaymentService();
  private dbService = new DatabaseService();

  async createPaymentIntent(req: Request, res: Response) {
    try {
      const { amount, currency = 'brl', orderId, customerId } = req.body;

      // Validações
      if (!amount || amount < 50) {
        return res.status(400).json({
          error: 'Valor mínimo de R$ 0,50',
        });
      }

      // Buscar dados do cliente
      const customer = await this.dbService.getCustomer(customerId);
      
      // Criar Payment Intent no Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          orderId,
          customerId,
          source: 'crm_parceiro',
        },
        customer: customer?.stripeCustomerId,
        description: `Pagamento OS #${orderId}`,
      });

      // Salvar no banco de dados
      await this.dbService.createPayment({
        stripePaymentIntentId: paymentIntent.id,
        orderId,
        customerId,
        amount,
        currency,
        status: 'pending',
        createdAt: new Date(),
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error: any) {
      console.error('Erro ao criar Payment Intent:', error);
      res.status(500).json({
        error: error.message || 'Erro interno do servidor',
      });
    }
  }

  async confirmPayment(req: Request, res: Response) {
    try {
      const { paymentIntentId } = req.params;

      // Buscar Payment Intent no Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      // Atualizar status no banco
      await this.dbService.updatePaymentStatus(
        paymentIntentId,
        paymentIntent.status
      );

      res.json({
        status: paymentIntent.status,
        paymentIntent,
      });
    } catch (error: any) {
      console.error('Erro ao confirmar pagamento:', error);
      res.status(500).json({
        error: error.message || 'Erro interno do servidor',
      });
    }
  }

  async refundPayment(req: Request, res: Response) {
    try {
      const { paymentIntentId } = req.params;
      const { amount } = req.body;

      // Criar reembolso no Stripe
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount,
      });

      // Atualizar no banco
      await this.dbService.createRefund({
        stripeRefundId: refund.id,
        paymentIntentId,
        amount: refund.amount,
        status: refund.status,
        createdAt: new Date(),
      });

      res.json(refund);
    } catch (error: any) {
      console.error('Erro ao processar reembolso:', error);
      res.status(500).json({
        error: error.message || 'Erro interno do servidor',
      });
    }
  }

  async getPaymentHistory(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, status, customerId } = req.query;

      const payments = await this.dbService.getPayments({
        page: Number(page),
        limit: Number(limit),
        status: status as string,
        customerId: customerId as string,
      });

      res.json(payments);
    } catch (error: any) {
      console.error('Erro ao buscar histórico:', error);
      res.status(500).json({
        error: error.message || 'Erro interno do servidor',
      });
    }
  }
}
```

### 3. Rotas de Pagamento

```typescript
// src/routes/payment.routes.ts
import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validatePayment } from '../middleware/validation.middleware';

const router = Router();
const paymentController = new PaymentController();

// Aplicar middleware de autenticação
router.use(authMiddleware);

// Rotas de pagamento
router.post('/create-intent', validatePayment, paymentController.createPaymentIntent);
router.post('/:paymentIntentId/confirm', paymentController.confirmPayment);
router.post('/:paymentIntentId/refund', paymentController.refundPayment);
router.get('/history', paymentController.getPaymentHistory);
router.get('/:paymentIntentId/status', paymentController.getPaymentStatus);

export { router as paymentRoutes };
```

---

## 🔗 Webhooks

### 1. Configuração de Webhooks

```typescript
// src/controllers/webhook.controller.ts
import { Request, Response } from 'express';
import { stripe, stripeConfig } from '../config/stripe.config';
import { DatabaseService } from '../services/database.service';
import { NotificationService } from '../services/notification.service';

export class WebhookController {
  private dbService = new DatabaseService();
  private notificationService = new NotificationService();

  async handleStripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'] as string;
    let event: any;

    try {
      // Verificar assinatura do webhook
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        stripeConfig.webhookSecret
      );
    } catch (err: any) {
      console.error('Erro na verificação do webhook:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Processar evento
    try {
      await this.processWebhookEvent(event);
      res.json({ received: true });
    } catch (error: any) {
      console.error('Erro ao processar webhook:', error);
      res.status(500).json({ error: 'Erro interno' });
    }
  }

  private async processWebhookEvent(event: any) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object);
        break;

      case 'payment_intent.canceled':
        await this.handlePaymentCanceled(event.data.object);
        break;

      case 'charge.dispute.created':
        await this.handleChargeDispute(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await this.handleInvoicePayment(event.data.object);
        break;

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }
  }

  private async handlePaymentSucceeded(paymentIntent: any) {
    // Atualizar status no banco
    await this.dbService.updatePaymentStatus(
      paymentIntent.id,
      'succeeded'
    );

    // Buscar dados da ordem
    const payment = await this.dbService.getPaymentByStripeId(paymentIntent.id);
    
    if (payment) {
      // Atualizar status da OS
      await this.dbService.updateOrderStatus(payment.orderId, 'paid');

      // Enviar notificação ao cliente
      await this.notificationService.sendPaymentConfirmation(
        payment.customerId,
        payment.amount
      );

      // Enviar notificação interna
      await this.notificationService.notifyPaymentReceived(payment);
    }
  }

  private async handlePaymentFailed(paymentIntent: any) {
    await this.dbService.updatePaymentStatus(
      paymentIntent.id,
      'failed'
    );

    const payment = await this.dbService.getPaymentByStripeId(paymentIntent.id);
    
    if (payment) {
      await this.notificationService.sendPaymentFailure(
        payment.customerId,
        paymentIntent.last_payment_error?.message
      );
    }
  }

  private async handlePaymentCanceled(paymentIntent: any) {
    await this.dbService.updatePaymentStatus(
      paymentIntent.id,
      'canceled'
    );
  }

  private async handleChargeDispute(dispute: any) {
    // Notificar equipe sobre disputa
    await this.notificationService.notifyDispute(dispute);
    
    // Criar registro de disputa
    await this.dbService.createDispute({
      stripeDisputeId: dispute.id,
      chargeId: dispute.charge,
      amount: dispute.amount,
      reason: dispute.reason,
      status: dispute.status,
      createdAt: new Date(),
    });
  }
}
```

### 2. Middleware para Webhooks

```typescript
// src/middleware/webhook.middleware.ts
import { Request, Response, NextFunction } from 'express';
import express from 'express';

export const webhookMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Para webhooks do Stripe, precisamos do body raw
  if (req.path === '/webhooks/stripe') {
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    next();
  }
};
```

---

## 🔒 Segurança

### 1. Validação de Dados

```typescript
// src/middleware/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const paymentSchema = Joi.object({
  amount: Joi.number().min(50).max(100000000).required(),
  currency: Joi.string().valid('brl', 'usd').default('brl'),
  orderId: Joi.string().required(),
  customerId: Joi.string().required(),
});

export const validatePayment = (req: Request, res: Response, next: NextFunction) => {
  const { error } = paymentSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: error.details.map(d => d.message),
    });
  }
  
  next();
};
```

### 2. Rate Limiting

```typescript
// src/middleware/rateLimit.middleware.ts
import rateLimit from 'express-rate-limit';

export const paymentRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // máximo 10 tentativas por IP
  message: {
    error: 'Muitas tentativas de pagamento. Tente novamente em 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
```

### 3. Logs de Auditoria

```typescript
// src/services/audit.service.ts
export class AuditService {
  async logPaymentAttempt(data: {
    userId: string;
    action: string;
    paymentIntentId?: string;
    amount?: number;
    ip: string;
    userAgent: string;
  }) {
    await this.dbService.createAuditLog({
      ...data,
      timestamp: new Date(),
      module: 'payment',
    });
  }

  async logSuspiciousActivity(data: {
    type: string;
    description: string;
    metadata: any;
  }) {
    await this.dbService.createSecurityAlert({
      ...data,
      timestamp: new Date(),
      severity: 'high',
    });

    // Notificar equipe de segurança
    await this.notificationService.notifySecurityTeam(data);
  }
}
```

---

## 🧪 Testes

### 1. Testes de Integração

```typescript
// tests/integration/payment.test.ts
import request from 'supertest';
import { app } from '../../src/app';
import { stripe } from '../../src/config/stripe.config';

describe('Payment Integration', () => {
  describe('POST /api/payments/create-intent', () => {
    it('should create payment intent successfully', async () => {
      const response = await request(app)
        .post('/api/payments/create-intent')
        .set('Authorization', 'Bearer valid-token')
        .send({
          amount: 5000, // R$ 50,00
          currency: 'brl',
          orderId: 'OS-123',
          customerId: 'customer-123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('clientSecret');
      expect(response.body).toHaveProperty('paymentIntentId');
    });

    it('should reject invalid amount', async () => {
      const response = await request(app)
        .post('/api/payments/create-intent')
        .set('Authorization', 'Bearer valid-token')
        .send({
          amount: 10, // Menor que o mínimo
          currency: 'brl',
          orderId: 'OS-123',
          customerId: 'customer-123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Valor mínimo');
    });
  });

  describe('Webhook Processing', () => {
    it('should process payment_intent.succeeded webhook', async () => {
      const webhookPayload = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_123',
            status: 'succeeded',
            amount: 5000,
          },
        },
      };

      const response = await request(app)
        .post('/api/webhooks/stripe')
        .set('stripe-signature', 'valid-signature')
        .send(webhookPayload);

      expect(response.status).toBe(200);
      expect(response.body.received).toBe(true);
    });
  });
});
```

### 2. Testes Unitários

```typescript
// tests/unit/payment.service.test.ts
import { PaymentService } from '../../src/services/payment.service';
import { stripe } from '../../src/config/stripe.config';

jest.mock('../../src/config/stripe.config');

describe('PaymentService', () => {
  let paymentService: PaymentService;

  beforeEach(() => {
    paymentService = new PaymentService();
  });

  describe('createPaymentIntent', () => {
    it('should create payment intent with correct parameters', async () => {
      const mockPaymentIntent = {
        id: 'pi_test_123',
        client_secret: 'pi_test_123_secret',
        status: 'requires_payment_method',
      };

      (stripe.paymentIntents.create as jest.Mock).mockResolvedValue(mockPaymentIntent);

      const result = await paymentService.createPaymentIntent({
        amount: 5000,
        currency: 'brl',
        orderId: 'OS-123',
        customerId: 'customer-123',
      });

      expect(stripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: 5000,
        currency: 'brl',
        automatic_payment_methods: { enabled: true },
        metadata: {
          orderId: 'OS-123',
          customerId: 'customer-123',
          source: 'crm_parceiro',
        },
      });

      expect(result).toEqual(mockPaymentIntent);
    });
  });
});
```

### 3. Testes E2E

```typescript
// tests/e2e/payment.e2e.test.ts
import { test, expect } from '@playwright/test';

test.describe('Payment Flow', () => {
  test('should complete payment successfully', async ({ page }) => {
    // Navegar para página de pagamento
    await page.goto('/orders/OS-123/payment');

    // Preencher dados do cartão
    await page.fill('[data-testid="card-number"]', '4242424242424242');
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.fill('[data-testid="card-cvc"]', '123');

    // Preencher endereço
    await page.fill('[data-testid="billing-name"]', 'João Silva');
    await page.fill('[data-testid="billing-email"]', 'joao@email.com');

    // Confirmar pagamento
    await page.click('[data-testid="pay-button"]');

    // Aguardar confirmação
    await expect(page.locator('[data-testid="payment-success"]')).toBeVisible();
    await expect(page.locator('text=Pagamento realizado com sucesso')).toBeVisible();
  });

  test('should handle payment failure', async ({ page }) => {
    await page.goto('/orders/OS-123/payment');

    // Usar cartão que falha
    await page.fill('[data-testid="card-number"]', '4000000000000002');
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.fill('[data-testid="card-cvc"]', '123');

    await page.click('[data-testid="pay-button"]');

    // Verificar mensagem de erro
    await expect(page.locator('[data-testid="payment-error"]')).toBeVisible();
    await expect(page.locator('text=Cartão recusado')).toBeVisible();
  });
});
```

---

## 📊 Monitoramento

### 1. Métricas de Pagamento

```typescript
// src/services/metrics.service.ts
export class MetricsService {
  async getPaymentMetrics(period: string) {
    const metrics = await this.dbService.query(`
      SELECT 
        COUNT(*) as total_payments,
        COUNT(CASE WHEN status = 'succeeded' THEN 1 END) as successful_payments,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_payments,
        AVG(amount) as average_amount,
        SUM(CASE WHEN status = 'succeeded' THEN amount ELSE 0 END) as total_revenue
      FROM payments 
      WHERE created_at >= NOW() - INTERVAL '${period}'
    `);

    return {
      totalPayments: metrics[0].total_payments,
      successfulPayments: metrics[0].successful_payments,
      failedPayments: metrics[0].failed_payments,
      successRate: (metrics[0].successful_payments / metrics[0].total_payments) * 100,
      averageAmount: metrics[0].average_amount,
      totalRevenue: metrics[0].total_revenue,
    };
  }

  async getPaymentMethodDistribution() {
    return await this.dbService.query(`
      SELECT 
        payment_method,
        COUNT(*) as count,
        SUM(amount) as total_amount
      FROM payments 
      WHERE status = 'succeeded'
        AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY payment_method
      ORDER BY count DESC
    `);
  }
}
```

### 2. Dashboard de Monitoramento

```typescript
// src/controllers/dashboard.controller.ts
export class DashboardController {
  private metricsService = new MetricsService();

  async getPaymentDashboard(req: Request, res: Response) {
    try {
      const [
        dailyMetrics,
        weeklyMetrics,
        monthlyMetrics,
        paymentMethods,
        recentFailures,
      ] = await Promise.all([
        this.metricsService.getPaymentMetrics('1 day'),
        this.metricsService.getPaymentMetrics('7 days'),
        this.metricsService.getPaymentMetrics('30 days'),
        this.metricsService.getPaymentMethodDistribution(),
        this.metricsService.getRecentFailures(),
      ]);

      res.json({
        daily: dailyMetrics,
        weekly: weeklyMetrics,
        monthly: monthlyMetrics,
        paymentMethods,
        recentFailures,
      });
    } catch (error: any) {
      console.error('Erro ao buscar dashboard:', error);
      res.status(500).json({ error: 'Erro interno' });
    }
  }
}
```

---

## 🔧 Troubleshooting

### Problemas Comuns

**1. Webhook não está sendo recebido**
```bash
# Verificar logs do Stripe
stripe logs tail

# Testar webhook localmente
stripe listen --forward-to localhost:3001/api/webhooks/stripe
```

**2. Pagamento falha sem motivo aparente**
```typescript
// Adicionar logs detalhados
console.log('Payment Intent:', paymentIntent);
console.log('Error:', error);

// Verificar no Stripe Dashboard
// https://dashboard.stripe.com/payments
```

**3. Problemas de CORS**
```typescript
// Configurar CORS corretamente
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
```

### Logs e Debugging

```typescript
// src/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/payment-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/payment-combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### Comandos Úteis

```bash
# Testar webhook localmente
stripe listen --forward-to localhost:3001/api/webhooks/stripe

# Simular eventos
stripe trigger payment_intent.succeeded

# Verificar logs
stripe logs tail --live

# Testar cartões
# Sucesso: 4242424242424242
# Falha: 4000000000000002
# 3D Secure: 4000000000003220
```

---

## 📚 Recursos Adicionais

### Documentação Oficial
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React Elements](https://stripe.com/docs/stripe-js/react)
- [Webhooks Guide](https://stripe.com/docs/webhooks)

### Cartões de Teste
- **Sucesso:** 4242424242424242
- **Falha:** 4000000000000002
- **3D Secure:** 4000000000003220
- **PIX:** Usar ambiente de teste

### Suporte
- **Email:** dev@crmparcerio.com
- **Slack:** #stripe-integration
- **Documentação:** /docs/stripe

---

**© 2025 CRM Parceiro - Documentação Técnica Stripe**

*Versão 1.0.0 - Janeiro 2025*