import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wrench, Clock, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, DollarSign, TrendingUp, Play as PlayCircle, Pause as PauseCircle, FileText, Target, ChartBar as BarChart3, Circle as XCircle } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import type { ServiceOrder } from "@/types";

interface ServiceOrderMetricsProps {
  serviceOrders: ServiceOrder[];
}

export const ServiceOrderMetrics = ({ serviceOrders }: ServiceOrderMetricsProps) => {
  const totalOrders = serviceOrders.length;
  
  // Status distribution
  const statusCounts = serviceOrders.reduce((acc, order) => {
    const status = order.status || 'pendente';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Financial metrics
  const totalRevenue = serviceOrders
    .filter(o => o.status === 'entregue' || o.status === 'concluido')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);
  
  const pendingRevenue = serviceOrders
    .filter(o => o.status === 'aprovado' || o.status === 'em_andamento')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Performance metrics
  const completedOrders = statusCounts['concluido'] || 0;
  const deliveredOrders = statusCounts['entregue'] || 0;
  const completionRate = totalOrders > 0 ? ((completedOrders + deliveredOrders) / totalOrders) * 100 : 0;
  
  const approvalRate = totalOrders > 0 ? 
    ((statusCounts['aprovado'] || 0) + (statusCounts['em_andamento'] || 0) + completedOrders + deliveredOrders) / totalOrders * 100 : 0;

  // Time-based metrics (mock data)
  const avgCompletionTime = Math.floor(Math.random() * 5) + 2; // 2-7 days
  const onTimeDelivery = Math.floor(Math.random() * 30) + 70; // 70-100%

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Orders - Landing Page Style */}
      <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-300">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <Wrench className="h-4 w-4 text-orange-400" />
            </div>
            Total de Ordens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{totalOrders}</div>
          <p className="text-xs text-slate-400">Todas as ordens</p>
        </CardContent>
      </Card>

      {/* Revenue Metrics - Landing Page Style */}
      <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-300">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            Receita Realizada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-400">
            {formatCurrency(totalRevenue)}
          </div>
          <p className="text-xs text-slate-400">
            Ticket médio: {formatCurrency(avgOrderValue)}
          </p>
        </CardContent>
      </Card>

      {/* Pending Revenue - Landing Page Style */}
      <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-warning" />
            Receita Pendente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">
            {formatCurrency(pendingRevenue)}
          </div>
          <p className="text-xs text-muted-foreground">
            Em andamento: {statusCounts['em_andamento'] || 0}
          </p>
        </CardContent>
      </Card>

      {/* Performance Score */}
      <Card className="gradient-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4 text-info" />
            Taxa de Conclusão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-info">
            {Math.round(completionRate)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {completedOrders + deliveredOrders} de {totalOrders} concluídas
          </p>
        </CardContent>
      </Card>

      {/* Status Distribution - Full Width */}
      <Card className="col-span-full gradient-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Distribuição por Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{statusCounts['orcamento'] || 0}</span>
              </div>
              <Badge variant="outline" className="text-xs">Orçamento</Badge>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="font-semibold">{statusCounts['aprovado'] || 0}</span>
              </div>
              <Badge variant="secondary" className="text-xs">Aprovado</Badge>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <PlayCircle className="h-4 w-4 text-info" />
                <span className="font-semibold">{statusCounts['em_andamento'] || 0}</span>
              </div>
              <Badge variant="secondary" className="text-xs">Em Andamento</Badge>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <PauseCircle className="h-4 w-4 text-warning" />
                <span className="font-semibold">{statusCounts['aguardando_pecas'] || 0}</span>
              </div>
              <Badge variant="secondary" className="text-xs">Aguard. Peças</Badge>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="font-semibold">{statusCounts['concluido'] || 0}</span>
              </div>
              <Badge variant="default" className="text-xs">Concluído</Badge>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="font-semibold">{statusCounts['entregue'] || 0}</span>
              </div>
              <Badge variant="default" className="text-xs">Entregue</Badge>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="font-semibold">{statusCounts['cancelado'] || 0}</span>
              </div>
              <Badge variant="destructive" className="text-xs">Cancelado</Badge>
            </div>
          </div>

          {/* Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Taxa de Aprovação</span>
                <span className="font-semibold">{Math.round(approvalRate)}%</span>
              </div>
              <Progress value={approvalRate} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Entrega no Prazo</span>
                <span className="font-semibold">{onTimeDelivery}%</span>
              </div>
              <Progress value={onTimeDelivery} className="h-2" />
            </div>
            
            <div className="text-center">
              <div className="text-lg font-bold text-info">{avgCompletionTime} dias</div>
              <p className="text-xs text-muted-foreground">Tempo médio de conclusão</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};