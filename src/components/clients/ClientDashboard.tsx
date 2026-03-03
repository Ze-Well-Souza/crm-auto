import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { User, Car, Calendar, DollarSign, Phone, Mail, MapPin, Star, TrendingUp, Clock, Wrench, X } from "lucide-react";
import { ClientTimeline } from "./ClientTimeline";
import { ClientQuickActions } from "./ClientQuickActions";
import { formatPhone, formatDate, formatCurrency } from "@/utils/formatters";
import type { Client } from "@/types";

interface ClientDashboardProps {
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ClientDashboard = ({ client, open, onOpenChange }: ClientDashboardProps) => {
  if (!client) return null;

  const clientStats = {
    totalSpent: 0,
    serviceCount: 0,
    vehicleCount: 0,
    avgTicket: 0,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <span>{client.name}</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-normal">
                  Cliente desde {formatDate(client.created_at)}
                </p>
              </div>
            </DialogTitle>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="vehicles">Veículos</TabsTrigger>
            <TabsTrigger value="timeline">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center border-l-4 border-l-emerald-500">
                <CardContent className="pt-4">
                  <DollarSign className="h-6 w-6 text-emerald-500 dark:text-emerald-400 mx-auto mb-2" />
                  <div className="text-lg font-bold">{formatCurrency(clientStats.totalSpent)}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Total Gasto</p>
                </CardContent>
              </Card>
              <Card className="text-center border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <Wrench className="h-6 w-6 text-blue-500 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-lg font-bold">{clientStats.serviceCount}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Serviços</p>
                </CardContent>
              </Card>
              <Card className="text-center border-l-4 border-l-purple-500">
                <CardContent className="pt-4">
                  <Car className="h-6 w-6 text-purple-500 dark:text-purple-400 mx-auto mb-2" />
                  <div className="text-lg font-bold">{clientStats.vehicleCount}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Veículos</p>
                </CardContent>
              </Card>
              <Card className="text-center border-l-4 border-l-orange-500">
                <CardContent className="pt-4">
                  <TrendingUp className="h-6 w-6 text-orange-500 dark:text-orange-400 mx-auto mb-2" />
                  <div className="text-lg font-bold">{formatCurrency(clientStats.avgTicket)}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Ticket Médio</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle className="text-lg">Informações de Contato</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {client.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span>{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>{formatPhone(client.phone)}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    {(client.address || client.city) && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                        <div>
                          {client.address && <div>{client.address}</div>}
                          {client.city && client.state && (
                            <div className="text-sm text-slate-400">
                              {client.city}, {client.state}
                              {client.zip_code && ` - ${client.zip_code}`}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <ClientQuickActions client={client} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services">
            <Card>
              <CardHeader><CardTitle>Histórico de Serviços</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Histórico detalhado de serviços será exibido aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles">
            <Card>
              <CardHeader><CardTitle>Veículos do Cliente</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Lista de veículos do cliente será exibida aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <ClientTimeline clientId={client.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
