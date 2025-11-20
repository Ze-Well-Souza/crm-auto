# Implementation Plan

- [x] 1. Update Login Card with colored glow


  - Modify the Login Card component in Landing.tsx to replace gray shadow with blue/indigo colored glow
  - Add light mode shadow: `shadow-2xl shadow-indigo-500/20`
  - Add dark mode shadow: `dark:shadow-indigo-400/20`
  - Remove or replace existing `shadow-xl` class
  - _Requirements: 1.1, 2.1_

- [x] 1.1 Write unit test for Login Card glow


  - **Property 1: Login Card has colored glow**
  - **Validates: Requirements 1.1, 2.1**

- [x] 2. Update Pricing Cards with plan-specific colored glows


  - Modify the pricing cards map function in Landing.tsx to add conditional colored shadows
  - Implement shadow class logic based on `plan.id` (gratuito → emerald, basico → blue, profissional → purple, enterprise → orange)
  - Add light mode shadows for all four plans
  - Add dark mode shadows for all four plans (note: Gratuito uses emerald-900/20 in dark mode)
  - Maintain existing `shadow-xl` as base and add color-specific shadows
  - _Requirements: 1.2, 1.3, 1.4, 1.5, 2.2, 2.3, 2.4, 2.5_

- [x] 2.1 Write property test for pricing card colored glows


  - **Property 1: All pricing cards have theme-appropriate colored glows**
  - **Validates: Requirements 1.2, 1.3, 1.4, 1.5, 2.2, 2.3, 2.4, 2.5**

- [x] 3. Add hover effects to pricing cards


  - Add hover shadow intensity increase for each plan (from /20 to /30 opacity)
  - Update hover translation from `hover:-translate-y-2` to `hover:-translate-y-1` for subtler effect
  - Ensure `transition-all duration-300` is maintained for smooth animations
  - Apply hover effects conditionally based on `plan.id`
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3.1 Write property test for hover effects


  - **Property 2: All pricing cards have hover glow intensification**
  - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

- [x] 4. Verify Tailwind-only implementation


  - Review all changes to ensure only Tailwind utility classes are used
  - Confirm no inline styles (style attribute) are present
  - Confirm no custom CSS classes are added
  - Verify proper use of `hover:` prefix for interactive states
  - Verify proper use of `dark:` prefix for theme variants
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 4.1 Write property test for Tailwind-only implementation


  - **Property 3: Tailwind-only implementation**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

- [x] 5. Checkpoint - Ensure all tests pass



  - Ensure all tests pass, ask the user if questions arise.
