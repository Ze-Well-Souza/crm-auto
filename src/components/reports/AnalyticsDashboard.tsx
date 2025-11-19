import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedChart } from './AdvancedChart';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Car, 
  Wrench,
  Calendar,
  Target,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface AnalyticsDashboardProps {
  data: {
    clientes: any[];
    veiculos: any[];
    transacoes: any[];
    agendamentos: any[];
    ordensServico: any[];
  };
  period: string;
}

export const AnalyticsDashboard = ({ data, period }: AnalyticsDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Calcular métricas principais
  const metrics = {
    revenue: data.transacoes?.filter(t => t.tipo === 'receita').reduce((sum, t) => sum + t.valor, 0) || 0,
    expenses: data.transacoes?.filter(t => t.tipo === 'despesa').reduce((sum, t) => sum + t.valor, 0) || 0,
    clients: data.clientes?.length || 0,
    vehicles: data.veiculos?.length || 0,
    appointments: data.agendamentos?.length || 0,
    serviceOrders: data.ordensServico?.length || 0,
    completedOrders: data.ordensServico?.filter(o => o.status === 'finalizado').length || 0,
    pendingOrders: data.ordensServico?.filter(o => o.status === 'em_andamento').length || 0,
  };

  const profit = metrics.revenue - metrics.expenses;
  const profitMargin = metrics.revenue > 0 ? (profit / metrics.revenue) * 100 : 0;
  const completionRate = metrics.serviceOrders > 0 ? (metrics.completedOrders / metrics.serviceOrders) * 100 : 0;

  // Dados para gráficos
  const revenueData = Array.from({ length: 12 }, (_, i) => ({
    mes: new Date(0, i).toLocaleDateString('pt-BR', { month: 'short' }),
    receitas: Math.floor(Math.random() * 50000) + 20000,
    despesas: Math.floor(Math.random() * 30000) + 15000,
    lucro: Math.floor(Math.random() * 20000) + 5000
  }));

  const clientsGrowthData = Array.from({ length: 12 }, (_, i) => ({
    mes: new Date(0, i).toLocaleDateString('pt-BR', { month: 'short' }),
    novos: Math.floor(Math.random() * 20) + 5,
    ativos: Math.floor(Math.random() * 100) + 150,
    churn: Math.floor(Math.random() * 5) + 1
  }));

  const servicesData = [
    { name: 'Manutenção', value: 45, color: '#10b981' },
    { name: 'Revisão', value: 30, color: '#3b82f6' },
    { name: 'Reparo', value: 20, color: '#f59e0b' },
    { name: 'Outros', value: 5, color: '#ef4444' }
  ];

  const performanceData = Array.from({ length: 7 }, (_, i) => ({
    dia: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][i],
    agendamentos: Math.floor(Math.random() * 15) + 5,
    conclusoes: Math.floor(Math.random() * 12) + 3,
    cancelamentos: Math.floor(Math.random() * 3) + 1
  }));

  return (
    <div className="space-y-6">
      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="gradient-card bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Receita Total</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(metrics.revenue)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+12.5%</span>
                </div>
              </div>
              <div className="p-3 bg-green-200 rounded-full">
                <DollarSign className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Lucro Líquido</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(profit)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-sm text-blue-600">{profitMargin.toFixed(1)}% margem</span>
                </div>
              </div>
              <div className="p-3 bg-blue-200 rounded-full">
                <Target className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Clientes Ativos</p>
                <p className="text-2xl font-bold text-purple-900">{metrics.clients}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-purple-600 mr-1" />
                  <span className="text-sm text-purple-600">+8.2%</span>
                </div>
              </div>
              <div className="p-3 bg-purple-200 rounded-full">
                <Users className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Taxa de Conclusão</p>
                <p className="text-2xl font-bold text-orange-900">{completionRate.toFixed(1)}%</p>
                <div className="flex items-center mt-1">
                  <CheckCircle className="h-4 w-4 text-orange-600 mr-1" />
                  <span className="text-sm text-orange-600">{metrics.completedOrders} concluídos</span>
                </div>
              </div>
              <div className="p-3 bg-orange-200 rounded-full">
                <Activity className="h-6 w-6 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard com Abas */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="operations">Operações</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdvancedChart
              title="Evolução Financeira"
              data={revenueData}
              type="bar"
              xAxisKey="mes"
              yAxisKeys={['receitas', 'despesas', 'lucro']}
              colors={['#10b981', '#ef4444', '#3b82f6']}
              height={300}
              showLegend={true}
              showGrid={true}
            />
            
            <AdvancedChart
              title="Crescimento de Clientes"
              data={clientsGrowthData}
              type="line"
              xAxisKey="mes"
              yAxisKeys={['novos', 'ativos']}
              colors={['#8b5cf6', '#06b6d4']}
              height={300}
              showLegend={true}
              showGrid={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AdvancedChart
                title="Análise Financeira Detalhada"
                data={revenueData}
                type="composed"
                xAxisKey="mes"
                yAxisKeys={['receitas', 'despesas', 'lucro']}
                colors={['#10b981', '#ef4444', '#3b82f6']}
                height={400}
                showLegend={true}
                showGrid={true}
              />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Indicadores Financeiros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Receita Média Mensal</span>
                    <span className="font-medium">{formatCurrency(metrics.revenue / 12)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Despesa Média Mensal</span>
                    <span className="font-medium">{formatCurrency(metrics.expenses / 12)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Margem de Lucro</span>
                    <span className="font-medium text-green-600">{profitMargin.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">ROI Estimado</span>
                    <span className="font-medium text-blue-600">18.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdvancedChart
              title="Distribuição de Serviços"
              data={servicesData}
              type="pie"
              xAxisKey="name"
              yAxisKeys={['value']}
              colors={servicesData.map(s => s.color)}
              height={300}
              showLegend={true}
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status das Operações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Ordens Concluídas</span>
                    </div>
                    <Badge variant="secondary">{metrics.completedOrders}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      <span className="font-medium text-orange-900 dark:text-orange-100">Em Andamento</span>
                    </div>
                    <Badge variant="secondary">{metrics.pendingOrders}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Agendamentos</span>
                    </div>
                    <Badge variant="secondary">{metrics.appointments}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <AdvancedChart
              title="Performance Semanal"
              data={performanceData}
              type="area"
              xAxisKey="dia"
              yAxisKeys={['agendamentos', 'conclusoes', 'cancelamentos']}
              colors={['#3b82f6', '#10b981', '#ef4444']}
              height={300}
              showLegend={true}
              showGrid={true}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600">{metrics.appointments}</div>
                  <p className="text-sm text-muted-foreground">Total de Agendamentos</p>
                  <div className="flex items-center justify-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+15.3%</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-600">{completionRate.toFixed(1)}%</div>
                  <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
                  <div className="flex items-center justify-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+3.2%</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-purple-600">4.8/5</div>
                  <p className="text-sm text-muted-foreground">Satisfação do Cliente</p>
                  <div className="flex items-center justify-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600">+0.3</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};