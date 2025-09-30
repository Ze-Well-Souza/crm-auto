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
import { Calendar, Clock, User, Car, Phone, Mail, DollarSign, TrendingUp, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Target, ChartBar as BarChart3 } from "lucide-react";
import { AppointmentQuickActions } from "./AppointmentQuickActions";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { Appointment } from "@/types";

interface AppointmentDashboardProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AppointmentDashboard = ({ appointment, open, onOpenChange }: AppointmentDashboardProps) => {
  if (!appointment) return null;

  // Mock metrics for demonstration
  const appointmentStats = {
    profitability: Math.random() * 40 + 20,
    customerSatisfaction: Math.floor(Math.random() * 30) + 70,
    onTimeCompletion: Math.random() > 0.2,
    rescheduledCount: Math.floor(Math.random() * 3),
    estimatedDuration: appointment.estimated_duration || 60,
    actualDuration: Math.floor(Math.random() * 120) + 30,
    complexity: Math.random() > 0.7 ? 'alta' : Math.random() > 0.4 ? 'media' : 'baixa',
    priority: Math.random() > 0.8 ? 'alta' : Math.random() > 0.5 ? 'media' : 'baixa',
    preparationTime: Math.floor(Math.random() * 30) + 15,
    travelTime: Math.floor(Math.random() * 60) + 10
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'alta': return 'text-destructive';
      case 'media': return 'text-warning';
      case 'baixa': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'text-destructive';
      case 'media': return 'text-warning';
      case 'baixa': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span>{appointment.service_type}</span>
                  <StatusBadge status={appointment.status} type="appointment" />
                </div>
                <p className="text-sm text-muted-foreground font-normal">
                  {formatDate(appointment.scheduled_date)} às {appointment.scheduled_time}
                </p>
              </div>
            </DialogTitle>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="client">Cliente</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="pt-4">
                  <Clock className="h-6 w-6 text-info mx-auto mb-2" />
                  <div className="text-lg font-bold text-info">
                    {appointment.estimated_duration || 60} min
                  </div>
                  <p className="text-xs text-muted-foreground">Duração</p>
                </CardContent>
              </Card>

              {appointment.estimated_value && (
                <Card className="text-center">
                  <CardContent className="pt-4">
                    <DollarSign className="h-6 w-6 text-success mx-auto mb-2" />
                    <div className="text-lg font-bold text-success">
                      {formatCurrency(appointment.estimated_value)}
                    </div>
                    <p className="text-xs text-muted-foreground">Valor</p>
                  </CardContent>
                </Card>
              )}

              <Card className="text-center">
                <CardContent className="pt-4">
                  <Target className="h-6 w-6 text-warning mx-auto mb-2" />
                  <div className={`text-lg font-bold ${getComplexityColor(appointmentStats.complexity)}`}>
                    {appointmentStats.complexity.toUpperCase()}
                  </div>
                  <p className="text-xs text-muted-foreground">Complexidade</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-4">
                  <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
                  <div className={`text-lg font-bold ${getPriorityColor(appointmentStats.priority)}`}>
                    {appointmentStats.priority.toUpperCase()}
                  </div>
                  <p className="text-xs text-muted-foreground">Prioridade</p>
                </CardContent>
              </Card>
            </div>

            {/* Service Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações do Serviço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Data:</span>
                      <span>{formatDate(appointment.scheduled_date)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Horário:</span>
                      <span>{appointment.scheduled_time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Tipo:</span>
                      <Badge variant="outline">{appointment.service_type}</Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {appointment.estimated_value && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Valor Estimado:</span>
                        <span className="font-semibold text-success">
                          {formatCurrency(appointment.estimated_value)}
                        </span>
                      </div>
                    )}
                    
                    {appointment.final_value && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Valor Final:</span>
                        <span className="font-semibold text-primary">
                          {formatCurrency(appointment.final_value)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {appointment.service_description && (
                  <div className="pt-4 border-t">
                    <span className="font-medium text-muted-foreground">Descrição:</span>
                    <p className="mt-1 text-sm bg-muted/50 p-3 rounded-md">
                      {appointment.service_description}
                    </p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="pt-4 border-t">
                  <AppointmentQuickActions appointment={appointment} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Client Tab */}
          <TabsContent value="client" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {appointment.clients && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{appointment.clients.name}</span>
                    </div>
                    
                    {appointment.clients.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.clients.phone}</span>
                      </div>
                    )}
                    
                    {appointment.clients.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.clients.email}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Vehicle Information */}
                {appointment.vehicles && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Veículo</h4>
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {appointment.vehicles.brand} {appointment.vehicles.model} ({appointment.vehicles.year})
                      </span>
                      {appointment.vehicles.license_plate && (
                        <Badge variant="outline">{appointment.vehicles.license_plate}</Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Métricas detalhadas de performance serão implementadas aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Timeline do Agendamento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Timeline detalhada será implementada aqui
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};