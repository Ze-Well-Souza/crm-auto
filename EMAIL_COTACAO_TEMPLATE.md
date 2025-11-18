# Template de Email de Cotação

## 📋 Visão Geral

Template profissional de email para envio de cotações aos clientes, permitindo que o usuário envie propostas de serviços detalhadas com valores, condições de pagamento e prazo de validade.

## 🎯 Objetivo

Facilitar o envio de propostas comerciais profissionais aos clientes, permitindo que o usuário:
- Apresente serviços e peças de forma clara e organizada
- Mostre valores detalhados (unitários e totais)
- Defina prazo de validade da cotação
- Inclua condições de pagamento
- Adicione observações personalizadas

## 🏗️ Estrutura do Template

### 1. **Template React Email**
📁 `supabase/functions/send-notification-email/_templates/quotation-email.tsx`

**Seções do Email:**

#### Cabeçalho
- Título "Cotação de Serviços"
- Nome da oficina/empresa (se fornecido)
- Design em azul profissional

#### Informações da Cotação
- Cliente
- Número da cotação
- Data de emissão
- Validade
- Veículo (se aplicável)

#### Tabela de Serviços
- Descrição do serviço
- Quantidade
- Valor unitário
- Subtotal
- **Subtotal de Serviços**

#### Tabela de Peças (opcional)
- Nome da peça
- Código (se houver)
- Quantidade
- Valor unitário
- Subtotal
- **Subtotal de Peças**

#### Resumo Financeiro
- Desconto (se houver)
- **VALOR TOTAL** (destaque)

#### Condições de Pagamento (opcional)
- Formas aceitas
- Parcelamento
- Condições especiais

#### Observações (opcional)
- Notas adicionais
- Garantias
- Prazo de execução
- Outras informações

#### Call to Action
- Incentivo para confirmar
- Disponibilidade para dúvidas

#### Aviso de Validade
- Data de expiração destacada

#### Rodapé
- Nome da empresa
- Telefone
- Email
- Disclaimer

**Design Profissional:**
- Tabelas com cabeçalhos destacados
- Cores consistentes e profissionais
- Valores formatados em BRL
- Layout limpo e organizado
- Responsivo para mobile

### 2. **Interface TypeScript**
📁 `src/hooks/useNotificationEmail.ts`

**Interfaces Definidas:**

```typescript
interface QuotationService {
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface QuotationPart {
  name: string;
  code?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface QuotationEmailData {
  clientName: string;
  quotationNumber: string;
  quotationDate: string;
  validUntil: string;
  vehicleInfo?: string;
  services: QuotationService[];
  parts?: QuotationPart[];
  subtotalServices: number;
  subtotalParts: number;
  discount?: number;
  total: number;
  paymentConditions?: string;
  notes?: string;
  partnerName?: string;
  partnerPhone?: string;
  partnerEmail?: string;
}
```

### 3. **Hook Atualizado - useNotificationEmail**

Novo método: `sendQuotationEmail()`
- Envia cotação formatada para cliente
- Feedback via toast
- Tratamento de erros

## 💻 Como Usar

### Exemplo Básico

```typescript
import { useNotificationEmail } from '@/hooks/useNotificationEmail';

const MeuComponente = () => {
  const { sendQuotationEmail, sending } = useNotificationEmail();

  const enviarCotacao = async () => {
    const quotationData = {
      clientName: 'João Silva',
      quotationNumber: 'COT-2024-001',
      quotationDate: new Date().toLocaleDateString('pt-BR'),
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'), // 15 dias
      vehicleInfo: 'Honda Civic 2020 - ABC-1234',
      
      services: [
        {
          description: 'Troca de óleo e filtro',
          quantity: 1,
          unitPrice: 150.00,
          subtotal: 150.00
        },
        {
          description: 'Alinhamento e balanceamento',
          quantity: 1,
          unitPrice: 120.00,
          subtotal: 120.00
        }
      ],
      
      parts: [
        {
          name: 'Óleo sintético 5W30',
          code: 'OIL-5W30-4L',
          quantity: 1,
          unitPrice: 89.90,
          subtotal: 89.90
        },
        {
          name: 'Filtro de óleo',
          code: 'FLT-OIL-001',
          quantity: 1,
          unitPrice: 25.00,
          subtotal: 25.00
        }
      ],
      
      subtotalServices: 270.00,
      subtotalParts: 114.90,
      discount: 20.00,
      total: 364.90,
      
      paymentConditions: 'À vista (10% desconto) ou em até 3x no cartão sem juros',
      notes: 'Garantia de 3 meses para serviços e 90 dias para peças. Agendamento sujeito a disponibilidade.',
      
      partnerName: 'Auto Center Silva',
      partnerPhone: '(11) 98765-4321',
      partnerEmail: 'contato@autocentrosilva.com.br'
    };

    try {
      await sendQuotationEmail('joao@email.com', quotationData);
      console.log('Cotação enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar cotação:', error);
    }
  };

  return (
    <button onClick={enviarCotacao} disabled={sending}>
      {sending ? 'Enviando...' : 'Enviar Cotação'}
    </button>
  );
};
```

