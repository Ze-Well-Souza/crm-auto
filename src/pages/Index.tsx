import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
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

const Index = () => {
  const modules = [
    {
      title: "Gestão de Clientes",
      description: "Cadastro completo de clientes com histórico de serviços e relacionamento",
      icon: Users,
      href: "/clientes",
      badge: "Core"
    },
    {
      title: "Gestão de Veículos", 
      description: "Controle detalhado de veículos, manutenções e histórico técnico",
      icon: Car,
      href: "/veiculos",
      badge: "Core"
    },
    {
      title: "Ordens de Serviço",
      description: "Criação, acompanhamento e finalização de orçamentos e serviços",
      icon: Wrench,
      href: "/ordens",
      badge: "Core"
    },
    {
      title: "Agendamentos",
      description: "Calendário inteligente para agendamento de serviços e consultas",
      icon: Calendar,
      href: "/agendamentos"
    },
    {
      title: "Controle de Estoque",
      description: "Gestão de peças, fornecedores e controle automático de baixa",
      icon: Package,
      href: "/estoque"
    },
    {
      title: "Gestão Financeira",
      description: "Contas a pagar/receber, fluxo de caixa e comissões",
      icon: DollarSign,
      href: "/financeiro"
    },
    {
      title: "Relatórios e Dashboard",
      description: "Indicadores de performance e relatórios customizáveis",
      icon: BarChart3,
      href: "/relatorios"
    }
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard Principal</h1>
        <p className="text-muted-foreground">
          Visão geral do seu negócio e acesso rápido aos módulos do sistema
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Clientes Ativos"
          value="1,247"
          change="+12% vs mês anterior"
          changeType="positive"
          icon={Users}
        />
        <MetricCard
          title="Serviços em Andamento"
          value="23"
          change="5 agendados hoje"
          changeType="neutral"
          icon={Clock}
        />
        <MetricCard
          title="Faturamento Mensal"
          value="R$ 45.890"
          change="+8.2% vs mês anterior"
          changeType="positive"
          icon={TrendingUp}
        />
        <MetricCard
          title="Serviços Concluídos"
          value="156"
          change="Este mês"
          changeType="positive"
          icon={CheckCircle}
        />
      </div>

      {/* Modules Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Módulos do Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <ModuleCard
              key={module.title}
              title={module.title}
              description={module.description}
              icon={module.icon}
              href={module.href}
              badge={module.badge}
            />
          ))}
        </div>
      </div>

      {/* Integration Notice */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
          <h3 className="font-semibold text-foreground">Próximos Passos</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Para ativar todas as funcionalidades do CRM (autenticação, banco de dados, APIs), 
          conecte seu projeto ao Supabase clicando no botão verde no topo direito da interface.
        </p>
        <p className="text-xs text-muted-foreground">
          Isso permitirá o desenvolvimento completo dos módulos com persistência de dados, 
          autenticação de usuários e todas as funcionalidades descritas no PRD.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Index;
