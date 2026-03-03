import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wrench, DollarSign, Clock, User, Car, Calendar, TrendingUp, Settings, FileText, CircleCheck as CheckCircle, Target } from "lucide-react";
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

  const totalAmount = serviceOrder.total_amount || 0;
  const totalLabor = serviceOrder.total_labor || 0;
  const totalParts = serviceOrder.total_parts || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-slate-900 border-white/10">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-white">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Wrench className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span>{serviceOrder.order_number}</span>
                  <StatusBadge status={serviceOrder.status} type="service-order" />
                </div>
                <p className="text-sm text-slate-400 font-normal">Criada em {formatDate(serviceOrder.created_at)}</p>
              </div>
            </DialogTitle>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="text-center bg-white/5 border-white/10">
                <CardContent className="pt-4">
                  <DollarSign className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-emerald-400">{formatCurrency(totalAmount)}</div>
                  <p className="text-xs text-slate-400">Valor Total</p>
                </CardContent>
              </Card>
              <Card className="text-center bg-white/5 border-white/10">
                <CardContent className="pt-4">
                  <Wrench className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-blue-400">{formatCurrency(totalLabor)}</div>
                  <p className="text-xs text-slate-400">Mão de Obra</p>
                </CardContent>
              </Card>
              <Card className="text-center bg-white/5 border-white/10">
                <CardContent className="pt-4">
                  <Settings className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-purple-400">{formatCurrency(totalParts)}</div>
                  <p className="text-xs text-slate-400">Peças</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardHeader><CardTitle className="text-lg text-white">Detalhes do Serviço</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <span className="font-medium text-white">Cliente:</span>
                      <span className="text-slate-300">{serviceOrder.clients?.name || '—'}</span>
                    </div>
                    {serviceOrder.vehicles && (
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-white">Veículo:</span>
                        <span className="text-slate-300">{serviceOrder.vehicles.brand} {serviceOrder.vehicles.model}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="font-medium text-white">Criada:</span>
                      <span className="text-slate-300">{formatDate(serviceOrder.created_at)}</span>
                    </div>
                  </div>
                </div>
                {serviceOrder.description && (
                  <div className="pt-4 border-t border-white/10">
                    <span className="font-medium text-slate-400">Descrição:</span>
                    <p className="mt-1 text-sm bg-white/5 p-3 rounded-md text-slate-300">{serviceOrder.description}</p>
                  </div>
                )}
                <div className="pt-4 border-t border-white/10">
                  <ServiceOrderQuickActions serviceOrder={serviceOrder} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader><CardTitle className="text-lg text-white">Breakdown de Custos</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Mão de Obra:</span>
                  <span className="font-semibold text-white">{formatCurrency(totalLabor)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-400">Peças:</span>
                  <span className="font-semibold text-white">{formatCurrency(totalParts)}</span>
                </div>
                {serviceOrder.discount && serviceOrder.discount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Desconto:</span>
                    <span className="font-semibold text-red-400">-{formatCurrency(serviceOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="font-medium text-white">Total:</span>
                  <span className="text-lg font-bold text-emerald-400">{formatCurrency(totalAmount)}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <ServiceOrderTimeline serviceOrderId={serviceOrder.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
