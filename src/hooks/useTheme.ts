import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Check for saved theme preference or default to system
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('system');
    }

    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const effectiveTheme = theme === 'system' ? systemTheme : theme;
    
    root.classList.remove('light', 'dark');
    root.classList.add(effectiveTheme);
    
    // Apply CSS variables
    if (effectiveTheme === 'light') {
      root.style.setProperty('--background', '248 250 252'); // slate-50
      root.style.setProperty('--foreground', '15 23 42'); // slate-900
      root.style.setProperty('--card', '255 255 255'); // white
      root.style.setProperty('--card-foreground', '15 23 42'); // slate-900
      root.style.setProperty('--primary', '29 78 216'); // blue-700
      root.style.setProperty('--primary-foreground', '255 255 255'); // white
      root.style.setProperty('--secondary', '241 245 249'); // slate-100
      root.style.setProperty('--secondary-foreground', '15 23 42'); // slate-900
      root.style.setProperty('--muted', '241 245 249'); // slate-100
      root.style.setProperty('--muted-foreground', '100 116 139'); // slate-500
      root.style.setProperty('--accent', '109 40 217'); // violet-700
      root.style.setProperty('--accent-foreground', '255 255 255'); // white
      root.style.setProperty('--destructive', '220 38 38'); // red-600
      root.style.setProperty('--border', '226 232 240'); // slate-200
      root.style.setProperty('--input', '226 232 240'); // slate-200
      root.style.setProperty('--ring', '29 78 216'); // blue-700
    } else {
      root.style.setProperty('--background', '15 23 42'); // slate-900
      root.style.setProperty('--foreground', '248 250 252'); // slate-50
      root.style.setProperty('--card', '17 24 39'); // slate-950
      root.style.setProperty('--card-foreground', '248 250 252'); // slate-50
      root.style.setProperty('--primary', '37 99 235'); // blue-600
      root.style.setProperty('--primary-foreground', '255 255 255'); // white
      root.style.setProperty('--secondary', '30 41 59'); // slate-800
      root.style.setProperty('--secondary-foreground', '248 250 252'); // slate-50
      root.style.setProperty('--muted', '30 41 59'); // slate-800
      root.style.setProperty('--muted-foreground', '148 163 184'); // slate-400
      root.style.setProperty('--accent', '139 92 246'); // violet-500
      root.style.setProperty('--accent-foreground', '255 255 255'); // white
      root.style.setProperty('--destructive', '239 68 68'); // red-500
      root.style.setProperty('--border', '30 41 59'); // slate-800
      root.style.setProperty('--input', '30 41 59'); // slate-800
      root.style.setProperty('--ring', '37 99 235'); // blue-600
    }
  }, [theme, systemTheme]);

  const setThemeValue = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  return {
    theme,
    setTheme: setThemeValue,
    systemTheme,
    effectiveTheme: theme === 'system' ? systemTheme : theme,
  };
}