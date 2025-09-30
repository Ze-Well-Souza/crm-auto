import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, DollarSign, Calendar, Clock, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Users, Car, Wrench, Package, ChartBar as BarChart3, Target, Activity, Bell, ArrowRight, Plus, Eye } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useVehicles } from "@/hooks/useVehicles";
import { usePartsNew } from "@/hooks/usePartsNew";
import { useFinancialTransactionsNew } from "@/hooks/useFinancialTransactionsNew";
import { useAppointmentsNew } from "@/hooks/useAppointmentsNew";
import { useServiceOrders } from "@/hooks/useServiceOrders";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Link } from "react-router-dom";
import { AdvancedAnalyticsDashboard } from "@/components/dashboard/AdvancedAnalyticsDashboard";

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

  // Calculate key metrics
  const totalClients = clients?.length || 0;
  const totalVehicles = vehicles?.length || 0;
  const totalParts = parts?.length || 0;
  const lowStockParts = parts?.filter(p => p.min_stock && p.stock_quantity && p.stock_quantity <= p.min_stock).length || 0;
  
  const totalReceitas = transactions?.filter(t => t.type === 'receita').reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalDespesas = transactions?.filter(t => t.type === 'despesa').reduce((sum, t) => sum + t.amount, 0) || 0;
  const monthlyRevenue = totalReceitas - totalDespesas;
  
  const totalAppointments = appointments?.length || 0;
  const todayAppointments = appointments?.filter(a => {
    const today = new Date().toISOString().split('T')[0];
    return a.scheduled_date === today;
  }).length || 0;
  const pendingAppointments = appointments?.filter(a => a.status === 'agendado').length || 0;
  const completedAppointments = appointments?.filter(a => a.status === 'concluido').length || 0;
  
  const totalServiceOrders = serviceOrders?.length || 0;
  const inProgressOrders = serviceOrders?.filter(so => so.status === 'em_andamento').length || 0;
  const completedServiceOrders = serviceOrders?.filter(so => so.status === 'concluido').length || 0;

  // Performance calculations
  const completionRate = totalServiceOrders > 0 ? (completedServiceOrders / totalServiceOrders) * 100 : 0;
  const appointmentRate = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;
  const profitMargin = totalReceitas > 0 ? (monthlyRevenue / totalReceitas) * 100 : 0;

  // Recent activities (mock data)
  const recentActivities = [
    {
      id: '1',
      type: 'appointment',
      title: 'Agendamento confirmado',
      description: 'João Silva - Troca de óleo',
      time: '2 horas atrás',
      icon: Calendar,
      color: 'text-success'
    },
    {
      id: '2',
      type: 'service',
      title: 'Ordem finalizada',
      description: 'OS-001 - Maria Santos',
      time: '4 horas atrás',
      icon: CheckCircle,
      color: 'text-primary'
    },
    {
      id: '3',
      type: 'stock',
      title: 'Estoque baixo',
      description: 'Filtro de óleo - 3 unidades',
      time: '6 horas atrás',
      icon: AlertTriangle,
      color: 'text-warning'
    },
    {
      id: '4',
      type: 'payment',
      title: 'Pagamento recebido',
      description: 'R$ 280,00 - PIX',
      time: '1 dia atrás',
      icon: DollarSign,
      color: 'text-success'
    }
  ];

  // Today's priorities
  const todayPriorities = [
    {
      id: '1',
      title: 'Confirmar agendamentos',
      description: `${pendingAppointments} agendamentos pendentes`,
      action: 'Ver agendamentos',
      href: '/agendamentos',
      urgent: pendingAppointments > 5,
      icon: Calendar
    },
    {
      id: '2',
      title: 'Ordens em andamento',
      description: `${inProgressOrders} ordens para acompanhar`,
      action: 'Ver ordens',
      href: '/ordens',
      urgent: inProgressOrders > 3,
      icon: Wrench
    },
    {
      id: '3',
      title: 'Reposição de estoque',
      description: `${lowStockParts} itens com estoque baixo`,
      action: 'Ver estoque',
      href: '/estoque',
      urgent: lowStockParts > 0,
      icon: Package
    }
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="space-y-8 p-6">
          {/* Welcome Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Bem-vindo, Administrador!
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg mt-2">
                  Gerencie todos os projetos e dados financeiros da plataforma com total controle!
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 px-3 py-1">
                  ● Ativo
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  {formatDate(new Date())}
                </Badge>
              </div>
            </div>
          </div>

          {/* Dashboard Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20">
              <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Target className="h-4 w-4" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <BarChart3 className="h-4 w-4" />
                Analytics Avançado
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8 mt-8">
              {/* Main KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Revenue Card */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 border-0 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">Receita Mensal</p>
                        <p className="text-3xl font-bold mt-2">{formatCurrency(monthlyRevenue)}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm font-medium">{profitMargin.toFixed(1)}% margem</span>
                        </div>
                      </div>
                      <div className="bg-white/20 p-3 rounded-full">
                        <DollarSign className="h-8 w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Clients Card */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Clientes Ativos</p>
                        <p className="text-3xl font-bold mt-2">{totalClients}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <Car className="h-4 w-4" />
                          <span className="text-sm font-medium">{totalVehicles} veículos</span>
                        </div>
                      </div>
                      <div className="bg-white/20 p-3 rounded-full">
                        <Users className="h-8 w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Appointments Card */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm font-medium">Agendamentos Hoje</p>
                        <p className="text-3xl font-bold mt-2">{todayAppointments}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm font-medium">{totalAppointments} total</span>
                        </div>
                      </div>
                      <div className="bg-white/20 p-3 rounded-full">
                        <Calendar className="h-8 w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Service Orders Card */}
                <Card className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 border-0 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm font-medium">Ordens em Andamento</p>
                        <p className="text-3xl font-bold mt-2">{inProgressOrders}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">{Math.round(completionRate)}% conclusão</span>
                        </div>
                      </div>
                      <div className="bg-white/20 p-3 rounded-full">
                        <Wrench className="h-8 w-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* Performance Dashboard */}
                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                          <BarChart3 className="h-6 w-6 text-white" />
                        </div>
                        Performance do Negócio
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {/* Performance Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Taxa de Conclusão de Serviços</span>
                            <span className="font-bold text-green-600">{Math.round(completionRate)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${completionRate}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {completedServiceOrders} de {totalServiceOrders} ordens
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Taxa de Agendamentos</span>
                            <span className="font-bold text-blue-600">{Math.round(appointmentRate)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${appointmentRate}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {completedAppointments} de {totalAppointments} concluídos
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Saúde do Estoque</span>
                            <span className="font-bold text-purple-600">
                              {totalParts > 0 ? Math.round(((totalParts - lowStockParts) / totalParts) * 100) : 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${totalParts > 0 ? ((totalParts - lowStockParts) / totalParts) * 100 : 0}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {lowStockParts} alertas de reposição
                          </p>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                          <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(totalReceitas)}
                          </div>
                          <p className="text-sm text-green-600 font-medium">Receitas</p>
                        </div>
                        <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                          <div className="text-2xl font-bold text-red-600">
                            {formatCurrency(totalDespesas)}
                          </div>
                          <p className="text-sm text-red-600 font-medium">Despesas</p>
                        </div>
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                          <div className="text-2xl font-bold text-blue-600">
                            {totalClients}
                          </div>
                          <p className="text-sm text-blue-600 font-medium">Clientes</p>
                        </div>
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                          <div className="text-2xl font-bold text-purple-600">
                            {totalVehicles}
                          </div>
                          <p className="text-sm text-purple-600 font-medium">Veículos</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pipeline Visual */}
                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-lg">
                          <Activity className="h-6 w-6 text-white" />
                        </div>
                        Pipeline de Serviços
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Pipeline Stages */}
                        <div className="grid grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl text-white shadow-lg">
                            <div className="text-2xl font-bold">
                              {appointments?.filter(a => a.status === 'agendado').length || 0}
                            </div>
                            <p className="text-sm font-medium opacity-90">Agendados</p>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl text-white shadow-lg">
                            <div className="text-2xl font-bold">
                              {serviceOrders?.filter(so => so.status === 'aprovado').length || 0}
                            </div>
                            <p className="text-sm font-medium opacity-90">Aprovados</p>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl text-white shadow-lg">
                            <div className="text-2xl font-bold">{inProgressOrders}</div>
                            <p className="text-sm font-medium opacity-90">Em Execução</p>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-green-400 to-green-600 rounded-xl text-white shadow-lg">
                            <div className="text-2xl font-bold">{completedServiceOrders}</div>
                            <p className="text-sm font-medium opacity-90">Finalizados</p>
                          </div>
                        </div>

                        {/* Pipeline Flow */}
                        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 px-4">
                          <span className="font-medium">Agendamento</span>
                          <ArrowRight className="h-4 w-4" />
                          <span className="font-medium">Aprovação</span>
                          <ArrowRight className="h-4 w-4" />
                          <span className="font-medium">Execução</span>
                          <ArrowRight className="h-4 w-4" />
                          <span className="font-medium">Entrega</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Activities & Quick Actions */}
                <div className="space-y-8">
                  
                  {/* Today's Priorities */}
                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="bg-gradient-to-r from-red-500 to-pink-600 p-2 rounded-lg">
                          <Bell className="h-6 w-6 text-white" />
                        </div>
                        Prioridades de Hoje
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {todayPriorities.map((priority) => (
                        <div 
                          key={priority.id}
                          className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                            priority.urgent 
                              ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-800' 
                              : 'bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200 dark:from-slate-800/50 dark:to-slate-700/50 dark:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${priority.urgent ? 'bg-red-100 dark:bg-red-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                <priority.icon className={`h-5 w-5 ${priority.urgent ? 'text-red-600' : 'text-slate-600 dark:text-slate-400'}`} />
                              </div>
                              <span className="font-semibold text-sm">{priority.title}</span>
                              {priority.urgent && (
                                <Badge className="bg-red-500 text-white text-xs px-2 py-1">Urgente</Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{priority.description}</p>
                          <Link to={priority.href}>
                            <Button 
                              size="sm" 
                              className={`w-full ${
                                priority.urgent 
                                  ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700' 
                                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                              } text-white border-0 shadow-lg`}
                            >
                              {priority.action}
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Recent Activities */}
                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-2 rounded-lg">
                          <Activity className="h-6 w-6 text-white" />
                        </div>
                        Atividades Recentes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-2 hover:bg-muted/30 rounded-md transition-smooth">
                          <div className="w-8 h-8 bg-muted/50 rounded-full flex items-center justify-center shrink-0">
                            <activity.icon className={`h-4 w-4 ${activity.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{activity.title}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{activity.description}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-2 rounded-lg">
                          <Plus className="h-6 w-6 text-white" />
                        </div>
                        Ações Rápidas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Link to="/clientes">
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg">
                          <Users className="h-4 w-4 mr-2" />
                          Novo Cliente
                        </Button>
                      </Link>
                      <Link to="/agendamentos">
                        <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 shadow-lg">
                          <Calendar className="h-4 w-4 mr-2" />
                          Agendar Serviço
                        </Button>
                      </Link>
                      <Link to="/estoque">
                        <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-lg">
                          <Package className="h-4 w-4 mr-2" />
                          Gerenciar Estoque
                        </Button>
                      </Link>
                      <Link to="/relatorios">
                        <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Ver Relatórios
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-8">
              <AdvancedAnalyticsDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;