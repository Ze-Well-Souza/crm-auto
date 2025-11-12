## Resumo da Auditoria
- Frontend: `React 18`, `Vite 5`, `TypeScript`, `React Router`, `TanStack Query`, `Tailwind`, `shadcn/ui`, `vite-plugin-pwa`.
- Backend: Funções Edge `Supabase` (Deno) + integrações `Stripe`.
- Banco: `Supabase` (Postgres gerenciado); migrações presentes; seeds ausentes.
- Auth: `Supabase Auth` com `ProtectedRoute`/`AdminRoute`/`FeatureRoute`.
- Testes: Ausentes (sem `vitest/jest` e E2E).
- CI/CD: Ausentes (sem pipelines, Docker); sem `.env*` versionados.
- Observabilidade: Sem Sentry/OTEL; logs via `console`.
- Itens críticos:
  - Segredos hardcoded no frontend em `src/integrations/supabase/client.ts:3`.
  - CORS permissivo (`'*'`) em múltiplas Edge Functions (ex.: `supabase/functions/create-checkout-session/index.ts:7`).
  - Uso incorreto de `process.env` no frontend Vite (`src/hooks/usePWA.ts:280`).
  - Webhook Stripe duplicado/ambíguo (`supabase/functions/stripe-webhook/index.ts:30` vs `api/webhooks/stripe.js:4`).
  - Mocks ainda presentes (`src/utils/mockData.ts`).

## Correções Críticas (Prioridade Alta)
- Remover segredos hardcoded e migrar para `import.meta.env`:
  - Substituir `supabaseUrl`/`supabaseAnonKey` em `src/integrations/supabase/client.ts:3` por `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` carregados de `.env.*`.
  - Corrigir VAPID no frontend: trocar `process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY` por `import.meta.env.VITE_VAPID_PUBLIC_KEY` (`src/hooks/usePWA.ts:280`).
- Restringir CORS nas Edge Functions a domínios de produção:
  - Ajustar headers e pré-flight (ex.: `create-checkout-session/index.ts:7`, `validate-plan-limit/index.ts:6`).
- Consolidar webhook Stripe:
  - Manter apenas `supabase/functions/stripe-webhook/index.ts` e remover/arquivar `api/webhooks/stripe.js:4` ou integrar corretamente em um servidor com verificação de assinatura e `raw` body.
- Eliminar dependência de mocks para produção:
  - Remover/encapsular `src/utils/mockData.ts` e garantir que telas/hooks usem dados reais do Supabase.

## Plano de Implementação por Etapas
1) Configuração de Ambientes e Segredos
- Criar `.env.development` e `.env.production` com `VITE_*` (URL/AnonKey Supabase, Stripe Publishable, VAPID).
- Padronizar acesso a env no frontend via `import.meta.env` e validar chaves na inicialização.
- Verificar uso de `Deno.env.get` nas funções para `SERVICE_ROLE_KEY` e demais segredos.

2) Segurança de Backend (Edge Functions)
- CORS: restringir `Access-Control-Allow-Origin` aos domínios oficiais; validar `OPTIONS` e métodos.
- Inputs: validar payloads com `zod` ou schema antes de acessar Supabase.
- Rate limiting: adicionar mecanismo por IP/usuario (ex.: via KV/cache ou regras Supabase).
- Headers: incluir `Cache-Control` apropriado; evitar caching de respostas autenticadas.

3) Stripe e Faturamento
- Unificar webhook na função `stripe-webhook` (`supabase/functions/stripe-webhook/index.ts:30`) com verificação de assinatura.
- `create-checkout-session`: garantir validação de plano/usuário e idempotência.

4) Frontend Hardening
- Corrigir `process.env` para `import.meta.env` (`src/hooks/usePWA.ts:280`).
- Revisar hooks Supabase para paginação e seleção eficiente (ex.: `src/hooks/useClients.ts:25`).
- Remover `console.log` em produção (já há `drop_console` no `vite.config.ts:148`).
- Garantir que `ErrorBoundary` capture falhas e reporte (preparar integração com Sentry) (`src/components/ErrorBoundary/ModuleErrorBoundary.tsx:72`).

