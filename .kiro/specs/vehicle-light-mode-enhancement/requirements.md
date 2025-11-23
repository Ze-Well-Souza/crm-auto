# Requirements Document

## Introduction

Este documento define os requisitos para melhorar a legibilidade e contraste visual do componente VehicleCard no modo claro (light mode). O design atual apresenta baixo contraste, com bordas e textos em tons muito claros que dificultam a leitura e reduzem a hierarquia visual. O objetivo é criar um visual com alto contraste e definição, onde os cards "saltem" da tela branca com informações facilmente legíveis.

## Glossary

- **VehicleCard**: Componente React que exibe informações de um veículo em formato de card
- **Light Mode**: Tema claro da aplicação com fundo branco
- **Dark Mode**: Tema escuro da aplicação (não será alterado nesta spec)
- **Badge**: Componente de etiqueta usado para status e categorias
- **Contrast Ratio**: Razão de contraste entre texto e fundo para legibilidade
- **Hover State**: Estado visual quando o usuário passa o mouse sobre o elemento

## Requirements

### Requirement 1

**User Story:** Como usuário do sistema, eu quero ver cards de veículos com bordas bem definidas no modo claro, para que eu possa distinguir claramente cada card na interface.

#### Acceptance Criteria

1. WHEN the application is in light mode, THE VehicleCard SHALL display borders using `border-slate-300` instead of `border-slate-200`
2. WHEN the application is in light mode, THE VehicleCard SHALL maintain a minimum contrast ratio of 3:1 between border and background
3. WHEN the application is in dark mode, THE VehicleCard SHALL preserve existing border styles without changes

### Requirement 2

**User Story:** Como usuário do sistema, eu quero ler títulos e labels com alto contraste no modo claro, para que eu possa identificar informações rapidamente sem esforço visual.

#### Acceptance Criteria

1. WHEN displaying vehicle titles in light mode, THE VehicleCard SHALL use `text-slate-900` with `font-semibold` weight
2. WHEN displaying field labels (such as "Placa", "Quilometragem") in light mode, THE VehicleCard SHALL use `text-slate-600` with `font-medium` weight
3. WHEN displaying field values in light mode, THE VehicleCard SHALL use `text-slate-800` color
4. WHEN the application is in dark mode, THE VehicleCard SHALL preserve existing text color styles

### Requirement 3

**User Story:** Como usuário do sistema, eu quero ver badges de status com cores saturadas e legíveis no modo claro, para que eu possa identificar rapidamente o estado de manutenção dos veículos.

#### Acceptance Criteria

1. WHEN displaying "Em Dia" status badge in light mode, THE VehicleCard SHALL use `bg-green-100`, `text-green-800`, and `border-green-200`
2. WHEN displaying "Atenção" status badge in light mode, THE VehicleCard SHALL use `bg-orange-100`, `text-orange-800`, and `border-orange-200`
3. WHEN displaying "Atrasada" status badge in light mode, THE VehicleCard SHALL use `bg-red-100`, `text-red-800`, and `border-red-200`
4. WHEN displaying fuel type badge in light mode, THE VehicleCard SHALL use `bg-blue-100`, `text-blue-800`, and `border-blue-200`
5. WHEN the application is in dark mode, THE VehicleCard SHALL preserve existing badge styles

### Requirement 4

**User Story:** Como usuário do sistema, eu quero ver um efeito visual claro quando passo o mouse sobre um card no modo claro, para que eu saiba que o elemento é interativo.

#### Acceptance Criteria

1. WHEN hovering over a VehicleCard in light mode, THE card SHALL display `shadow-lg` shadow effect
2. WHEN hovering over a VehicleCard in light mode, THE card SHALL display a `ring-1` with `ring-blue-200` color
3. WHEN not hovering, THE VehicleCard SHALL maintain its default shadow state
4. WHEN the application is in dark mode, THE VehicleCard SHALL preserve existing hover effects

### Requirement 5

**User Story:** Como usuário do sistema, eu quero que todas as melhorias visuais sejam aplicadas consistentemente em todos os elementos do VehicleCard, para que a interface tenha uma aparência coesa e profissional.

#### Acceptance Criteria

1. WHEN rendering any text element in light mode, THE VehicleCard SHALL apply appropriate contrast improvements based on element type
2. WHEN rendering any badge or status indicator in light mode, THE VehicleCard SHALL use saturated background colors with proper borders
3. WHEN rendering any container or section in light mode, THE VehicleCard SHALL use improved border colors for better definition
4. WHEN the user switches between light and dark modes, THE VehicleCard SHALL apply the correct styles for each mode without visual glitches
