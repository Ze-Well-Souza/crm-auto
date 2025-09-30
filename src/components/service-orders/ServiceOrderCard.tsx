import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Wrench, Clock, DollarSign, User, Car, Calendar, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Play as PlayCircle, Pause as PauseCircle, FileText, Phone, MessageCircle, TrendingUp, Settings, Circle as XCircle } from "lucide-react";
import { ServiceOrderActions } from "./ServiceOrderActions";
import { ServiceOrderDashboard } from "./ServiceOrderDashboard";
import { ServiceOrderQuickActions } from "./ServiceOrderQuickActions";
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
  
  // Mock data for demonstration - in real app would come from database
  const orderMetrics = {
    profitMargin: Math.random() * 40 + 20, // 20-60%
    timeSpent: Math.floor(Math.random() * 480) + 60, // 60-540 minutes
    estimatedTime: Math.floor(Math.random() * 360) + 120, // 120-480 minutes
    approvalTime: Math.floor(Math.random() * 48) + 1, // 1-48 hours
    customerSatisfaction: Math.floor(Math.random() * 30) + 70, // 70-100%
    complexity: Math.random() > 0.7 ? 'alta' : Math.random() > 0.4 ? 'media' : 'baixa'
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
        className="hover:shadow-elevated transition-smooth cursor-pointer group relative overflow-hidden"
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
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                  {getOrderIcon()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {serviceOrder.order_number}
                  <Badge variant={statusConfig.variant} className="flex items-center gap-1">
                    <StatusIcon className={cn("h-3 w-3", statusConfig.color)} />
                    {statusConfig.label}
                  </Badge>
                </CardTitle>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
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
            <div className="bg-muted/30 p-3 rounded-md">
              <p className="text-sm line-clamp-2">{serviceOrder.description}</p>
            </div>
          )}

          {/* Financial Information */}
          <div className="grid grid-cols-2 gap-3">
            {serviceOrder.total_labor && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Wrench className="h-3 w-3 text-primary" />
                  <span className="text-xs font-semibold">
                    {formatCurrency(serviceOrder.total_labor)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Mão de obra</p>
              </div>
            )}
            
            {serviceOrder.total_parts && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Settings className="h-3 w-3 text-info" />
                  <span className="text-xs font-semibold">
                    {formatCurrency(serviceOrder.total_parts)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Peças</p>
              </div>
            )}
          </div>

          {/* Total Amount */}
          {serviceOrder.total_amount && (
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm font-medium">Total:</span>
              <span className="text-lg font-bold text-success">
                {formatCurrency(serviceOrder.total_amount)}
              </span>
            </div>
          )}

          {/* Performance Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t text-xs">
            <div className="text-center">
              <div className={cn("font-semibold", getComplexityColor(orderMetrics.complexity))}>
                {orderMetrics.complexity.toUpperCase()}
              </div>
              <p className="text-muted-foreground">Complexidade</p>
            </div>
            
            <div className="text-center">
              <div className="font-semibold text-info">
                {Math.round(orderMetrics.profitMargin)}%
              </div>
              <p className="text-muted-foreground">Margem</p>
            </div>
            
            <div className="text-center">
              <div className="font-semibold text-warning">
                {Math.round(orderMetrics.timeSpent / 60)}h
              </div>
              <p className="text-muted-foreground">Tempo</p>
            </div>
          </div>

          {/* Overdue Alert */}
          {isOverdue() && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
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