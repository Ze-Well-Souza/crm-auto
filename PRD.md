# 📋 PRD - Product Requirements Document
## Sistema de Gestão de Oficinas Automotivas (Uautos Pro)

> **Última Atualização**: 2025-01-24
> **Versão do PRD**: 3.0
> **Status**: ✅ MVP em Produção (React + Vite)

---

## 1. VISÃO GERAL DO PRODUTO

### 1.1 Resumo Executivo
Sistema SaaS completo de gestão para oficinas automotivas e prestadores de serviços automotivos, oferecendo solução integrada para agendamentos, clientes, veículos, ordens de serviço, estoque de peças, financeiro e comunicação. **Desenvolvido com React 18 + Vite**, integrado ao Marketplace Uautos.

### 1.2 Proposta de Valor
- **Para Oficinas**: Sistema completo de gestão sem necessidade de múltiplas ferramentas
- **Para Clientes Finais**: Experiência digital de agendamento e acompanhamento de serviços
- **Para Parceiros**: Plataforma de marketplace para conexão com clientes

### 1.3 Objetivos do Produto
- Digitalizar completamente a operação de oficinas automotivas
- Reduzir tempo administrativo em 60%
- Aumentar taxa de conversão de agendamentos em 40%
- Melhorar satisfação do cliente com comunicação automatizada

---

## 2. PÚBLICO-ALVO

### 2.1 Persona Principal: Gestor de Oficina
**João Silva, 42 anos**
- Dono de oficina mecânica de médio porte (5-15 funcionários)
- Busca profissionalizar gestão e reduzir retrabalho
- Dificuldade com controle de estoque e financeiro
- Quer oferecer experiência digital aos clientes

### 2.2 Persona Secundária: Mecânico/Técnico
**Carlos Santos, 28 anos**
- Mecânico com 8 anos de experiência
- Usa sistema para consultar ordens de serviço e registrar peças utilizadas
- Precisa de interface simples e rápida

### 2.3 Persona Terciária: Cliente Final
**Maria Oliveira, 35 anos**
- Dona de veículo popular
- Quer agendar serviços online sem telefonemas
- Deseja acompanhar status do serviço em tempo real

---

## 3. ARQUITETURA DO SISTEMA

### 3.1 Stack Tecnológico (ATUALIZADO)
```
Frontend (SPA - Single Page Application):
├── React 18.3.1 (Biblioteca UI)
├── Vite 5.4.19 (Build Tool & Dev Server)
├── TypeScript 5.8.3 (Type Safety)
├── React Router DOM 6.30.1 (Client-Side Routing)
├── Tailwind CSS 3.4.17 (Utility-First CSS)
├── Shadcn/ui (Componentes Radix UI)
├── TanStack Query 5.83.0 (Server State Management)
├── React Hook Form 7.61.1 + Zod 3.25.76 (Validação)
├── Next Themes 0.3.0 (Dark/Light Mode)
└── Vite PWA 1.1.0 (Progressive Web App)

Backend & Infraestrutura:
├── Supabase (PostgreSQL + Auth + Storage + Edge Functions)
│   ├── PostgreSQL 15+ (Database)
│   ├── Row Level Security (RLS) - Segurança a nível de linha
│   ├── Realtime Subscriptions (WebSockets)
│   └── Edge Functions (Deno Runtime)
├── Supabase Auth (JWT-based Authentication)
└── Supabase Storage (Armazenamento de arquivos)

Integrações:
├── Stripe (Pagamentos e Assinaturas SaaS)
│   ├── @stripe/stripe-js 4.8.0
│   └── @stripe/react-stripe-js 2.8.1
├── SMTP (E-mails transacionais)
├── Sentry 10.25.0 (Error Tracking & Performance)
└── PWA (App Offline com Service Workers)

Build & Deploy:
├── Vite (Bundler com Rollup)
├── Terser (Minificação JS)
├── Code Splitting (Lazy Loading por rota)
├── Lovable Cloud (Hosting Frontend)
└── Supabase Cloud (Backend as a Service)

Testes & Qualidade:
├── Vitest 4.0.10 (Unit & Integration Tests)
├── @testing-library/react 16.3.0 (Component Tests)
├── ESLint 9.32.0 (Linting)
└── TypeScript (Type Checking)
```

### 3.2 Arquitetura de Roteamento
**Tipo**: Client-Side Routing (React Router v6)
**Estrutura**: `/src/pages/` (Não usa App Router do Next.js)

**Rotas Públicas:**
- `/` → Landing Page
- `/landing` → Landing Page alternativa
- `/register` → Cadastro de usuário
- `/auth/callback` → Callback de confirmação de email
- `/reset-password` → Recuperação de senha
- `/install` → Instalação PWA

