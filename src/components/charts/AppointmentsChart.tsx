import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BaseChart } from './BaseChart';
import { Calendar, TrendingUp } from 'lucide-react';

interface AppointmentData {
  month: string;
  agendados: number;
  realizados: number;
  cancelados: number;
}

interface StatusData {
  name: string;
  value: number;
  color: string;
}

interface AppointmentsChartProps {
  data?: AppointmentData[];
  statusData?: StatusData[];
  loading?: boolean;
  error?: string;
}

const defaultData: AppointmentData[] = [
  { month: 'Jan', agendados: 45, realizados: 38, cancelados: 7 },
  { month: 'Fev', agendados: 52, realizados: 47, cancelados: 5 },
  { month: 'Mar', agendados: 48, realizados: 42, cancelados: 6 },
  { month: 'Abr', agendados: 61, realizados: 55, cancelados: 6 },
  { month: 'Mai', agendados: 55, realizados: 49, cancelados: 6 },
  { month: 'Jun', agendados: 67, realizados: 61, cancelados: 6 },
];

const defaultStatusData: StatusData[] = [
  { name: 'Realizados', value: 292, color: '#10B981' },
  { name: 'Agendados', value: 45, color: '#3B82F6' },
  { name: 'Cancelados', value: 36, color: '#EF4444' },
];

export const AppointmentsChart: React.FC<AppointmentsChartProps> = ({
  data = defaultData,
  statusData = defaultStatusData,
  loading = false,
  error
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">{`${data.value} agendamentos`}</p>
          <p className="text-sm text-gray-600">{`${((data.value / statusData.reduce((acc, item) => acc + item.value, 0)) * 100).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Barras - Tendência Mensal */}
      <BaseChart
        title="Tendência de Agendamentos"
        description="Comparativo mensal de agendamentos realizados vs cancelados"
        icon={TrendingUp}
        loading={loading}
        error={error}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="realizados" fill="#10B981" name="Realizados" radius={[2, 2, 0, 0]} />
            <Bar dataKey="agendados" fill="#3B82F6" name="Agendados" radius={[2, 2, 0, 0]} />
            <Bar dataKey="cancelados" fill="#EF4444" name="Cancelados" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </BaseChart>

      {/* Gráfico de Pizza - Status dos Agendamentos */}
      <BaseChart
        title="Status dos Agendamentos"
        description="Distribuição atual por status"
        icon={Calendar}
        loading={loading}
        error={error}
      >
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Legenda personalizada */}
        <div className="flex justify-center mt-4 space-x-6">
          {statusData.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">
                {entry.name} ({entry.value})
              </span>
            </div>
          ))}
        </div>
      </BaseChart>
    </div>
  );
};