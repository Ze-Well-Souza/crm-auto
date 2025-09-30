import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { BaseChart } from './BaseChart';
import { DollarSign, TrendingUp, PieChart } from 'lucide-react';

interface FinancialData {
  month: string;
  receita: number;
  despesa: number;
  lucro: number;
  meta: number;
}

interface CashFlowData {
  day: string;
  entrada: number;
  saida: number;
  saldo: number;
}

interface FinancialChartProps {
  revenueData?: FinancialData[];
  cashFlowData?: CashFlowData[];
  loading?: boolean;
  error?: string;
}

const defaultRevenueData: FinancialData[] = [
  { month: 'Jan', receita: 45000, despesa: 32000, lucro: 13000, meta: 15000 },
  { month: 'Fev', receita: 52000, despesa: 35000, lucro: 17000, meta: 15000 },
  { month: 'Mar', receita: 48000, despesa: 33000, lucro: 15000, meta: 15000 },
  { month: 'Abr', receita: 61000, despesa: 38000, lucro: 23000, meta: 15000 },
  { month: 'Mai', receita: 55000, despesa: 36000, lucro: 19000, meta: 15000 },
  { month: 'Jun', receita: 67000, despesa: 41000, lucro: 26000, meta: 15000 },
];

const defaultCashFlowData: CashFlowData[] = [
  { day: '01', entrada: 2500, saida: 1800, saldo: 700 },
  { day: '02', entrada: 3200, saida: 2100, saldo: 1100 },
  { day: '03', entrada: 1800, saida: 1500, saldo: 300 },
  { day: '04', entrada: 4100, saida: 2800, saldo: 1300 },
  { day: '05', entrada: 2900, saida: 2200, saldo: 700 },
  { day: '06', entrada: 3500, saida: 1900, saldo: 1600 },
  { day: '07', entrada: 2200, saida: 1600, saldo: 600 },
];

export const FinancialChart: React.FC<FinancialChartProps> = ({
  revenueData = defaultRevenueData,
  cashFlowData = defaultCashFlowData,
  loading = false,
  error
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CashFlowTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`Dia ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey === 'entrada' ? 'Entrada' : entry.dataKey === 'saida' ? 'Saída' : 'Saldo'}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Gráfico de Receita vs Meta */}
      <BaseChart
        title="Receita vs Meta"
        description="Comparativo mensal de receita realizada vs meta estabelecida"
        icon={TrendingUp}
        loading={loading}
        error={error}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="receita" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              name="Receita"
            />
            <Line 
              type="monotone" 
              dataKey="meta" 
              stroke="#F59E0B" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
              name="Meta"
            />
          </LineChart>
        </ResponsiveContainer>
      </BaseChart>

      {/* Gráfico de Fluxo de Caixa */}
      <BaseChart
        title="Fluxo de Caixa Semanal"
        description="Entradas, saídas e saldo diário"
        icon={DollarSign}
        loading={loading}
        error={error}
      >
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={cashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CashFlowTooltip />} />
            <Area 
              type="monotone" 
              dataKey="entrada" 
              stackId="1"
              stroke="#10B981" 
              fill="#10B981"
              fillOpacity={0.6}
              name="Entrada"
            />
            <Area 
              type="monotone" 
              dataKey="saida" 
              stackId="2"
              stroke="#EF4444" 
              fill="#EF4444"
              fillOpacity={0.6}
              name="Saída"
            />
          </AreaChart>
        </ResponsiveContainer>
      </BaseChart>

      {/* Gráfico de Lucro Mensal */}
      <div className="xl:col-span-2">
        <BaseChart
          title="Análise de Lucro Mensal"
          description="Receita, despesa e lucro líquido por mês"
          icon={PieChart}
          loading={loading}
          error={error}
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="receita" fill="#10B981" name="Receita" radius={[2, 2, 0, 0]} />
              <Bar dataKey="despesa" fill="#EF4444" name="Despesa" radius={[2, 2, 0, 0]} />
              <Bar dataKey="lucro" fill="#3B82F6" name="Lucro" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </BaseChart>
      </div>
    </div>
  );
};