**Rotas Protegidas (Requer Autenticação):**
- `/dashboard` → Dashboard principal
- `/clientes` → Gestão de clientes (Feature: `crm_clients`)
- `/veiculos` → Gestão de veículos (Feature: `crm_vehicles`)
- `/agendamentos` → Agendamentos (Feature: `crm_appointments`)
- `/ordens` → Ordens de Serviço (Feature: `crm_service_orders`)
- `/estoque` → Estoque de peças (Feature: `crm_parts`)
- `/financeiro` → Gestão financeira (Feature: `crm_financial`)
- `/pagamentos` → Pagamentos Stripe
- `/parceiros` → Marketplace de parceiros
- `/comunicacao` → Comunicação com clientes
- `/biblioteca-imagens` → Biblioteca de imagens
- `/configuracoes` → Configurações do usuário
- `/docs` → Documentação

**Rotas Administrativas (Requer Role Admin/Super Admin):**
- `/admin` → Painel administrativo completo

**Proteção de Rotas:**
```typescript
// Componentes de proteção
<ProtectedRoute>        // Requer autenticação (supabase.auth.getUser())
<AdminRoute>            // Requer role admin/super_admin (via is_admin() function)
<FeatureRoute>          // Requer feature do plano (via SubscriptionContext)
```

### 3.2 Modelo de Dados Principais

#### Tabelas Core
```sql
-- Usuários e Autenticação
- auth.users (Supabase Auth)
- user_roles (admin | user)
- usuarios (Perfil estendido)

-- Assinaturas
- subscription_plans (Planos disponíveis)
- partner_subscriptions (Assinaturas ativas)
- subscription_audit_log (Histórico de mudanças)

-- Gestão de Clientes
- clients (Clientes da oficina)
- vehicles (Veículos dos clientes)

-- Operacional
- appointments (Agendamentos)
- service_orders (Ordens de Serviço)
- service_order_items (Itens da OS)

-- Estoque
- parts (Peças e produtos)
- stock_movements (Movimentações)

-- Financeiro
- financial_transactions (Receitas e Despesas)
- pagamentos (Pagamentos via Stripe)

-- Comunicação
- email_configurations (Config SMTP)
- email_logs (Histórico de envios)
- notifications (Notificações in-app)
- chat_messages (Chat com clientes)

-- Biblioteca de Imagens
- image_library (Imagens do sistema)
- image_collections (Coleções organizadas)
```

---

## 4. MÓDULOS E FUNCIONALIDADES

### 4.1 📊 Dashboard Principal
**Objetivo**: Visão consolidada de KPIs e acesso rápido aos módulos

**Funcionalidades Core:**
- Cards de métricas principais:
  - Receita do mês (atual vs. anterior)
  - Agendamentos de hoje/semana
  - Clientes ativos
  - Ordens de serviço em andamento
  - Status de estoque crítico
- Gráficos interativos:
  - Receita mensal (últimos 12 meses)
  - Agendamentos por status
  - Distribuição de serviços
- Acesso rápido aos módulos
- Alertas importantes (estoque baixo, agendamentos do dia)

**UX:**
- Layout em grid responsivo
- Cards com animações suaves
- Cores semânticas (verde=positivo, vermelho=alerta)
- Skeleton loading durante carregamento

---

### 4.2 👥 Gestão de Clientes
**Objetivo**: Centralizar informações de clientes e histórico

**Funcionalidades Core:**
- ✅ CRUD completo de clientes
- ✅ Campos: Nome, CPF/CNPJ, Email, Telefone, Endereço
- ✅ Busca avançada (nome, CPF, telefone)
- ✅ Filtros por status (ativo/inativo)
- ✅ Timeline de interações:
  - Agendamentos realizados
  - Ordens de serviço
  - Veículos cadastrados
- ✅ Métricas por cliente:
  - Valor total gasto (LTV)
  - Ticket médio
  - Última visita
  - Frequência de retorno
- ✅ Exportação para Excel/CSV
- ✅ Importação em lote (CSV)
- ✅ Quick actions (WhatsApp, Email, Agendar)

**Regras de Negócio:**
- Limite por plano:
  - Gratuito: 40 clientes ativos
  - Básico: 200 clientes
  - Profissional: 1000 clientes
  - Enterprise: Ilimitado
- Validação de CPF/CNPJ
- E-mail único (opcional)
- Telefone obrigatório

**UX:**
- Cards visuais com avatar
- Badge de status colorido
- Modal com abas (Dados | Veículos | Histórico)
- Busca com debounce 300ms
- Feedback de ações com toast

---

### 4.3 🚗 Gestão de Veículos
**Objetivo**: Cadastro e histórico de manutenções dos veículos

**Funcionalidades Core:**
- ✅ CRUD de veículos
- ✅ Campos: Marca, Modelo, Ano, Placa, Cor, Chassis
- ✅ Vínculo com cliente (1 cliente → N veículos)
- ✅ Histórico de manutenções
- ✅ Timeline de serviços realizados
- ✅ Alertas de manutenção preventiva
- ✅ Fotos do veículo (galeria)
- ✅ QR Code do veículo (para acesso rápido)

