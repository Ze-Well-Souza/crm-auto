import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Landing from './Landing';

// Mock the AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    signIn: vi.fn(),
  }),
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('Landing Page Colored Glows', () => {
  it('should render login card with blue/indigo glow in light mode', () => {
    const { container } = render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );

    // Find the login card by looking for the card with the title "Acesse sua conta"
    const loginCardTitle = screen.getByText('Acesse sua conta');
    const loginCard = loginCardTitle.closest('[class*="shadow"]');

    expect(loginCard).toBeInTheDocument();
    expect(loginCard?.className).toContain('shadow-2xl');
    expect(loginCard?.className).toContain('shadow-indigo-500/20');
  });

  it('should render login card with dark mode indigo glow classes', () => {
    const { container } = render(
      <BrowserRouter>
        <Landing />
      </BrowserRouter>
    );

    const loginCardTitle = screen.getByText('Acesse sua conta');
    const loginCard = loginCardTitle.closest('[class*="shadow"]');

    expect(loginCard).toBeInTheDocument();
    expect(loginCard?.className).toContain('dark:shadow-indigo-400/20');
  });

  /**
   * Feature: landing-colored-glows, Property 1: All pricing cards have theme-appropriate colored glows
   * 
   * Property: For any pricing card rendered on the Landing Page, the card should have a colored shadow 
   * class that matches its plan theme color (emerald for Gratuito, blue for Básico, purple for Profissional, 
   * orange for Enterprise) in both light and dark modes.
   * 
   * Validates: Requirements 1.2, 1.3, 1.4, 1.5, 2.2, 2.3, 2.4, 2.5
   */
  describe('Property 1: All pricing cards have theme-appropriate colored glows', () => {
    const planColorMapping = [
      { name: 'Gratuito', lightShadow: 'shadow-emerald-500/20', darkShadow: 'dark:shadow-emerald-900/20' },
      { name: 'Básico', lightShadow: 'shadow-blue-500/20', darkShadow: 'dark:shadow-blue-500/20' },
      { name: 'Profissional', lightShadow: 'shadow-purple-500/20', darkShadow: 'dark:shadow-purple-500/20' },
      { name: 'Enterprise', lightShadow: 'shadow-orange-500/20', darkShadow: 'dark:shadow-orange-500/20' },
    ];

    planColorMapping.forEach(({ name, lightShadow, darkShadow }) => {
      it(`should render ${name} card with correct colored glow (${lightShadow})`, () => {
        render(
          <BrowserRouter>
            <Landing />
          </BrowserRouter>
        );

        const planCard = screen.getByText(name).closest('[class*="shadow"]');
        
        expect(planCard).toBeInTheDocument();
        expect(planCard?.className).toContain('shadow-xl');
        expect(planCard?.className).toContain(lightShadow);
        expect(planCard?.className).toContain(darkShadow);
      });
    });
  });

  /**
   * Feature: landing-colored-glows, Property 2: All pricing cards have hover glow intensification
   * 
   * Property: For any pricing card, hovering should increase the shadow opacity and translate the card upward.
   * 
   * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5
   */
  describe('Property 2: All pricing cards have hover glow intensification', () => {
    const planHoverMapping = [
      { name: 'Gratuito', hoverShadow: 'hover:shadow-emerald-500/30' },
      { name: 'Básico', hoverShadow: 'hover:shadow-blue-500/30' },
      { name: 'Profissional', hoverShadow: 'hover:shadow-purple-500/30' },
      { name: 'Enterprise', hoverShadow: 'hover:shadow-orange-500/30' },
    ];

    planHoverMapping.forEach(({ name, hoverShadow }) => {
      it(`should render ${name} card with hover glow intensification (${hoverShadow})`, () => {
        render(
          <BrowserRouter>
            <Landing />
          </BrowserRouter>
        );

        const planCard = screen.getByText(name).closest('[class*="shadow"]');
        
        expect(planCard).toBeInTheDocument();
        expect(planCard?.className).toContain(hoverShadow);
        expect(planCard?.className).toContain('hover:-translate-y-1');
      });
    });
  });

  /**
   * Feature: landing-colored-glows, Property 3: Tailwind-only implementation
   * 
   * Property: For all modified card elements, the implementation should use only Tailwind utility classes 
   * (shadow-*, hover:*, dark:*, transition-*) without custom CSS or inline styles.
   * 
   * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5
   */
  describe('Property 3: Tailwind-only implementation', () => {
    it('should use only Tailwind utility classes for Login Card', () => {
      render(
        <BrowserRouter>
          <Landing />
        </BrowserRouter>
      );

      const loginCardTitle = screen.getByText('Acesse sua conta');
      const loginCard = loginCardTitle.closest('[class*="shadow"]');

      expect(loginCard).toBeInTheDocument();
      
      // Verify Tailwind shadow classes are used
      expect(loginCard?.className).toMatch(/shadow-(2xl|xl|lg|md|sm|none)/);
      expect(loginCard?.className).toMatch(/shadow-\w+-\d+\/\d+/);
      
      // Verify dark: prefix is used
      expect(loginCard?.className).toMatch(/dark:shadow-/);
      
      // Verify no inline styles for shadows (style attribute should not contain shadow-related CSS)
      const styleAttr = loginCard?.getAttribute('style');
      if (styleAttr) {
        expect(styleAttr).not.toMatch(/box-shadow/i);
      }
    });

    it('should use only Tailwind utility classes for all Pricing Cards', () => {
      render(
        <BrowserRouter>
          <Landing />
        </BrowserRouter>
      );

      const planNames = ['Gratuito', 'Básico', 'Profissional', 'Enterprise'];
      
      planNames.forEach(name => {
        const planCard = screen.getByText(name).closest('[class*="shadow"]');
        
        expect(planCard).toBeInTheDocument();
        
        // Verify Tailwind shadow classes
        expect(planCard?.className).toMatch(/shadow-(xl|2xl)/);
        expect(planCard?.className).toMatch(/shadow-\w+-\d+\/\d+/);
        
        // Verify hover: prefix is used
        expect(planCard?.className).toMatch(/hover:shadow-/);
        expect(planCard?.className).toMatch(/hover:-translate-y-/);
        
        // Verify dark: prefix is used
        expect(planCard?.className).toMatch(/dark:shadow-/);
        
        // Verify transition classes
        expect(planCard?.className).toMatch(/transition-/);
        expect(planCard?.className).toMatch(/duration-/);
        
        // Verify no inline styles for shadows
        const styleAttr = planCard?.getAttribute('style');
        if (styleAttr) {
          expect(styleAttr).not.toMatch(/box-shadow/i);
        }
      });
    });
  });
});
