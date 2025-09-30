# 🔌 Documentação de APIs e Endpoints - CRM Parceiro

**Versão:** 1.0.0  
**Data:** Janeiro 2025  
**Base URL:** `https://api.crmparcerio.com/v1`

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Estrutura de Resposta](#estrutura-de-resposta)
4. [Códigos de Status](#códigos-de-status)
5. [Rate Limiting](#rate-limiting)
6. [APIs por Módulo](#apis-por-módulo)
7. [Webhooks](#webhooks)
8. [SDKs e Bibliotecas](#sdks-e-bibliotecas)
9. [Exemplos de Integração](#exemplos-de-integração)
10. [Troubleshooting](#troubleshooting)

---

## 🌐 Visão Geral

### Características da API

- **Arquitetura:** RESTful
- **Formato:** JSON
- **Autenticação:** JWT + Supabase Auth
- **Versionamento:** URL path (`/v1/`)
- **HTTPS:** Obrigatório em produção
- **Rate Limiting:** 1000 requests/hora por usuário

### URLs Base

```
Produção:    https://api.crmparcerio.com/v1
Staging:     https://staging-api.crmparcerio.com/v1
Development: http://localhost:3000/api/v1
```

---

## 🔐 Autenticação

### 1. Autenticação via Supabase

```typescript
// Configuração do cliente
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://seu-projeto.supabase.co',
  'sua-chave-publica'
);

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'usuario@email.com',
  password: 'senha123'
});

// Usar token nas requisições
const token = data.session?.access_token;
```

### 2. Headers de Autenticação

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
X-API-Version: v1
```

### 3. Refresh Token

```typescript
// Renovar token automaticamente
const { data, error } = await supabase.auth.refreshSession();
```

---

## 📊 Estrutura de Resposta

### Resposta de Sucesso

```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "João Silva",
    "email": "joao@email.com"
  },
  "meta": {
    "timestamp": "2025-01-15T10:30:00Z",
    "version": "v1",
    "request_id": "req_123456789"
  }
}
```

### Resposta de Erro

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos fornecidos",
    "details": [
      {
        "field": "email",
        "message": "Email é obrigatório"
      }
    ]
  },
  "meta": {
    "timestamp": "2025-01-15T10:30:00Z",
    "version": "v1",
    "request_id": "req_123456789"
  }
}
```

### Resposta Paginada

```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Item 1" },
    { "id": 2, "name": "Item 2" }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "has_next": true,
    "has_prev": false
  },
  "meta": {
    "timestamp": "2025-01-15T10:30:00Z",
    "version": "v1",
    "request_id": "req_123456789"
  }
}
```

---

## 📋 Códigos de Status

| Código | Significado | Descrição |
|--------|-------------|-----------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 204 | No Content | Operação bem-sucedida sem conteúdo |
| 400 | Bad Request | Dados inválidos na requisição |
| 401 | Unauthorized | Token de autenticação inválido |
| 403 | Forbidden | Sem permissão para acessar recurso |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Conflito com estado atual do recurso |
| 422 | Unprocessable Entity | Dados válidos mas não processáveis |
| 429 | Too Many Requests | Limite de rate excedido |
| 500 | Internal Server Error | Erro interno do servidor |
| 503 | Service Unavailable | Serviço temporariamente indisponível |

---

## ⏱️ Rate Limiting

### Limites por Endpoint

```typescript
// Limites padrão
const rateLimits = {
  default: '1000/hour',
  auth: '10/minute',
  payments: '100/hour',
  reports: '50/hour',
  webhooks: '10000/hour'
};

// Headers de resposta
{
  'X-RateLimit-Limit': '1000',
  'X-RateLimit-Remaining': '999',
  'X-RateLimit-Reset': '1642694400'
}
```

### Tratamento de Rate Limit

```typescript
// Exemplo de retry com backoff
async function apiRequest(url: string, options: RequestInit) {
  let retries = 3;
  
  while (retries > 0) {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      const resetTime = response.headers.get('X-RateLimit-Reset');
      const waitTime = resetTime ? 
        parseInt(resetTime) * 1000 - Date.now() : 
        60000; // 1 minuto padrão
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
      retries--;
      continue;
    }
    
    return response;
  }
  
  throw new Error('Rate limit exceeded');
}
```

---

## 🔧 APIs por Módulo

### 1. Autenticação

#### POST /auth/login
Realizar login no sistema

```typescript
// Request
interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

// Response
interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}
```

**Exemplo:**
```bash
curl -X POST https://api.crmparcerio.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@email.com",
    "password": "senha123"
  }'
```

#### POST /auth/logout
Realizar logout

```bash
curl -X POST https://api.crmparcerio.com/v1/auth/logout \
  -H "Authorization: Bearer TOKEN"
```

#### POST /auth/refresh
Renovar token de acesso

```bash
curl -X POST https://api.crmparcerio.com/v1/auth/refresh \
  -H "Authorization: Bearer REFRESH_TOKEN"
```

### 2. Clientes

#### GET /customers
Listar clientes

**Parâmetros de Query:**
```typescript
interface CustomersQuery {
  page?: number;          // Página (padrão: 1)
  limit?: number;         // Itens por página (padrão: 20, máx: 100)
  search?: string;        // Busca por nome, email ou telefone
  sort?: string;          // Campo para ordenação
  order?: 'asc' | 'desc'; // Direção da ordenação
  created_after?: string; // Filtro por data de criação
  created_before?: string;
}
```

**Exemplo:**
```bash
curl -X GET "https://api.crmparcerio.com/v1/customers?page=1&limit=20&search=João" \
  -H "Authorization: Bearer TOKEN"
```

#### GET /customers/:id
Obter cliente específico

```bash
curl -X GET https://api.crmparcerio.com/v1/customers/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer TOKEN"
```

#### POST /customers
Criar novo cliente

```typescript
interface CreateCustomerRequest {
  name: string;
  email?: string;
  phone?: string;
  cpf_cnpj?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
  };
  notes?: string;
}
```

**Exemplo:**
```bash
curl -X POST https://api.crmparcerio.com/v1/customers \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "(11) 99999-9999",
    "cpf_cnpj": "123.456.789-00"
  }'
```

#### PUT /customers/:id
Atualizar cliente

```bash
curl -X PUT https://api.crmparcerio.com/v1/customers/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva Santos",
    "phone": "(11) 88888-8888"
  }'
```

#### DELETE /customers/:id
Excluir cliente

```bash
curl -X DELETE https://api.crmparcerio.com/v1/customers/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer TOKEN"
```

### 3. Veículos

#### GET /vehicles
Listar veículos

```bash
curl -X GET "https://api.crmparcerio.com/v1/vehicles?customer_id=123e4567-e89b-12d3-a456-426614174000" \
  -H "Authorization: Bearer TOKEN"
```

#### POST /vehicles
Criar novo veículo

```typescript
interface CreateVehicleRequest {
  customer_id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  chassis?: string;
  color?: string;
  fuel_type?: string;
  mileage?: number;
}
```

**Exemplo:**
```bash
curl -X POST https://api.crmparcerio.com/v1/vehicles \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "123e4567-e89b-12d3-a456-426614174000",
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2022,
    "plate": "ABC-1234",
    "color": "Branco"
  }'
```

### 4. Agendamentos

#### GET /appointments
Listar agendamentos

**Parâmetros de Query:**
```typescript
interface AppointmentsQuery {
  page?: number;
  limit?: number;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  customer_id?: string;
  date_from?: string;    // YYYY-MM-DD
  date_to?: string;      // YYYY-MM-DD
  service_type?: string;
}
```

#### POST /appointments
Criar agendamento

```typescript
interface CreateAppointmentRequest {
  customer_id: string;
  vehicle_id: string;
  service_type: string;
  scheduled_date: string; // ISO 8601
  duration?: number;      // em minutos
  notes?: string;
}
```

#### PUT /appointments/:id/status
Atualizar status do agendamento

```bash
curl -X PUT https://api.crmparcerio.com/v1/appointments/123e4567-e89b-12d3-a456-426614174000/status \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "notes": "Cliente chegou no horário"
  }'
```

### 5. Estoque

#### GET /inventory
Listar itens do estoque

```bash
curl -X GET "https://api.crmparcerio.com/v1/inventory?category=filtros&low_stock=true" \
  -H "Authorization: Bearer TOKEN"
```

#### POST /inventory
Adicionar item ao estoque

```typescript
interface CreateInventoryRequest {
  name: string;
  description?: string;
  sku: string;
  category: string;
  brand?: string;
  cost_price: number;
  sale_price: number;
  quantity: number;
  min_quantity: number;
  location?: string;
}
```

#### PUT /inventory/:id/quantity
Atualizar quantidade

```bash
curl -X PUT https://api.crmparcerio.com/v1/inventory/123e4567-e89b-12d3-a456-426614174000/quantity \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 50,
    "operation": "add",
    "reason": "Compra de estoque"
  }'
```

### 6. Ordens de Serviço

#### GET /service-orders
Listar ordens de serviço

```bash
curl -X GET "https://api.crmparcerio.com/v1/service-orders?status=pending" \
  -H "Authorization: Bearer TOKEN"
```

#### POST /service-orders
Criar ordem de serviço

```typescript
interface CreateServiceOrderRequest {
  customer_id: string;
  vehicle_id: string;
  description: string;
  items: Array<{
    type: 'service' | 'part';
    description: string;
    quantity: number;
    unit_price: number;
    inventory_id?: string;
  }>;
  assigned_to?: string;
}
```

#### PUT /service-orders/:id/status
Atualizar status

```bash
curl -X PUT https://api.crmparcerio.com/v1/service-orders/123e4567-e89b-12d3-a456-426614174000/status \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "completion_notes": "Serviço realizado com sucesso"
  }'
```

### 7. Pagamentos (Stripe)

#### POST /payments/create-intent
Criar intenção de pagamento

```typescript
interface CreatePaymentIntentRequest {
  amount: number;           // em centavos
  currency: string;         // 'brl'
  customer_id: string;
  service_order_id?: string;
  payment_method_types: string[]; // ['card', 'pix', 'boleto']
  metadata?: Record<string, string>;
}
```

**Exemplo:**
```bash
curl -X POST https://api.crmparcerio.com/v1/payments/create-intent \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 15000,
    "currency": "brl",
    "customer_id": "123e4567-e89b-12d3-a456-426614174000",
    "payment_method_types": ["card", "pix"]
  }'
```

#### GET /payments/:id
Obter status do pagamento

```bash
curl -X GET https://api.crmparcerio.com/v1/payments/pi_1234567890abcdef \
  -H "Authorization: Bearer TOKEN"
```

#### POST /payments/:id/confirm
Confirmar pagamento

```bash
curl -X POST https://api.crmparcerio.com/v1/payments/pi_1234567890abcdef/confirm \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_method": "pm_1234567890abcdef"
  }'
```

### 8. Relatórios

#### GET /reports/financial
Relatório financeiro

**Parâmetros de Query:**
```typescript
interface FinancialReportQuery {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;     // YYYY-MM-DD
  end_date: string;       // YYYY-MM-DD
  group_by?: 'day' | 'week' | 'month';
  include_forecast?: boolean;
}
```

#### GET /reports/customers
Relatório de clientes

```bash
curl -X GET "https://api.crmparcerio.com/v1/reports/customers?period=monthly&start_date=2025-01-01&end_date=2025-01-31" \
  -H "Authorization: Bearer TOKEN"
```

#### POST /reports/custom
Gerar relatório customizado

```typescript
interface CustomReportRequest {
  name: string;
  type: 'financial' | 'operational' | 'customer' | 'inventory';
  filters: Record<string, any>;
  fields: string[];
  group_by?: string[];
  sort_by?: string;
  format: 'json' | 'csv' | 'pdf' | 'excel';
}
```

#### GET /reports/:id/export
Exportar relatório

```bash
curl -X GET "https://api.crmparcerio.com/v1/reports/123e4567-e89b-12d3-a456-426614174000/export?format=pdf" \
  -H "Authorization: Bearer TOKEN" \
  -o relatorio.pdf
```

### 9. Comunicação

#### POST /communications/whatsapp/send
Enviar mensagem WhatsApp

```typescript
interface SendWhatsAppRequest {
  to: string;              // Número do telefone
  type: 'text' | 'template' | 'media';
  content: {
    text?: string;
    template_name?: string;
    template_params?: string[];
    media_url?: string;
    media_type?: 'image' | 'document' | 'video';
  };
  customer_id?: string;
}
```

#### POST /communications/email/send
Enviar email

```typescript
interface SendEmailRequest {
  to: string | string[];
  subject: string;
  content: {
    html?: string;
    text?: string;
    template_id?: string;
    template_data?: Record<string, any>;
  };
  attachments?: Array<{
    filename: string;
    content: string;        // base64
    type: string;
  }>;
  customer_id?: string;
}
```

#### GET /communications/history
Histórico de comunicações

```bash
curl -X GET "https://api.crmparcerio.com/v1/communications/history?customer_id=123e4567-e89b-12d3-a456-426614174000&type=whatsapp" \
  -H "Authorization: Bearer TOKEN"
```

---

## 🔔 Webhooks

### Configuração de Webhooks

#### POST /webhooks/subscriptions
Criar assinatura de webhook

```typescript
interface CreateWebhookRequest {
  url: string;
  events: string[];
  secret?: string;
  active: boolean;
}
```

**Eventos Disponíveis:**
```typescript
const availableEvents = [
  'customer.created',
  'customer.updated',
  'customer.deleted',
  'appointment.created',
  'appointment.updated',
  'appointment.cancelled',
  'service_order.created',
  'service_order.completed',
  'payment.succeeded',
  'payment.failed',
  'inventory.low_stock',
  'communication.sent',
  'communication.failed'
];
```

### Estrutura do Webhook

```json
{
  "id": "evt_123456789",
  "type": "customer.created",
  "created": 1642694400,
  "data": {
    "object": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "João Silva",
      "email": "joao@email.com"
    }
  },
  "api_version": "v1"
}
```

### Verificação de Assinatura

```typescript
// Verificar assinatura do webhook
import crypto from 'crypto';

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

---

## 📚 SDKs e Bibliotecas

### JavaScript/TypeScript SDK

```bash
npm install @crmparcerio/sdk
```

```typescript
import { CRMParceiro } from '@crmparcerio/sdk';

const crm = new CRMParceiro({
  apiKey: 'sua-api-key',
  baseURL: 'https://api.crmparcerio.com/v1'
});

// Listar clientes
const customers = await crm.customers.list({
  page: 1,
  limit: 20
});

// Criar cliente
const newCustomer = await crm.customers.create({
  name: 'João Silva',
  email: 'joao@email.com'
});

// Criar agendamento
const appointment = await crm.appointments.create({
  customer_id: newCustomer.id,
  vehicle_id: 'vehicle-id',
  service_type: 'Troca de óleo',
  scheduled_date: '2025-01-20T10:00:00Z'
});
```

### Python SDK

```bash
pip install crmparcerio-python
```

```python
from crmparcerio import CRMParceiro

crm = CRMParceiro(
    api_key='sua-api-key',
    base_url='https://api.crmparcerio.com/v1'
)

# Listar clientes
customers = crm.customers.list(page=1, limit=20)

# Criar cliente
new_customer = crm.customers.create({
    'name': 'João Silva',
    'email': 'joao@email.com'
})
```

### PHP SDK

```bash
composer require crmparcerio/php-sdk
```

```php
<?php
use CRMParceiro\Client;

$crm = new Client([
    'api_key' => 'sua-api-key',
    'base_url' => 'https://api.crmparcerio.com/v1'
]);

// Listar clientes
$customers = $crm->customers->list(['page' => 1, 'limit' => 20]);

// Criar cliente
$newCustomer = $crm->customers->create([
    'name' => 'João Silva',
    'email' => 'joao@email.com'
]);
?>
```

---

## 🔧 Exemplos de Integração

### 1. Integração com Sistema de Vendas

```typescript
// Sincronizar cliente do sistema de vendas
async function syncCustomerFromSales(salesCustomer: any) {
  try {
    // Verificar se cliente já existe
    const existingCustomer = await crm.customers.search({
      email: salesCustomer.email
    });
    
    if (existingCustomer.length > 0) {
      // Atualizar cliente existente
      return await crm.customers.update(existingCustomer[0].id, {
        name: salesCustomer.name,
        phone: salesCustomer.phone,
        address: salesCustomer.address
      });
    } else {
      // Criar novo cliente
      return await crm.customers.create({
        name: salesCustomer.name,
        email: salesCustomer.email,
        phone: salesCustomer.phone,
        address: salesCustomer.address,
        notes: `Importado do sistema de vendas em ${new Date().toISOString()}`
      });
    }
  } catch (error) {
    console.error('Erro ao sincronizar cliente:', error);
    throw error;
  }
}
```

### 2. Integração com Sistema de Estoque

```typescript
// Sincronizar estoque com sistema externo
async function syncInventory() {
  try {
    // Obter itens do sistema externo
    const externalItems = await externalSystem.getInventory();
    
    for (const item of externalItems) {
      // Verificar se item existe no CRM
      const existingItem = await crm.inventory.findBySku(item.sku);
      
      if (existingItem) {
        // Atualizar quantidade se diferente
        if (existingItem.quantity !== item.quantity) {
          await crm.inventory.updateQuantity(existingItem.id, {
            quantity: item.quantity,
            operation: 'set',
            reason: 'Sincronização automática'
          });
        }
      } else {
        // Criar novo item
        await crm.inventory.create({
          name: item.name,
          sku: item.sku,
          category: item.category,
          quantity: item.quantity,
          cost_price: item.cost_price,
          sale_price: item.sale_price
        });
      }
    }
  } catch (error) {
    console.error('Erro ao sincronizar estoque:', error);
  }
}
```

### 3. Automação de Comunicação

```typescript
// Enviar lembrete de agendamento automaticamente
async function sendAppointmentReminders() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Buscar agendamentos para amanhã
  const appointments = await crm.appointments.list({
    date_from: tomorrow.toISOString().split('T')[0],
    date_to: tomorrow.toISOString().split('T')[0],
    status: 'scheduled'
  });
  
  for (const appointment of appointments.data) {
    try {
      // Enviar WhatsApp
      await crm.communications.whatsapp.send({
        to: appointment.customer.phone,
        type: 'template',
        content: {
          template_name: 'appointment_reminder',
          template_params: [
            appointment.customer.name,
            appointment.service_type,
            new Date(appointment.scheduled_date).toLocaleString('pt-BR')
          ]
        },
        customer_id: appointment.customer_id
      });
      
      // Enviar email de backup
      await crm.communications.email.send({
        to: appointment.customer.email,
        subject: 'Lembrete: Agendamento para amanhã',
        content: {
          template_id: 'appointment_reminder_email',
          template_data: {
            customer_name: appointment.customer.name,
            service_type: appointment.service_type,
            appointment_date: new Date(appointment.scheduled_date).toLocaleString('pt-BR'),
            vehicle: `${appointment.vehicle.brand} ${appointment.vehicle.model}`
          }
        },
        customer_id: appointment.customer_id
      });
      
    } catch (error) {
      console.error(`Erro ao enviar lembrete para ${appointment.customer.name}:`, error);
    }
  }
}
```

---

## 🔍 Troubleshooting

### Problemas Comuns

#### 1. Erro 401 - Unauthorized

```typescript
// Verificar se token está válido
const response = await fetch('/api/v1/auth/verify', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

if (!response.ok) {
  // Token inválido, fazer login novamente
  await refreshToken();
}
```

#### 2. Erro 429 - Rate Limit

```typescript
// Implementar retry com backoff exponencial
async function apiRequestWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options);
    
    if (response.status !== 429) {
      return response;
    }
    
    // Aguardar antes de tentar novamente
    const waitTime = Math.pow(2, i) * 1000; // 1s, 2s, 4s
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  throw new Error('Rate limit exceeded after retries');
}
```

#### 3. Erro de Validação

```typescript
// Tratar erros de validação
try {
  await crm.customers.create(customerData);
} catch (error) {
  if (error.code === 'VALIDATION_ERROR') {
    error.details.forEach(detail => {
      console.error(`Campo ${detail.field}: ${detail.message}`);
    });
  }
}
```

### Logs e Debug

```typescript
// Habilitar logs detalhados
const crm = new CRMParceiro({
  apiKey: 'sua-api-key',
  debug: true,
  logLevel: 'debug'
});

// Interceptar requisições
crm.interceptors.request.use(config => {
  console.log('Enviando requisição:', config);
  return config;
});

crm.interceptors.response.use(
  response => {
    console.log('Resposta recebida:', response);
    return response;
  },
  error => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);
```

### Ferramentas de Teste

```bash
# Testar endpoints com curl
curl -X GET https://api.crmparcerio.com/v1/health \
  -H "Authorization: Bearer TOKEN" \
  -v

# Usar Postman Collection
# Importar: https://api.crmparcerio.com/v1/postman-collection.json

# Usar Insomnia
# Importar: https://api.crmparcerio.com/v1/insomnia-collection.json
```

---

## 📞 Suporte

### Contatos para Desenvolvedores

- **Email:** dev@crmparcerio.com
- **Discord:** https://discord.gg/crmparcerio
- **GitHub Issues:** https://github.com/crmparcerio/api/issues
- **Stack Overflow:** Tag `crmparcerio`

### Recursos Adicionais

- **Documentação Interativa:** https://docs.crmparcerio.com
- **Playground da API:** https://playground.crmparcerio.com
- **Status da API:** https://status.crmparcerio.com
- **Changelog:** https://changelog.crmparcerio.com

---

**© 2025 CRM Parceiro - Documentação de APIs**

*Versão 1.0.0 - Janeiro 2025*