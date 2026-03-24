import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, DollarSign, Calendar, Clock, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Users, Car, Wrench, Package, ChartBar as BarChart3, Target, Activity, Bell, ArrowRight, Plus, Eye } from "lucide-react";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { useRecentActivities } from "@/hooks/useRecentActivities";
import { formatCurrency, formatDate, formatRelativeTime } from "@/utils/formatters";
import { Link } from "react-router-dom";
import { AdvancedAnalyticsDashboard } from "@/components/dashboard/AdvancedAnalyticsDashboard";

const Index = () => {
  // Use unified dashboard metrics hook (single query instead of 8)
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: recentActivities, isLoading: activitiesLoading } = useRecentActivities(5);

  const isLoading = metricsLoading || activitiesLoading;

  // Use metrics from unified hook
  const totalClients = metrics?.totalClients || 0;
  const totalVehicles = metrics?.totalVehicles || 0;
  const lowStockParts = metrics?.lowStockParts || 0;
  const monthlyRevenue = metrics?.monthlyRevenue || 0;
  const profitMargin = metrics?.profitMargin || 0;
  const totalAppointments = metrics?.totalAppointments || 0;
  const pendingAppointments = metrics?.pendingAppointments || 0;
  const completedAppointments = metrics?.confirmedAppointments || 0;
  const totalServiceOrders = metrics?.totalServiceOrders || 0;
  const inProgressOrders = metrics?.inProgressOrders || 0;
  const completedServiceOrders = metrics?.completedServiceOrders || 0;

  // Performance calculations
  const completionRate = totalServiceOrders > 0 ? (completedServiceOrders / totalServiceOrders) * 100 : 0;
  const appointmentRate = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;

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
      <div className="min-h-screen">
        <div className="space-y-8 p-6">
          {/* Welcome Header - Landing Page Style */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-blue-300 dark:to-cyan-400">
                  Bem-vindo ao Uautos Pro!
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg mt-2">
                  Gerencie sua oficina com eficiência e controle total sobre seus processos.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-600 text-white dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30 px-3 py-1">
                  ● Ativo
                </Badge>
                <Badge className="bg-blue-600 text-white dark:bg-white/5 dark:border-white/10 dark:text-slate-300 px-3 py-1">
                  {formatDate(new Date())}
                </Badge>
              </div>
            </div>
          </div>

          {/* Dashboard Tabs - Landing Page Style */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-1 rounded-xl shadow-sm">
              <TabsTrigger
                value="overview"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all text-slate-700 dark:text-slate-300"
              >
                <BarChart3 className="h-4 w-4" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all text-slate-700 dark:text-slate-300"
              >
                <Target className="h-4 w-4" />
                Análises Avançadas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Key Metrics - Landing Page Style */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white/90 dark:bg-white/5 border-l-4 border-l-blue-600 border-t border-r border-b border-slate-200/50 dark:border-t-white/10 dark:border-r-white/10 dark:border-b-white/10 backdrop-blur-xl shadow-xl shadow-blue-500/10 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Total de Clientes</CardTitle>
                    <div className="p-2 rounded-lg bg-blue-600/20 dark:bg-blue-500/20">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalClients}</div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {totalClients > 0 ? '+5% este mês' : 'Nenhum cliente ainda'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 dark:bg-white/5 border-l-4 border-l-emerald-600 border-t border-r border-b border-slate-200/50 dark:border-t-white/10 dark:border-r-white/10 dark:border-b-white/10 backdrop-blur-xl shadow-xl shadow-emerald-500/10 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Veículos</CardTitle>
                    <div className="p-2 rounded-lg bg-emerald-600/20 dark:bg-emerald-500/20">
                      <Car className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalVehicles}</div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {totalVehicles > 0 ? 'Em manutenção ativa' : 'Nenhum veículo cadastrado'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 dark:bg-white/5 border-l-4 border-l-orange-600 border-t border-r border-b border-slate-200/50 dark:border-t-white/10 dark:border-r-white/10 dark:border-b-white/10 backdrop-blur-xl shadow-xl shadow-orange-500/10 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Ordens de Serviço</CardTitle>
                    <div className="p-2 rounded-lg bg-orange-600/20 dark:bg-orange-500/20">
                      <Wrench className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">{totalServiceOrders}</div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {inProgressOrders} em andamento
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 dark:bg-white/5 border-l-4 border-l-purple-600 border-t border-r border-b border-slate-200/50 dark:border-t-white/10 dark:border-r-white/10 dark:border-b-white/10 backdrop-blur-xl shadow-xl shadow-purple-500/10 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">Faturamento</CardTitle>
                    <div className="p-2 rounded-lg bg-purple-600/20 dark:bg-purple-500/20">
                      <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrency(monthlyRevenue)}</div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {profitMargin.toFixed(1)}% margem
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activities - Landing Page Style */}
                <Card className="lg:col-span-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                      <div className="p-2 rounded-lg bg-blue-500/20">
                        <Activity className="h-5 w-5 text-blue-400" />
                      </div>
                      Atividades Recentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities && recentActivities.length > 0 ? (
                        recentActivities.map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10">
                            <div className="flex-shrink-0">
                              <div className={`w-2 h-2 rounded-full shadow-lg ${
                                activity.type === 'client_created' ? 'bg-blue-500 shadow-blue-500/50' :
                                activity.type === 'service_order_created' ? 'bg-orange-500 shadow-orange-500/50' :
                                activity.type === 'appointment_created' ? 'bg-emerald-500 shadow-emerald-500/50' :
                                activity.type === 'vehicle_added' ? 'bg-purple-500 shadow-purple-500/50' :
                                'bg-orange-500 shadow-orange-500/50'
                              }`} />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium text-white">
                                {activity.title}
                              </p>
                              <p className="text-sm text-slate-400">
                                {activity.description}
                              </p>
                              <p className="text-xs text-slate-500">
                                {formatRelativeTime(activity.timestamp)}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-slate-400">
                          <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Nenhuma atividade recente</p>
                          <p className="text-sm">As atividades aparecerão aqui quando você começar a usar o sistema</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Today's Priorities - Landing Page Style */}
                <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                      <div className="p-2 rounded-lg bg-orange-500/20">
                        <Target className="h-5 w-5 text-orange-400" />
                      </div>
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