5) Remoção de Mocks e Dados Reais
- Substituir referências a `src/utils/mockData.ts` por chamadas reais (hooks com `useQuery`).
- Se necessário, criar scripts seed controlados para ambiente de desenvolvimento.

6) Observabilidade
- Integrar Sentry no frontend e nas Edge Functions (DSN via env).
- Adotar logger estruturado (ex.: `pino`) nas funções; adicionar `request-id` e níveis de log.
- Planejar métricas básicas (contagem de chamadas, latência) e traços simples.

7) Testes e Qualidade
- Adicionar `vitest` e testes unitários (utils, hooks críticos).
- Configurar E2E com `playwright` para rotas protegidas e fluxo Stripe.
- Cobertura mínima 70%; ESLint e Prettier com checagem.

8) CI/CD e Deploy
- GitHub Actions:
  - Jobs: Lint, Test, Build, Deploy.
  - Artefatos: `vite build` do frontend.
- Deploy Frontend: hosting estático (Supabase/Netlify/Vercel) com headers seguros.
- Deploy Backend: publicar funções no `Supabase` (CLI).
- Gestão de variáveis: GitHub Environments/Secrets; não comitar `.env`.

9) Segurança Complementar
- CSP no `index.html` (script-src com nonce/hash; connect-src para Supabase/domínios Stripe).
- Sanitização de HTML rico quando aplicável (DOMPurify).
- Regras RLS no Supabase revisadas para RBAC real; `FeatureRoute` client-side deve coincidir com RLS.
- Buckets de Storage com políticas privadas e URLs assinadas quando necessário (`src/hooks/useImageLibrary.ts:90`).

## Mudanças Por Arquivo (Indicativas)
- `src/integrations/supabase/client.ts:3` — remover hardcode, usar `VITE_*`.
- `src/hooks/usePWA.ts:280` — corrigir `process.env` → `import.meta.env.VITE_*`.
- `supabase/functions/*/index.ts:7` — restringir CORS e pré-flight.
- `supabase/functions/stripe-webhook/index.ts:30` — verificação de assinatura; logs estruturados.
- `api/webhooks/stripe.js:4` — remover ou integrar corretamente.
- `vite.config.ts:148` — confirmar `drop_console` apenas em produção.
- `src/components/ErrorBoundary/ModuleErrorBoundary.tsx:72` — integrar Sentry.
- `src/utils/mockData.ts` — remover/encapsular por flag de ambiente.

## Critérios de Aceite
- Nenhum segredo hardcoded no repositório; builds usam `.env`.
- CORS restrito aos domínios oficiais.
- Webhook Stripe único e validado por assinatura.
- Frontend sem dependência de mocks; todas telas usam dados reais.
- Suite de testes com cobertura ≥ 70% e E2E básico passando.
- Pipeline CI/CD executa lint, testes e build; deploy automatizado com variáveis seguras.
- Logs estruturados e captura de erros via Sentry visíveis.

## Checklist de Pré-Deploy
- `vite build` sem warnings críticos.
- Migrações aplicadas no Supabase; backup executado.
- Variáveis de ambiente configuradas nos ambientes (dev/staging/prod).
- Healthchecks básicos para funções (resposta 200 em rota de status).
- PWA testado (install/update) sem erro; cache não vaza dados sensíveis.
- Validação manual dos principais fluxos: login, CRUD clientes, faturamento Stripe.

## Cronograma Sugerido
- Semana 1: Segredos/env, CORS, webhook Stripe, remoção de mocks.
- Semana 2: Testes unitários/E2E, observabilidade (Sentry/logger), hardening frontend.
- Semana 3: CI/CD completo, CSP/headers, revisão RLS e Storage, checklist final.

## Entregáveis
- `.env.development` e `.env.production` modelos (sem segredos).
- Relatório de segurança (CORS, CSP, RLS) e evidências.
- Suite de testes e relatório de cobertura.
- Pipeline CI/CD com documentação breve de deploy.