**Regras de Negócio:**
- Placa única no sistema
- Validação de formato de placa (ABC-1234 ou ABC1D23)
- Cliente obrigatório
- Foto de perfil opcional
- Sem limite de veículos por plano

**UX:**
- Cards com foto do veículo
- Badge da marca colorido
- Modal full-screen para detalhes
- Galeria de imagens com lightbox
- Timeline vertical com ícones

---

### 4.4 📅 Agendamentos
**Objetivo**: Gestão de agendamentos e disponibilidade

**Funcionalidades Core:**
- ✅ CRUD de agendamentos
- ✅ Calendário visual (dia/semana/mês)
- ✅ Campos: Cliente, Veículo, Serviço, Data/Hora, Duração
- ✅ Status: Agendado | Confirmado | Em Andamento | Concluído | Cancelado
- ✅ Notificações automáticas:
  - E-mail de confirmação
  - Lembrete 1 dia antes
  - WhatsApp (se configurado)
- ✅ Reagendamento com histórico
- ✅ Cancelamento com motivo
- ✅ Filtros: Status, Data, Cliente
- ✅ Busca rápida

**Regras de Negócio:**
- Limite por plano:
  - Gratuito: 100 agendamentos/mês
  - Básico: 500 agendamentos/mês
  - Profissional: 2000 agendamentos/mês
  - Enterprise: Ilimitado
- Não permite conflito de horários
- Mínimo 30 minutos de duração
- Máximo 8h de duração
- Cancelamento até 2h antes (configurável)

**UX:**
- Calendário interativo (FullCalendar style)
- Drag & drop para reagendar
- Quick form para agendamento rápido
- Badge colorido por status
- Modal de detalhes com timeline

---

### 4.5 🔧 Ordens de Serviço
**Objetivo**: Gerenciar execução dos serviços

**Funcionalidades Core:**
- ✅ CRUD de OS
- ✅ Geração automática de número (OS001-2024)
- ✅ Campos:
  - Cliente e Veículo
  - Descrição do problema
  - Diagnóstico
  - Serviços executados (lista)
  - Peças utilizadas (lista)
  - Mão de obra
  - Observações técnicas
- ✅ Status: Aberta | Em Andamento | Aguardando Peças | Concluída | Cancelada
- ✅ Assinatura digital do cliente
- ✅ Fotos antes/depois
- ✅ Exportação para PDF
- ✅ Envio por e-mail/WhatsApp
- ✅ Timeline de progresso
- ✅ Checklist de serviços

**Cálculo Automático:**
```javascript
Total da OS = Σ(Peças) + Σ(Serviços) - Desconto
```

**Regras de Negócio:**
- Limite por plano (igual a agendamentos)
- Apenas usuários autenticados
- Baixa automática de estoque ao finalizar
- Cria transação financeira automática
- Bloqueia edição após concluída (apenas admin pode)

**UX:**
- Wizard de criação (3 etapas)
- Tabela de itens com inline edit
- Badge de status grande e colorido
- Print otimizado para A4
- Modal de visualização full-screen

---

### 4.6 📦 Gestão de Estoque
**Objetivo**: Controle de peças e produtos

**Funcionalidades Core:**
- ✅ CRUD de peças
- ✅ Campos:
  - Código/SKU
  - Nome
  - Categoria
  - Fornecedor
  - Quantidade em estoque
  - Estoque mínimo
  - Preço de custo
  - Preço de venda
  - Margem de lucro (auto-calculada)
  - Localização no estoque
- ✅ Movimentações:
  - Entrada (compra)
  - Saída (venda/uso)
  - Ajuste de estoque
  - Transferência
- ✅ Alertas de estoque baixo
- ✅ Histórico de movimentações
- ✅ Relatório de curva ABC
- ✅ Inventário (contagem)
- ✅ Código de barras

**Regras de Negócio:**
- Limite por plano:
  - Gratuito: 200 itens
  - Básico: 1000 itens
  - Profissional: 5000 itens
  - Enterprise: Ilimitado
- SKU único
- Estoque não pode ficar negativo (aviso)
- Margem calculada: `((preço_venda - preço_custo) / preço_custo) * 100`

**UX:**
- Cards com foto do produto
- Badge de status de estoque (verde/amarelo/vermelho)
- Quick edit inline
- Scanner de código de barras (PWA)
- Modal de movimentação

---

### 4.7 💰 Gestão Financeira
**Objetivo**: Controle de receitas e despesas

**Funcionalidades Core:**
- ✅ CRUD de transações
- ✅ Tipos: Receita | Despesa
- ✅ Categorias:
  - Receitas: Serviços, Peças, Produtos
  - Despesas: Salários, Aluguel, Fornecedores, Impostos, Outros
- ✅ Campos:
  - Descrição
  - Valor
  - Data de vencimento
  - Data de pagamento
  - Método de pagamento
  - Cliente/Fornecedor
  - OS vinculada
  - Status (Pendente | Pago | Atrasado)