### Exemplo com Dados de Ordem de Serviço

```typescript
const gerarCotacaoDeOS = async (serviceOrder: ServiceOrder) => {
  const { sendQuotationEmail } = useNotificationEmail();

  // Buscar cliente e veículo
  const { data: client } = await supabase
    .from('clients')
    .select('name, email')
    .eq('id', serviceOrder.client_id)
    .single();

  const { data: vehicle } = await supabase
    .from('vehicles')
    .select('brand, model, plate')
    .eq('id', serviceOrder.vehicle_id)
    .single();

  // Buscar itens da OS
  const { data: items } = await supabase
    .from('service_order_items')
    .select('*')
    .eq('service_order_id', serviceOrder.id);

  // Separar serviços e peças
  const services = items
    .filter(item => item.type === 'service')
    .map(item => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      subtotal: item.subtotal
    }));

  const parts = items
    .filter(item => item.type === 'part')
    .map(item => ({
      name: item.description,
      code: undefined,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      subtotal: item.subtotal
    }));

  const quotationData = {
    clientName: client.name,
    quotationNumber: `COT-${serviceOrder.order_number}`,
    quotationDate: new Date().toLocaleDateString('pt-BR'),
    validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
    vehicleInfo: `${vehicle.brand} ${vehicle.model} - ${vehicle.plate}`,
    services,
    parts,
    subtotalServices: serviceOrder.total_labor || 0,
    subtotalParts: serviceOrder.total_parts || 0,
    discount: serviceOrder.total_discount || 0,
    total: serviceOrder.total_amount || 0,
    paymentConditions: 'À vista, cartão ou PIX',
    notes: serviceOrder.diagnosis || '',
    // Adicionar informações da oficina
  };

  await sendQuotationEmail(client.email, quotationData);
};
```

### Exemplo de Componente Completo

```typescript
import { useState } from 'react';
import { useNotificationEmail } from '@/hooks/useNotificationEmail';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const QuotationForm = () => {
  const { sendQuotationEmail, sending } = useNotificationEmail();
  const [clientEmail, setClientEmail] = useState('');
  const [services, setServices] = useState([
    { description: '', quantity: 1, unitPrice: 0, subtotal: 0 }
  ]);

  const calculateSubtotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  const handleAddService = () => {
    setServices([...services, { description: '', quantity: 1, unitPrice: 0, subtotal: 0 }]);
  };

  const handleSubmit = async () => {
    const totalServices = services.reduce((sum, s) => sum + s.subtotal, 0);
    
    const quotationData = {
      clientName: 'Cliente',
      quotationNumber: `COT-${Date.now()}`,
      quotationDate: new Date().toLocaleDateString('pt-BR'),
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      services,
      subtotalServices: totalServices,
      subtotalParts: 0,
      total: totalServices,
    };

    await sendQuotationEmail(clientEmail, quotationData);
  };

  return (
    <div>
      <Input
        placeholder="Email do cliente"
        value={clientEmail}
        onChange={(e) => setClientEmail(e.target.value)}
      />
      
      {/* Formulário de serviços */}
      
      <Button onClick={handleSubmit} disabled={sending}>
        {sending ? 'Enviando...' : 'Enviar Cotação'}
      </Button>
    </div>
  );
};
```

## 🧪 Testando

### Teste Manual

```bash
# Testar o template via Supabase Functions
curl -X POST \
  https://lfsoxururyqknnjhrzxu.supabase.co/functions/v1/send-notification-email \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "quotation",
    "to": "seu-email@teste.com",
    "data": {
      "clientName": "Cliente Teste",
      "quotationNumber": "COT-TEST-001",
      "quotationDate": "17/01/2025",
      "validUntil": "31/01/2025",
      "vehicleInfo": "Honda Civic 2020",
      "services": [
        {
          "description": "Troca de óleo",
          "quantity": 1,
          "unitPrice": 150,
          "subtotal": 150
        }
      ],
      "subtotalServices": 150,
      "subtotalParts": 0,
      "total": 150,
      "partnerName": "Oficina Teste",
      "partnerPhone": "(11) 99999-9999",
      "partnerEmail": "teste@oficina.com"
    }
  }'
```

### Verificar Email Enviado

```sql
-- Ver cotações enviadas
SELECT * FROM email_log 
WHERE template = 'quotation'
ORDER BY sent_at DESC;
```

