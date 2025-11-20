import { Sidebar } from "./Sidebar";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LogOut, User, Bell, Search, Settings, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-transparent">
        {/* Modern top bar with enhanced glassmorphism */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700/30 shadow-sm dark:shadow-lg">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex-1">
              {/* Search bar */}
              <div className="max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar clientes, veículos, ordens..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/30 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800/70 border border-slate-200 dark:border-slate-700/30 transition-all duration-300"
              >
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></span>
              </Button>

              {/* User profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-3 bg-slate-100 dark:bg-slate-800/50 rounded-2xl px-4 py-2 border border-slate-200 dark:border-slate-700/30 hover:bg-slate-200 dark:hover:bg-slate-800/70 transition-all duration-300 h-auto"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user?.email?.split('@')[0] || 'Admin'}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Administrador</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-white/20 dark:border-slate-700/30 shadow-xl"
                >
                  <DropdownMenuLabel className="text-slate-700 dark:text-slate-200">
                    Minha Conta
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                  <DropdownMenuItem 
                    onClick={() => navigate('/perfil')}
                    className="cursor-pointer text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 focus:bg-slate-100 dark:focus:bg-slate-700/50"
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate('/configuracoes')}
                    className="cursor-pointer text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 focus:bg-slate-100 dark:focus:bg-slate-700/50"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme toggle */}
              <div className="bg-white dark:bg-slate-800/50 rounded-xl p-1 border border-gray-200 dark:border-slate-700/30">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content area with clean background */}
        <div className="relative min-h-full">
          <div className="container mx-auto p-6 space-y-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};