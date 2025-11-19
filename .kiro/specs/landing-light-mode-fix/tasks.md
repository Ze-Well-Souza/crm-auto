# Implementation Plan

- [x] 1. Update Landing Page root container and background


  - Add `bg-gray-50` for light mode base background
  - Keep `dark:bg-slate-900` for dark mode
  - Ensure gradient overlays have dark mode variants
  - _Requirements: 1.1, 1.2_


- [ ] 2. Update Landing Page typography for light mode
  - Add `text-slate-900` to all H1 headings with `dark:text-white` override
  - Add `text-slate-900` to all H2 headings with `dark:text-white` override
  - Add `text-slate-600` to all paragraph text with `dark:text-slate-300` override
  - Update badge text colors for light mode readability
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 2.1 Write property test for heading text colors
  - **Property 1: Heading text color consistency in light mode**
  - **Validates: Requirements 2.1, 2.2**

- [ ] 2.2 Write property test for paragraph text colors
  - **Property 2: Paragraph text color consistency in light mode**
  - **Validates: Requirements 2.3**

- [ ] 2.3 Write property test for dark mode text preservation
  - **Property 3: Dark mode text preservation**
  - **Validates: Requirements 2.5**

- [ ] 3. Update login card styling for light mode
  - Add `bg-white border border-gray-200 shadow-xl` for light mode
  - Keep `dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10` for dark mode
  - Update input field classes: `bg-white text-slate-900` with dark mode overrides
  - Update label classes: `text-slate-700` with `dark:text-slate-300` override
  - _Requirements: 3.1, 3.4, 3.5_

- [ ] 3.1 Write property test for login card input styling
  - **Property 6: Login card input styling in light mode**
  - **Validates: Requirements 3.4**

- [ ] 3.2 Write property test for login card label styling
  - **Property 7: Login card label styling in light mode**

  - **Validates: Requirements 3.5**

- [ ] 4. Update pricing cards styling for light mode
  - Add `bg-white border border-gray-200 shadow-xl` for light mode
  - Keep `dark:bg-white/5 dark:backdrop-blur-xl dark:border-white/10` for dark mode
  - Ensure neon glow effects only apply in dark mode
  - _Requirements: 3.2, 3.3_

- [ ] 4.1 Write property test for pricing card styling
  - **Property 4: Pricing card styling in light mode**
  - **Validates: Requirements 3.2**

- [ ] 4.2 Write property test for card glassmorphism preservation
  - **Property 5: Card glassmorphism preservation in dark mode**
  - **Validates: Requirements 3.3**

- [ ] 5. Update button styling for light mode
  - Ensure primary login button has proper gradient in both modes
  - Update plan buttons to have solid backgrounds in light mode
  - Verify all buttons have proper contrast in light mode
  - _Requirements: 4.1, 4.3, 4.4_

- [ ] 5.1 Write property test for plan button styling
  - **Property 8: Plan button styling in light mode**
  - **Validates: Requirements 4.3**

- [-] 5.2 Write property test for button dark mode preservation

  - **Property 9: Button styling preservation in dark mode**
  - **Validates: Requirements 4.4**

- [ ] 6. Fix Theme Toggle dropdown menu colors
  - Update DropdownMenuItem to use `text-slate-700 dark:text-slate-200`
  - Remove any yellow/amber color classes
  - Add `data-[state=checked]:text-blue-600 dark:data-[state=checked]:text-blue-400` for active state
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 6.1 Write property test for dropdown text colors
  - **Property 10: Theme dropdown menu text in light mode**
  - **Property 11: Theme dropdown menu text in dark mode**
  - **Validates: Requirements 5.1, 5.2**


- [ ] 6.2 Write property test for no yellow/amber colors
  - **Property 12: No yellow or amber in theme dropdown**
  - **Validates: Requirements 5.5**

- [ ] 7. Update navbar styling for light mode
  - Add `bg-white border-b border-gray-200` for light mode
  - Keep `dark:bg-slate-900/50 dark:border-white/10` for dark mode
  - Update logo icon: `text-blue-600 dark:text-blue-400`
  - Update navbar text: `text-slate-900 dark:text-white`
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 8. Update feature pills and badges for light mode
  - Add `bg-gray-100` to feature pills with `dark:bg-white/5` override
  - Update feature pill text: `text-slate-700 dark:text-slate-300`
  - Update feature pill icons with appropriate color variants
  - Update badge backgrounds to light variants with dark text in light mode
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 8.1 Write property test for feature pill styling
  - **Property 13: Feature pill styling in light mode**
  - **Property 14: Feature pill text in light mode**
  - **Validates: Requirements 7.1, 7.2**

- [ ] 8.2 Write property test for badge styling
  - **Property 15: Badge styling in light mode**
  - **Validates: Requirements 7.4**



- [ ] 8.3 Write property test for feature pill dark mode preservation
  - **Property 16: Feature pill glassmorphism preservation in dark mode**
  - **Validates: Requirements 7.5**

- [ ] 9. Update footer styling for light mode
  - Add `bg-white border-t border-gray-200` for light mode
  - Keep `dark:bg-slate-900/50 dark:border-white/10` for dark mode
  - Update footer text: `text-slate-600 dark:text-slate-400`
  - Update footer logo icon: `text-blue-600 dark:text-blue-400`
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 10. Checkpoint - Verify all styling changes
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10.1 Write property test for theme transition timing
  - **Property 17: Theme transition timing**
  - **Validates: Requirements 1.3**

- [ ] 11. Final visual verification
  - Manually test light mode appearance against reference design
  - Manually test dark mode to ensure no regressions
  - Test theme switching for smooth transitions
  - Verify all text is readable in both modes
  - _Requirements: All_
