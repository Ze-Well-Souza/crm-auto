# 🧪 Guia de Testes - CRM Auto

## 📋 Visão Geral

Este projeto utiliza **Vitest** e **React Testing Library** para testes automatizados.

---

## 🚀 Comandos Disponíveis

```bash
# Executar todos os testes
npm run test

# Modo watch (re-executa ao salvar arquivos)
npm run test:watch

# Interface gráfica do Vitest
npm run test:ui

# Testes com coverage (para CI/CD)
npm run test:ci

# Verificar tipos TypeScript
npm run type-check

# Executar linter
npm run lint
```

---

## 📁 Estrutura de Testes

```
src/
├── test/
│   ├── setup.ts                    # Configuração global
│   └── utils/
│       └── test-utils.tsx          # Helpers de renderização
├── components/
│   └── ui/
│       └── __tests__/
│           ├── button.test.tsx
│           └── card.test.tsx
├── hooks/
│   └── __tests__/
│       └── useClients.test.tsx
└── utils/
    └── __tests__/
        └── formatters.test.ts
```

---

## ✍️ Como Escrever Testes

### **1. Teste de Componente UI**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import { Button } from '../button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    screen.getByText('Click').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### **2. Teste de Hook Customizado**

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useMyHook } from '../useMyHook';

it('fetches data successfully', async () => {
  const { result } = renderHook(() => useMyHook());

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.data).toBeDefined();
});
```

### **3. Teste de Função Utilitária**

```typescript
import { describe, it, expect } from 'vitest';
import { formatCurrency } from '../formatters';

describe('formatCurrency', () => {
  it('formats number as Brazilian currency', () => {
    expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
  });
});
```

---

## 🎯 Boas Práticas

### ✅ **DO's**

1. **Testar comportamento, não implementação**
   ```typescript
   // ✅ BOM: Testa o que o usuário vê
   expect(screen.getByText('Salvo com sucesso')).toBeInTheDocument();

   // ❌ RUIM: Testa detalhes de implementação
   expect(component.state.saved).toBe(true);
   ```

2. **Usar queries acessíveis**
   ```typescript
   // ✅ BOM: Usa role/label (melhor para acessibilidade)
   screen.getByRole('button', { name: /salvar/i });

   // ⚠️ OK: Usa texto
   screen.getByText('Salvar');

   // ❌ EVITAR: Usa classes CSS
   container.querySelector('.btn-save');
   ```

3. **Testar casos extremos**
   ```typescript
   it('handles empty input', () => {
     render(<SearchInput value="" />);
     expect(screen.getByText('Nenhum resultado')).toBeInTheDocument();
   });
   ```

### ❌ **DON'Ts**

1. **Não teste código de terceiros**
   - Não teste React, Supabase, etc.
   - Confie que bibliotecas já são testadas

2. **Não teste detalhes de implementação**
   - Evite testar estado interno
   - Foque no comportamento visível

3. **Não duplique testes**
   - Um teste deve validar um comportamento específico

---

## 🔧 Configuração de Mocks

### **Mock do Supabase**

Já configurado em `src/test/setup.ts`:

```typescript
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: { ... },
    from: vi.fn(() => ({ ... }))
  }
}));
```

### **Mock de Módulos Específicos**

```typescript
vi.mock('../api/client', () => ({
  fetchUsers: vi.fn(() => Promise.resolve([]))
}));
```

---

## 📊 Coverage (Cobertura de Código)

### **Ver Relatório HTML**

```bash
npm run test:ci
# Abre: coverage/index.html
```

### **Metas de Coverage**

- **Componentes críticos:** 80%+
- **Hooks customizados:** 70%+
- **Funções utilitárias:** 90%+
- **Total do projeto:** 70%+

---

## 🐛 Troubleshooting

### **Erro: "Cannot find module"**

```bash
# Reinstalar dependências
npm install

# Limpar cache
npm run test -- --clearCache
```

### **Erro: "ReferenceError: vi is not defined"**

Adicione no topo do arquivo:
```typescript
/// <reference types="vitest/globals" />
import { vi } from 'vitest';
```

### **Testes lentos**

```typescript
// Aumentar timeout para testes assíncronos
it('fetches data', async () => {
  // ...
}, 10000); // 10 segundos
```

---

## 📚 Recursos

- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## ✅ Checklist de Teste

Antes de fazer commit:

- [ ] Todos os testes passam (`npm run test`)
- [ ] Sem erros de tipo (`npm run type-check`)
- [ ] Sem erros de lint (`npm run lint`)
- [ ] Coverage aceitável (>70%)
- [ ] Testes cobrem casos extremos

---

**Última Atualização:** 2025-01-26
