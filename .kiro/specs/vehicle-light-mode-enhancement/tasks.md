# Implementation Plan

- [x] 1. Update VehicleCard border and container styles for light mode


  - Modify Card component border classes from `border-slate-200` to `border-slate-300`
  - Update all section container borders to use `border-slate-300` in light mode
  - Add enhanced hover effects: `hover:shadow-lg hover:ring-1 hover:ring-blue-200`
  - Preserve all dark mode border styles with `dark:` prefix
  - _Requirements: 1.1, 5.3_

- [x] 2. Enhance text contrast and hierarchy in light mode


  - Update CardTitle to use `text-slate-900 font-semibold` for vehicle brand/model
  - Update all field labels (e.g., "Quilometragem", "Total gasto") to use `text-slate-600 font-medium`
  - Update all field values to use `text-slate-800`
  - Update CardDescription to use `text-slate-700` for better visibility
  - Preserve all dark mode text styles
  - _Requirements: 2.1, 2.2, 2.3, 5.1_

- [x] 3. Improve badge styling with saturated colors and borders


  - Update "Em Dia" status badge to use `bg-green-100 text-green-800 border-green-200`
  - Update "Atenção" status badge to use `bg-orange-100 text-orange-800 border-orange-200`
  - Update "Atrasada" status badge to use `bg-red-100 text-red-800 border-red-200`
  - Update license plate badge to use `bg-blue-100 text-blue-800 border-blue-200`
  - Ensure all badges include explicit `border` class
  - Preserve all dark mode badge styles
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 5.2_

- [x] 4. Update owner information and specification sections


  - Update owner info container to use `bg-slate-100 border-slate-300` in light mode
  - Update icon colors to use `text-slate-700` in light mode
  - Update specification text to use `text-slate-800` in light mode
  - Preserve dark mode styles for all sections
  - _Requirements: 5.1, 5.3_

- [x] 5. Enhance metrics and service information sections


  - Update metric labels to use `text-slate-600` in light mode
  - Update metric values to use `text-slate-900 font-semibold` in light mode
  - Update section dividers to use `border-slate-200` in light mode
  - Update maintenance alert backgrounds and borders with saturated colors
  - Preserve dark mode styles
  - _Requirements: 2.1, 2.2, 5.1_

- [x] 6. Write unit tests for light mode styling


  - Create test file `VehicleCard.lightmode.test.tsx`
  - Test that Card container has `border-slate-300` in light mode
  - Test that titles have `text-slate-900 font-semibold` in light mode
  - Test that labels have `text-slate-600 font-medium` in light mode
  - Test that values have `text-slate-800` in light mode
  - Test badge color classes for each status type
  - Test hover state classes are applied correctly
  - _Requirements: 1.1, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2_

- [x] 6.1 Write property test for border contrast


  - **Property 1: Border contrast in light mode**
  - **Validates: Requirements 1.1, 5.3**
  - Generate random vehicle data
  - Render VehicleCard in light mode
  - Verify all border elements use slate-300 or darker
  - Run 100 iterations

- [x] 6.2 Write property test for text hierarchy

  - **Property 2: Text hierarchy and contrast**
  - **Validates: Requirements 2.1, 2.2, 2.3, 5.1**
  - Generate random vehicle data with various field combinations
  - Render VehicleCard in light mode
  - Verify titles use slate-900 + semibold
  - Verify labels use slate-600 + medium
  - Verify values use slate-800
  - Run 100 iterations

- [x] 6.3 Write property test for badge styling

  - **Property 3: Badge saturation and borders**
  - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 5.2**
  - Generate vehicles with different maintenance statuses
  - Render VehicleCard in light mode
  - Verify each badge has saturated bg (100-level), dark text (800-level), and border (200-level)
  - Run 100 iterations

- [x] 6.4 Write property test for hover states

  - **Property 4: Hover state enhancement**
  - **Validates: Requirements 4.1, 4.2, 4.3**
  - Generate random vehicle data
  - Render VehicleCard in light mode
  - Simulate hover and verify shadow-lg and ring classes
  - Simulate unhover and verify default state
  - Run 100 iterations

- [x] 6.5 Write property test for dark mode preservation

  - **Property 5: Dark mode preservation**
  - **Validates: Requirements 1.3, 2.4, 3.5, 4.4**
  - Generate random vehicle data
  - Render VehicleCard in dark mode
  - Verify all styles match original implementation
  - Compare against baseline snapshot
  - Run 100 iterations

- [x] 6.6 Write property test for theme switching

  - **Property 6: Theme switching stability**
  - **Validates: Requirements 5.4**
  - Generate random vehicle data
  - Render VehicleCard and toggle between themes
  - Verify correct styles apply immediately without glitches
  - Run 100 iterations

- [x] 7. Manual visual verification


  - Test VehicleCard appearance in light mode with various vehicle data
  - Verify hover effects work smoothly
  - Test theme switching between light and dark modes
  - Verify on different screen sizes
  - Check accessibility with browser dev tools
  - _Requirements: All_

- [x] 8. Checkpoint - Ensure all tests pass



  - Ensure all tests pass, ask the user if questions arise.