- ✅ Dashboard financeiro:
  - Receita total
  - Despesa total
  - Lucro líquido
  - Contas a receber
  - Contas a pagar
  - Fluxo de caixa mensal
- ✅ Gráficos:
  - Receita x Despesa (mensal)
  - Distribuição por categoria
  - Lucro acumulado
- ✅ Filtros por período, status, categoria
- ✅ Exportação para Excel

**Regras de Negócio:**
- Limite por plano:
  - Gratuito: 200 transações/mês
  - Básico: 1000 transações/mês
  - Profissional: Ilimitado
  - Enterprise: Ilimitado
- Status automático (atrasado se vencimento < hoje)
- Integração com OS (cria receita automática)

**UX:**
- Cards de métricas com cores semânticas
- Gráficos interativos (Recharts)
- Tabela com quick actions
- Filtros avançados
- Badge de status colorido

---

### 4.8 📧 Comunicação
**Objetivo**: Centralizar comunicação com clientes

**Funcionalidades Core:**
- ✅ Configuração de e-mail SMTP
- ✅ Templates de e-mail:
  - Confirmação de agendamento
  - Lembrete de agendamento
  - OS pronta para retirada
  - Nota fiscal/recibo
  - Promoções
- ✅ Envio manual de e-mails
- ✅ Logs de envios (sucesso/erro)
- ✅ Integração WhatsApp (webhook)
- ✅ Chat interno com clientes
- ✅ Notificações push (PWA)
- ✅ Histórico de mensagens

**Configuração SMTP Suportada:**
- Gmail
- Outlook/Office 365
- SendGrid
- Mailgun
- Custom SMTP

**Regras de Negócio:**
- Gratuito: 100 e-mails/mês
- Básico: 500 e-mails/mês
- Profissional: 2000 e-mails/mês
- Enterprise: Ilimitado

**UX:**
- Editor de templates WYSIWYG
- Preview antes de enviar
- Status de entrega em tempo real
- Chat com interface moderna
- Notificações não intrusivas

---

### 4.9 📊 Relatórios e Analytics
**Objetivo**: Insights e tomada de decisão

**Funcionalidades Core:**
- ✅ Relatórios pré-definidos:
  - Receita por período
  - Serviços mais executados
  - Clientes mais fiéis (LTV)
  - Peças mais vendidas
  - Produtos com margem maior
  - Taxa de conversão de agendamentos
  - Tempo médio de atendimento
- ✅ Dashboard analítico:
  - KPIs principais
  - Gráficos interativos
  - Comparativos (mês atual vs. anterior)
- ✅ Filtros customizáveis
- ✅ Exportação para Excel/PDF
- ✅ Agendamento de relatórios (envio automático)

**Regras de Negócio:**
- Limite por plano:
  - Gratuito: 20 relatórios/mês
  - Básico: 100 relatórios/mês
  - Profissional: Ilimitado
  - Enterprise: Ilimitado + Relatórios customizados

**UX:**
- Interface estilo BI
- Gráficos interativos com drill-down
- Exportação em 1 clique
- Agendamento visual (calendário)

---

### 4.10 🖼️ Biblioteca de Imagens
**Objetivo**: Organizar imagens do sistema

**Funcionalidades Core:**
- ✅ Upload de imagens (drag & drop)
- ✅ Organização em coleções
- ✅ Tags e categorias
- ✅ Busca por nome/tag
- ✅ Metadados:
  - Dimensões
  - Tamanho do arquivo
  - Cores dominantes
  - Data de upload
  - Contagem de uso
- ✅ Galeria visual
- ✅ Lightbox para visualização
- ✅ Edição básica (crop, rotate)
- ✅ Vínculo com veículos, OS, produtos

**Regras de Negócio:**
- Limite de storage por plano:
  - Gratuito: 1GB
  - Básico: 10GB
  - Profissional: 50GB
  - Enterprise: Ilimitado
- Formatos aceitos: JPG, PNG, WEBP
- Tamanho máximo: 10MB por arquivo
- Compressão automática

**UX:**
- Grid responsivo com masonry
- Drag & drop para upload
- Preview antes de salvar
- Filtros visuais
- Modal full-screen

---

### 4.11 🤝 Marketplace de Parceiros
**Objetivo**: Conectar oficinas com clientes

**Funcionalidades Core:**
- ✅ Cadastro de oficina parceira
- ✅ Perfil público da oficina:
  - Fotos
  - Serviços oferecidos
  - Horário de funcionamento
  - Avaliações
  - Localização (mapa)
- ✅ Busca de oficinas:
  - Por proximidade
  - Por serviço
  - Por avaliação
- ✅ Sistema de avaliações (1-5 estrelas)
- ✅ Solicitação de orçamento
- ✅ Agendamento direto

**UX:**
- Cards de oficinas estilo marketplace
- Mapa interativo
- Sistema de estrelas visual
- Badge "Parceiro Verificado"

---

