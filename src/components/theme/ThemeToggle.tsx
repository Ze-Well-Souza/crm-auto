import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { theme, setTheme, effectiveTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="fixed top-4 right-4 z-50">
          <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${effectiveTheme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 rotate-90'}`} />
          <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${effectiveTheme === 'dark' ? 'scale-0 rotate-90' : 'scale-100 rotate-0'}`} />
          <span className="sr-only">Alternar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-popover">
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className={`text-slate-700 dark:text-slate-200 ${theme === 'light' ? 'text-blue-600 dark:text-blue-400' : ''}`}
        >
          <Sun className="mr-2 h-4 w-4" />
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className={`text-slate-700 dark:text-slate-200 ${theme === 'dark' ? 'text-blue-600 dark:text-blue-400' : ''}`}
        >
          <Moon className="mr-2 h-4 w-4" />
          Escuro
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className={`text-slate-700 dark:text-slate-200 ${theme === 'system' ? 'text-blue-600 dark:text-blue-400' : ''}`}
        >
          <div className="mr-2 h-4 w-4 flex items-center justify-center text-xs">🖥️</div>
          Sistema
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}