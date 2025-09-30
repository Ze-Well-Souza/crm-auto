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
    if (score >= 80) return { label: 'VIP', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score >= 60) return { label: 'Premium', color: 'text-purple-600', bg: 'bg-purple-100' };
    if (score >= 40) return { label: 'Regular', color: 'text-blue-600', bg: 'bg-blue-100' };
    return { label: 'Novo', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const tier = getClientTier(clientStats.score);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span>{client.name}</span>
                  <Badge variant="outline" className={tier.color}>
                    {tier.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground font-normal">
                  Cliente há {clientStats.loyaltyMonths} meses
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

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="pt-4">
                  <DollarSign className="h-6 w-6 text-success mx-auto mb-2" />
                  <div className="text-lg font-bold text-success">
                    {formatCurrency(clientStats.totalSpent)}
                  </div>
                  <p className="text-xs text-muted-foreground">Total Gasto</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-4">
                  <Wrench className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className="text-lg font-bold">{clientStats.serviceCount}</div>
                  <p className="text-xs text-muted-foreground">Serviços</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-4">
                  <Car className="h-6 w-6 text-info mx-auto mb-2" />
                  <div className="text-lg font-bold">{clientStats.vehicleCount}</div>
                  <p className="text-xs text-muted-foreground">Veículos</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-4">
                  <TrendingUp className="h-6 w-6 text-warning mx-auto mb-2" />
                  <div className="text-lg font-bold">
                    {formatCurrency(clientStats.avgTicket)}
                  </div>
                  <p className="text-xs text-muted-foreground">Ticket Médio</p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {client.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1">{client.email}</span>
                      </div>
                    )}
                    
                    {client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1">{formatPhone(client.phone)}</span>
                      </div>
                    )}
                    
                    {client.cpf_cnpj && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1">{client.cpf_cnpj}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {(client.address || client.city) && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          {client.address && <div>{client.address}</div>}
                          {client.city && client.state && (
                            <div className="text-sm text-muted-foreground">
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
                <div className="pt-4 border-t">
                  <ClientQuickActions client={client} />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Último serviço</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(clientStats.lastService)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Concluído</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Próximo agendamento</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(clientStats.nextAppointment)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Agendado</Badge>
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
            <Card>
              <CardHeader>
                <CardTitle>Veículos do Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
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