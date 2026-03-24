import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, User, Car, Phone, Mail, DollarSign, Target } from "lucide-react";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
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
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="client">Cliente</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="text-center">
                <CardContent className="pt-4">
                  <Clock className="h-6 w-6 text-info mx-auto mb-2" />
                  <div className="text-lg font-bold text-info">{appointment.estimated_duration || 60} min</div>
                  <p className="text-xs text-muted-foreground">Duração</p>
                </CardContent>
              </Card>
              {appointment.estimated_value && (
                <Card className="text-center">
                  <CardContent className="pt-4">
                    <DollarSign className="h-6 w-6 text-success mx-auto mb-2" />
                    <div className="text-lg font-bold text-success">{formatCurrency(appointment.estimated_value)}</div>
                    <p className="text-xs text-muted-foreground">Valor Estimado</p>
                  </CardContent>
                </Card>
              )}
              {appointment.final_value && (
                <Card className="text-center">
                  <CardContent className="pt-4">
                    <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="text-lg font-bold text-primary">{formatCurrency(appointment.final_value)}</div>
                    <p className="text-xs text-muted-foreground">Valor Final</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <Card>
              <CardHeader><CardTitle className="text-lg">Informações do Serviço</CardTitle></CardHeader>
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
                </div>
                {appointment.service_description && (
                  <div className="pt-4 border-t">
                    <span className="font-medium text-muted-foreground">Descrição:</span>
                    <p className="mt-1 text-sm bg-muted/50 p-3 rounded-md">{appointment.service_description}</p>
                  </div>
                )}
                <div className="pt-4 border-t">
                  <AppointmentQuickActions appointment={appointment} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="client" className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Informações do Cliente</CardTitle></CardHeader>
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
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
