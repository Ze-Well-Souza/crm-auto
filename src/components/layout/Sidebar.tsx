import { 
  Users, 
  Car, 
  Wrench, 
  Calendar, 
  Package, 
  DollarSign, 
  BarChart3, 
  Settings,
  Home 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home, current: true },
  { name: "Clientes", href: "/clientes", icon: Users, current: false },
  { name: "Veículos", href: "/veiculos", icon: Car, current: false },
  { name: "Ordens de Serviço", href: "/ordens", icon: Wrench, current: false },
  { name: "Agendamentos", href: "/agendamentos", icon: Calendar, current: false },
  { name: "Estoque", href: "/estoque", icon: Package, current: false },
  { name: "Financeiro", href: "/financeiro", icon: DollarSign, current: false },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3, current: false },
  { name: "Configurações", href: "/configuracoes", icon: Settings, current: false },
];

export const Sidebar = () => {
  const location = useLocation();
  
  return (
    <div className="flex h-full w-64 flex-col glass border-r border-sidebar-border shadow-elevated relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary rounded-full animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple rounded-full animate-pulse-slow"></div>
      </div>

      {/* Logo with enhanced styling */}
      <div className="flex h-20 shrink-0 items-center px-6 border-b border-sidebar-border/50 relative z-10">
        <div className="flex items-center gap-4 group">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-primary group-hover:scale-110 transition-smooth animate-glow">
            <Wrench className="h-6 w-6 text-primary-foreground animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient-primary">Oficina Eficiente</h1>
            <p className="text-xs text-sidebar-foreground/60">CRM Automotivo</p>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation */}
      <nav className="flex flex-1 flex-col px-4 py-6 relative z-10">
        <ul role="list" className="flex flex-1 flex-col gap-y-3">
          {navigation.map((item, index) => {
            const isActive = location.pathname === item.href;
            const colors = ["primary", "info", "warning", "purple", "orange", "success", "pink", "primary", "success"];
            const color = colors[index] || "primary";
            
            return (
              <li key={item.name} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <Link
                  to={item.href}
                  className={cn(
                    "group flex gap-x-3 rounded-xl p-3 text-sm font-medium transition-smooth relative overflow-hidden hover-lift",
                    isActive
                      ? `bg-gradient-to-r from-${color}/10 to-${color}/5 text-${color} shadow-${color} border border-${color}/20`
                      : "text-sidebar-foreground hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent hover:text-primary"
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className={`absolute left-0 top-0 w-1 h-full bg-${color} rounded-r-full animate-scale-in`}></div>
                  )}
                  
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-smooth group-hover:scale-110",
                      isActive 
                        ? `text-${color} animate-bounce-in` 
                        : "text-sidebar-foreground/70 group-hover:text-primary"
                    )}
                  />
                  <span className="group-hover:translate-x-1 transition-smooth">{item.name}</span>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-smooth bg-gradient-to-r from-primary/5 to-transparent"></div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Enhanced User Profile */}
      <div className="border-t border-sidebar-border/50 p-4 relative z-10">
        <div className="flex items-center gap-3 group hover-lift transition-smooth">
          <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center shadow-primary animate-glow">
            <span className="text-sm font-bold text-primary-foreground">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground group-hover:text-primary transition-smooth">Admin</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">admin@oficina.com</p>
          </div>
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};