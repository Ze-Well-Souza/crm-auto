# 🚀 Guia de Instalação e Configuração - CRM Parceiro

**Versão:** 1.0.0  
**Data:** Janeiro 2025  
**Público-alvo:** Desenvolvedores e administradores de sistema

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação Local](#instalação-local)
3. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
4. [Configuração de Variáveis de Ambiente](#configuração-de-variáveis-de-ambiente)
5. [Configuração do Stripe](#configuração-do-stripe)
6. [Configuração de Integrações](#configuração-de-integrações)
7. [Deploy em Produção](#deploy-em-produção)
8. [Configuração de Backup](#configuração-de-backup)
9. [Monitoramento](#monitoramento)
10. [Troubleshooting](#troubleshooting)

---

## ⚙️ Pré-requisitos

### Requisitos de Sistema

**Desenvolvimento:**
- **Node.js:** 18.x ou superior
- **npm:** 9.x ou superior
- **Git:** 2.x ou superior
- **VS Code:** Recomendado

**Produção:**
- **Servidor:** Linux Ubuntu 20.04+ ou CentOS 8+
- **RAM:** Mínimo 4GB, recomendado 8GB
- **Armazenamento:** Mínimo 50GB SSD
- **CPU:** 2 cores mínimo, 4 cores recomendado

### Ferramentas Necessárias

```bash
# Verificar versões instaladas
node --version    # v18.0.0+
npm --version     # 9.0.0+
git --version     # 2.0.0+
```

### Contas de Serviços Externos

1. **Supabase** - Banco de dados e autenticação
2. **Stripe** - Processamento de pagamentos
3. **WhatsApp Business API** - Comunicação
4. **SendGrid/Mailgun** - Envio de emails
5. **Cloudflare/AWS** - CDN e hospedagem (opcional)

---

## 💻 Instalação Local

### 1. Clone do Repositório

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/crm-parceiro.git
cd crm-parceiro

# Verificar estrutura
ls -la
```

### 2. Instalação de Dependências

```bash
# Instalar dependências do projeto
npm install

# Verificar se todas as dependências foram instaladas
npm list --depth=0
```

### 3. Configuração Inicial

```bash
# Copiar arquivo de exemplo das variáveis de ambiente
cp .env.example .env

# Editar variáveis de ambiente
nano .env
```

### 4. Estrutura do Projeto

```
crm-parceiro/
├── public/                 # Arquivos estáticos
├── src/                   # Código fonte
│   ├── components/        # Componentes React
│   ├── pages/            # Páginas da aplicação
│   ├── services/         # Serviços e APIs
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utilitários
│   ├── types/            # Definições TypeScript
│   └── styles/           # Estilos CSS
├── docs/                 # Documentação
├── tests/                # Testes automatizados
├── .env.example          # Exemplo de variáveis
├── package.json          # Dependências
├── tsconfig.json         # Configuração TypeScript
└── README.md             # Documentação básica
```

---

## 🗄️ Configuração do Banco de Dados

### 1. Configuração do Supabase

#### Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Preencha os dados:
   - **Name:** CRM Parceiro
   - **Database Password:** Senha segura
   - **Region:** South America (São Paulo)

#### Obter Credenciais

```bash
# No dashboard do Supabase, vá em Settings > API
# Copie as seguintes informações:

SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Criação das Tabelas

Execute os seguintes scripts SQL no editor do Supabase:

```sql
-- Tabela de usuários (estende auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de clientes
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  cpf_cnpj VARCHAR(18),
  address JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de veículos
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  brand VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INTEGER,
  plate VARCHAR(10) UNIQUE,
  chassis VARCHAR(17),
  color VARCHAR(30),
  fuel_type VARCHAR(20),
  mileage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de agendamentos
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  service_type VARCHAR(100) NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER DEFAULT 60, -- em minutos
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de estoque
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  sku VARCHAR(50) UNIQUE,
  category VARCHAR(50),
  brand VARCHAR(50),
  cost_price DECIMAL(10,2),
  sale_price DECIMAL(10,2),
  quantity INTEGER DEFAULT 0,
  min_quantity INTEGER DEFAULT 0,
  location VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de ordens de serviço
CREATE TABLE public.service_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  total_amount DECIMAL(10,2) DEFAULT 0,
  created_by UUID REFERENCES users(id),
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de itens da ordem de serviço
CREATE TABLE public.service_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
  type VARCHAR(20) CHECK (type IN ('service', 'part')),
  description VARCHAR(200) NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  inventory_id UUID REFERENCES inventory(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de transações financeiras
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) CHECK (type IN ('income', 'expense')),
  category VARCHAR(50) NOT NULL,
  description VARCHAR(200) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(30),
  reference_id UUID, -- Pode referenciar service_orders, etc.
  reference_type VARCHAR(20),
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pagamentos (integração Stripe)
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_payment_intent_id VARCHAR(100) UNIQUE,
  service_order_id UUID REFERENCES service_orders(id),
  customer_id UUID REFERENCES customers(id),
  amount INTEGER NOT NULL, -- em centavos
  currency VARCHAR(3) DEFAULT 'brl',
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de comunicações
CREATE TABLE public.communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  type VARCHAR(20) CHECK (type IN ('whatsapp', 'email', 'sms', 'call')),
  direction VARCHAR(10) CHECK (direction IN ('inbound', 'outbound')),
  content TEXT,
  status VARCHAR(20) DEFAULT 'sent',
  sent_by UUID REFERENCES users(id),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Configuração de Permissões (RLS)

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (usuários autenticados podem acessar)
CREATE POLICY "Usuários autenticados podem ver clientes" ON public.customers
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver veículos" ON public.vehicles
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários autenticados podem ver agendamentos" ON public.appointments
  FOR ALL USING (auth.role() = 'authenticated');

-- Adicionar políticas similares para outras tabelas...
```

### 4. Índices para Performance

```sql
-- Índices importantes para performance
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_vehicles_plate ON vehicles(plate);
CREATE INDEX idx_vehicles_customer_id ON vehicles(customer_id);
CREATE INDEX idx_appointments_date ON appointments(scheduled_date);
CREATE INDEX idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX idx_service_orders_number ON service_orders(order_number);
CREATE INDEX idx_service_orders_status ON service_orders(status);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_payments_stripe_id ON payments(stripe_payment_intent_id);
```

---

## 🔧 Configuração de Variáveis de Ambiente

### Arquivo .env Completo

```env
# ==============================================
# CONFIGURAÇÕES GERAIS
# ==============================================
NODE_ENV=development
PORT=3000
APP_NAME="CRM Parceiro"
APP_URL=http://localhost:3000

# ==============================================
# SUPABASE CONFIGURATION
# ==============================================
REACT_APP_SUPABASE_URL=https://seu-projeto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ==============================================
# STRIPE CONFIGURATION
# ==============================================
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_51234567890abcdef
STRIPE_SECRET_KEY=sk_test_51234567890abcdef
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef
STRIPE_ENVIRONMENT=sandbox

# ==============================================
# EMAIL CONFIGURATION
# ==============================================
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.1234567890abcdef
EMAIL_FROM=noreply@crmparcerio.com
EMAIL_FROM_NAME="CRM Parceiro"

# ==============================================
# WHATSAPP CONFIGURATION
# ==============================================
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_ACCESS_TOKEN=EAABsbCS1234567890abcdef
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_VERIFY_TOKEN=seu_token_de_verificacao

# ==============================================
# SMS CONFIGURATION
# ==============================================
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=AC1234567890abcdef
TWILIO_AUTH_TOKEN=1234567890abcdef
TWILIO_PHONE_NUMBER=+5511999999999

# ==============================================
# STORAGE CONFIGURATION
# ==============================================
STORAGE_PROVIDER=supabase
# ou para AWS S3:
# STORAGE_PROVIDER=s3
# AWS_ACCESS_KEY_ID=AKIA1234567890ABCDEF
# AWS_SECRET_ACCESS_KEY=1234567890abcdef
# AWS_REGION=us-east-1
# AWS_S3_BUCKET=crm-parceiro-files

# ==============================================
# REDIS CONFIGURATION (CACHE)
# ==============================================
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
REDIS_DB=0

# ==============================================
# LOGGING CONFIGURATION
# ==============================================
LOG_LEVEL=info
LOG_FILE=logs/app.log
LOG_MAX_SIZE=10m
LOG_MAX_FILES=5

# ==============================================
# SECURITY CONFIGURATION
# ==============================================
JWT_SECRET=sua_chave_secreta_muito_segura_aqui
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000

# ==============================================
# BACKUP CONFIGURATION
# ==============================================
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30
BACKUP_STORAGE=local
# ou para S3:
# BACKUP_STORAGE=s3
# BACKUP_S3_BUCKET=crm-parceiro-backups

# ==============================================
# MONITORING CONFIGURATION
# ==============================================
SENTRY_DSN=https://1234567890abcdef@o123456.ingest.sentry.io/123456
ANALYTICS_ENABLED=true
PERFORMANCE_MONITORING=true

# ==============================================
# FEATURE FLAGS
# ==============================================
FEATURE_PAYMENTS=true
FEATURE_WHATSAPP=true
FEATURE_SMS=true
FEATURE_REPORTS=true
FEATURE_PWA=true
```

### Validação das Variáveis

```typescript
// src/config/env.validation.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  
  // Supabase
  REACT_APP_SUPABASE_URL: z.string().url(),
  REACT_APP_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  
  // Stripe
  REACT_APP_STRIPE_PUBLIC_KEY: z.string().startsWith('pk_'),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  
  // Email
  EMAIL_PROVIDER: z.enum(['sendgrid', 'mailgun', 'smtp']),
  SENDGRID_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email(),
  
  // WhatsApp
  WHATSAPP_ACCESS_TOKEN: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  
  // Security
  JWT_SECRET: z.string().min(32),
  CORS_ORIGIN: z.string().url(),
});

export const validateEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Erro na validação das variáveis de ambiente:');
    console.error(error.errors);
    process.exit(1);
  }
};
```

---

## 💳 Configuração do Stripe

### 1. Configuração da Conta

1. **Criar conta** em [stripe.com](https://stripe.com)
2. **Ativar conta** com documentos necessários
3. **Configurar webhook** endpoint:
   - URL: `https://seu-dominio.com/api/webhooks/stripe`
   - Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`

### 2. Configuração no Dashboard

```javascript
// Configurações recomendadas no Stripe Dashboard

// 1. Payment Methods
// Habilitar: Cards, PIX, Boleto
// Configurar: 3D Secure para cartões

// 2. Webhooks
const webhookEvents = [
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'payment_intent.canceled',
  'charge.dispute.created',
  'invoice.payment_succeeded',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted'
];

// 3. Business Settings
// Configurar: Nome da empresa, endereço, telefone
// Upload: Logo da empresa
```

### 3. Teste da Integração

```bash
# Instalar Stripe CLI
npm install -g stripe-cli

# Login na conta
stripe login

# Testar webhook localmente
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Simular eventos
stripe trigger payment_intent.succeeded
```

---

## 🔗 Configuração de Integrações

### 1. WhatsApp Business API

#### Configuração no Meta for Developers

1. Acesse [developers.facebook.com](https://developers.facebook.com)
2. Crie um novo app
3. Adicione o produto "WhatsApp Business API"
4. Configure o webhook:

```javascript
// Webhook URL: https://seu-dominio.com/api/webhooks/whatsapp
// Verify Token: seu_token_de_verificacao

// Eventos para subscrever:
const whatsappEvents = [
  'messages',
  'message_deliveries',
  'message_reads',
  'message_reactions'
];
```

#### Teste da Integração

```bash
# Testar envio de mensagem
curl -X POST \
  "https://graph.facebook.com/v18.0/PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "5511999999999",
    "type": "text",
    "text": {
      "body": "Teste de integração CRM Parceiro"
    }
  }'
```

### 2. Configuração de Email

#### SendGrid

```typescript
// src/config/email.config.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const emailConfig = {
  from: {
    email: process.env.EMAIL_FROM!,
    name: process.env.EMAIL_FROM_NAME!,
  },
  templates: {
    welcome: 'd-1234567890abcdef',
    appointment: 'd-abcdef1234567890',
    invoice: 'd-567890abcdef1234',
  },
};
```

#### Teste de Email

```bash
# Testar envio via API
curl -X POST \
  "https://api.sendgrid.com/v3/mail/send" \
  -H "Authorization: Bearer SG.YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "personalizations": [{
      "to": [{"email": "teste@email.com"}]
    }],
    "from": {"email": "noreply@crmparcerio.com"},
    "subject": "Teste CRM Parceiro",
    "content": [{
      "type": "text/plain",
      "value": "Teste de integração de email"
    }]
  }'
```

---

## 🚀 Deploy em Produção

### 1. Preparação para Deploy

```bash
# Build da aplicação
npm run build

# Verificar arquivos gerados
ls -la build/

# Testar build localmente
npm run preview
```

### 2. Deploy na Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login na Vercel
vercel login

# Deploy
vercel --prod

# Configurar variáveis de ambiente
vercel env add REACT_APP_SUPABASE_URL
vercel env add REACT_APP_SUPABASE_ANON_KEY
# ... adicionar todas as variáveis necessárias
```

### 3. Deploy na Netlify

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login na Netlify
netlify login

# Deploy
netlify deploy --prod --dir=build

# Configurar variáveis de ambiente no dashboard
# Site Settings > Environment Variables
```

### 4. Deploy em VPS (Ubuntu)

```bash
# Conectar ao servidor
ssh user@seu-servidor.com

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Instalar Nginx
sudo apt install nginx -y

# Configurar firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable

# Clone do projeto
git clone https://github.com/seu-usuario/crm-parceiro.git
cd crm-parceiro

# Instalar dependências
npm install

# Build da aplicação
npm run build

# Configurar PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Configuração do Nginx

```nginx
# /etc/nginx/sites-available/crm-parceiro
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;
    
    root /var/www/crm-parceiro/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Cache static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Configurar renovação automática
sudo crontab -e
# Adicionar linha:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 💾 Configuração de Backup

### 1. Backup do Banco de Dados

```bash
#!/bin/bash
# scripts/backup-database.sh

# Configurações
BACKUP_DIR="/var/backups/crm-parceiro"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Criar diretório se não existir
mkdir -p $BACKUP_DIR

# Backup do Supabase (via pg_dump)
pg_dump $DATABASE_URL > $BACKUP_DIR/database_$DATE.sql

# Compactar backup
gzip $BACKUP_DIR/database_$DATE.sql

# Remover backups antigos
find $BACKUP_DIR -name "database_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Upload para S3 (opcional)
if [ "$BACKUP_TO_S3" = "true" ]; then
    aws s3 cp $BACKUP_DIR/database_$DATE.sql.gz s3://$BACKUP_S3_BUCKET/database/
fi

echo "Backup concluído: database_$DATE.sql.gz"
```

### 2. Backup de Arquivos

```bash
#!/bin/bash
# scripts/backup-files.sh

# Configurações
SOURCE_DIR="/var/www/crm-parceiro"
BACKUP_DIR="/var/backups/crm-parceiro/files"
DATE=$(date +%Y%m%d_%H%M%S)

# Criar backup
tar -czf $BACKUP_DIR/files_$DATE.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='logs' \
    $SOURCE_DIR

# Upload para S3 (opcional)
if [ "$BACKUP_TO_S3" = "true" ]; then
    aws s3 cp $BACKUP_DIR/files_$DATE.tar.gz s3://$BACKUP_S3_BUCKET/files/
fi

echo "Backup de arquivos concluído: files_$DATE.tar.gz"
```

### 3. Agendamento de Backups

```bash
# Configurar crontab
sudo crontab -e

# Adicionar linhas:
# Backup diário do banco às 2h
0 2 * * * /var/www/crm-parceiro/scripts/backup-database.sh

# Backup semanal de arquivos aos domingos às 3h
0 3 * * 0 /var/www/crm-parceiro/scripts/backup-files.sh
```

---

## 📊 Monitoramento

### 1. Configuração do Sentry

```typescript
// src/config/sentry.config.ts
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Filtrar erros sensíveis
    if (event.exception) {
      const error = event.exception.values?.[0];
      if (error?.value?.includes('password')) {
        return null;
      }
    }
    return event;
  },
});
```

### 2. Logs da Aplicação

```typescript
// src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

### 3. Health Check

```typescript
// src/routes/health.routes.ts
import { Router } from 'express';
import { supabase } from '../config/supabase.config';

const router = Router();

router.get('/health', async (req, res) => {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'ok',
    services: {
      database: 'unknown',
      stripe: 'unknown',
      email: 'unknown',
    },
  };

  try {
    // Verificar banco de dados
    const { error: dbError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    checks.services.database = dbError ? 'error' : 'ok';

    // Verificar Stripe
    try {
      await stripe.accounts.retrieve();
      checks.services.stripe = 'ok';
    } catch {
      checks.services.stripe = 'error';
    }

    // Verificar email
    // ... implementar verificação do provedor de email

    const hasErrors = Object.values(checks.services).includes('error');
    checks.status = hasErrors ? 'error' : 'ok';

    res.status(hasErrors ? 503 : 200).json(checks);
  } catch (error) {
    checks.status = 'error';
    res.status(503).json(checks);
  }
});

export { router as healthRoutes };
```

---

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Erro de Conexão com Supabase

```bash
# Verificar variáveis de ambiente
echo $REACT_APP_SUPABASE_URL
echo $REACT_APP_SUPABASE_ANON_KEY

# Testar conexão
curl -H "apikey: $REACT_APP_SUPABASE_ANON_KEY" \
     "$REACT_APP_SUPABASE_URL/rest/v1/"
```

#### 2. Erro no Stripe

```bash
# Verificar chaves
stripe config --list

# Testar webhook
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

#### 3. Problemas de Build

```bash
# Limpar cache
npm run clean
rm -rf node_modules package-lock.json
npm install

# Verificar TypeScript
npm run type-check

# Build com logs detalhados
npm run build -- --verbose
```

#### 4. Problemas de Performance

```bash
# Analisar bundle
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js

# Verificar memory leaks
node --inspect app.js
```

### Scripts Úteis

```bash
# scripts/check-system.sh
#!/bin/bash

echo "=== Verificação do Sistema CRM Parceiro ==="

# Verificar Node.js
echo "Node.js: $(node --version)"

# Verificar npm
echo "npm: $(npm --version)"

# Verificar espaço em disco
echo "Espaço em disco:"
df -h

# Verificar memória
echo "Memória:"
free -h

# Verificar processos
echo "Processos do CRM:"
pm2 list

# Verificar logs
echo "Últimos logs de erro:"
tail -n 10 logs/error.log

# Verificar conectividade
echo "Testando conectividade:"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health

echo "=== Verificação concluída ==="
```

### Comandos de Manutenção

```bash
# Reiniciar aplicação
pm2 restart crm-parceiro

# Verificar logs em tempo real
pm2 logs crm-parceiro --lines 100

# Monitorar recursos
pm2 monit

# Backup manual
./scripts/backup-database.sh

# Verificar integridade do banco
psql $DATABASE_URL -c "SELECT pg_size_pretty(pg_database_size('postgres'));"

# Limpar logs antigos
find logs/ -name "*.log" -mtime +7 -delete
```

---

## 📞 Suporte

### Contatos

- **Email:** suporte@crmparcerio.com
- **WhatsApp:** (11) 99999-9999
- **Documentação:** https://docs.crmparcerio.com
- **GitHub:** https://github.com/seu-usuario/crm-parceiro

### Horário de Atendimento

- **Segunda a Sexta:** 8h às 18h
- **Sábado:** 8h às 12h
- **Emergências:** 24/7 (apenas para clientes premium)

---

**© 2025 CRM Parceiro - Guia de Instalação e Configuração**

*Versão 1.0.0 - Janeiro 2025*