import { Sidebar } from "./Sidebar";
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LogOut, User, Bell, Search } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {/* Modern top bar with enhanced glassmorphism */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/30 shadow-lg">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex-1">
              {/* Search bar */}
              <div className="max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar clientes, veículos, ordens..."
                    className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-slate-800/70 border border-white/30 dark:border-slate-700/30 transition-all duration-300 hover:scale-105"
              >
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></span>
              </Button>

              {/* User profile */}
              <div className="flex items-center space-x-3 bg-white/50 dark:bg-slate-800/50 rounded-2xl px-4 py-2 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user?.email?.split('@')[0] || 'Admin'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Administrador</p>
                </div>
              </div>

              {/* Theme toggle */}
              <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-1 backdrop-blur-sm border border-white/30 dark:border-slate-700/30">
                <ThemeToggle />
              </div>

              {/* Logout button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2 bg-white/50 dark:bg-slate-800/50 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl px-4 py-2 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 transition-all duration-300 hover:scale-105"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main content area with enhanced background */}
        <div className="relative min-h-full">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-cyan-600/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative container mx-auto p-6 space-y-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};