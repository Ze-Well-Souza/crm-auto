# 📊 Migração do Módulo de Gestão de Clientes - CRM Uautos

## 🎯 Objetivo
Migrar o módulo de Gestão de Clientes do CRM legado para o ecossistema Uautos com Supabase, incluindo:
- KPIs de topo (Total, Qualidade, Classificação)
- Filtros avançados (Busca, Tags Rápidas)
- Grid de cards com métricas reais
- Hover effects com ações rápidas

---

## 1️⃣ **PASSO 1: Executar Migration SQL**

### Arquivo: `supabase/migrations/20250121_add_client_metrics.sql`

**O que faz:**
- ✅ Adiciona campos de métricas à tabela `clients` existente
- ✅ Cria índices para performance
- ✅ Implementa função `calculate_client_quality_score()` (0-100%)
- ✅ Implementa função `update_client_metrics()` para atualizar totais
- ✅ Cria triggers automáticos para manter métricas sincronizadas
- ✅ Atualiza métricas de todos os clientes existentes

**Campos Adicionados:**
```sql
tags text[]                    -- ['VIP', 'Novo', 'Recente']
total_spent decimal(10,2)      -- Total gasto em serviços
service_count integer          -- Quantidade de serviços
vehicle_count integer          -- Quantidade de veículos
last_service_date timestamptz  -- Data do último serviço
quality_score integer          -- Score 0-100 (completude dos dados)
is_vip boolean                 -- Cliente VIP (>R$5000 ou >10 serviços)
is_active boolean              -- Cliente ativo
```

**Como executar:**
```bash
# No Supabase Dashboard > SQL Editor
# Copiar e colar o conteúdo do arquivo e executar
```

---

## 2️⃣ **PASSO 2: Componentes React Criados**

### 2.1 **ClientCardModern.tsx**
Card moderno com hover effects para exibir ações rápidas.

**Funcionalidades:**
- ✅ Exibe nome, tags (VIP/Novo), quality score
- ✅ Mostra CPF/CNPJ, email, telefone, endereço
- ✅ Métricas: Total Gasto, Veículos Cadastrados
- ✅ **Hover Effect:** Botões aparecem suavemente (Ligar, WhatsApp, Email, Agendar, Novo Serviço)

**Props:**
```typescript
interface ClientCardModernProps {
  client: Client;
  onCall?: (client: Client) => void;
  onWhatsApp?: (client: Client) => void;
  onEmail?: (client: Client) => void;
  onSchedule?: (client: Client) => void;
  onNewService?: (client: Client) => void;
}
```

**CSS Hover Effect:**
```css
/* Overlay com gradiente escuro */
opacity-0 group-hover:opacity-100 transition-opacity duration-300

/* Botões aparecem em duas linhas */
flex flex-col gap-2
```

---

### 2.2 **ClientKPIs.tsx**
Componente de KPIs para o topo da página.

**Métricas Exibidas:**
1. **Total de Clientes** (ícone Users, azul)
2. **Qualidade dos Dados** (ícone TrendingUp, verde/amarelo/vermelho)
3. **Classificação** (ícone Star, amarelo) - VIP/Novos/Regulares
4. **Com Email** (ícone Mail, roxo) - Total + Recentes

**Props:**
```typescript
interface ClientKPIsProps {
  metrics: ClientMetrics | null;
  loading: boolean;
}
```

---

### 2.3 **ClientFiltersAdvanced.tsx**
Barra de filtros com busca textual e tags rápidas.

**Funcionalidades:**
- ✅ Campo de busca (nome, email, telefone, CPF/CNPJ)
- ✅ Dropdown de filtros avançados (VIP, Novos, Com Email, Recentes)
- ✅ Tags rápidas clicáveis
- ✅ Contador de resultados
- ✅ Botão "Limpar Filtros"

**Props:**
```typescript
interface ClientFiltersAdvancedProps {
  filters: ClientFilterOptions;
  onFiltersChange: (filters: ClientFilterOptions) => void;
  totalResults: number;
}
```

---

### 2.4 **useClientMetricsAdvanced.ts**
Hook customizado para buscar métricas agregadas.

**Retorna:**
```typescript
interface ClientMetrics {
  totalClients: number;
  averageQualityScore: number;
  vipCount: number;
  newCount: number;
  regularCount: number;
  withEmail: number;
  recentClients: number;
}
```

**Uso:**
```typescript
const { metrics, loading, error, refetch } = useClientMetricsAdvanced();
```

