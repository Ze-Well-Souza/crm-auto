import React, { useState } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon,
  TrendingUp,
  Download,
  Maximize2,
  Settings,
  RefreshCw
} from "lucide-react";

export type ChartType = 'line' | 'area' | 'bar' | 'pie' | 'composed';

export interface ChartData {
  [key: string]: any;
}

interface AdvancedChartProps {
  title: string;
  data: ChartData[];
  type?: ChartType;
  xAxisKey: string;
  yAxisKeys: string[];
  colors?: string[];
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  period?: string;
  onExport?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const DEFAULT_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

export const AdvancedChart: React.FC<AdvancedChartProps> = ({
  title,
  data,
  type = 'line',
  xAxisKey,
  yAxisKeys,
  colors = DEFAULT_COLORS,
  height = 300,
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  period,
  onExport,
  onRefresh,
  isLoading = false
}) => {
  const [chartType, setChartType] = useState<ChartType>(type);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const formatTooltipValue = (value: any, name: string) => {
    if (typeof value === 'number') {
      if (name.toLowerCase().includes('valor') || name.toLowerCase().includes('receita') || name.toLowerCase().includes('despesa')) {
        return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      }
      if (name.toLowerCase().includes('percentual') || name.toLowerCase().includes('taxa')) {
        return `${value.toFixed(1)}%`;
      }
      return value.toLocaleString('pt-BR');
    }
    return value;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl p-4 animate-fade-in">
          <p className="font-semibold text-foreground mb-3 text-sm border-b border-border pb-2">{label}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm font-medium text-muted-foreground">{entry.name}:</span>
                </div>
                <span className="text-sm font-bold" style={{ color: entry.color }}>
                  {formatTooltipValue(entry.value, entry.name)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <defs>
              {yAxisKeys.map((key, index) => (
                <linearGradient key={`gradient-${key}`} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0.1}/>
                </linearGradient>
              ))}
            </defs>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />}
            <XAxis 
              dataKey={xAxisKey} 
              className="text-xs" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              className="text-xs" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            {yAxisKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={3}
                dot={{ 
                  r: 5, 
                  fill: colors[index % colors.length],
                  strokeWidth: 2,
                  stroke: '#fff'
                }}
                activeDot={{ 
                  r: 8, 
                  fill: colors[index % colors.length],
                  strokeWidth: 3,
                  stroke: '#fff',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }}
                animationDuration={1500}
                animationBegin={index * 200}
              />
            ))}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              {yAxisKeys.map((key, index) => (
                <linearGradient key={`area-gradient-${key}`} id={`area-gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.9}/>
                  <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0.1}/>
                </linearGradient>
              ))}
            </defs>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />}
            <XAxis 
              dataKey={xAxisKey} 
              className="text-xs" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              className="text-xs" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            {yAxisKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stackId="1"
                stroke={colors[index % colors.length]}
                fill={`url(#area-gradient-${key})`}
                strokeWidth={2}
                animationDuration={1500}
                animationBegin={index * 200}
              />
            ))}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <defs>
              {yAxisKeys.map((key, index) => (
                <linearGradient key={`bar-gradient-${key}`} id={`bar-gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors[index % colors.length]} stopOpacity={1}/>
                  <stop offset="100%" stopColor={colors[index % colors.length]} stopOpacity={0.7}/>
                </linearGradient>
              ))}
            </defs>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />}
            <XAxis 
              dataKey={xAxisKey} 
              className="text-xs" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              className="text-xs" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            {yAxisKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={`url(#bar-gradient-${key})`}
                radius={[6, 6, 0, 0]}
                animationDuration={1500}
                animationBegin={index * 200}
              />
            ))}
          </BarChart>
        );

      case 'pie':
        const pieData = data.map((item, index) => ({
          name: item[xAxisKey],
          value: item[yAxisKeys[0]],
          fill: colors[index % colors.length]
        }));

        return (
          <PieChart>
            <defs>
              {pieData.map((entry, index) => (
                <radialGradient key={`pie-gradient-${index}`} id={`pie-gradient-${index}`}>
                  <stop offset="0%" stopColor={entry.fill} stopOpacity={1}/>
                  <stop offset="100%" stopColor={entry.fill} stopOpacity={0.8}/>
                </radialGradient>
              ))}
            </defs>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              innerRadius={30}
              fill="#8884d8"
              dataKey="value"
              animationDuration={1500}
              animationBegin={0}
            >
              {pieData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#pie-gradient-${index})`}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
          </PieChart>
        );

      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
            <XAxis dataKey={xAxisKey} className="text-xs" />
            <YAxis className="text-xs" />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            {yAxisKeys.map((key, index) => {
              if (index % 2 === 0) {
                return (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={colors[index % colors.length]}
                    radius={[2, 2, 0, 0]}
                  />
                );
              } else {
                return (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                  />
                );
              }
            })}
          </ComposedChart>
        );

      default:
        return null;
    }
  };

  const chartTypeOptions = [
    { value: 'line', label: 'Linha', icon: LineChartIcon },
    { value: 'area', label: 'Área', icon: TrendingUp },
    { value: 'bar', label: 'Barras', icon: BarChart3 },
    { value: 'pie', label: 'Pizza', icon: PieChartIcon },
    { value: 'composed', label: 'Combinado', icon: BarChart3 }
  ];

  return (
    <Card className={`bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-purple/5 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-gradient-primary">
            {title}
            {period && (
              <Badge variant="outline" className="text-xs bg-white/50 border-primary/20">
                {period}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
              <SelectTrigger className="w-32 bg-white/50 border-white/20 backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-white/20">
                {chartTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {onRefresh && (
              <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isLoading} className="hover:bg-white/20">
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            )}
            
            <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)} className="hover:bg-white/20">
              <Maximize2 className="h-4 w-4" />
            </Button>
            
            {onExport && (
              <Button variant="ghost" size="sm" onClick={onExport} className="hover:bg-white/20">
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center animate-fade-in" style={{ height }}>
            <div className="text-center">
              <div className="relative">
                <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-primary/20 animate-pulse mx-auto"></div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">Carregando dados...</p>
              <div className="mt-2 flex justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center animate-fade-in" style={{ height }}>
            <div className="text-center">
              <div className="relative mb-4">
                <BarChart3 className="h-16 w-16 text-muted-foreground/50 mx-auto" />
                <div className="absolute inset-0 h-16 w-16 rounded-full bg-gradient-to-r from-primary/10 to-purple/10 animate-pulse mx-auto"></div>
              </div>
              <p className="text-lg font-semibold text-muted-foreground mb-2">Nenhum dado disponível</p>
              <p className="text-sm text-muted-foreground/70">Os dados serão exibidos aqui quando estiverem disponíveis</p>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <ResponsiveContainer width="100%" height={isFullscreen ? '80vh' : height}>
              {renderChart()}
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};