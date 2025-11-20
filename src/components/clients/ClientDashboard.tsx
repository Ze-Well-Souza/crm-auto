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
import { 
  User, 
  Car, 
  Calendar, 
  DollarSign, 
  Phone, 
  Mail,
  MapPin,
  Star,
  TrendingUp,
  Clock,
  Wrench,
  X
} from "lucide-react";
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

  // Mock metrics for demonstration
  const clientStats = {
    totalSpent: Math.random() * 8000 + 1000,
    serviceCount: Math.floor(Math.random() * 25) + 3,
    vehicleCount: Math.floor(Math.random() * 3) + 1,
    avgTicket: 0,
    lastService: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
    nextAppointment: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
    score: Math.floor(Math.random() * 100) + 1,
    loyaltyMonths: Math.floor(Math.random() * 36) + 6
  };

  clientStats.avgTicket = clientStats.totalSpent / clientStats.serviceCount;

  const getClientTier = (score: number) => {
    if (score >= 80) return { label: 'VIP', color: 'text-yellow-400', bg: 'bg-yellow-500/20 border-yellow-500/30' };
    if (score >= 60) return { label: 'Premium', color: 'text-purple-400', bg: 'bg-purple-500/20 border-purple-500/30' };
    if (score >= 40) return { label: 'Regular', color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/30' };
    return { label: 'Novo', color: 'text-slate-400', bg: 'bg-slate-500/20 border-slate-500/30' };
  };

  const tier = getClientTier(clientStats.score);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-slate-900 border-white/10">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white">{client.name}</span>
                  <Badge variant="outline" className={`${tier.color} ${tier.bg}`}>
                    {tier.label}
                  </Badge>
                </div>
                <p className="text-sm text-slate-400 font-normal">
                  Cliente há {clientStats.loyaltyMonths} meses
                </p>
              </div>
            </DialogTitle>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/5 border-white/10">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-400"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-400"
            >
              Serviços
            </TabsTrigger>
            <TabsTrigger
              value="vehicles"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-400"
            >
              Veículos
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-slate-400"
            >
              Histórico
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center bg-white/5 border-white/10">
                <CardContent className="pt-4">
                  <DollarSign className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">
                    {formatCurrency(clientStats.totalSpent)}
                  </div>
                  <p className="text-xs text-slate-400">Total Gasto</p>
                </CardContent>
              </Card>

              <Card className="text-center bg-white/5 border-white/10">
                <CardContent className="pt-4">
                  <Wrench className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{clientStats.serviceCount}</div>
                  <p className="text-xs text-slate-400">Serviços</p>
                </CardContent>
              </Card>

              <Card className="text-center bg-white/5 border-white/10">
                <CardContent className="pt-4">
                  <Car className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">{clientStats.vehicleCount}</div>
                  <p className="text-xs text-slate-400">Veículos</p>
                </CardContent>
              </Card>

              <Card className="text-center bg-white/5 border-white/10">
                <CardContent className="pt-4">
                  <TrendingUp className="h-6 w-6 text-orange-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">
                    {formatCurrency(clientStats.avgTicket)}
                  </div>
                  <p className="text-xs text-slate-400">Ticket Médio</p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {client.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="flex-1 text-white">{client.email}</span>
                      </div>
                    )}

                    {client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="flex-1 text-white">{formatPhone(client.phone)}</span>
                      </div>
                    )}

                    {client.cpf_cnpj && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="flex-1 text-white">{client.cpf_cnpj}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {(client.address || client.city) && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                        <div className="flex-1">
                          {client.address && <div className="text-white">{client.address}</div>}
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

                {/* Quick Actions */}
                <div className="pt-4 border-t border-white/10">
                  <ClientQuickActions client={client} />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg text-white">Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-white">Último serviço</p>
                        <p className="text-xs text-slate-400">
                          {formatDate(clientStats.lastService)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Concluído</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-white">Próximo agendamento</p>
                        <p className="text-xs text-slate-400">
                          {formatDate(clientStats.nextAppointment)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400">Agendado</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Histórico detalhado de serviços será implementado aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Veículos do Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-400 text-center py-8">
                  Lista de veículos do cliente será implementada aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <ClientTimeline clientId={client.id} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};