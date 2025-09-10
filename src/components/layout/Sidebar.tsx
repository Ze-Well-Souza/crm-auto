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
  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border shadow-elevated">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Wrench className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">Oficina Eficiente</h1>
            <p className="text-xs text-sidebar-foreground/60">CRM Automotivo</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-4 py-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={cn(
                  "group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-smooth",
                  item.current
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-fast",
                    item.current ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/70"
                  )}
                />
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground">Admin</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">admin@oficina.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};