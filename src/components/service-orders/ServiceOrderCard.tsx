import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Wrench, Clock, DollarSign, User, Car, Calendar, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Play as PlayCircle, Pause as PauseCircle, FileText, Phone, MessageCircle, TrendingUp, Settings, Circle as XCircle } from "lucide-react";
import { ServiceOrderActions } from "./ServiceOrderActions";
import { ServiceOrderDashboard } from "./ServiceOrderDashboard";
import { ServiceOrderQuickActions } from "./ServiceOrderQuickActions";
import { useServiceOrderMetrics } from "@/hooks/useServiceOrderMetrics";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { StatusBadge } from "@/components/common/StatusBadge";
import { cn } from "@/lib/utils";
import type { ServiceOrder } from "@/types";

interface ServiceOrderCardProps {
  serviceOrder: ServiceOrder;
  onUpdate: () => void;
  onQuickAction?: (action: string, order: ServiceOrder) => void;
}

export const ServiceOrderCard = ({ serviceOrder, onUpdate, onQuickAction }: ServiceOrderCardProps) => {
  const [showDashboard, setShowDashboard] = useState(false);
  const { metrics, loading: metricsLoading } = useServiceOrderMetrics(serviceOrder.id);
  
  // Usar métricas reais ou valores padrão durante carregamento
  const orderMetrics = metrics || {
    profitMargin: 0,
    timeSpent: null,
    estimatedTime: null,
    approvalTime: null,
    complexity: 'media' as const
  };

  const getStatusConfig = (status: string | null) => {
    switch (status) {
      case 'orcamento':
        return { 
          variant: 'outline' as const, 
          label: 'Orçamento', 
          icon: FileText,
          color: 'text-muted-foreground',
          bgColor: 'from-gray-400/10 to-gray-500/5'
        };
      case 'aprovado':
        return { 
          variant: 'default' as const, 
          label: 'Aprovado', 
          icon: CheckCircle,
          color: 'text-success',
          bgColor: 'from-green-400/10 to-emerald-500/5'
        };
      case 'em_andamento':
        return { 
          variant: 'secondary' as const, 
          label: 'Em Andamento', 
          icon: PlayCircle,
          color: 'text-info',
          bgColor: 'from-blue-400/10 to-cyan-500/5'
        };
      case 'aguardando_pecas':
        return { 
          variant: 'secondary' as const, 
          label: 'Aguardando Peças', 
          icon: PauseCircle,
          color: 'text-warning',
          bgColor: 'from-yellow-400/10 to-orange-500/5'
        };
      case 'concluido':
        return { 
          variant: 'default' as const, 
          label: 'Concluído', 
          icon: CheckCircle,
          color: 'text-success',
          bgColor: 'from-green-400/10 to-emerald-500/5'
        };
      case 'entregue':
        return { 
          variant: 'default' as const, 
          label: 'Entregue', 
          icon: CheckCircle,
          color: 'text-success',
          bgColor: 'from-emerald-400/10 to-green-500/5'
        };
      case 'cancelado':
        return { 
          variant: 'destructive' as const, 
          label: 'Cancelado', 
          icon: AlertTriangle,
          color: 'text-destructive',
          bgColor: 'from-red-400/10 to-red-500/5'
        };
      default:
        return { 
          variant: 'outline' as const, 
          label: 'Pendente', 
          icon: Clock,
          color: 'text-muted-foreground',
          bgColor: 'from-gray-400/10 to-gray-500/5'
        };
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'alta': return 'text-destructive';
      case 'media': return 'text-warning';
      case 'baixa': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getOrderIcon = () => {
    return serviceOrder.order_number?.slice(-2) || 'OS';
  };

  const statusConfig = getStatusConfig(serviceOrder.status);
  const StatusIcon = statusConfig.icon;

  const handleQuickAction = (action: string) => {
    onQuickAction?.(action, serviceOrder);
  };

  const handleCardClick = () => {
    setShowDashboard(true);
  };

  const isOverdue = () => {
    // Mock logic - in real app would check against estimated completion date
    return serviceOrder.status === 'em_andamento' && Math.random() > 0.7;
  };

  return (
    <>
      <Card
        className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer group relative overflow-hidden"
        onClick={handleCardClick}
      >
        {/* Background gradient based on status */}
        <div className={cn(
          "absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10 bg-gradient-to-br",
          statusConfig.bgColor
        )} />

        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-purple-500/30 bg-purple-500/10">
                <AvatarFallback className="bg-purple-500/20 text-purple-300 font-semibold text-xs">
                  {getOrderIcon()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  {serviceOrder.order_number}
                  <Badge
                    variant={statusConfig.variant}
                    className={cn(
                      "flex items-center gap-1",
                      serviceOrder.status === 'concluido' && "bg-emerald-500/20 text-emerald-300 border-0",
                      serviceOrder.status === 'em_andamento' && "bg-blue-500/20 text-blue-300 border-0",
                      serviceOrder.status === 'orcamento' && "bg-slate-500/20 text-slate-300 border-0",
                      serviceOrder.status === 'aguardando_pecas' && "bg-orange-500/20 text-orange-300 border-0",
                      serviceOrder.status === 'cancelado' && "bg-red-500/20 text-red-300 border-0"
                    )}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig.label}
                  </Badge>
                </CardTitle>
                <div className="text-sm text-slate-400 flex items-center gap-2">
                  {serviceOrder.clients?.name}
                  {serviceOrder.vehicles && (
                    <>
                      <span>•</span>
                      <span>{serviceOrder.vehicles.brand} {serviceOrder.vehicles.model}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <ServiceOrderActions serviceOrder={serviceOrder} onUpdate={onUpdate} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10">
          {/* Service Description */}
          {serviceOrder.description && (
            <div className="bg-white/5 p-3 rounded-md border border-white/10">
              <p className="text-sm line-clamp-2 text-slate-300">{serviceOrder.description}</p>
            </div>
          )}

          {/* Financial Information */}
          <div className="grid grid-cols-2 gap-3">
            {serviceOrder.total_labor && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Wrench className="h-3 w-3 text-purple-400" />
                  <span className="text-xs font-semibold text-white">
                    {formatCurrency(serviceOrder.total_labor)}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Mão de obra</p>
              </div>
            )}

            {serviceOrder.total_parts && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Settings className="h-3 w-3 text-blue-400" />
                  <span className="text-xs font-semibold text-white">
                    {formatCurrency(serviceOrder.total_parts)}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Peças</p>
              </div>
            )}
          </div>

          {/* Total Amount */}
          {serviceOrder.total_amount && (
            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <span className="text-sm font-medium text-slate-300">Total:</span>
              <span className="text-lg font-bold text-emerald-400">
                {formatCurrency(serviceOrder.total_amount)}
              </span>
            </div>
          )}

          {/* Performance Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-xs">
            <div className="text-center">
              <div className={cn(
                "font-semibold",
                orderMetrics.complexity === 'alta' && "text-red-400",
                orderMetrics.complexity === 'media' && "text-orange-400",
                orderMetrics.complexity === 'baixa' && "text-emerald-400"
              )}>
                {orderMetrics.complexity.toUpperCase()}
              </div>
              <p className="text-slate-400">Complexidade</p>
            </div>

            <div className="text-center">
              <div className="font-semibold text-blue-400">
                {Math.round(orderMetrics.profitMargin)}%
              </div>
              <p className="text-slate-400">Margem</p>
            </div>

            <div className="text-center">
              <div className="font-semibold text-orange-400">
                {Math.round(orderMetrics.timeSpent / 60)}h
              </div>
              <p className="text-slate-400">Tempo</p>
            </div>
          </div>

          {/* Overdue Alert */}
          {isOverdue() && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-md p-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span className="text-sm font-medium text-destructive">Atrasada</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Prazo estimado ultrapassado
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ServiceOrderQuickActions 
              serviceOrder={serviceOrder}
              onStatusChange={() => handleQuickAction('status-change')}
              onContactClient={() => handleQuickAction('contact')}
              onViewDetails={() => handleQuickAction('details')}
            />
          </div>

          {/* Creation Date */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Criada em {formatDate(serviceOrder.created_at)}</span>
            </div>
            {serviceOrder.mechanic_id && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>Mecânico: {serviceOrder.mechanic_id}</span>
              </div>
            )}
          </div>

          {serviceOrder.notes && (
            <div className="mt-3 p-2 bg-muted/50 rounded-md">
              <p className="text-xs text-muted-foreground line-clamp-2">
                {serviceOrder.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service Order Dashboard Modal */}
      <ServiceOrderDashboard
        serviceOrder={serviceOrder}
        open={showDashboard}
        onOpenChange={setShowDashboard}
      />
    </>
  );
};