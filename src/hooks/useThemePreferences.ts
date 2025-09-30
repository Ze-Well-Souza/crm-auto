import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

interface ThemePreferences {
  smoothTransitions: boolean;
  autoSave: boolean;
  systemSync: boolean;
  preferredTheme: 'light' | 'dark' | 'system';
}

const DEFAULT_PREFERENCES: ThemePreferences = {
  smoothTransitions: true,
  autoSave: true,
  systemSync: true,
  preferredTheme: 'system'
};

const STORAGE_KEY = 'crm-theme-preferences';

export const useThemePreferences = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [preferences, setPreferences] = useState<ThemePreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
      }
    } catch (error) {
      console.warn('Failed to load theme preferences:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = (newPreferences: Partial<ThemePreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    
    if (updated.autoSave) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save theme preferences:', error);
      }
    }
  };

  // Apply theme with preferences
  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    savePreferences({ preferredTheme: newTheme });
  };

  // Toggle between light and dark (skipping system)
  const toggleTheme = () => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
  };

  // Get current effective theme
  const effectiveTheme = theme === 'system' ? systemTheme : theme;

  // Reset to defaults
  const resetPreferences = () => {
    setPreferences(DEFAULT_PREFERENCES);
    localStorage.removeItem(STORAGE_KEY);
    setTheme(DEFAULT_PREFERENCES.preferredTheme);
  };

  // Export preferences for backup
  const exportPreferences = () => {
    return {
      ...preferences,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
  };

  // Import preferences from backup
  const importPreferences = (importedPreferences: any) => {
    try {
      const { exportDate, version, ...prefs } = importedPreferences;
      savePreferences(prefs);
      if (prefs.preferredTheme) {
        setTheme(prefs.preferredTheme);
      }
      return true;
    } catch (error) {
      console.error('Failed to import preferences:', error);
      return false;
    }
  };

  return {
    // Current state
    preferences,
    theme,
    effectiveTheme,
    systemTheme,
    isLoading,

    // Actions
    applyTheme,
    toggleTheme,
    savePreferences,
    resetPreferences,
    exportPreferences,
    importPreferences,

    // Computed values
    isDark: effectiveTheme === 'dark',
    isLight: effectiveTheme === 'light',
    isSystem: theme === 'system',
    hasCustomPreferences: JSON.stringify(preferences) !== JSON.stringify(DEFAULT_PREFERENCES)
  };
};

export type { ThemePreferences };