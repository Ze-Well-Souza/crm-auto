import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeDebug() {
  const { theme, systemTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-card border rounded-lg p-4 text-sm shadow-lg z-50">
      <h3 className="font-semibold mb-2">Theme Debug</h3>
      <div className="space-y-1">
        <div>Current theme: <span className="font-mono">{theme}</span></div>
        <div>System theme: <span className="font-mono">{systemTheme}</span></div>
        <div>Resolved theme: <span className="font-mono">{resolvedTheme}</span></div>
        <div>OS prefers dark: <span className="font-mono">{window.matchMedia('(prefers-color-scheme: dark)').matches ? 'true' : 'false'}</span></div>
      </div>
    </div>
  );
}