# Design Document

## Overview

This design implements colored shadow glows on the Landing Page to create a modern, premium visual aesthetic that matches the Partners Module. The implementation uses Tailwind CSS utility classes to apply color-specific shadows with appropriate opacity levels for both light and dark themes, along with enhanced hover interactions.

## Architecture

The solution is purely presentational and requires no architectural changes. It involves:

1. **CSS Class Updates**: Modifying existing Tailwind utility classes on Card components
2. **Theme-Aware Styling**: Using Tailwind's `dark:` prefix for dark mode variants
3. **Interactive States**: Applying `hover:` prefixes for enhanced user feedback

No new components, hooks, or state management is required.

## Components and Interfaces

### Affected Components

**1. Landing.tsx - Login Card**
- Location: Hero section, right column
- Current: `shadow-xl` (gray shadow)
- Update: Add colored glow matching the blue/purple gradient of the login button

**2. Landing.tsx - Pricing Cards**
- Location: Pricing section grid
- Current: `shadow-xl` (gray shadow)
- Update: Add plan-specific colored glows based on plan theme colors

### Component Structure

```typescript
// No interface changes required
// Only className prop modifications on existing Card components
```

## Data Models

No data model changes required. The `plans` array in Landing.tsx already contains the necessary color information in the `gradient` property:

