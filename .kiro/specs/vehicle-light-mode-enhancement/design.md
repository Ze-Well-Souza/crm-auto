# Design Document

## Overview

This design document outlines the approach to enhance the visual contrast and readability of the VehicleCard component in light mode. The current implementation uses low-contrast colors (slate-200 borders, light gray text) that make the interface appear "washed out" and difficult to read. This enhancement will apply targeted CSS improvements to borders, text, badges, and hover states specifically for light mode, while preserving the existing dark mode styles.

The solution focuses on:
- Increasing border visibility from slate-200 to slate-300
- Strengthening text contrast with darker slate tones and appropriate font weights
- Using saturated badge colors with visible borders
- Enhancing hover effects with stronger shadows and ring indicators

## Architecture

The enhancement will be implemented as CSS class modifications within the existing VehicleCard component structure. No architectural changes are required since this is purely a visual/styling improvement.

### Component Structure
```
VehicleCard (main component)
├── Card (shadcn/ui wrapper)
│   ├── CardHeader
│   │   ├── Avatar (vehicle icon)
│   │   ├── CardTitle (brand/model + status badge)
│   │   └── CardDescription (year + license plate badge)
│   └── CardContent
│       ├── Owner Information Section
│       ├── Vehicle Specifications Grid
│       ├── Mileage and Value Grid
│       ├── Service Metrics Grid
│       ├── Maintenance Alert (conditional)
│       ├── Next Maintenance (conditional)
│       ├── Quick Actions
│       └── Last Service Info
```

## Components and Interfaces

### VehicleCard Component
The VehicleCard component will be modified to apply light mode specific styles using Tailwind's conditional class syntax:
- Light mode classes: Applied directly or with explicit conditions
- Dark mode classes: Prefixed with `dark:` to preserve existing behavior

### Affected UI Elements

1. **Card Container**
   - Border colors
   - Shadow effects
   - Hover states

2. **Text Elements**
   - Titles (CardTitle)
   - Labels (field names)
   - Values (field data)
   - Descriptions

3. **Badge Components**
   - Status badges (Em Dia, Atenção, Atrasada)
   - License plate badge
   - Fuel type indicators

4. **Section Containers**
   - Owner information box
   - Maintenance alerts
   - Next maintenance info

## Data Models

No data model changes required. This is a pure styling enhancement.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Acceptance Criteria Testing Prework

1.1 WHEN the application is in light mode, THE VehicleCard SHALL display borders using `border-slate-300` instead of `border-slate-200`
  Thoughts: This is about ensuring specific CSS classes are applied in light mode. We can test this by rendering the component in light mode and checking that the computed styles or className includes border-slate-300 and not border-slate-200.
  Testable: yes - property

