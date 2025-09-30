import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign, 
  Package, 
  Clock,
  Target,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface MetricData {
  title: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  target?: number;
  progress?: number;
  icon: React.ElementType;
  description?: string;
  status?: 'success' | 'warning' | 'danger' | 'info';
}

interface AdvancedMetricsProps {
  metrics?: MetricData[];
  loading?: boolean;
}

const defaultMetrics: MetricData[] = [
  {
    title: "Receita Mensal",
    value: "R$ 67.500",
    change: 12.5,
    changeType: 'increase',
    target: 70000,
    progress: 96.4,
    icon: DollarSign,
    description: "Meta: R$ 70.000",
    status: 'success'
  },
  {
    title: "Novos Clientes",
    value: 23,
    change: -8.2,
    changeType: 'decrease',
    target: 30,
    progress: 76.7,
    icon: Users,
    description: "Meta: 30 clientes",
    status: 'warning'
  },
  {
    title: "Agendamentos",
    value: 156,
    change: 15.3,
    changeType: 'increase',
    target: 180,
    progress: 86.7,
    icon: Calendar,
    description: "Meta: 180 agendamentos",
    status: 'success'
  },
  {
    title: "Taxa de Conversão",
    value: "68.5%",
    change: 5.2,
    changeType: 'increase',
    icon: Target,
    description: "Agendamentos → Vendas",
    status: 'success'
  },
  {
    title: "Estoque Baixo",
    value: 12,
    change: 3,
    changeType: 'increase',
    icon: Package,
    description: "Itens abaixo do mínimo",
    status: 'danger'
  },
  {
    title: "Tempo Médio Atendimento",
    value: "45min",
    change: -12.8,
    changeType: 'decrease',
    icon: Clock,
    description: "Redução no tempo",
    status: 'success'
  }
];

export const AdvancedMetrics: React.FC<AdvancedMetricsProps> = ({
  metrics = defaultMetrics,
  loading = false
}) => {
  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'danger':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'danger':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card 
            key={index} 
            className={`transition-all duration-200 hover:shadow-lg ${getStatusColor(metric.status)}`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.title}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(metric.status)}
                  <Icon className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Valor Principal */}
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </span>
                  <div className={`flex items-center space-x-1 ${getChangeColor(metric.changeType)}`}>
                    {getChangeIcon(metric.changeType)}
                    <span className="text-sm font-medium">
                      {Math.abs(metric.change)}%
                    </span>
                  </div>
                </div>

                {/* Progresso (se disponível) */}
                {metric.progress !== undefined && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Progresso</span>
                      <span>{metric.progress.toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={metric.progress} 
                      className="h-2"
                    />
                  </div>
                )}

                {/* Descrição */}
                {metric.description && (
                  <CardDescription className="text-xs">
                    {metric.description}
                  </CardDescription>
                )}

                {/* Badge de Status */}
                {metric.status && (
                  <div className="flex justify-end">
                    <Badge 
                      variant={
                        metric.status === 'success' ? 'default' :
                        metric.status === 'warning' ? 'secondary' :
                        metric.status === 'danger' ? 'destructive' : 'outline'
                      }
                      className="text-xs"
                    >
                      {metric.status === 'success' ? 'No alvo' :
                       metric.status === 'warning' ? 'Atenção' :
                       metric.status === 'danger' ? 'Crítico' : 'Normal'}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};