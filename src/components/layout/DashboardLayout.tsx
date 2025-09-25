import { Sidebar } from "./Sidebar";
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex h-screen gradient-mesh">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {/* Modern top bar with glassmorphism */}
        <div className="sticky top-0 z-10 glass border-b border-border/50">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex-1" />
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 text-sm bg-background/50 rounded-full px-4 py-2 backdrop-blur-sm">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center animate-glow">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-foreground font-medium">{user?.email}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2 hover:bg-destructive/10 hover:text-destructive transition-smooth"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto p-6 space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
};