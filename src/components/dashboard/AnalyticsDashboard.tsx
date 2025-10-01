import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdvancedMetrics } from "./AdvancedMetrics";
import { RevenueChart } from "../charts/RevenueChart";
import { AppointmentsChart } from "../charts/AppointmentsChart";
import { FinancialChart } from "../charts/FinancialChart";
import { 
  BarChart3, 
  Calendar, 
  DollarSign, 
  Download, 
  Filter,
  RefreshCw,
  TrendingUp
} from "lucide-react";

interface AnalyticsDashboardProps {
  loading?: boolean;
  error?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  loading = false,
  error
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simular refresh de dados
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleExport = () => {
    // Implementar exportação de relatórios
    console.log("Exportando relatórios...");
  };

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">Erro ao carregar Analytics</CardTitle>
          <CardDescription className="text-red-600">
            {error}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleRefresh} variant="outline" className="text-red-700 border-red-300">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Análise completa de performance e métricas</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Último mês</SelectItem>
              <SelectItem value="3months">3 meses</SelectItem>
              <SelectItem value="6months">6 meses</SelectItem>
              <SelectItem value="1year">1 ano</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Avançadas */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas Principais</h3>
        <AdvancedMetrics loading={loading} />
      </div>

      {/* Tabs com diferentes análises */}
      <Tabs defaultValue="financial" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Agendamentos
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Análise Financeira */}
        <TabsContent value="financial" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise Financeira</h3>
            <FinancialChart loading={loading} error={error} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Resumo Financeiro
                </CardTitle>
                <CardDescription>
                  Principais indicadores do período
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Receita Total</span>
                    <span className="font-semibold text-green-600">R$ 328.000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Despesas Totais</span>
                    <span className="font-semibold text-red-600">R$ 215.000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Lucro Líquido</span>
                    <span className="font-semibold text-blue-600">R$ 113.000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Margem de Lucro</span>
                    <span className="font-semibold text-purple-600">34.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projeções</CardTitle>
                <CardDescription>
                  Estimativas para os próximos meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Receita Projetada (Próximo Mês)</span>
                    <span className="font-semibold text-green-600">R$ 72.000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Meta de Crescimento</span>
                    <span className="font-semibold text-blue-600">15%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">ROI Esperado</span>
                    <span className="font-semibold text-purple-600">28%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Análise de Agendamentos */}
        <TabsContent value="appointments" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Análise de Agendamentos</h3>
            <AppointmentsChart loading={loading} error={error} />
          </div>
        </TabsContent>

        {/* Análise de Performance */}
        <TabsContent value="performance" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Geral</h3>
            <RevenueChart 
              data={[]} 
              loading={loading} 
              error={error} 
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Eficiência Operacional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Taxa de Conversão</span>
                    <span className="font-semibold">68.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tempo Médio Atendimento</span>
                    <span className="font-semibold">45min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Satisfação Cliente</span>
                    <span className="font-semibold">4.7/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crescimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Novos Clientes</span>
                    <span className="font-semibold text-green-600">+23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Receita vs Mês Anterior</span>
                    <span className="font-semibold text-green-600">+12.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Agendamentos</span>
                    <span className="font-semibold text-green-600">+15.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alertas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Estoque Baixo</span>
                    <span className="font-semibold text-red-600">12 itens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Agendamentos Pendentes</span>
                    <span className="font-semibold text-yellow-600">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Faturas Vencidas</span>
                    <span className="font-semibold text-red-600">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};