---

## 3️⃣ **PASSO 3: Integração na Página de Clientes**

### Exemplo de Uso Completo:

```typescript
import { useState } from "react";
import { ClientKPIs } from "@/components/clients/ClientKPIs";
import { ClientFiltersAdvanced, ClientFilterOptions } from "@/components/clients/ClientFiltersAdvanced";
import { ClientCardModern } from "@/components/clients/ClientCardModern";
import { useClients } from "@/hooks/useClients";
import { useClientMetricsAdvanced } from "@/hooks/useClientMetricsAdvanced";

export const ClientsPage = () => {
  const { clients, loading } = useClients();
  const { metrics, loading: metricsLoading } = useClientMetricsAdvanced();
  
  const [filters, setFilters] = useState<ClientFilterOptions>({
    searchQuery: '',
    showVIP: false,
    showNew: false,
    showWithEmail: false,
    showRecent: false
  });

  // Aplicar filtros
  const filteredClients = clients?.filter(client => {
    // Busca textual
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        client.name.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.phone?.includes(query) ||
        client.cpf_cnpj?.includes(query);
      if (!matchesSearch) return false;
    }
    
    // Filtros de tags
    if (filters.showVIP && !client.is_vip) return false;
    if (filters.showNew && client.service_count !== 0) return false;
    if (filters.showWithEmail && !client.email) return false;
    if (filters.showRecent) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      if (new Date(client.created_at) <= sevenDaysAgo) return false;
    }
    
    return true;
  }) || [];

  const handleCall = (client: Client) => {
    window.location.href = `tel:${client.phone}`;
  };

  const handleWhatsApp = (client: Client) => {
    const phone = client.phone?.replace(/\D/g, '');
    window.open(`https://wa.me/55${phone}`, '_blank');
  };

  const handleEmail = (client: Client) => {
    window.location.href = `mailto:${client.email}`;
  };

  return (
    <div className="space-y-6 p-6">
      {/* KPIs */}
      <ClientKPIs metrics={metrics} loading={metricsLoading} />
      
      {/* Filtros */}
      <ClientFiltersAdvanced
        filters={filters}
        onFiltersChange={setFilters}
        totalResults={filteredClients.length}
      />
      
      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map(client => (
          <ClientCardModern
            key={client.id}
            client={client}
            onCall={handleCall}
            onWhatsApp={handleWhatsApp}
            onEmail={handleEmail}
            onSchedule={(c) => console.log('Agendar', c)}
            onNewService={(c) => console.log('Novo Serviço', c)}
          />
        ))}
      </div>
    </div>
  );
};
```

---

## 4️⃣ **Cálculo Automático de Métricas**

### Como Funciona:

1. **Triggers Automáticos:**
   - Quando uma `service_order` é criada/atualizada/deletada → atualiza `total_spent` e `service_count`
   - Quando um `vehicle` é criado/deletado → atualiza `vehicle_count`

2. **Quality Score (0-100%):**
   - Email preenchido: +20 pontos
   - Telefone preenchido: +20 pontos
   - CPF/CNPJ preenchido: +15 pontos
   - Endereço completo: +15 pontos
   - CEP preenchido: +10 pontos
   - Tem veículos: +10 pontos
   - Tem serviços: +10 pontos

3. **Classificação VIP:**
   - Total gasto >= R$ 5.000 OU
   - Quantidade de serviços >= 10

---

## 5️⃣ **Checklist de Implementação**

- [x] ✅ SQL Migration criada
- [x] ✅ Tipos TypeScript atualizados
- [x] ✅ Componente ClientCardModern
- [x] ✅ Componente ClientKPIs
- [x] ✅ Componente ClientFiltersAdvanced
- [x] ✅ Hook useClientMetricsAdvanced
- [ ] ⏳ Executar migration no Supabase
- [ ] ⏳ Integrar componentes na página de Clientes
- [ ] ⏳ Testar filtros e busca
- [ ] ⏳ Testar hover effects
- [ ] ⏳ Testar ações rápidas (Ligar, WhatsApp, Email)

---

## 6️⃣ **Próximos Passos**

1. Execute a migration SQL no Supabase Dashboard
2. Integre os componentes na página de Clientes
3. Teste todas as funcionalidades
4. Ajuste estilos conforme necessário
5. Implemente as ações de Agendar e Novo Serviço

---

**Documentação Completa ✅**

