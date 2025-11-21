import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  Car,
  Wrench,
  Calendar,
  DollarSign,
  Package,
  BarChart3,
  HandshakeIcon,
  MessageSquare,
  Settings,
  Crown,
  Lock,
  Shield
} from "lucide-react";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "sonner";

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasFeature, loading } = useSubscriptionContext();
  const { isAdmin } = useUserRole();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home, feature: null, adminOnly: false },
    { name: "Clientes", href: "/clientes", icon: Users, feature: 'crm_clients', adminOnly: false },
    { name: "Veículos", href: "/veiculos", icon: Car, feature: 'crm_vehicles', adminOnly: false },
    { name: "Agendamentos", href: "/agendamentos", icon: Calendar, feature: 'crm_appointments', adminOnly: false },
    { name: "Ordens de Serviço", href: "/ordens", icon: Wrench, feature: 'crm_service_orders', adminOnly: false },
    { name: "Estoque", href: "/estoque", icon: Package, feature: 'crm_parts', adminOnly: false },
    { name: "Financeiro", href: "/financeiro", icon: DollarSign, feature: 'crm_financial', adminOnly: false },
    { name: "Relatórios", href: "/relatorios", icon: BarChart3, feature: 'crm_reports', adminOnly: false },
    { name: "Parceiros", href: "/parceiros", icon: HandshakeIcon, feature: null, adminOnly: false },
    { name: "Comunicação", href: "/comunicacao", icon: MessageSquare, feature: null, adminOnly: false },
    { name: "Configurações", href: "/configuracoes", icon: Settings, feature: null, adminOnly: false },
    { name: "Admin", href: "/admin", icon: Shield, color: "text-red-600", feature: null, adminOnly: true },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-white dark:bg-gradient-to-b dark:from-slate-900/95 dark:to-slate-800/95 dark:backdrop-blur-xl border-r border-gray-200 dark:border-slate-700/30 shadow-sm dark:shadow-2xl relative overflow-hidden">
      {/* Logo */}
      <div className="flex h-20 shrink-0 items-center px-6 border-b border-gray-200 dark:border-white/20 dark:border-slate-700/30 relative z-10">
        <div className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
            <Wrench className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Uautos Pro</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Gestão Profissional</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-4 py-6 relative z-10 overflow-y-auto">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => {
            // Ocultar item admin se não for admin
            if (item.adminOnly && !isAdmin) return null;

            const isActive = location.pathname === item.href;
            const hasAccess = !item.feature || hasFeature(item.feature);
            const isLocked = !hasAccess;
            
            return (
              <li key={item.name}>
                <Link
                  to={isLocked ? '/planos' : item.href}
                  className={cn(
                    "group flex gap-x-3 rounded-2xl p-3 text-sm font-semibold leading-6 transition-all duration-200 relative",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-slate-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800",
                    item.color,
                    isLocked && "opacity-60 cursor-not-allowed"
                  )}
                  onClick={(e) => {
                    if (isLocked) {
                      e.preventDefault();
                      toast.error(`${item.name} disponível no plano Profissional`, {
                        action: {
                          label: 'Ver Planos',
                          onClick: () => navigate('/planos')
                        }
                      });
                    }
                  }}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", item.color)} />
                  <span className="flex-1">{item.name}</span>
                  {isLocked && <Lock className="h-4 w-4 ml-auto flex-shrink-0" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-200 dark:border-white/20 dark:border-slate-700/30 p-4 relative z-10">
        <div className="flex items-center gap-3 group transition-all duration-300 p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-800/50 dark:backdrop-blur-sm">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-sm font-bold text-white">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Admin</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">admin@oficina.com</p>
          </div>
          <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
        </div>
      </div>
    </div>
  );
};