### 4.12 👨‍💼 Painel Administrativo
**Objetivo**: Gestão completa do sistema (Super Admin)

**Funcionalidades Core:**
- ✅ **Aba Usuários**:
  - Listar todos os usuários
  - Ver dados de assinatura
  - Ver uso de recursos
  - Promover/rebaixar roles (user ↔ admin)
  - Buscar por e-mail
  - Paginação
- ✅ **Aba Assinaturas**:
  - Cards de métricas (total, ativos, trial, cancelados)
  - Tabela com uso detalhado:
    - Email | Plano | Status | Uso %
  - Progress bars coloridas
  - Alertas de uso alto
- ✅ **Aba Sistema**:
  - Health checks:
    - Database status
    - Auth status
    - Edge Functions status
    - Storage status
  - Latência de serviços
  - Status cards (✅ Healthy | ⚠️ Warning | ❌ Error)
- ✅ **Aba Logs**:
  - Últimos 100 logs de auditoria
  - Filtros por usuário/ação
  - Visualização de JSON completo
  - Timeline visual

**Regras de Acesso:**
- Apenas roles `admin` ou `super_admin`
- Super admin pode promover admins
- Admin comum NÃO pode promover
- Logs de todas as ações administrativas

**UX:**
- Layout com tabs
- Ícone Shield vermelho
- Badges de roles coloridos
- Tooltips explicativos
- Confirmação para ações críticas

---

## 5. SISTEMA DE ASSINATURAS

### 5.1 Planos Disponíveis

#### 🆓 Plano Gratuito
**Preço**: R$ 0,00 (Para sempre)
**Público**: Oficinas pequenas / Testes
**Limites:**
- ✅ 40 clientes ativos
- ✅ 100 agendamentos/mês
- ✅ 200 itens no estoque
- ✅ 200 transações financeiras/mês
- ✅ 20 relatórios/mês
- ✅ 1GB de storage
- ✅ 100 e-mails/mês

**Recursos:**
- ✅ Gestão de clientes e veículos
- ✅ Agendamentos
- ✅ Ordens de serviço
- ✅ Estoque básico
- ✅ Financeiro básico
- ❌ Comunicação por e-mail
- ❌ Relatórios avançados
- ❌ Integrações
- ❌ Suporte prioritário

---

#### 💼 Plano Básico
**Preço**: 
- Mensal: R$ 49,90/mês
- Anual: R$ 499,00/ano (-17%)

**Público**: Oficinas médias
**Limites:**
- ✅ 200 clientes ativos
- ✅ 500 agendamentos/mês
- ✅ 1000 itens no estoque
- ✅ 1000 transações financeiras/mês
- ✅ 100 relatórios/mês
- ✅ 10GB de storage
- ✅ 500 e-mails/mês

**Recursos:**
- ✅ Tudo do Gratuito
- ✅ Comunicação por e-mail
- ✅ Templates de e-mail
- ✅ Relatórios básicos
- ✅ Exportação Excel/PDF
- ✅ Suporte por e-mail (48h)
- ❌ WhatsApp
- ❌ Relatórios customizados
- ❌ API

---

#### 🚀 Plano Profissional
**Preço**: 
- Mensal: R$ 99,90/mês
- Anual: R$ 999,00/ano (-17%)

**Público**: Oficinas grandes
**Trial**: 14 dias grátis
**Limites:**
- ✅ 1000 clientes ativos
- ✅ 2000 agendamentos/mês
- ✅ 5000 itens no estoque
- ✅ Transações ilimitadas
- ✅ Relatórios ilimitados
- ✅ 50GB de storage
- ✅ 2000 e-mails/mês

**Recursos:**
- ✅ Tudo do Básico
- ✅ Integração WhatsApp
- ✅ Chat com clientes
- ✅ Relatórios avançados
- ✅ Agendamento de relatórios
- ✅ Múltiplos usuários (até 5)
- ✅ Suporte prioritário (24h)
- ✅ PWA offline
- ❌ White label
- ❌ API customizada

---

#### 🏢 Plano Enterprise
**Preço**: Sob consulta (R$ 299+/mês)
**Público**: Redes de oficinas / Franquias
**Limites:**
- ✅ Clientes ilimitados
- ✅ Agendamentos ilimitados
- ✅ Estoque ilimitado
- ✅ Tudo ilimitado
- ✅ Storage ilimitado
- ✅ E-mails ilimitados

**Recursos:**
- ✅ Tudo do Profissional
- ✅ Múltiplos usuários ilimitados
- ✅ White label
- ✅ API customizada
- ✅ Webhooks
- ✅ Relatórios customizados
- ✅ Gerente de conta dedicado
- ✅ Suporte 24/7
- ✅ SLA 99.9%
- ✅ Treinamento presencial

---

### 5.2 Fluxo de Upgrade/Downgrade

