import { useEffect } from 'react';
import { useThemePreferences } from '@/hooks/useThemePreferences';

export const ThemeTransitionManager = () => {
  const { preferences } = useThemePreferences();

  useEffect(() => {
    const root = document.documentElement;
    
    if (preferences.smoothTransitions) {
      root.classList.add('transition-smooth');
    } else {
      root.classList.remove('transition-smooth');
    }

    // Apply theme-specific transition class
    root.classList.add('transition-theme');

    return () => {
      root.classList.remove('transition-smooth', 'transition-theme');
    };
  }, [preferences.smoothTransitions]);

  return null;
};