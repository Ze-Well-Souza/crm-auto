import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  ComposedChart,
  ScatterChart,
  Scatter,
  RadialBarChart,
  RadialBar
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
  Star,
  Filter,
  Settings,
  Eye,
  Maximize2,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";

interface AnalyticsData {
  clientes: any[];
  veiculos: any[];
  transacoes: any[];
  agendamentos: any[];
  ordensServico: any[];
  pecas: any[];
}

interface InteractiveAnalyticsDashboardProps {
  data: AnalyticsData;
  period: string;
  onPeriodChange: (period: string) => void;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

export const InteractiveAnalyticsDashboard = ({ 
  data, 
  period, 
  onPeriodChange 
}: InteractiveAnalyticsDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [showComparison, setShowComparison] = useState(true);
  const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'expenses', 'profit']);

  // Calcular métricas principais
  const metrics = useMemo(() => {
    const revenue = data.transacoes?.filter(t => t.type === 'receita').reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
    const expenses = data.transacoes?.filter(t => t.type === 'despesa').reduce((sum, t) => sum + (t.amount || 0), 0) || 0;
    const profit = revenue - expenses;
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
    
    const totalClients = data.clientes?.length || 0;
    const totalVehicles = data.veiculos?.length || 0;
    const totalAppointments = data.agendamentos?.length || 0;
    const completedAppointments = data.agendamentos?.filter(a => a.status === 'concluido').length || 0;
    const completionRate = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;
    
    const lowStockParts = data.pecas?.filter(p => p.stock_quantity <= (p.min_stock || 0)).length || 0;
    const totalParts = data.pecas?.length || 0;
    const stockHealth = totalParts > 0 ? ((totalParts - lowStockParts) / totalParts) * 100 : 100;

    return {
      revenue,
      expenses,
      profit,
      profitMargin,
      totalClients,
      totalVehicles,
      totalAppointments,
      completedAppointments,
      completionRate,
      lowStockParts,
      totalParts,
      stockHealth
    };
  }, [data]);

  // Dados para gráficos temporais
  const timeSeriesData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months.map((month, index) => ({
      month,
      revenue: Math.floor(Math.random() * 50000) + 20000 + (index * 2000),
      expenses: Math.floor(Math.random() * 30000) + 15000 + (index * 1000),
      profit: Math.floor(Math.random() * 20000) + 5000 + (index * 500),
      appointments: Math.floor(Math.random() * 50) + 20 + index,
      clients: Math.floor(Math.random() * 20) + 5 + Math.floor(index / 2),
      satisfaction: Math.floor(Math.random() * 20) + 80
    }));
  }, []);

  // Dados para análise de serviços
  const servicesData = useMemo(() => [
    { name: 'Manutenção Preventiva', value: 35, revenue: 45000, count: 120, color: '#8884d8' },
    { name: 'Revisão Completa', value: 25, revenue: 38000, count: 85, color: '#82ca9d' },
    { name: 'Reparo de Motor', value: 20, revenue: 52000, count: 45, color: '#ffc658' },
    { name: 'Troca de Peças', value: 15, revenue: 28000, count: 95, color: '#ff7300' },
    { name: 'Diagnóstico', value: 5, revenue: 8000, count: 65, color: '#8dd1e1' }
  ], []);

  // Dados de performance por técnico
  const techniciansData = useMemo(() => [
    { name: 'João Silva', efficiency: 95, satisfaction: 4.8, services: 45, revenue: 35000 },
    { name: 'Maria Santos', efficiency: 88, satisfaction: 4.6, services: 38, revenue: 28000 },
    { name: 'Pedro Costa', efficiency: 92, satisfaction: 4.7, services: 42, revenue: 32000 },
    { name: 'Ana Oliveira', efficiency: 85, satisfaction: 4.5, services: 35, revenue: 25000 }
  ], []);

  // Dados de satisfação do cliente
  const satisfactionData = useMemo(() => [
    { rating: 5, count: 145, percentage: 65 },
    { rating: 4, count: 52, percentage: 23 },
    { rating: 3, count: 18, percentage: 8 },
    { rating: 2, count: 6, percentage: 3 },
    { rating: 1, count: 2, percentage: 1 }
  ], []);

  const renderKPICard = (title: string, value: string | number, change: number, icon: React.ReactNode, color: string) => (
    <Card className={`border-l-4 border-l-${color}-500`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className="flex items-center mt-1">
              {change >= 0 ? (
                <TrendingUp className={`h-4 w-4 text-${color}-600 mr-1`} />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
              )}
              <span className={`text-sm ${change >= 0 ? `text-${color}-600` : 'text-red-600'}`}>
                {change >= 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className={`p-3 bg-${color}-100 rounded-full`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' && entry.name.includes('revenue') || entry.name.includes('expenses') || entry.name.includes('profit') 
                ? formatCurrency(entry.value) 
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Controles do Dashboard */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Análise avançada de performance e métricas</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderKPICard(
          "Receita Total",
          formatCurrency(metrics.revenue),
          12.5,
          <DollarSign className="h-6 w-6 text-green-700" />,
          "green"
        )}
        {renderKPICard(
          "Taxa de Conclusão",
          `${metrics.completionRate.toFixed(1)}%`,
          8.2,
          <CheckCircle className="h-6 w-6 text-blue-700" />,
          "blue"
        )}
        {renderKPICard(
          "Clientes Ativos",
          metrics.totalClients.toString(),
          15.3,
          <Users className="h-6 w-6 text-purple-700" />,
          "purple"
        )}
        {renderKPICard(
          "Saúde do Estoque",
          `${metrics.stockHealth.toFixed(1)}%`,
          -2.1,
          <Package className="h-6 w-6 text-orange-700" />,
          "orange"
        )}
      </div>

      {/* Tabs para diferentes visualizações */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfação</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Gráfico principal de receita */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Evolução Financeira</CardTitle>
                    <CardDescription>Receita, despesas e lucro ao longo do tempo</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="line">Linha</SelectItem>
                        <SelectItem value="bar">Barra</SelectItem>
                        <SelectItem value="area">Área</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  {chartType === 'line' ? (
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} name="Receita" />
                      <Line type="monotone" dataKey="expenses" stroke="#ff7300" strokeWidth={3} name="Despesas" />
                      <Line type="monotone" dataKey="profit" stroke="#82ca9d" strokeWidth={3} name="Lucro" />
                    </LineChart>
                  ) : chartType === 'bar' ? (
                    <BarChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#8884d8" name="Receita" />
                      <Bar dataKey="expenses" fill="#ff7300" name="Despesas" />
                      <Bar dataKey="profit" fill="#82ca9d" name="Lucro" />
                    </BarChart>
                  ) : (
                    <AreaChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" name="Receita" />
                      <Area type="monotone" dataKey="expenses" stackId="1" stroke="#ff7300" fill="#ff7300" name="Despesas" />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribuição de serviços */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Serviços</CardTitle>
                <CardDescription>Por tipo de serviço</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={servicesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {servicesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Performance dos técnicos */}
            <Card>
              <CardHeader>
                <CardTitle>Performance dos Técnicos</CardTitle>
                <CardDescription>Eficiência e satisfação por técnico</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={techniciansData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="efficiency" fill="#8884d8" name="Eficiência %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Métricas de satisfação */}
            <Card>
              <CardHeader>
                <CardTitle>Satisfação dos Clientes</CardTitle>
                <CardDescription>Distribuição de avaliações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {satisfactionData.map((item) => (
                    <div key={item.rating} className="flex items-center gap-4">
                      <div className="flex items-center gap-1 w-16">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                      <Progress value={item.percentage} className="flex-1" />
                      <span className="text-sm text-muted-foreground w-12">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="satisfaction" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Satisfação Detalhada</CardTitle>
              <CardDescription>Evolução da satisfação ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="appointments" fill="#8884d8" name="Agendamentos" />
                  <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#ff7300" strokeWidth={3} name="Satisfação %" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};