#### Upgrade (Imediato)
```
1. Cliente no Plano Gratuito atinge limite
2. Clica em "Ver Planos"
3. Seleciona Plano Profissional
4. Redireciona para Stripe Checkout
5. Insere dados do cartão
6. Stripe processa pagamento
7. Webhook atualiza partner_subscriptions:
   - status = 'active'
   - plan_id = novo_plano
   - current_period_end = hoje + 30 dias
8. Limites aumentam imediatamente
9. Cliente pode usar novos recursos ✅
```

**Regras:**
- Crédito proporcional se upgrade no meio do ciclo
- Acesso imediato aos novos recursos
- Não há período de carência

#### Downgrade (Fim do Período)
```
1. Cliente no Plano Profissional
2. Acessa "Gerenciar Assinatura" (Stripe Portal)
3. Clica em "Cancelar Assinatura"
4. Stripe marca cancel_at_period_end = true
5. Webhook atualiza partner_subscriptions:
   - cancel_at_period_end = true
   - status = 'active' (ainda)
6. Cliente continua usando até fim do período ✅
7. No dia do fim do período:
   - Webhook customer.subscription.deleted
   - status = 'cancelled'
   - Sistema busca plano gratuito
   - Cria nova assinatura gratuita
   - Zera contadores de uso
8. Cliente downgrade para Gratuito
9. Dados antigos PRESERVADOS ✅
10. Novos registros bloqueados se exceder limite ❌
```

**Regras:**
- Downgrade só ocorre ao fim do período pago
- Dados nunca são deletados
- Cliente pode RE-UPGRADE a qualquer momento
- Acesso imediato ao plano superior ao re-upgradar

---

### 5.3 Gestão de Limites

#### Validação Client-Side
```typescript
// Hook usePlanLimits
const { checkLimit } = usePlanLimits();

const canCreate = await checkLimit('clients');
if (!canCreate) {
  toast.error('Limite atingido');
  navigate('/planos');
  return;
}
```

#### Validação Server-Side (RLS)
```sql
CREATE POLICY "check_client_limit_on_insert"
ON clients FOR INSERT
WITH CHECK (
  check_subscription_limit(
    auth.uid(), 
    'clients', 
    (SELECT COUNT(*) FROM clients WHERE user_id = auth.uid())
  )
);
```

#### Edge Function de Validação
```typescript
// validate-plan-limit
// Validação extra server-side para garantir integridade
```

---

## 6. SISTEMA DE ROLES E PERMISSÕES

### 6.1 Roles Disponíveis

#### 👤 User (Padrão)
**Acesso:**
- ✅ Todos os módulos operacionais
- ✅ Apenas seus próprios dados
- ❌ Painel administrativo
- ❌ Ver dados de outros usuários

#### 👨‍💼 Admin
**Acesso:**
- ✅ Todos os módulos operacionais
- ✅ Ver dados de TODOS os usuários (toggle)
- ✅ Painel administrativo (exceto promover admins)
- ✅ Logs de auditoria
- ❌ Promover outros usuários para admin

#### 👑 Super Admin
**Acesso:**
- ✅ Acesso total ao sistema
- ✅ Painel administrativo completo
- ✅ Promover/rebaixar usuários
- ✅ Gerenciar assinaturas manualmente
- ✅ Acesso a métricas globais

### 6.2 Segurança

#### Armazenamento de Roles
```sql
-- ✅ CORRETO: Tabela separada
CREATE TABLE user_roles (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- ❌ ERRADO: No perfil (risco de escalação)
ALTER TABLE profiles ADD COLUMN role text;
```

#### Validação Server-Side
```sql
-- Security Definer Function (bypass RLS)
CREATE FUNCTION has_role(_user_id uuid, _role app_role)
RETURNS boolean
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Uso em RLS Policy
CREATE POLICY "admins_see_all"
ON clients FOR SELECT
USING (
  user_id = auth.uid() 
  OR has_role(auth.uid(), 'admin')
);
```

#### Client-Side Hook
```typescript
// useUserRole.ts
export const useUserRole = () => {
  const [role, setRole] = useState<AppRole | null>(null);
  
  // Busca role do Supabase
  // NÃO usa localStorage (pode ser manipulado)
  
  return { 
    role, 
    isAdmin: role === 'admin' || role === 'super_admin',
    isSuperAdmin: role === 'super_admin'
  };
};
```

---

## 7. INTEGRAÇÕES

### 7.1 Stripe
**Uso**: Pagamentos e Gestão de Assinaturas

**Fluxo de Integração:**
```
1. Cliente seleciona plano
2. Frontend chama Edge Function create-checkout-session
3. Edge Function cria Stripe Checkout Session
4. Cliente redireciona para Stripe
5. Stripe processa pagamento
6. Stripe envia webhook para stripe-webhook
7. Edge Function atualiza partner_subscriptions
8. Cliente recebe confirmação
```

**Webhooks Implementados:**
- ✅ `checkout.session.completed` → Ativar assinatura
- ✅ `invoice.payment_succeeded` → Renovar assinatura
- ✅ `customer.subscription.deleted` → Cancelar
- ✅ `customer.subscription.updated` → Atualizar status

