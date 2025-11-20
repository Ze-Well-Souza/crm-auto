# Requirements Document

## Introduction

This feature enhances the Landing Page visual design by replacing standard gray shadows with colored glows (colored shadows) to match the modern, vibrant aesthetic already implemented in the Partners Module. The colored glows create visual hierarchy, improve brand consistency, and make the interface more engaging and premium-feeling.

## Glossary

- **Landing Page**: The public-facing page (`src/pages/Landing.tsx`) where users can view pricing plans and log in to the system
- **Colored Glow**: A shadow effect using color and opacity (e.g., `shadow-xl shadow-blue-500/20`) instead of standard gray shadows
- **Login Card**: The authentication card on the right side of the hero section where users enter credentials
- **Pricing Cards**: The four plan cards (Gratuito, Básico, Profissional, Enterprise) displayed in the pricing section
- **Light Mode**: The light theme variant of the application
- **Dark Mode**: The dark theme variant of the application
- **Partners Module**: The internal reference implementation (`src/components/partners/PartnerCard.tsx`) that already uses colored glows

## Requirements

### Requirement 1

**User Story:** As a potential customer viewing the Landing Page in Light Mode, I want to see visually appealing colored glows on cards, so that the interface feels modern and premium.

#### Acceptance Criteria

1. WHEN the Landing Page renders in Light Mode, THEN the Login Card SHALL display a soft blue/indigo glow shadow instead of a gray shadow
2. WHEN the Landing Page renders in Light Mode, THEN the Gratuito pricing card SHALL display a soft emerald green glow shadow
3. WHEN the Landing Page renders in Light Mode, THEN the Básico pricing card SHALL display a soft blue glow shadow
4. WHEN the Landing Page renders in Light Mode, THEN the Profissional pricing card SHALL display a soft purple glow shadow
5. WHEN the Landing Page renders in Light Mode, THEN the Enterprise pricing card SHALL display a soft orange glow shadow

### Requirement 2

**User Story:** As a potential customer viewing the Landing Page in Dark Mode, I want colored glows to remain visible and appropriate for the dark theme, so that the visual enhancement works across both themes.

#### Acceptance Criteria

1. WHEN the Landing Page renders in Dark Mode, THEN the Login Card SHALL display a blue/indigo glow shadow with appropriate opacity for dark backgrounds
2. WHEN the Landing Page renders in Dark Mode, THEN the Gratuito pricing card SHALL display an emerald green glow shadow with darker tone (emerald-900/20)
3. WHEN the Landing Page renders in Dark Mode, THEN the Básico pricing card SHALL display a blue glow shadow appropriate for dark backgrounds
4. WHEN the Landing Page renders in Dark Mode, THEN the Profissional pricing card SHALL display a purple glow shadow appropriate for dark backgrounds
5. WHEN the Landing Page renders in Dark Mode, THEN the Enterprise pricing card SHALL display an orange glow shadow appropriate for dark backgrounds

### Requirement 3

**User Story:** As a user interacting with pricing cards, I want hover effects to enhance the colored glows, so that the interface feels responsive and interactive.

#### Acceptance Criteria

1. WHEN a user hovers over any pricing card, THEN the card SHALL translate upward by 1 unit (-translate-y-1)
2. WHEN a user hovers over the Gratuito card, THEN the emerald glow intensity SHALL increase from /20 to /30 opacity
3. WHEN a user hovers over the Básico card, THEN the blue glow intensity SHALL increase from /20 to /30 opacity
4. WHEN a user hovers over the Profissional card, THEN the purple glow intensity SHALL increase from /20 to /30 opacity
5. WHEN a user hovers over the Enterprise card, THEN the orange glow intensity SHALL increase from /20 to /30 opacity

### Requirement 4

**User Story:** As a developer, I want the colored glow implementation to use Tailwind CSS utility classes, so that the solution is maintainable and consistent with the existing codebase.

#### Acceptance Criteria

1. WHEN implementing colored glows, THE system SHALL use Tailwind's `shadow-{color}-{shade}/{opacity}` utility classes
2. WHEN implementing colored glows, THE system SHALL NOT use custom CSS or inline styles
3. WHEN implementing hover effects, THE system SHALL use Tailwind's `hover:` prefix for state variants
4. WHEN implementing theme-specific glows, THE system SHALL use Tailwind's `dark:` prefix for dark mode variants
5. WHEN implementing transitions, THE system SHALL use existing transition utility classes (e.g., `transition-all duration-300`)
