# Requirements Document

## Introduction

This specification addresses the Light Mode inconsistencies in the Landing Page of the Oficina Eficiente CRM system. Currently, the Landing Page has a perfect Dark Mode implementation with glassmorphism effects, but the Light Mode has readability issues including invisible text (white text on white backgrounds) and yellow/amber accent colors in the theme dropdown. The goal is to make the Light Mode match the clean SaaS aesthetic of the internal dashboard while preserving the existing Dark Mode design.

## Glossary

- **Landing Page**: The public-facing page at the root URL that displays marketing content, login form, and pricing plans
- **Light Mode**: The light color scheme activated when the `dark` class is removed from the HTML element
- **Dark Mode**: The dark color scheme activated when the `dark` class is present on the HTML element
- **Glassmorphism**: A design style using transparency, blur effects, and subtle borders to create a glass-like appearance
- **Theme Toggle**: The dropdown menu component that allows users to switch between Light, Dark, and System themes
- **Clean SaaS Aesthetic**: A modern design style characterized by clean backgrounds (gray-50), solid white cards with shadows, and dark readable text

## Requirements

### Requirement 1

**User Story:** As a user viewing the Landing Page in Light Mode, I want the background to be a clean light gray, so that the page has a professional SaaS appearance consistent with the internal dashboard.

#### Acceptance Criteria

1. WHEN the page is rendered in Light Mode THEN the system SHALL display the background as `bg-gray-50`
2. WHEN the page is rendered in Dark Mode THEN the system SHALL display the background as `bg-slate-900` with gradient overlays
3. WHEN switching between Light and Dark modes THEN the system SHALL transition smoothly between background colors

### Requirement 2

**User Story:** As a user viewing the Landing Page in Light Mode, I want all text to be dark and readable, so that I can easily read the content without straining my eyes.

#### Acceptance Criteria

1. WHEN the page is rendered in Light Mode THEN the system SHALL display all H1 headings as `text-slate-900`
2. WHEN the page is rendered in Light Mode THEN the system SHALL display all H2 headings as `text-slate-900`
3. WHEN the page is rendered in Light Mode THEN the system SHALL display all paragraph text as `text-slate-600`
4. WHEN the page is rendered in Light Mode THEN the system SHALL display all badge text with appropriate dark colors
5. WHEN the page is rendered in Dark Mode THEN the system SHALL display all text in light colors as currently implemented

### Requirement 3

**User Story:** As a user viewing the Landing Page in Light Mode, I want the login card and pricing cards to have solid white backgrounds with shadows, so that they stand out clearly from the page background.

#### Acceptance Criteria

1. WHEN the login card is rendered in Light Mode THEN the system SHALL display it with `bg-white`, `border-gray-200`, and `shadow-xl`
2. WHEN pricing cards are rendered in Light Mode THEN the system SHALL display them with `bg-white`, `border-gray-200`, and `shadow-xl`
3. WHEN cards are rendered in Dark Mode THEN the system SHALL display them with glassmorphism effects as currently implemented
4. WHEN the login card is rendered in Light Mode THEN the system SHALL display input fields with white backgrounds and dark text
5. WHEN the login card is rendered in Light Mode THEN the system SHALL display labels as `text-slate-700`

### Requirement 4

**User Story:** As a user viewing the Landing Page in Light Mode, I want buttons to have professional blue styling, so that they are clearly visible and actionable.

#### Acceptance Criteria

1. WHEN the primary login button is rendered in Light Mode THEN the system SHALL display it with a blue gradient (`from-blue-600 to-purple-600`)
2. WHEN the "Começar Grátis" button is rendered in Light Mode THEN the system SHALL display it with appropriate contrast
3. WHEN the "Assinar Agora" buttons are rendered in Light Mode THEN the system SHALL display them with solid backgrounds matching their plan gradients
4. WHEN buttons are rendered in Dark Mode THEN the system SHALL maintain current styling

### Requirement 5

**User Story:** As a user interacting with the Theme Toggle dropdown, I want the menu text to be clearly readable without yellow coloring, so that I can easily select my preferred theme.

#### Acceptance Criteria

1. WHEN the Theme Toggle dropdown is opened in Light Mode THEN the system SHALL display menu items with `text-slate-700`
2. WHEN the Theme Toggle dropdown is opened in Dark Mode THEN the system SHALL display menu items with `text-slate-200`
3. WHEN a theme option is selected THEN the system SHALL highlight it with `text-blue-600` in Light Mode
4. WHEN a theme option is selected THEN the system SHALL highlight it with `text-blue-400` in Dark Mode
5. WHEN the Theme Toggle dropdown is rendered THEN the system SHALL NOT display any yellow or amber text colors

### Requirement 6

**User Story:** As a user viewing the Landing Page in Light Mode, I want the navbar to have a clean appearance, so that it matches the overall light theme aesthetic.

#### Acceptance Criteria

1. WHEN the navbar is rendered in Light Mode THEN the system SHALL display it with `bg-white` and `border-gray-200`
2. WHEN the navbar is rendered in Dark Mode THEN the system SHALL display it with the current dark styling
3. WHEN the navbar logo is rendered in Light Mode THEN the system SHALL display the icon in `text-blue-600`
4. WHEN the navbar text is rendered in Light Mode THEN the system SHALL display it as `text-slate-900`

### Requirement 7

**User Story:** As a user viewing the Landing Page in Light Mode, I want feature pills and badges to have appropriate light mode styling, so that they are readable and visually consistent.

#### Acceptance Criteria

1. WHEN feature pills are rendered in Light Mode THEN the system SHALL display them with `bg-gray-100` backgrounds
2. WHEN feature pills are rendered in Light Mode THEN the system SHALL display text as `text-slate-700`
3. WHEN feature pills are rendered in Light Mode THEN the system SHALL display icons with appropriate color variants
4. WHEN badges are rendered in Light Mode THEN the system SHALL use light background variants with dark text
5. WHEN feature pills are rendered in Dark Mode THEN the system SHALL maintain current glassmorphism styling

### Requirement 8

**User Story:** As a user viewing the Landing Page in Light Mode, I want the footer to have clean light styling, so that it completes the professional appearance of the page.

#### Acceptance Criteria

1. WHEN the footer is rendered in Light Mode THEN the system SHALL display it with `bg-white` and `border-gray-200`
2. WHEN the footer is rendered in Light Mode THEN the system SHALL display text as `text-slate-600`
3. WHEN the footer logo is rendered in Light Mode THEN the system SHALL display the icon as `text-blue-600`
4. WHEN the footer is rendered in Dark Mode THEN the system SHALL maintain current dark styling