### 7.2 SMTP (E-mail)
**Provedores Suportados:**
- Gmail (smtp.gmail.com:587)
- Outlook (smtp.office365.com:587)
- Custom SMTP

**Templates Implementados:**
- Confirmação de agendamento
- Lembrete de agendamento (24h antes)
- OS pronta para retirada
- Recibo de pagamento

### 7.3 WhatsApp (Futuro)
**Provedor**: Twilio API
**Uso**: Notificações e lembretes

### 7.4 Google Maps (Futuro)
**Uso**: Localização de oficinas no marketplace

---

## 8. REQUISITOS NÃO-FUNCIONAIS

### 8.1 Performance
- ⚡ Tempo de carregamento inicial: < 3s
- ⚡ Tempo de resposta de APIs: < 500ms
- ⚡ Lazy loading de imagens
- ⚡ Code splitting por rota
- ⚡ Cache de dados com TanStack Query

### 8.2 Segurança
- 🔒 Autenticação via Supabase Auth (JWT)
- 🔒 Row Level Security em todas as tabelas
- 🔒 HTTPS obrigatório
- 🔒 CORS configurado
- 🔒 Rate limiting em Edge Functions
- 🔒 Validação server-side de limites
- 🔒 Sanitização de inputs

### 8.3 Escalabilidade
- 📈 Suporte a 10.000 usuários simultâneos
- 📈 Database indexada corretamente
- 📈 CDN para assets estáticos
- 📈 Edge Functions distribuídas

### 8.4 Disponibilidade
- ✅ SLA 99.5% (Profissional)
- ✅ SLA 99.9% (Enterprise)
- ✅ Backup diário automático
- ✅ Failover automático

### 8.5 Usabilidade
- 🎨 Design responsivo (mobile-first)
- 🎨 Suporte a temas (claro/escuro/sistema)
- 🎨 Acessibilidade WCAG 2.1 AA
- 🎨 Feedback visual de todas as ações
- 🎨 Loading states e skeletons

### 8.6 Compatibilidade
- ✅ Chrome 90+ (desktop/mobile)
- ✅ Firefox 88+ (desktop/mobile)
- ✅ Safari 14+ (desktop/mobile)
- ✅ Edge 90+
- ✅ PWA em iOS e Android

---

## 9. ROADMAP

### Q1 2024 (Concluído) ✅
- [x] MVP Core
- [x] Gestão de clientes
- [x] Agendamentos
- [x] Ordens de serviço
- [x] Estoque básico
- [x] Financeiro básico
- [x] Sistema de assinaturas

### Q2 2024 (Concluído) ✅
- [x] Integração Stripe
- [x] Comunicação por e-mail
- [x] Relatórios básicos
- [x] Biblioteca de imagens
- [x] Painel administrativo
- [x] Sistema de roles

### Q3 2024 (Em Desenvolvimento) 🚧
- [ ] PWA offline completo
- [ ] Integração WhatsApp
- [ ] Chat com clientes
- [ ] Marketplace de parceiros
- [ ] API pública
- [ ] White label

### Q4 2024 (Planejado) 📋
- [ ] Mobile app nativo (React Native)
- [ ] Integração com ERPs
- [ ] Relatórios customizáveis
- [ ] BI avançado
- [ ] Multi-idioma (EN, ES)
- [ ] Integração Google Maps

### 2025 (Futuro) 🔮
- [ ] IA para diagnósticos
- [ ] Assistente virtual
- [ ] Marketplace de peças
- [ ] Programa de fidelidade
- [ ] Franchising módulo

---

## 10. MÉTRICAS DE SUCESSO

### 10.1 Métricas de Produto
- **Usuários ativos mensais (MAU)**: Meta 1.000 até Q4/2024
- **Taxa de conversão trial → pago**: Meta 30%
- **Churn mensal**: Meta < 5%
- **NPS (Net Promoter Score)**: Meta > 50
- **Tempo médio de uso diário**: Meta 45 minutos

### 10.2 Métricas de Negócio
- **MRR (Monthly Recurring Revenue)**: Meta R$ 50.000 até Q4/2024
- **ARR (Annual Recurring Revenue)**: Meta R$ 600.000
- **CAC (Custo de Aquisição)**: Meta < R$ 200
- **LTV (Lifetime Value)**: Meta > R$ 1.800
- **LTV/CAC Ratio**: Meta > 3

### 10.3 Métricas Técnicas
- **Uptime**: Meta 99.5%
- **P95 Latência**: Meta < 1s
- **Crash rate**: Meta < 0.1%
- **Core Web Vitals**: 
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1

---

## 11. DOCUMENTAÇÃO TÉCNICA

### 11.1 Para Desenvolvedores
- [x] README.md com setup
- [x] Manual de instalação PWA
- [x] Documentação de APIs
- [x] Guia de integração Stripe
- [x] Sistema de relatórios
- [x] Manual de teste admin

