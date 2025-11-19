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
import { useMetrics } from "@/hooks/useMetrics";
import { useRecentActivities } from "@/hooks/useRecentActivities";
import { formatCurrency, formatDate, formatRelativeTime } from "@/utils/formatters";
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
  const { data: metrics, isLoading: metricsLoading } = useMetrics();
  const { data: recentActivities, isLoading: activitiesLoading } = useRecentActivities(5);

  const isLoading = clientsLoading || vehiclesLoading || partsLoading || 
                   transactionsLoading || appointmentsLoading || serviceOrdersLoading || 
                   metricsLoading || activitiesLoading;

  // Calculate key metrics from real data
  const totalClients = metrics?.totalClients || 0;
  const totalVehicles = metrics?.totalVehicles || 0;
  const totalParts = metrics?.totalParts || 0;
  const lowStockParts = metrics?.lowStockParts || 0;
  
  const totalReceitas = metrics?.totalRevenue || 0;
  const totalDespesas = transactions?.filter(t => t.type === 'despesa').reduce((sum, t) => sum + t.amount, 0) || 0;
  const monthlyRevenue = totalReceitas - totalDespesas;
  
  const totalAppointments = metrics?.totalAppointments || 0;
  const todayAppointments = metrics?.confirmedAppointments || 0;
  const pendingAppointments = totalAppointments - metrics?.confirmedAppointments || 0;
  const completedAppointments = metrics?.confirmedAppointments || 0;
  
  const totalServiceOrders = metrics?.totalServiceOrders || 0;
  const inProgressOrders = metrics?.pendingServiceOrders || 0;
  const completedServiceOrders = metrics?.completedServiceOrders || 0;

  // Performance calculations
  const completionRate = totalServiceOrders > 0 ? (completedServiceOrders / totalServiceOrders) * 100 : 0;
  const appointmentRate = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;
  const profitMargin = totalReceitas > 0 ? (monthlyRevenue / totalReceitas) * 100 : 0;

  // Today's priorities based on real data
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
                  Bem-vindo ao CRM Auto!
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg mt-2">
                  Gerencie sua oficina com eficiência e controle total sobre seus processos.
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
              <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:font-semibold text-slate-700 dark:text-slate-300">
                <BarChart3 className="h-4 w-4" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:font-semibold text-slate-700 dark:text-slate-300">
                <Target className="h-4 w-4" />
                Análises Avançadas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Total de Clientes</CardTitle>
                    <Users className="h-5 w-5 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalClients}</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {totalClients > 0 ? '+5% este mês' : 'Nenhum cliente ainda'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Veículos</CardTitle>
                    <Car className="h-5 w-5 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalVehicles}</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {totalVehicles > 0 ? 'Em manutenção ativa' : 'Nenhum veículo cadastrado'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Ordens de Serviço</CardTitle>
                    <Wrench className="h-5 w-5 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalServiceOrders}</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {inProgressOrders} em andamento
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Faturamento</CardTitle>
                    <DollarSign className="h-5 w-5 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(monthlyRevenue)}</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {profitMargin.toFixed(1)}% margem
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activities */}
                <Card className="lg:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/30 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Atividades Recentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities && recentActivities.length > 0 ? (
                        recentActivities.map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <div className="flex-shrink-0">
                              <div className={`w-2 h-2 rounded-full ${
                                activity.type === 'client_created' ? 'bg-blue-500' :
                                activity.type === 'service_order_created' ? 'bg-orange-500' :
                                activity.type === 'appointment_created' ? 'bg-green-500' :
                                activity.type === 'vehicle_added' ? 'bg-purple-500' :
                                'bg-orange-500'
                              }`} />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {activity.title}
                              </p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {activity.description}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-500">
                                {formatRelativeTime(activity.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                          <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Nenhuma atividade recente</p>
                          <p className="text-sm">As atividades aparecerão aqui quando você começar a usar o sistema</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Today's Priorities */}
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/30 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                      <Target className="h-5 w-5 text-orange-600" />
                      Prioridades de Hoje
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {todayPriorities.map((priority) => (
                        <div key={priority.id} className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                          priority.urgent 
                            ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
                            : 'bg-slate-50 border-slate-200 dark:bg-slate-700/50 dark:border-slate-700'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <priority.icon className={`h-5 w-5 mt-0.5 ${
                                priority.urgent ? 'text-red-600' : 'text-slate-600 dark:text-slate-400'
                              }`} />
                              <div className="space-y-1">
                                <h4 className={`text-sm font-medium ${
                                  priority.urgent ? 'text-red-900 dark:text-red-100' : 'text-slate-900 dark:text-white'
                                }`}>
                                  {priority.title}
                                </h4>
                                <p className={`text-xs ${
                                  priority.urgent ? 'text-red-700 dark:text-red-300' : 'text-slate-600 dark:text-slate-400'
                                }`}>
                                  {priority.description}
                                </p>
                              </div>
                            </div>
                            {priority.urgent && (
                              <Badge variant="destructive" className="text-xs">
                                Urgente
                              </Badge>
                            )}
                          </div>
                          <div className="mt-3">
                            <Button 
                              variant={priority.urgent ? "destructive" : "outline"} 
                              size="sm" 
                              className="w-full"
                              asChild
                            >
                              <Link to={priority.href}>
                                {priority.action}
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <AdvancedAnalyticsDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;