1.2 WHEN the application is in light mode, THE VehicleCard SHALL maintain a minimum contrast ratio of 3:1 between border and background
  Thoughts: This is about accessibility and visual contrast. We can calculate the contrast ratio between the border color (#cbd5e1 for slate-300) and background color (#ffffff for white) and verify it meets the 3:1 threshold.
  Testable: yes - example

1.3 WHEN the application is in dark mode, THE VehicleCard SHALL preserve existing border styles without changes
  Thoughts: This ensures we don't break dark mode. We can test by rendering in dark mode and verifying the border classes remain unchanged from the original implementation.
  Testable: yes - property

2.1 WHEN displaying vehicle titles in light mode, THE VehicleCard SHALL use `text-slate-900` with `font-semibold` weight
  Thoughts: This is testing that specific CSS classes are applied to title elements in light mode. We can render the component and check the className of title elements.
  Testable: yes - property

2.2 WHEN displaying field labels in light mode, THE VehicleCard SHALL use `text-slate-600` with `font-medium` weight
  Thoughts: Similar to 2.1, we can test that label elements have the correct CSS classes applied in light mode.
  Testable: yes - property

2.3 WHEN displaying field values in light mode, THE VehicleCard SHALL use `text-slate-800` color
  Thoughts: We can test that value elements have the text-slate-800 class in light mode.
  Testable: yes - property

2.4 WHEN the application is in dark mode, THE VehicleCard SHALL preserve existing text color styles
  Thoughts: This ensures dark mode text colors remain unchanged. We can compare rendered output in dark mode against the original implementation.
  Testable: yes - property

3.1 WHEN displaying "Em Dia" status badge in light mode, THE VehicleCard SHALL use `bg-green-100`, `text-green-800`, and `border-green-200`
  Thoughts: This tests specific CSS classes for a specific badge type. We can render a vehicle with "em_dia" status and verify the badge has these classes.
  Testable: yes - example

3.2 WHEN displaying "Atenção" status badge in light mode, THE VehicleCard SHALL use `bg-orange-100`, `text-orange-800`, and `border-orange-200`
  Thoughts: Similar to 3.1, testing specific badge styling for "atencao" status.
  Testable: yes - example

3.3 WHEN displaying "Atrasada" status badge in light mode, THE VehicleCard SHALL use `bg-red-100`, `text-red-800`, and `border-red-200`
  Thoughts: Testing specific badge styling for "atrasado" status.
  Testable: yes - example

3.4 WHEN displaying fuel type badge in light mode, THE VehicleCard SHALL use `bg-blue-100`, `text-blue-800`, and `border-blue-200`
  Thoughts: Testing the license plate badge styling which uses blue colors.
  Testable: yes - example

3.5 WHEN the application is in dark mode, THE VehicleCard SHALL preserve existing badge styles
  Thoughts: Ensuring dark mode badge styles remain unchanged.
  Testable: yes - property

4.1 WHEN hovering over a VehicleCard in light mode, THE card SHALL display `shadow-lg` shadow effect
  Thoughts: This tests hover state styling. We can simulate a hover event and check that shadow-lg is applied.
  Testable: yes - property

4.2 WHEN hovering over a VehicleCard in light mode, THE card SHALL display a `ring-1` with `ring-blue-200` color
  Thoughts: Testing that the ring effect is applied on hover in light mode.
  Testable: yes - property

4.3 WHEN not hovering, THE VehicleCard SHALL maintain its default shadow state
  Thoughts: Testing that hover effects are removed when not hovering.
  Testable: yes - property

4.4 WHEN the application is in dark mode, THE VehicleCard SHALL preserve existing hover effects
  Thoughts: Ensuring dark mode hover effects remain unchanged.
  Testable: yes - property

5.1 WHEN rendering any text element in light mode, THE VehicleCard SHALL apply appropriate contrast improvements based on element type
  Thoughts: This is a general rule about all text elements. We can generate random vehicle data and verify that all text elements have appropriate contrast classes based on their semantic role (title, label, value).
  Testable: yes - property

5.2 WHEN rendering any badge or status indicator in light mode, THE VehicleCard SHALL use saturated background colors with proper borders
  Thoughts: This is about all badges having visible borders and saturated colors. We can test that all badge elements include border classes in light mode.
  Testable: yes - property

5.3 WHEN rendering any container or section in light mode, THE VehicleCard SHALL use improved border colors for better definition
  Thoughts: Testing that all container elements use slate-300 or darker for borders in light mode.
  Testable: yes - property

5.4 WHEN the user switches between light and dark modes, THE VehicleCard SHALL apply the correct styles for each mode without visual glitches
  Thoughts: This is about theme switching behavior. We can test by toggling between themes and verifying styles update correctly.
  Testable: yes - property

### Property Reflection

After reviewing all properties, I've identified the following consolidations:

**Redundancies to address:**
- Properties 1.1, 1.3, 2.4, 3.5, 4.4 all test "dark mode preservation" - these can be consolidated into one comprehensive property
- Properties 2.1, 2.2, 2.3 all test text styling - can be consolidated with 5.1 into a comprehensive text contrast property
- Properties 4.1, 4.2, 4.3 test hover states - can be consolidated into one property about hover state transitions
- Properties 3.1, 3.2, 3.3, 3.4 test specific badge examples - these should remain as examples but don't need separate properties since 5.2 covers the general case

**Consolidated Properties:**

Property 1: Border contrast in light mode
*For any* VehicleCard rendered in light mode, all border elements should use slate-300 or darker colors instead of slate-200 or lighter
**Validates: Requirements 1.1, 5.3**

Property 2: Text hierarchy and contrast
*For any* text element in a VehicleCard in light mode, the element should have appropriate color and weight based on its semantic role: titles use slate-900 + semibold, labels use slate-600 + medium, values use slate-800
**Validates: Requirements 2.1, 2.2, 2.3, 5.1**

Property 3: Badge saturation and borders
*For any* badge element in a VehicleCard in light mode, the badge should have a saturated background color (100-level), dark text (800-level), and visible border (200-level) in the appropriate color family
**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 5.2**

Property 4: Hover state enhancement
*For any* VehicleCard in light mode, hovering should add shadow-lg and ring-1 ring-blue-200 effects, and removing hover should restore the default shadow state
**Validates: Requirements 4.1, 4.2, 4.3**

Property 5: Dark mode preservation
*For any* VehicleCard rendered in dark mode, all styling should match the original implementation without any changes to colors, borders, shadows, or hover effects
**Validates: Requirements 1.3, 2.4, 3.5, 4.4**

Property 6: Theme switching stability
*For any* VehicleCard, switching between light and dark modes should immediately apply the correct theme-specific styles without visual glitches or transition artifacts
**Validates: Requirements 5.4**

## Error Handling

No error handling changes required. This is a pure styling enhancement that doesn't affect component logic or data flow.

### Edge Cases
- **Missing vehicle data**: Existing null/undefined handling remains unchanged
- **Theme detection**: Relies on Tailwind's dark mode detection (class-based or media query)
- **Browser compatibility**: Tailwind CSS classes are widely supported; no special handling needed

## Testing Strategy

### Unit Testing Approach

Unit tests will verify that the correct CSS classes are applied based on theme and component state:

1. **Snapshot Testing**: Capture rendered output in both light and dark modes to detect unintended changes
2. **Class Verification**: Test that specific elements have expected Tailwind classes
3. **Theme Switching**: Verify correct class application when theme changes

**Test Framework**: Vitest + React Testing Library (already configured in project)

### Property-Based Testing Approach

Property-based tests will verify that styling rules hold across all possible vehicle data combinations:

1. **Text Contrast Property**: Generate random vehicle data and verify all text elements have appropriate contrast classes
2. **Badge Styling Property**: Generate vehicles with different statuses and verify badge styling consistency
3. **Border Consistency Property**: Verify all bordered elements use slate-300+ in light mode
4. **Dark Mode Preservation Property**: Verify dark mode classes remain unchanged

**PBT Framework**: @fast-check/vitest (JavaScript/TypeScript property-based testing library)
**Configuration**: Each property test will run a minimum of 100 iterations

### Test Tagging Convention

Each property-based test will include a comment tag in this format:
```typescript
// **Feature: vehicle-light-mode-enhancement, Property 1: Border contrast in light mode**
```

### Testing Implementation Notes

- Tests will use `data-testid` attributes to identify specific elements without relying on implementation details
- Theme switching will be tested by toggling the `dark` class on the root element
- Color contrast calculations will use WCAG contrast ratio formulas
- Hover states will be tested using `userEvent.hover()` from Testing Library

## Implementation Approach

### CSS Class Modifications

The implementation will follow this pattern for each element:

**Before (current):**
```tsx
className="border-slate-200 dark:border-white/10"
```

**After (enhanced):**
```tsx
className="border-slate-300 dark:border-white/10"
```

### Specific Changes Required

1. **Card Container**
   - Border: `border-slate-200` → `border-slate-300`
   - Hover: Add `hover:shadow-lg hover:ring-1 hover:ring-blue-200`

2. **Titles (CardTitle)**
   - Color: `text-slate-900` (ensure semibold is applied)

3. **Labels** (e.g., "Quilometragem", "Total gasto")
   - Color: `text-slate-600`
   - Weight: `font-medium`

4. **Values** (e.g., mileage numbers, currency amounts)
   - Color: `text-slate-800`

5. **Status Badges**
   - Em Dia: `bg-green-100 text-green-800 border-green-200`
   - Atenção: `bg-orange-100 text-orange-800 border-orange-200`
   - Atrasada: `bg-red-100 text-red-800 border-red-200`

6. **License Plate Badge**
   - Style: `bg-blue-100 text-blue-800 border-blue-200`

7. **Section Containers**
   - Borders: `border-slate-300` in light mode

### Conditional Styling Strategy

Use Tailwind's responsive and state variants:
- Light mode: Default classes (no prefix)
- Dark mode: `dark:` prefix (preserve existing)
- Hover: `hover:` prefix
- Combined: `hover:shadow-lg dark:hover:shadow-2xl`

## Performance Considerations

- **No performance impact**: CSS class changes don't affect rendering performance
- **Bundle size**: Negligible increase (Tailwind purges unused classes)
- **Runtime**: No JavaScript logic changes, purely declarative CSS

## Accessibility

The enhanced contrast improves accessibility:
- **WCAG AA compliance**: Slate-300 borders and slate-800+ text meet contrast requirements
- **Color blindness**: Saturated badge colors with borders provide multiple visual cues
- **Screen readers**: No changes to semantic HTML or ARIA attributes

## Migration and Rollout

- **No migration needed**: Changes are backward compatible
- **Rollout**: Can be deployed immediately as a visual enhancement
- **Rollback**: Simple git revert if issues arise
- **Testing**: Verify in both themes before deployment
