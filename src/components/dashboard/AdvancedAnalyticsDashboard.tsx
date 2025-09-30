import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Users, 
  Car, 
  Package, 
  Wrench,
  Download,
  RefreshCw,
  Target,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Clock,
  Star
} from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { useAppointmentsNew } from "@/hooks/useAppointmentsNew";
import { useFinancialTransactionsNew } from "@/hooks/useFinancialTransactionsNew";
import { useClients } from "@/hooks/useClients";
import { usePartsNew } from "@/hooks/usePartsNew";

// Interfaces para métricas avançadas conforme especificação
interface AdvancedMetrics {
  revenue_trend: number[];
  client_retention_rate: number;
  average_service_value: number;
  most_profitable_services: ServiceType[];
  seasonal_analysis: SeasonalData[];
  cash_flow_projection: CashFlowData[];
}

interface ServiceType {
  name: string;
  revenue: number;
  count: number;
  avgValue: number;
}

interface SeasonalData {
  season: string;
  revenue: number;
  appointments: number;
  growth: number;
}

interface CashFlowData {
  month: string;
  projected_revenue: number;
  projected_expenses: number;
  net_flow: number;
  confidence: number;
}

interface AdvancedAnalyticsDashboardProps {
  className?: string;
}

export const AdvancedAnalyticsDashboard: React.FC<AdvancedAnalyticsDashboardProps> = ({
  className
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState("12months");
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const { appointments } = useAppointmentsNew();
  const { transactions } = useFinancialTransactionsNew();
  const { clients } = useClients();
  const { parts } = usePartsNew();

  // Calcular métricas avançadas conforme especificação FASE 4.1
  const analytics: AdvancedMetrics = useMemo(() => {
    const now = new Date();
    const monthsToAnalyze = selectedPeriod === "12months" ? 12 : 6;
    
    // 1. Revenue Trend - Tendência de receita mensal
    const revenue_trend = Array.from({ length: monthsToAnalyze }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthTransactions = transactions?.filter(t => 
        t.type === 'receita' && 
        new Date(t.created_at).getMonth() === date.getMonth() &&
        new Date(t.created_at).getFullYear() === date.getFullYear()
      ) || [];
      
      return monthTransactions.reduce((sum, t) => sum + t.amount, 0);
    }).reverse();

    // 2. Client Retention Rate - Taxa de retenção de clientes
    const clientsWithMultipleServices = clients?.filter(client => {
      const clientAppointments = appointments?.filter(a => a.client_id === client.id) || [];
      return clientAppointments.length > 1;
    }) || [];
    
    const client_retention_rate = clients?.length > 0 
      ? (clientsWithMultipleServices.length / clients.length) * 100 
      : 0;

    // 3. Average Service Value - Valor médio por serviço
    const totalRevenue = transactions?.filter(t => t.type === 'receita').reduce((sum, t) => sum + t.amount, 0) || 0;
    const totalServices = appointments?.length || 0;
    const average_service_value = totalServices > 0 ? totalRevenue / totalServices : 0;

    // 4. Most Profitable Services - Serviços mais lucrativos
    const serviceRevenue = appointments?.reduce((acc, appointment) => {
      const service = appointment.service_type || 'Outros';
      const serviceTransactions = transactions?.filter(t => 
        t.service_order_id && t.type === 'receita'
      ) || [];
      
      const revenue = serviceTransactions
        .filter(t => t.service_order_id === appointment.id)
        .reduce((sum, t) => sum + t.amount, 0);
      
      if (!acc[service]) {
        acc[service] = { revenue: 0, count: 0 };
      }
      acc[service].revenue += revenue;
      acc[service].count += 1;
      
      return acc;
    }, {} as Record<string, { revenue: number; count: number }>) || {};

    const most_profitable_services: ServiceType[] = Object.entries(serviceRevenue)
      .map(([name, data]) => ({
        name,
        revenue: data.revenue,
        count: data.count,
        avgValue: data.count > 0 ? data.revenue / data.count : 0
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // 5. Seasonal Analysis - Análise sazonal
    const seasonal_analysis: SeasonalData[] = [
      { season: 'Verão', revenue: 0, appointments: 0, growth: 0 },
      { season: 'Outono', revenue: 0, appointments: 0, growth: 0 },
      { season: 'Inverno', revenue: 0, appointments: 0, growth: 0 },
      { season: 'Primavera', revenue: 0, appointments: 0, growth: 0 }
    ];

    appointments?.forEach(appointment => {
      const month = new Date(appointment.scheduled_date).getMonth();
      const seasonIndex = Math.floor(month / 3);
      const revenue = transactions?.filter(t => 
        t.service_order_id === appointment.id && t.type === 'receita'
      ).reduce((sum, t) => sum + t.amount, 0) || 0;
      
      seasonal_analysis[seasonIndex].revenue += revenue;
      seasonal_analysis[seasonIndex].appointments += 1;
    });

    // Calcular crescimento sazonal
    seasonal_analysis.forEach((season, index) => {
      const prevIndex = index === 0 ? 3 : index - 1;
      const prevRevenue = seasonal_analysis[prevIndex].revenue;
      season.growth = prevRevenue > 0 
        ? ((season.revenue - prevRevenue) / prevRevenue) * 100 
        : 0;
    });

    // 6. Cash Flow Projection - Projeção de fluxo de caixa
    const cash_flow_projection: CashFlowData[] = Array.from({ length: 6 }, (_, i) => {
      const futureDate = new Date(now.getFullYear(), now.getMonth() + i + 1, 1);
      const monthName = futureDate.toLocaleDateString('pt-BR', { month: 'short' });
      
      // Projeção baseada na média dos últimos 3 meses
      const recentRevenue = revenue_trend.slice(-3);
      const avgRevenue = recentRevenue.reduce((sum, r) => sum + r, 0) / 3;
      
      const recentExpenses = Array.from({ length: 3 }, (_, j) => {
        const date = new Date(now.getFullYear(), now.getMonth() - j, 1);
        return transactions?.filter(t => 
          t.type === 'despesa' && 
          new Date(t.created_at).getMonth() === date.getMonth()
        ).reduce((sum, t) => sum + t.amount, 0) || 0;
      });
      
      const avgExpenses = recentExpenses.reduce((sum, e) => sum + e, 0) / 3;
      
      // Aplicar tendência de crescimento
      const growthFactor = 1 + (i * 0.05); // 5% de crescimento mensal projetado
      const projected_revenue = avgRevenue * growthFactor;
      const projected_expenses = avgExpenses * (1 + (i * 0.02)); // 2% de aumento nas despesas
      
      return {
        month: monthName,
        projected_revenue,
        projected_expenses,
        net_flow: projected_revenue - projected_expenses,
        confidence: Math.max(90 - (i * 10), 50) // Confiança diminui com o tempo
      };
    });

    return {
      revenue_trend,
      client_retention_rate,
      average_service_value,
      most_profitable_services,
      seasonal_analysis,
      cash_flow_projection
    };
  }, [appointments, transactions, clients, parts, selectedPeriod]);

  // Dados para gráficos
  const revenueChartData = useMemo(() => {
    const now = new Date();
    const monthsToShow = selectedPeriod === "12months" ? 12 : 6;
    
    return Array.from({ length: monthsToShow }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthTransactions = transactions?.filter(t => 
        new Date(t.created_at).getMonth() === date.getMonth() &&
        new Date(t.created_at).getFullYear() === date.getFullYear()
      ) || [];
      
      const revenue = monthTransactions.filter(t => t.type === 'receita').reduce((sum, t) => sum + t.amount, 0);
      const expenses = monthTransactions.filter(t => t.type === 'despesa').reduce((sum, t) => sum + t.amount, 0);
      
      return {
        month: date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        revenue,
        expenses,
        profit: revenue - expenses,
        appointments: appointments?.filter(a => 
          new Date(a.scheduled_date).getMonth() === date.getMonth() &&
          new Date(a.scheduled_date).getFullYear() === date.getFullYear()
        ).length || 0
      };
    }).reverse();
  }, [transactions, appointments, selectedPeriod]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleExport = () => {
    const data = {
      analytics,
      revenueChartData,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header com controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics Avançado</h2>
          <p className="text-muted-foreground">Métricas detalhadas e projeções de negócio</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6months">6 meses</SelectItem>
              <SelectItem value="12months">12 meses</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Retenção</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.client_retention_rate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Clientes que retornaram
            </p>
            <Progress value={analytics.client_retention_rate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio/Serviço</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.average_service_value)}</div>
            <p className="text-xs text-muted-foreground">
              Ticket médio por atendimento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tendência Receita</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.revenue_trend.length > 1 && 
                analytics.revenue_trend[analytics.revenue_trend.length - 1] > 
                analytics.revenue_trend[analytics.revenue_trend.length - 2] ? (
                <span className="text-green-600 flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  Crescendo
                </span>
              ) : (
                <span className="text-red-600 flex items-center">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  Declinando
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Últimos {selectedPeriod === "12months" ? "12" : "6"} meses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projeção 6 Meses</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics.cash_flow_projection.reduce((sum, p) => sum + p.net_flow, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Fluxo de caixa projetado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes visualizações */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="projections">Projeções</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Gráfico de receita vs despesas */}
            <Card>
              <CardHeader>
                <CardTitle>Receita vs Despesas</CardTitle>
                <CardDescription>Comparativo mensal de entradas e saídas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" name="Receita" />
                    <Bar dataKey="expenses" fill="#ff7300" name="Despesas" />
                    <Line type="monotone" dataKey="profit" stroke="#82ca9d" name="Lucro" strokeWidth={3} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Análise sazonal */}
            <Card>
              <CardHeader>
                <CardTitle>Análise Sazonal</CardTitle>
                <CardDescription>Performance por estação do ano</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.seasonal_analysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="season" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(Number(value)) : value,
                      name === 'revenue' ? 'Receita' : name === 'appointments' ? 'Agendamentos' : 'Crescimento %'
                    ]} />
                    <Bar dataKey="revenue" fill="#8884d8" name="Receita" />
                    <Bar dataKey="appointments" fill="#82ca9d" name="Agendamentos" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendência de Receita</CardTitle>
              <CardDescription>Evolução da receita ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Serviços mais lucrativos */}
            <Card>
              <CardHeader>
                <CardTitle>Serviços Mais Lucrativos</CardTitle>
                <CardDescription>Top 5 serviços por receita</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.most_profitable_services.map((service, index) => (
                    <div key={service.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {service.count} serviços • {formatCurrency(service.avgValue)} média
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(service.revenue)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Distribuição de serviços */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Serviços</CardTitle>
                <CardDescription>Proporção por tipo de serviço</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.most_profitable_services}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.most_profitable_services.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Projeção de Fluxo de Caixa</CardTitle>
              <CardDescription>Previsão para os próximos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={analytics.cash_flow_projection}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    formatCurrency(Number(value)),
                    name === 'projected_revenue' ? 'Receita Projetada' :
                    name === 'projected_expenses' ? 'Despesas Projetadas' :
                    name === 'net_flow' ? 'Fluxo Líquido' : 'Confiança %'
                  ]} />
                  <Legend />
                  <Bar dataKey="projected_revenue" fill="#8884d8" name="Receita Projetada" />
                  <Bar dataKey="projected_expenses" fill="#ff7300" name="Despesas Projetadas" />
                  <Line type="monotone" dataKey="net_flow" stroke="#82ca9d" name="Fluxo Líquido" strokeWidth={3} />
                  <Line type="monotone" dataKey="confidence" stroke="#ffc658" name="Confiança %" strokeWidth={2} strokeDasharray="5 5" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Indicadores de confiança */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.cash_flow_projection.slice(0, 3).map((projection, index) => (
              <Card key={projection.month}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{projection.month}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Fluxo Líquido:</span>
                      <span className={`font-bold ${projection.net_flow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(projection.net_flow)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Confiança:</span>
                      <div className="flex items-center gap-2">
                        <Progress value={projection.confidence} className="w-16" />
                        <span className="text-sm">{projection.confidence.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};