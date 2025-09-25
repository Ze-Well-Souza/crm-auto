import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  Car, 
  Wrench, 
  Calendar, 
  Package, 
  DollarSign, 
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useVehicles } from "@/hooks/useVehicles";
import { usePartsNew } from "@/hooks/usePartsNew";
import { useFinancialTransactionsNew } from "@/hooks/useFinancialTransactionsNew";
import { useAppointmentsNew } from "@/hooks/useAppointmentsNew";
import { useServiceOrders } from "@/hooks/useServiceOrders";

const Index = () => {
  // Data hooks
  const { clients, loading: clientsLoading } = useClients();
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const { parts, loading: partsLoading } = usePartsNew();
  const { transactions, loading: transactionsLoading } = useFinancialTransactionsNew();
  const { appointments, loading: appointmentsLoading } = useAppointmentsNew();
  const { serviceOrders, loading: serviceOrdersLoading } = useServiceOrders();

  const isLoading = clientsLoading || vehiclesLoading || partsLoading || 
                   transactionsLoading || appointmentsLoading || serviceOrdersLoading;

  // Calculate metrics
  const totalClients = clients?.length || 0;
  const totalVehicles = vehicles?.length || 0;
  const totalParts = parts?.length || 0;
  const lowStockParts = parts?.filter(p => p.min_stock && p.stock_quantity && p.stock_quantity <= p.min_stock).length || 0;
  
  const totalReceitas = transactions?.filter(t => t.type === 'receita').reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalDespesas = transactions?.filter(t => t.type === 'despesa').reduce((sum, t) => sum + t.amount, 0) || 0;
  const monthlyRevenue = totalReceitas - totalDespesas;
  
  const totalAppointments = appointments?.length || 0;
  const pendingAppointments = appointments?.filter(a => a.status === 'agendado').length || 0;
  const completedAppointments = appointments?.filter(a => a.status === 'concluido').length || 0;
  
  const totalServiceOrders = serviceOrders?.length || 0;
  const completedServiceOrders = serviceOrders?.filter(so => so.status === 'finalizado').length || 0;
  const modules = [
    {
      title: "Gestão de Clientes",
      description: "Cadastro completo de clientes com histórico de serviços e relacionamento",
      icon: Users,
      href: "/clientes",
      badge: "Core",
      color: "primary" as const
    },
    {
      title: "Gestão de Veículos", 
      description: "Controle detalhado de veículos, manutenções e histórico técnico",
      icon: Car,
      href: "/veiculos",
      badge: "Core",
      color: "info" as const
    },
    {
      title: "Ordens de Serviço",
      description: "Criação, acompanhamento e finalização de orçamentos e serviços",
      icon: Wrench,
      href: "/ordens",
      badge: "Core",
      color: "warning" as const
    },
    {
      title: "Agendamentos",
      description: "Calendário inteligente para agendamento de serviços e consultas",
      icon: Calendar,
      href: "/agendamentos",
      color: "purple" as const
    },
    {
      title: "Controle de Estoque",
      description: "Gestão de peças, fornecedores e controle automático de baixa",
      icon: Package,
      href: "/estoque",
      color: "orange" as const
    },
    {
      title: "Gestão Financeira",
      description: "Contas a pagar/receber, fluxo de caixa e comissões",
      icon: DollarSign,
      href: "/financeiro",
      color: "success" as const
    },
    {
      title: "Relatórios e Dashboard",
      description: "Indicadores de performance e relatórios customizáveis",
      icon: BarChart3,
      href: "/relatorios",
      color: "pink" as const
    }
  ];

  return (
    <DashboardLayout>
      {/* Animated Header */}
      <div className="space-y-4 animate-fade-in">
        <div className="relative">
          <h1 className="text-4xl font-bold text-gradient-primary animate-slide-up">Dashboard Principal</h1>
          <div className="absolute -top-2 -left-2 w-8 h-8 bg-primary/20 rounded-full animate-float"></div>
        </div>
        <p className="text-muted-foreground text-lg animate-fade-in">
          Visão geral do seu negócio e acesso rápido aos módulos do sistema
        </p>
      </div>

      {/* Metrics with staggered animation */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Clientes Ativos"
            value={totalClients.toString()}
            change={`${totalVehicles} veículos cadastrados`}
            changeType="neutral"
            icon={Users}
            color="primary"
          />
          <MetricCard
            title="Agendamentos"
            value={totalAppointments.toString()}
            change={`${pendingAppointments} pendentes`}
            changeType={pendingAppointments > 0 ? "neutral" : "positive"}
            icon={Calendar}
            color="purple"
          />
          <MetricCard
            title="Saldo Mensal"
            value={`R$ ${monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            change={`Receitas: R$ ${totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            changeType={monthlyRevenue >= 0 ? "positive" : "negative"}
            icon={TrendingUp}
            color="success"
          />
          <MetricCard
            title="Estoque"
            value={totalParts.toString()}
            change={lowStockParts > 0 ? `${lowStockParts} com estoque baixo` : "Estoque OK"}
            changeType={lowStockParts > 0 ? "negative" : "positive"}
            icon={Package}
            color="orange"
          />
        </div>
      )}

      {/* Modules Grid with enhanced styling */}
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-semibold text-gradient-primary">Módulos do Sistema</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <ModuleCard
              key={module.title}
              title={module.title}
              description={module.description}
              icon={module.icon}
              href={module.href}
              badge={module.badge}
              color={module.color}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Integration Notice */}
      <div className="glass border-primary/20 rounded-xl p-8 space-y-4 animate-fade-in relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-full animate-float"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-warning/10 to-transparent rounded-full animate-pulse-slow"></div>
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-3 h-3 bg-warning rounded-full animate-glow"></div>
          <h3 className="font-bold text-foreground text-xl">Próximos Passos</h3>
        </div>
        <p className="text-muted-foreground relative z-10">
          Para ativar todas as funcionalidades do CRM (autenticação, banco de dados, APIs), 
          conecte seu projeto ao Supabase clicando no botão verde no topo direito da interface.
        </p>
        <p className="text-xs text-muted-foreground/80 relative z-10">
          Isso permitirá o desenvolvimento completo dos módulos com persistência de dados, 
          autenticação de usuários e todas as funcionalidades descritas no PRD.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Index;