### 11.2 Para Usuários
- [x] Manual do usuário completo
- [ ] Vídeos tutoriais
- [ ] FAQ interativo
- [ ] Base de conhecimento

### 11.3 Para Administradores
- [x] Manual de teste admin
- [x] Checklist de produção
- [x] Status de produção
- [x] Auditoria de sistema

---

## 12. GLOSSÁRIO

**Termos Técnicos:**
- **RLS**: Row Level Security (segurança a nível de linha)
- **PWA**: Progressive Web App (aplicação web progressiva)
- **SaaS**: Software as a Service (software como serviço)
- **Edge Function**: Função serverless executada na borda da rede
- **JWT**: JSON Web Token (token de autenticação)

**Termos de Negócio:**
- **MRR**: Monthly Recurring Revenue (receita recorrente mensal)
- **ARR**: Annual Recurring Revenue (receita recorrente anual)
- **CAC**: Customer Acquisition Cost (custo de aquisição)
- **LTV**: Lifetime Value (valor vitalício do cliente)
- **Churn**: Taxa de cancelamento

**Termos do Domínio:**
- **OS**: Ordem de Serviço
- **SKU**: Stock Keeping Unit (unidade de manutenção de estoque)
- **Curva ABC**: Classificação de itens por importância
- **Markup**: Margem de lucro sobre custo

---

## 13. CONTATO E SUPORTE

**Equipe de Desenvolvimento:**
- 📧 dev@oficinasystem.com.br
- 🐛 GitHub Issues: github.com/oficinasystem/issues

**Suporte ao Cliente:**
- 📧 suporte@oficinasystem.com.br
- 💬 Chat: disponível no sistema
- 📞 WhatsApp: (11) 99999-9999

**Vendas:**
- 📧 vendas@oficinasystem.com.br
- 📞 (11) 3333-3333

---

## 14. CHANGELOG

### v2.0.0 (Atual)
- ✅ Painel administrativo completo
- ✅ Sistema de roles (user/admin/super_admin)
- ✅ Upgrade/Downgrade de planos
- ✅ Biblioteca de imagens
- ✅ Comunicação por e-mail

### v1.5.0
- ✅ Integração Stripe
- ✅ Sistema de assinaturas
- ✅ Limites por plano

### v1.0.0 (MVP)
- ✅ Gestão de clientes
- ✅ Agendamentos
- ✅ Ordens de serviço
- ✅ Estoque básico
- ✅ Financeiro básico

---

## 15. NOTAS TÉCNICAS IMPORTANTES

### 15.1 Arquitetura Frontend
**O projeto SEMPRE foi React + Vite. NÃO houve migração de/para Next.js.**

- ✅ Build Tool: Vite 5.4.19
- ✅ Roteamento: React Router DOM v6 (client-side)
- ✅ Entry Point: `index.html` (padrão Vite)
- ✅ Estrutura: SPA (Single Page Application)
- ❌ NÃO usa Next.js App Router
- ❌ NÃO usa Next.js Pages Router
- ❌ NÃO usa Server-Side Rendering (SSR)

### 15.2 Proteção de Rotas
**3 Camadas de Segurança:**

1. **Autenticação** (`<ProtectedRoute>`)
   - Verifica se usuário está logado via Supabase Auth
   - Redireciona para landing se não autenticado

2. **Autorização por Role** (`<AdminRoute>`)
   - Valida role via função `is_admin()` (SECURITY DEFINER)
   - Bloqueia acesso se não for admin/super_admin

3. **Autorização por Feature** (`<FeatureRoute>`)
   - Verifica se plano atual tem acesso à feature
   - Exibe prompt de upgrade se necessário

### 15.3 Segurança Server-Side
**Row Level Security (RLS) ativo em 100% das tabelas:**

- Todas as queries passam por validação RLS
- Funções SECURITY DEFINER para operações privilegiadas
- Impossível burlar limites de plano via client-side
- Logs de auditoria para ações administrativas

### 15.4 Pendências Críticas Identificadas

**❌ CRÍTICO - Ofuscação de Dados do Parceiro:**
- **Problema**: Dados sensíveis do parceiro são exibidos antes da compra
- **Impacto**: Violação de privacidade e modelo de negócio
- **Solução**: Implementar ofuscação em `src/components/partners/PartnerCard.tsx`
- **Prioridade**: ALTA (bloqueador para produção)

**⚠️ IMPORTANTE - Otimização de Performance:**
- **Problema**: Possíveis re-renders excessivos em contexts
- **Impacto**: Performance degradada em uso intenso
- **Solução**: Adicionar memoização em `AuthContext` e `SubscriptionContext`
- **Prioridade**: MÉDIA (melhoria de UX)

---

**Última Atualização**: 2025-01-24
**Versão do PRD**: 3.0
**Status**: ✅ MVP 95% Completo (Pendente: Ofuscação de Dados)
