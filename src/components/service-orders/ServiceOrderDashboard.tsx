import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Wrench, DollarSign, Clock, User, Car, Phone, Mail, Calendar, TrendingUp, Settings, FileText, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, ChartBar as BarChart3, Target } from "lucide-react";
import { ServiceOrderTimeline } from "./ServiceOrderTimeline";
import { ServiceOrderQuickActions } from "./ServiceOrderQuickActions";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { ServiceOrder } from "@/types";

interface ServiceOrderDashboardProps {
  serviceOrder: ServiceOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ServiceOrderDashboard = ({ serviceOrder, open, onOpenChange }: ServiceOrderDashboardProps) => {
  if (!serviceOrder) return null;

  // Mock metrics for demonstration
  const orderStats = {
    profitMargin: Math.random() * 40 + 20, // 20-60%
    timeSpent: Math.floor(Math.random() * 480) + 60, // 60-540 minutes
    estimatedTime: Math.floor(Math.random() * 360) + 120, // 120-480 minutes
    partsCount: Math.floor(Math.random() * 10) + 1,
    laborHours: Math.random() * 8 + 1,
    efficiency: Math.floor(Math.random() * 40) + 60, // 60-100%
    customerSatisfaction: Math.floor(Math.random() * 30) + 70, // 70-100%
    reworkNeeded: Math.random() > 0.8,
    onTimeCompletion: Math.random() > 0.3
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'text-success';
    if (efficiency >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getProfitMarginColor = (margin: number) => {
    if (margin >= 30) return 'text-success';
    if (margin >= 20) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span>{serviceOrder.order_number}</span>
                  <StatusBadge status={serviceOrder.status} type="service-order" />
                </div>
                <p className="text-sm text-muted-foreground font-normal">
                  Criada em {formatDate(serviceOrder.created_at)}
                </p>
              </div>
            </DialogTitle>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="pt-4">
                  <DollarSign className="h-6 w-6 text-success mx-auto mb-2" />
                  <div className="text-lg font-bold text-success">
                    {formatCurrency(serviceOrder.total_amount || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Valor Total</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-4">
                  <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className={`text-lg font-bold ${getProfitMarginColor(orderStats.profitMargin)}`}>
                    {Math.round(orderStats.profitMargin)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Margem</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-4">
                  <Clock className="h-6 w-6 text-info mx-auto mb-2" />
                  <div className="text-lg font-bold text-info">
                    {Math.round(orderStats.timeSpent / 60)}h
                  </div>
                  <p className="text-xs text-muted-foreground">Tempo Gasto</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-4">
                  <Target className="h-6 w-6 text-warning mx-auto mb-2" />
                  <div className={`text-lg font-bold ${getEfficiencyColor(orderStats.efficiency)}`}>
                    {orderStats.efficiency}%
                  </div>
                  <p className="text-xs text-muted-foreground">Eficiência</p>
                </CardContent>
              </Card>
            </div>

            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalhes do Serviço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Cliente:</span>
                      <span>{serviceOrder.clients?.name}</span>
                    </div>
                    
                    {serviceOrder.vehicles && (
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Veículo:</span>
                        <span>{serviceOrder.vehicles.brand} {serviceOrder.vehicles.model}</span>
                        {serviceOrder.vehicles.license_plate && (
                          <Badge variant="outline">{serviceOrder.vehicles.license_plate}</Badge>
                        )}
                      </div>
                    )}
                    
                    {serviceOrder.mechanic_id && (
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Mecânico:</span>
                        <span>{serviceOrder.mechanic_id}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Criada:</span>
                      <span>{formatDate(serviceOrder.created_at)}</span>
                    </div>
                    
                    {serviceOrder.started_at && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Iniciada:</span>
                        <span>{formatDate(serviceOrder.started_at)}</span>
                      </div>
                    )}
                    
                    {serviceOrder.finished_at && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Finalizada:</span>
                        <span>{formatDate(serviceOrder.finished_at)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {serviceOrder.description && (
                  <div className="pt-4 border-t">
                    <span className="font-medium text-muted-foreground">Descrição:</span>
                    <p className="mt-1 text-sm bg-muted/50 p-3 rounded-md">
                      {serviceOrder.description}
                    </p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="pt-4 border-t">
                  <ServiceOrderQuickActions serviceOrder={serviceOrder} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Breakdown de Custos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Mão de Obra:</span>
                      <span className="font-semibold">{formatCurrency(serviceOrder.total_labor || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Peças:</span>
                      <span className="font-semibold">{formatCurrency(serviceOrder.total_parts || 0)}</span>
                    </div>
                    {serviceOrder.discount && serviceOrder.discount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Desconto:</span>
                        <span className="font-semibold text-destructive">
                          -{formatCurrency(serviceOrder.discount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-medium">Total:</span>
                      <span className="text-lg font-bold text-success">
                        {formatCurrency(serviceOrder.total_amount || 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Análise de Rentabilidade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Margem de Lucro:</span>
                      <span className={`font-semibold ${getProfitMarginColor(orderStats.profitMargin)}`}>
                        {Math.round(orderStats.profitMargin)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Custo Estimado:</span>
                      <span className="font-semibold">
                        {formatCurrency((serviceOrder.total_amount || 0) * (1 - orderStats.profitMargin / 100))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Lucro Estimado:</span>
                      <span className="font-semibold text-success">
                        {formatCurrency((serviceOrder.total_amount || 0) * (orderStats.profitMargin / 100))}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tempo de Execução</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Estimado:</span>
                      <span className="font-semibold">{Math.round(orderStats.estimatedTime / 60)}h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Real:</span>
                      <span className="font-semibold">{Math.round(orderStats.timeSpent / 60)}h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Eficiência:</span>
                      <span className={`font-semibold ${getEfficiencyColor(orderStats.efficiency)}`}>
                        {orderStats.efficiency}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Qualidade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Satisfação:</span>
                      <span className="font-semibold text-success">
                        {orderStats.customerSatisfaction}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Retrabalho:</span>
                      <Badge variant={orderStats.reworkNeeded ? "destructive" : "default"}>
                        {orderStats.reworkNeeded ? "Necessário" : "Não"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">No Prazo:</span>
                      <Badge variant={orderStats.onTimeCompletion ? "default" : "destructive"}>
                        {orderStats.onTimeCompletion ? "Sim" : "Não"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recursos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Peças Usadas:</span>
                      <span className="font-semibold">{orderStats.partsCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Horas de Trabalho:</span>
                      <span className="font-semibold">{orderStats.laborHours.toFixed(1)}h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Custo/Hora:</span>
                      <span className="font-semibold">
                        {formatCurrency((serviceOrder.total_labor || 0) / orderStats.laborHours)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alertas de Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {orderStats.efficiency < 70 && (
                  <div className="flex items-center justify-between p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <div>
                        <p className="text-sm font-medium">Eficiência Baixa</p>
                        <p className="text-xs text-muted-foreground">Tempo gasto acima do estimado</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Atenção</Badge>
                  </div>
                )}
                
                {orderStats.profitMargin < 20 && (
                  <div className="flex items-center justify-between p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <div>
                        <p className="text-sm font-medium">Margem Baixa</p>
                        <p className="text-xs text-muted-foreground">Revisar precificação</p>
                      </div>
                    </div>
                    <Badge variant="destructive">Crítico</Badge>
                  </div>
                )}
                
                {orderStats.reworkNeeded && (
                  <div className="flex items-center justify-between p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <div>
                        <p className="text-sm font-medium">Retrabalho Necessário</p>
                        <p className="text-xs text-muted-foreground">Verificar qualidade do serviço</p>
                      </div>
                    </div>
                    <Badge variant="destructive">Ação Requerida</Badge>
                  </div>
                )}

                {orderStats.efficiency >= 80 && orderStats.profitMargin >= 30 && !orderStats.reworkNeeded && (
                  <div className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <div>
                        <p className="text-sm font-medium">Excelente Performance</p>
                        <p className="text-xs text-muted-foreground">Ordem executada com alta qualidade</p>
                      </div>
                    </div>
                    <Badge variant="default">Parabéns!</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>Análise Financeira Detalhada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Análise financeira detalhada será implementada aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <ServiceOrderTimeline serviceOrderId={serviceOrder.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};