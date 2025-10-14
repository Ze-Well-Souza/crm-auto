import { 
  Users, 
  Car, 
  Wrench, 
  Calendar, 
  Package, 
  DollarSign, 
  BarChart3, 
  MessageCircle,
  Settings,
  Home,
  CreditCard,
  Store,
  Image
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home, current: true, color: "blue" },
  { name: "Clientes", href: "/clientes", icon: Users, current: false, color: "emerald" },
  { name: "Veículos", href: "/veiculos", icon: Car, current: false, color: "purple" },
  { name: "Ordens de Serviço", href: "/ordens", icon: Wrench, current: false, color: "orange" },
  { name: "Agendamentos", href: "/agendamentos", icon: Calendar, current: false, color: "cyan" },
  { name: "Estoque", href: "/estoque", icon: Package, current: false, color: "green" },
  { name: "Financeiro", href: "/financeiro", icon: DollarSign, current: false, color: "yellow" },
  { name: "Pagamentos", href: "/pagamentos", icon: CreditCard, current: false, color: "pink" },
  { name: "Parceiros", href: "/parceiros", icon: Store, current: false, color: "amber" },
  { name: "Relatórios", href: "/relatorios", icon: BarChart3, current: false, color: "indigo" },
  { name: "Comunicação", href: "/comunicacao", icon: MessageCircle, current: false, color: "teal" },
  { name: "Biblioteca de Imagens", href: "/biblioteca-imagens", icon: Image, current: false, color: "rose" },
  { name: "Configurações", href: "/configuracoes", icon: Settings, current: false, color: "slate" },
];

const getColorClasses = (color: string, isActive: boolean) => {
  const colorMap = {
    blue: {
      active: "bg-gradient-to-r from-blue-500/20 to-blue-600/10 text-blue-600 border-blue-500/30 shadow-blue-500/20",
      icon: "text-blue-600",
      indicator: "bg-gradient-to-b from-blue-500 to-blue-600"
    },
    emerald: {
      active: "bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 text-emerald-600 border-emerald-500/30 shadow-emerald-500/20",
      icon: "text-emerald-600",
      indicator: "bg-gradient-to-b from-emerald-500 to-emerald-600"
    },
    purple: {
      active: "bg-gradient-to-r from-purple-500/20 to-purple-600/10 text-purple-600 border-purple-500/30 shadow-purple-500/20",
      icon: "text-purple-600",
      indicator: "bg-gradient-to-b from-purple-500 to-purple-600"
    },
    orange: {
      active: "bg-gradient-to-r from-orange-500/20 to-orange-600/10 text-orange-600 border-orange-500/30 shadow-orange-500/20",
      icon: "text-orange-600",
      indicator: "bg-gradient-to-b from-orange-500 to-orange-600"
    },
    cyan: {
      active: "bg-gradient-to-r from-cyan-500/20 to-cyan-600/10 text-cyan-600 border-cyan-500/30 shadow-cyan-500/20",
      icon: "text-cyan-600",
      indicator: "bg-gradient-to-b from-cyan-500 to-cyan-600"
    },
    green: {
      active: "bg-gradient-to-r from-green-500/20 to-green-600/10 text-green-600 border-green-500/30 shadow-green-500/20",
      icon: "text-green-600",
      indicator: "bg-gradient-to-b from-green-500 to-green-600"
    },
    yellow: {
      active: "bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 text-yellow-600 border-yellow-500/30 shadow-yellow-500/20",
      icon: "text-yellow-600",
      indicator: "bg-gradient-to-b from-yellow-500 to-yellow-600"
    },
    pink: {
      active: "bg-gradient-to-r from-pink-500/20 to-pink-600/10 text-pink-600 border-pink-500/30 shadow-pink-500/20",
      icon: "text-pink-600",
      indicator: "bg-gradient-to-b from-pink-500 to-pink-600"
    },
    indigo: {
      active: "bg-gradient-to-r from-indigo-500/20 to-indigo-600/10 text-indigo-600 border-indigo-500/30 shadow-indigo-500/20",
      icon: "text-indigo-600",
      indicator: "bg-gradient-to-b from-indigo-500 to-indigo-600"
    },
    teal: {
      active: "bg-gradient-to-r from-teal-500/20 to-teal-600/10 text-teal-600 border-teal-500/30 shadow-teal-500/20",
      icon: "text-teal-600",
      indicator: "bg-gradient-to-b from-teal-500 to-teal-600"
    },
    slate: {
      active: "bg-gradient-to-r from-slate-500/20 to-slate-600/10 text-slate-600 border-slate-500/30 shadow-slate-500/20",
      icon: "text-slate-600",
      indicator: "bg-gradient-to-b from-slate-500 to-slate-600"
    },
    amber: {
      active: "bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-600 border-amber-500/30 shadow-amber-500/20",
      icon: "text-amber-600",
      indicator: "bg-gradient-to-b from-amber-500 to-amber-600"
    },
    rose: {
      active: "bg-gradient-to-r from-rose-500/20 to-rose-600/10 text-rose-600 border-rose-500/30 shadow-rose-500/20",
      icon: "text-rose-600",
      indicator: "bg-gradient-to-b from-rose-500 to-rose-600"
    }
  };

  return colorMap[color as keyof typeof colorMap] || colorMap.blue;
};

export const Sidebar = () => {
  const location = useLocation();
  
  return (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-white/95 to-slate-50/95 dark:from-slate-900/95 dark:to-slate-800/95 backdrop-blur-xl border-r border-white/20 dark:border-slate-700/30 shadow-2xl relative overflow-hidden">

      {/* Logo with enhanced styling */}
      <div className="flex h-20 shrink-0 items-center px-6 border-b border-white/20 dark:border-slate-700/30 relative z-10">
        <div className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 hover:shadow-blue-500/25">
            <Wrench className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Oficina Eficiente</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">CRM Automotivo</p>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation */}
      <nav className="flex flex-1 flex-col px-4 py-6 relative z-10 overflow-y-auto">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item, index) => {
            const isActive = location.pathname === item.href;
            const colorClasses = getColorClasses(item.color, isActive);
            
            return (
              <li key={item.name} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <Link
                  to={item.href}
                  className={cn(
                    "group flex gap-x-3 rounded-2xl p-3 text-sm font-semibold transition-all duration-300 relative overflow-hidden hover:scale-105 hover:shadow-lg",
                    isActive
                      ? `${colorClasses.active} border shadow-lg`
                      : "text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white backdrop-blur-sm"
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className={`absolute left-0 top-0 w-1 h-full ${colorClasses.indicator} rounded-r-full`}></div>
                  )}
                  
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-all duration-300 group-hover:scale-110",
                      isActive 
                        ? colorClasses.icon
                        : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                    )}
                  />
                  <span className="group-hover:translate-x-1 transition-all duration-300">{item.name}</span>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-r from-white/10 to-transparent dark:from-slate-700/10"></div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Enhanced User Profile */}
      <div className="border-t border-white/20 dark:border-slate-700/30 p-4 relative z-10">
        <div className="flex items-center gap-3 group hover:scale-105 transition-all duration-300 p-3 rounded-2xl hover:bg-white/50 dark:hover:bg-slate-800/50 backdrop-blur-sm">
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