## 📊 Casos de Uso

### 1. Enviar Cotação de OS Existente
- Usuário cria OS com itens
- Clica em "Enviar Cotação"
- Sistema gera email formatado
- Cliente recebe proposta profissional

### 2. Cotação Rápida sem OS
- Cliente solicita orçamento por telefone
- Usuário cria cotação diretamente
- Envia por email
- Cliente avalia e responde

### 3. Múltiplas Opções de Serviço
- Enviar 2-3 cotações diferentes
- Cliente escolhe melhor opção
- Facilita decisão

### 4. Follow-up de Cotações
- Reenviar cotação após X dias
- Lembrar cliente sobre validade
- Oferecer desconto adicional

## 🎨 Personalização

### Alterar Cores

Edite `quotation-email.tsx`:

```typescript
const header = {
  backgroundColor: '#1e40af', // Azul padrão
  // Altere para cor da sua marca
};

const totalRow = {
  backgroundColor: '#1e40af', // Mesmo azul
};
```

### Adicionar Logo

```typescript
import { Img } from 'npm:@react-email/components@0.0.22';

<Section style={header}>
  <Img 
    src="https://seu-dominio.com/logo.png" 
    width="150" 
    alt="Logo"
    style={{ margin: '0 auto 20px' }}
  />
  <Heading style={h1}>Cotação de Serviços</Heading>
</Section>
```

### Alterar Prazo de Validade Padrão

```typescript
// No seu componente
const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
  .toLocaleDateString('pt-BR');
```

### Adicionar Campos Customizados

```typescript
// No template
{customField && (
  <Text style={customStyle}>{customField}</Text>
)}
```

## 💡 Dicas e Melhores Práticas

### Prazo de Validade
- **Padrão recomendado:** 15 dias
- Muito curto (< 7 dias): Cliente pode sentir pressa
- Muito longo (> 30 dias): Valores podem ficar desatualizados

### Condições de Pagamento
Seja claro e específico:
- ✅ "À vista (10% desconto) ou 3x sem juros"
- ❌ "Várias formas de pagamento disponíveis"

### Observações
Use para:
- Garantias oferecidas
- Prazo de execução estimado
- Requisitos especiais
- Avisos importantes

### Cálculo de Valores
```typescript
// Sempre calcule subtotais corretamente
const subtotal = quantity * unitPrice;

// Some tudo antes de aplicar desconto
const totalBeforeDiscount = subtotalServices + subtotalParts;
const total = totalBeforeDiscount - discount;
```

### Formatação de Números
```typescript
// Sempre use formatação brasileira
valor.toLocaleString('pt-BR', { 
  minimumFractionDigits: 2,
  maximumFractionDigits: 2 
})
```

## 📈 Métricas a Acompanhar

```sql
-- Taxa de conversão de cotações
WITH cotacoes AS (
  SELECT 
    recipient as client_email,
    sent_at
  FROM email_log
  WHERE template = 'quotation'
    AND status = 'sent'
    AND sent_at >= CURRENT_DATE - INTERVAL '90 days'
),
agendamentos AS (
  SELECT DISTINCT
    c.email,
    MIN(a.scheduled_date) as first_appointment
  FROM appointments a
  JOIN clients c ON a.client_id = c.id
  WHERE a.scheduled_date >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY c.email
)
SELECT 
  COUNT(cot.*) as total_cotacoes,
  COUNT(ag.email) as converteram,
  ROUND(100.0 * COUNT(ag.email) / COUNT(cot.*), 2) as taxa_conversao_pct
FROM cotacoes cot
LEFT JOIN agendamentos ag 
  ON cot.client_email = ag.email
  AND ag.first_appointment > cot.sent_at;
```

## 🔗 Integrações Futuras

- **WhatsApp:** Enviar cotação também via WhatsApp
- **PDF:** Gerar PDF da cotação anexo
- **Assinatura Digital:** Cliente aceita cotação online
- **Pagamento Online:** Link de pagamento na cotação
- **CRM:** Rastrear status de cotações (enviada, visualizada, aceita)

## 📝 Próximos Passos

- [ ] Testar envio de cotação
- [ ] Integrar com formulário de criação de OS
- [ ] Adicionar botão "Enviar Cotação" em OS
- [ ] Criar templates de cotação salvos
- [ ] Implementar numeração automática de cotações
- [ ] Adicionar analytics de abertura de email

## 🔗 Links Úteis

- [Edge Function - send-notification-email](https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/functions/send-notification-email)
- [Tabela email_log](https://supabase.com/dashboard/project/lfsoxururyqknnjhrzxu/editor)
- [React Email Documentation](https://react.email/docs/introduction)
