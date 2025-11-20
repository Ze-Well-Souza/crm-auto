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
      <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-yellow-500/20 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-300">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <Clock className="h-4 w-4 text-yellow-400" />
            </div>
            Receita Pendente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-400">
            {formatCurrency(pendingRevenue)}
          </div>
          <p className="text-xs text-slate-400">
            Em andamento: {statusCounts['em_andamento'] || 0}
          </p>
        </CardContent>
      </Card>

      {/* Performance Score */}
      <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-300">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Target className="h-4 w-4 text-purple-400" />
            </div>
            Taxa de Conclusão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-400">
            {Math.round(completionRate)}%
          </div>
          <p className="text-xs text-slate-400">
            {completedOrders + deliveredOrders} de {totalOrders} concluídas
          </p>
        </CardContent>
      </Card>

      {/* Status Distribution - Full Width */}
      <Card className="col-span-full bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-white">
            <BarChart3 className="h-5 w-5 text-purple-400" />
            Distribuição por Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="font-semibold text-white">{statusCounts['orcamento'] || 0}</span>
              </div>
              <Badge className="text-xs bg-slate-500/20 text-slate-300 border-0">Orçamento</Badge>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="font-semibold text-white">{statusCounts['aprovado'] || 0}</span>
              </div>
              <Badge className="text-xs bg-emerald-500/20 text-emerald-300 border-0">Aprovado</Badge>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <PlayCircle className="h-4 w-4 text-blue-400" />
                <span className="font-semibold text-white">{statusCounts['em_andamento'] || 0}</span>
              </div>
              <Badge className="text-xs bg-blue-500/20 text-blue-300 border-0">Em Andamento</Badge>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <PauseCircle className="h-4 w-4 text-orange-400" />
                <span className="font-semibold text-white">{statusCounts['aguardando_pecas'] || 0}</span>
              </div>
              <Badge className="text-xs bg-orange-500/20 text-orange-300 border-0">Aguard. Peças</Badge>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="font-semibold text-white">{statusCounts['concluido'] || 0}</span>
              </div>
              <Badge className="text-xs bg-emerald-500/20 text-emerald-300 border-0">Concluído</Badge>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="font-semibold text-white">{statusCounts['entregue'] || 0}</span>
              </div>
              <Badge className="text-xs bg-emerald-500/20 text-emerald-300 border-0">Entregue</Badge>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <XCircle className="h-4 w-4 text-red-400" />
                <span className="font-semibold text-white">{statusCounts['cancelado'] || 0}</span>
              </div>
              <Badge className="text-xs bg-red-500/20 text-red-300 border-0">Cancelado</Badge>
            </div>
          </div>

          {/* Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-300">
                <span>Taxa de Aprovação</span>
                <span className="font-semibold text-yellow-400">{Math.round(approvalRate)}%</span>
              </div>
              <Progress value={approvalRate} className="h-2 bg-white/10" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-300">
                <span>Entrega no Prazo</span>
                <span className="font-semibold text-emerald-400">{onTimeDelivery}%</span>
              </div>
              <Progress value={onTimeDelivery} className="h-2 bg-white/10" />
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{avgCompletionTime} dias</div>
              <p className="text-xs text-slate-400">Tempo médio de conclusão</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};