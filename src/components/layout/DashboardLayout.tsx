import { Sidebar } from "./Sidebar";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-gradient-dashboard">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
};