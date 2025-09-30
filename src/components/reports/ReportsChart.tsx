import React from 'react';
import { AdvancedChart } from './AdvancedChart';
import { DollarSign, Users, Car, Wrench } from "lucide-react";

interface ReportsChartProps {
  title: string;
  type: 'revenue' | 'clients' | 'services' | 'vehicles';
  data?: any[];
  period?: string;
}

export const ReportsChart = ({ title, type, data = [], period = "Este mês" }: ReportsChartProps) => {
  // Generate mock data based on type
  const generateMockData = () => {
    const days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    });

    switch (type) {
      case 'revenue':
        return days.map(day => ({
          data: day,
          receitas: Math.floor(Math.random() * 5000) + 2000,
          despesas: Math.floor(Math.random() * 3000) + 1000,
          lucro: Math.floor(Math.random() * 2000) + 500
        }));
      
      case 'clients':
        return days.map(day => ({
          data: day,
          novos: Math.floor(Math.random() * 10) + 1,
          ativos: Math.floor(Math.random() * 50) + 150,
          retencao: Math.floor(Math.random() * 20) + 80
        }));
      
      case 'services':
        return days.map(day => ({
          data: day,
          realizados: Math.floor(Math.random() * 20) + 5,
          agendados: Math.floor(Math.random() * 15) + 10,
          cancelados: Math.floor(Math.random() * 5) + 1
        }));
      
      case 'vehicles':
        return days.map(day => ({
          data: day,
          atendidos: Math.floor(Math.random() * 15) + 5,
          manutencoes: Math.floor(Math.random() * 10) + 3,
          revisoes: Math.floor(Math.random() * 8) + 2
        }));
      
      default:
        return [];
    }
  };

  const getChartConfig = () => {
    switch (type) {
      case 'revenue':
        return {
          xAxisKey: 'data',
          yAxisKeys: ['receitas', 'despesas', 'lucro'],
          colors: ['#10b981', '#ef4444', '#3b82f6'],
          chartType: 'bar' as const
        };
      
      case 'clients':
        return {
          xAxisKey: 'data',
          yAxisKeys: ['novos', 'ativos', 'retencao'],
          colors: ['#8b5cf6', '#06b6d4', '#f59e0b'],
          chartType: 'line' as const
        };
      
      case 'services':
        return {
          xAxisKey: 'data',
          yAxisKeys: ['realizados', 'agendados', 'cancelados'],
          colors: ['#10b981', '#f59e0b', '#ef4444'],
          chartType: 'area' as const
        };
      
      case 'vehicles':
        return {
          xAxisKey: 'data',
          yAxisKeys: ['atendidos', 'manutencoes', 'revisoes'],
          colors: ['#3b82f6', '#8b5cf6', '#10b981'],
          chartType: 'composed' as const
        };
      
      default:
        return {
          xAxisKey: 'data',
          yAxisKeys: [],
          colors: [],
          chartType: 'line' as const
        };
    }
  };

  const chartData = data.length > 0 ? data : generateMockData();
  const config = getChartConfig();

  const handleExport = () => {
    console.log(`Exportando gráfico ${type}:`, chartData);
    // Implementar exportação específica do gráfico
  };

  const handleRefresh = () => {
    console.log(`Atualizando dados do gráfico ${type}`);
    // Implementar atualização dos dados
  };

  return (
    <AdvancedChart
      title={title}
      data={chartData}
      type={config.chartType}
      xAxisKey={config.xAxisKey}
      yAxisKeys={config.yAxisKeys}
      colors={config.colors}
      height={300}
      period={period}
      onExport={handleExport}
      onRefresh={handleRefresh}
      showLegend={true}
      showGrid={true}
      showTooltip={true}
    />
  );
};