```typescript
{
  id: 'gratuito',
  gradient: 'from-green-500 to-emerald-600',  // → emerald glow
  // ...
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Acceptance Criteria Testing Prework

**1.1** WHEN the Landing Page renders in Light Mode, THEN the Login Card SHALL display a soft blue/indigo glow shadow instead of a gray shadow
- Thoughts: This is testing that a specific UI element has the correct CSS classes applied. We can render the component and check that the Login Card element contains the expected shadow classes.
- Testable: yes - example

**1.2** WHEN the Landing Page renders in Light Mode, THEN the Gratuito pricing card SHALL display a soft emerald green glow shadow
- Thoughts: This is testing that a specific card has the correct shadow class. We can render and verify the class is present.
- Testable: yes - example

**1.3** WHEN the Landing Page renders in Light Mode, THEN the Básico pricing card SHALL display a soft blue glow shadow
- Thoughts: Similar to 1.2, checking for specific CSS class on a specific card.
- Testable: yes - example

**1.4** WHEN the Landing Page renders in Light Mode, THEN the Profissional pricing card SHALL display a soft purple glow shadow
- Thoughts: Similar to 1.2, checking for specific CSS class on a specific card.
- Testable: yes - example

**1.5** WHEN the Landing Page renders in Light Mode, THEN the Enterprise pricing card SHALL display a soft orange glow shadow
- Thoughts: Similar to 1.2, checking for specific CSS class on a specific card.
- Testable: yes - example

**2.1** WHEN the Landing Page renders in Dark Mode, THEN the Login Card SHALL display a blue/indigo glow shadow with appropriate opacity for dark backgrounds
- Thoughts: This tests that dark mode classes are present. We can render in dark mode and verify the dark: prefixed classes.
- Testable: yes - example

**2.2** WHEN the Landing Page renders in Dark Mode, THEN the Gratuito pricing card SHALL display an emerald green glow shadow with darker tone (emerald-900/20)
- Thoughts: Testing dark mode specific classes on a specific card.
- Testable: yes - example

**2.3-2.5** Similar dark mode tests for other pricing cards
- Thoughts: Same pattern as 2.2
- Testable: yes - example

**3.1** WHEN a user hovers over any pricing card, THEN the card SHALL translate upward by 1 unit (-translate-y-1)
- Thoughts: This is testing hover behavior across all pricing cards. We can test that all cards have the hover:translate class.
- Testable: yes - property

**3.2** WHEN a user hovers over the Gratuito card, THEN the emerald glow intensity SHALL increase from /20 to /30 opacity
- Thoughts: Testing specific hover class on specific card.
- Testable: yes - example

**3.3-3.5** Similar hover intensity tests for other cards
- Thoughts: Same pattern as 3.2
- Testable: yes - example

**4.1** WHEN implementing colored glows, THE system SHALL use Tailwind's shadow-{color}-{shade}/{opacity} utility classes
- Thoughts: This is about code quality and implementation approach. We can verify no custom CSS is used.
- Testable: yes - property

**4.2** WHEN implementing colored glows, THE system SHALL NOT use custom CSS or inline styles
- Thoughts: This is verifying the absence of style attributes or custom CSS. We can check the rendered output.
- Testable: yes - property

**4.3** WHEN implementing hover effects, THE system SHALL use Tailwind's hover: prefix for state variants
- Thoughts: Verifying implementation approach - checking for hover: prefix in classes.
- Testable: yes - property

**4.4** WHEN implementing theme-specific glows, THE system SHALL use Tailwind's dark: prefix for dark mode variants
- Thoughts: Verifying dark: prefix is used for theme variants.
- Testable: yes - property

**4.5** WHEN implementing transitions, THE system SHALL use existing transition utility classes
- Thoughts: Checking that transition classes are present and not custom.
- Testable: yes - property

### Property Reflection

After reviewing the prework, several observations:
- Requirements 1.2-1.5 and 2.2-2.5 and 3.2-3.5 are all the same pattern (checking specific cards for specific classes)
- These can be consolidated into properties that check *all* pricing cards have appropriate colored glows
- Requirements 4.1-4.5 are all about implementation constraints and can be combined into a single property about Tailwind usage

**Consolidated Properties:**

**Property 1: All pricing cards have theme-appropriate colored glows**
*For any* pricing card rendered on the Landing Page, the card should have a colored shadow class that matches its plan theme color (emerald for Gratuito, blue for Básico, purple for Profissional, orange for Enterprise) in both light and dark modes.
**Validates: Requirements 1.2, 1.3, 1.4, 1.5, 2.2, 2.3, 2.4, 2.5**

**Property 2: All pricing cards have hover glow intensification**
*For any* pricing card, hovering should increase the shadow opacity and translate the card upward.
**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

**Property 3: Tailwind-only implementation**
*For all* modified card elements, the implementation should use only Tailwind utility classes (shadow-*, hover:*, dark:*, transition-*) without custom CSS or inline styles.
**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

## Error Handling

No error handling required as this is a purely visual/CSS change with no runtime logic or data processing.

## Testing Strategy

### Unit Testing

Since this is a visual styling change, traditional unit tests will verify that:
1. The Login Card renders with the correct shadow classes
2. Each pricing card renders with its theme-specific shadow classes
3. Hover classes are present on interactive elements
4. Dark mode classes are properly applied

**Test Framework**: Vitest + React Testing Library

**Example Test Structure**:
```typescript
describe('Landing Page Colored Glows', () => {
  it('should render login card with blue/indigo glow', () => {
    render(<Landing />);
    const loginCard = screen.getByRole('form').closest('.shadow-indigo-500\\/20');
    expect(loginCard).toBeInTheDocument();
  });

  it('should render Gratuito card with emerald glow', () => {
    render(<Landing />);
    const gratuitoCard = screen.getByText('Gratuito').closest('.shadow-emerald-500\\/20');
    expect(gratuitoCard).toBeInTheDocument();
  });
});
```

### Property-Based Testing

Property-based testing will verify universal behaviors:

**Property Test Framework**: fast-check (JavaScript/TypeScript PBT library)

**Property 1: All pricing cards have colored glows**
- Generate: All plan IDs from the plans array
- Test: Each card has a non-gray shadow class matching its theme
- Validates: Requirements 1.2-1.5, 2.2-2.5

**Property 2: All pricing cards have hover effects**
- Generate: All plan IDs from the plans array
- Test: Each card has hover:shadow and hover:-translate-y classes
- Validates: Requirements 3.1-3.5

**Property 3: No custom CSS used**
- Generate: All Card components in Landing.tsx
- Test: No inline styles or custom CSS classes, only Tailwind utilities
- Validates: Requirements 4.1-4.5

### Visual Regression Testing (Optional)

For comprehensive visual validation:
- Use Playwright or Chromatic for screenshot comparison
- Capture before/after states in both light and dark modes
- Verify hover states visually

## Implementation Details

### Shadow Class Mapping

| Card | Light Mode Shadow | Dark Mode Shadow | Hover Enhancement |
|------|------------------|------------------|-------------------|
| Login Card | `shadow-2xl shadow-indigo-500/20` | `dark:shadow-indigo-400/20` | N/A (not interactive) |
| Gratuito | `shadow-xl shadow-emerald-500/20` | `dark:shadow-emerald-900/20` | `hover:shadow-emerald-500/30` |
| Básico | `shadow-xl shadow-blue-500/20` | `dark:shadow-blue-500/20` | `hover:shadow-blue-500/30` |
| Profissional | `shadow-xl shadow-purple-500/20` | `dark:shadow-purple-500/20` | `hover:shadow-purple-500/30` |
| Enterprise | `shadow-xl shadow-orange-500/20` | `dark:shadow-orange-500/20` | `hover:shadow-orange-500/30` |

### Transition Configuration

All cards should maintain existing transition classes:
```
transition-all duration-300
```

This ensures smooth animation of both the shadow intensity change and the upward translation on hover.

### Implementation Approach

1. **Login Card**: Replace `shadow-xl` with `shadow-2xl shadow-indigo-500/20 dark:shadow-indigo-400/20`

2. **Pricing Cards**: Add conditional shadow classes based on `plan.id`:
   ```typescript
   className={`... shadow-xl ${
     plan.id === 'gratuito' ? 'shadow-emerald-500/20 dark:shadow-emerald-900/20 hover:shadow-emerald-500/30' :
     plan.id === 'basico' ? 'shadow-blue-500/20 dark:shadow-blue-500/20 hover:shadow-blue-500/30' :
     plan.id === 'profissional' ? 'shadow-purple-500/20 dark:shadow-purple-500/20 hover:shadow-purple-500/30' :
     'shadow-orange-500/20 dark:shadow-orange-500/20 hover:shadow-orange-500/30'
   }`}
   ```

3. **Hover Translation**: Update existing hover class from `hover:-translate-y-2` to `hover:-translate-y-1` for subtler effect

### Browser Compatibility

Tailwind's shadow utilities are supported in all modern browsers. No polyfills or fallbacks required.

## Performance Considerations

- CSS-only changes have zero runtime performance impact
- Shadow rendering is GPU-accelerated in modern browsers
- No JavaScript execution or re-renders triggered by this change
