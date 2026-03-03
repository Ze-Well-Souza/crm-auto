import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wrench, Clock, CircleCheck as CheckCircle, DollarSign, Target, ChartBar as BarChart3, Play as PlayCircle, Pause as PauseCircle, FileText, Circle as XCircle } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import type { ServiceOrder } from "@/types";

interface ServiceOrderMetricsProps {
  serviceOrders: ServiceOrder[];
}

export const ServiceOrderMetrics = ({ serviceOrders }: ServiceOrderMetricsProps) => {
  const totalOrders = serviceOrders.length;
  
  const statusCounts = serviceOrders.reduce((acc, order) => {
    const status = order.status || 'pendente';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalRevenue = serviceOrders
    .filter(o => o.status === 'entregue' || o.status === 'concluido')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);
  
  const pendingRevenue = serviceOrders
    .filter(o => o.status === 'aprovado' || o.status === 'em_andamento')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const completedOrders = statusCounts['concluido'] || 0;
  const deliveredOrders = statusCounts['entregue'] || 0;
  const completionRate = totalOrders > 0 ? ((completedOrders + deliveredOrders) / totalOrders) * 100 : 0;
  
  const approvalRate = totalOrders > 0 ? 
    ((statusCounts['aprovado'] || 0) + (statusCounts['em_andamento'] || 0) + completedOrders + deliveredOrders) / totalOrders * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-300">
            <div className="p-2 rounded-lg bg-orange-500/20"><Wrench className="h-4 w-4 text-orange-400" /></div>
            Total de Ordens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{totalOrders}</div>
          <p className="text-xs text-slate-400">Todas as ordens</p>
        </CardContent>
      </Card>

      <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-300">
            <div className="p-2 rounded-lg bg-emerald-500/20"><DollarSign className="h-4 w-4 text-emerald-400" /></div>
            Receita Realizada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-400">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-slate-400">Ticket médio: {formatCurrency(avgOrderValue)}</p>
        </CardContent>
      </Card>

      <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-300">
            <div className="p-2 rounded-lg bg-yellow-500/20"><Clock className="h-4 w-4 text-yellow-400" /></div>
            Receita Pendente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-400">{formatCurrency(pendingRevenue)}</div>
          <p className="text-xs text-slate-400">Em andamento: {statusCounts['em_andamento'] || 0}</p>
        </CardContent>
      </Card>

      <Card className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-300">
            <div className="p-2 rounded-lg bg-purple-500/20"><Target className="h-4 w-4 text-purple-400" /></div>
            Taxa de Conclusão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-400">{Math.round(completionRate)}%</div>
          <p className="text-xs text-slate-400">{completedOrders + deliveredOrders} de {totalOrders} concluídas</p>
        </CardContent>
      </Card>

      <Card className="col-span-full bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-white">
            <BarChart3 className="h-5 w-5 text-purple-400" />
            Distribuição por Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { key: 'orcamento', label: 'Orçamento', icon: FileText, color: 'text-slate-400' },
              { key: 'aprovado', label: 'Aprovado', icon: CheckCircle, color: 'text-emerald-400' },
              { key: 'em_andamento', label: 'Em Andamento', icon: PlayCircle, color: 'text-blue-400' },
              { key: 'aguardando_pecas', label: 'Aguard. Peças', icon: PauseCircle, color: 'text-orange-400' },
              { key: 'concluido', label: 'Concluído', icon: CheckCircle, color: 'text-emerald-400' },
              { key: 'entregue', label: 'Entregue', icon: CheckCircle, color: 'text-emerald-400' },
              { key: 'cancelado', label: 'Cancelado', icon: XCircle, color: 'text-red-400' },
            ].map(({ key, label, icon: Icon, color }) => (
              <div key={key} className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Icon className={`h-4 w-4 ${color}`} />
                  <span className="font-semibold text-white">{statusCounts[key] || 0}</span>
                </div>
                <Badge className={`text-xs bg-${color.split('-')[1]}-500/20 text-${color.split('-')[1]}-300 border-0`}>{label}</Badge>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/10">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-300">
                <span>Taxa de Aprovação</span>
                <span className="font-semibold text-yellow-400">{Math.round(approvalRate)}%</span>
              </div>
              <Progress value={approvalRate} className="h-2 bg-white/10" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-300">
                <span>Taxa de Conclusão</span>
                <span className="font-semibold text-emerald-400">{Math.round(completionRate)}%</span>
              </div>
              <Progress value={completionRate} className="h-2 bg-white/10" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
