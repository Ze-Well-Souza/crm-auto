# Design Document

## Overview

This design document outlines the approach to fix the Light Mode styling of the Landing Page component. The solution uses Tailwind CSS's `dark:` variant system to conditionally apply styles based on the theme. The design preserves the existing Dark Mode glassmorphism aesthetic while introducing a clean, professional Light Mode that matches the internal dashboard's SaaS styling.

## Architecture

The Landing Page component (`src/pages/Landing.tsx`) will be refactored to use responsive theme-aware class names. The approach follows these principles:

1. **Default Light Mode Styling**: Base classes define Light Mode appearance
2. **Dark Mode Overrides**: `dark:` prefixed classes override for Dark Mode
3. **Conditional Rendering**: No conditional rendering logic needed - pure CSS approach
4. **Theme Toggle Component**: Minor updates to ensure proper text colors in dropdown

### Component Structure

```
Landing.tsx
├── Background Layer (theme-aware gradients)
├── Navbar (theme-aware colors)
├── Hero Section
│   ├── Value Proposition (theme-aware text)
│   ├── Feature Pills (theme-aware backgrounds)
│   └── Login Card (theme-aware glassmorphism/solid)
├── Pricing Section
│   └── Plan Cards (theme-aware glassmorphism/solid)
└── Footer (theme-aware colors)
```

## Components and Interfaces

### Landing Page Component

The Landing Page component will maintain its current structure but with updated className strings that include both light and dark mode variants.

**Key Changes:**
- Root container: Add light mode background classes
- Text elements: Add light mode text color classes
- Cards: Add conditional styling for glassmorphism (dark) vs solid (light)
- Buttons: Ensure proper contrast in both modes
- Feature pills: Add light mode background variants

### Theme Toggle Component

The Theme Toggle dropdown menu will be updated to remove any yellow/amber text colors and use blue for active states.

**Key Changes:**
- Dropdown menu items: Explicit text color classes
- Active state: Use blue instead of yellow/amber
- Hover state: Consistent with theme

## Data Models

No data model changes required. This is purely a presentational update.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Heading text color consistency in light mode
*For any* heading element (H1 or H2) on the Landing Page in Light Mode, the element should have the `text-slate-900` class
**Validates: Requirements 2.1, 2.2**

### Property 2: Paragraph text color consistency in light mode
*For any* paragraph element on the Landing Page in Light Mode, the element should have the `text-slate-600` class
**Validates: Requirements 2.3**

### Property 3: Dark mode text preservation
*For any* text element on the Landing Page in Dark Mode, the element should have light-colored text classes (text-white, text-slate-300, text-slate-400, etc.)
**Validates: Requirements 2.5**

### Property 4: Pricing card styling in light mode
*For any* pricing card on the Landing Page in Light Mode, the card should have `bg-white`, `border-gray-200`, and `shadow-xl` classes
**Validates: Requirements 3.2**

### Property 5: Card glassmorphism preservation in dark mode
*For any* card component (login or pricing) on the Landing Page in Dark Mode, the card should have glassmorphism-related classes (`bg-white/5`, `backdrop-blur`, `border-white/10`)
**Validates: Requirements 3.3**

### Property 6: Login card input styling in light mode
*For any* input field within the login card in Light Mode, the input should have white background and dark text classes
**Validates: Requirements 3.4**

### Property 7: Login card label styling in light mode
*For any* label element within the login card in Light Mode, the label should have the `text-slate-700` class
**Validates: Requirements 3.5**

### Property 8: Plan button styling in light mode
*For any* "Assinar Agora" button on the Landing Page in Light Mode, the button should have gradient classes matching its plan's color scheme
**Validates: Requirements 4.3**

### Property 9: Button styling preservation in dark mode
*For any* button on the Landing Page in Dark Mode, the button should maintain its current dark mode styling classes
**Validates: Requirements 4.4**

### Property 10: Theme dropdown menu text in light mode
*For any* menu item in the Theme Toggle dropdown in Light Mode, the item should have the `text-slate-700` class
**Validates: Requirements 5.1**

### Property 11: Theme dropdown menu text in dark mode
*For any* menu item in the Theme Toggle dropdown in Dark Mode, the item should have the `text-slate-200` class
**Validates: Requirements 5.2**

### Property 12: No yellow or amber in theme dropdown
*For any* element in the Theme Toggle dropdown, the element should not have any yellow or amber color classes (`text-yellow-*`, `text-amber-*`, `bg-yellow-*`, `bg-amber-*`)
**Validates: Requirements 5.5**

### Property 13: Feature pill styling in light mode
*For any* feature pill element on the Landing Page in Light Mode, the pill should have `bg-gray-100` background class
**Validates: Requirements 7.1**

### Property 14: Feature pill text in light mode
*For any* text element within a feature pill in Light Mode, the text should have the `text-slate-700` class
**Validates: Requirements 7.2**

### Property 15: Badge styling in light mode
*For any* badge element on the Landing Page in Light Mode, the badge should have light background classes and dark text classes
**Validates: Requirements 7.4**

### Property 16: Feature pill glassmorphism preservation in dark mode
*For any* feature pill on the Landing Page in Dark Mode, the pill should maintain glassmorphism styling classes
**Validates: Requirements 7.5**

### Property 17: Theme transition timing
*For any* theme change from light to dark or dark to light, all color transitions should complete within 300ms
**Validates: Requirements 1.3**

## Error Handling

No specific error handling required for this styling update. The Tailwind CSS classes will gracefully fall back to default styles if any class is invalid.

## Testing Strategy

### Unit Testing

Unit tests will verify:
1. **Class name presence**: Test that components have both light and dark mode classes
2. **Theme toggle rendering**: Test that dropdown menu items render with correct text colors
3. **Conditional class application**: Test that the correct classes are applied based on theme state

Example test cases:
- Verify Landing Page root element has `bg-gray-50` class
- Verify Landing Page root element has `dark:bg-slate-900` class
- Verify login card has `bg-white` class for light mode
- Verify login card has `dark:bg-white/5` class for dark mode
- Verify Theme Toggle dropdown items do not contain `text-yellow` or `text-amber`

### Property-Based Testing

Property-based tests will verify:
1. **Contrast ratios**: Generate random text/background combinations and verify WCAG compliance
2. **Theme consistency**: For any theme state, verify all elements follow the theme's color scheme

### Visual Regression Testing

Manual visual testing will verify:
1. Landing Page appearance in Light Mode matches reference design
2. Landing Page appearance in Dark Mode remains unchanged
3. Theme transitions are smooth
4. All text is readable in both modes
5. Cards have appropriate styling in both modes

### Testing Framework

- **Unit Tests**: Vitest + React Testing Library
- **Property-Based Tests**: fast-check (JavaScript property-based testing library)
- **Visual Tests**: Manual review with browser DevTools

### Property-Based Testing Configuration

- Each property test will run a minimum of 100 iterations
- Tests will use fast-check's arbitrary generators for theme states and color values
- Each test will be tagged with the format: **Feature: landing-light-mode-fix, Property {number}: {property_text}**
