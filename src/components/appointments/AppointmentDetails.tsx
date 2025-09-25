import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Clock, 
  User, 
  Car, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from "lucide-react";
import { AppointmentForm } from "./AppointmentForm";
import { useAppointmentsNew } from "@/hooks/useAppointmentsNew";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatCurrency, formatDate } from "@/utils/formatters";
import type { Appointment } from "@/types";

interface AppointmentDetailsProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export const AppointmentDetails = ({ 
  appointment, 
  open, 
  onOpenChange, 
  onUpdate 
}: AppointmentDetailsProps) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updateAppointment, deleteAppointment } = useAppointmentsNew();

  if (!appointment) return null;

  const handleStatusUpdate = async (newStatus: string) => {
    setLoading(true);
    try {
      await updateAppointment(appointment.id, { status: newStatus });
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteAppointment(appointment.id);
      onUpdate();
      onOpenChange(false);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Detalhes do Agendamento
            </DialogTitle>
            <DialogDescription>
              {formatDate(appointment.scheduled_date)} às {appointment.scheduled_time}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Status e Ações */}
            <div className="flex items-center justify-between">
              <StatusBadge status={appointment.status} type="appointment" />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEditForm(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>

            <Separator />

            {/* Informações do Serviço */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Informações do Serviço</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-muted-foreground">Tipo:</span>
                    <Badge variant="outline">{appointment.service_type}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Duração:</span>
                    <span>{appointment.estimated_duration || 60} minutos</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {appointment.estimated_value && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-muted-foreground">Valor Estimado:</span>
                      <span className="font-semibold text-success">
                        {formatCurrency(appointment.estimated_value)}
                      </span>
                    </div>
                  )}
                  
                  {appointment.final_value && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-muted-foreground">Valor Final:</span>
                      <span className="font-semibold text-primary">
                        {formatCurrency(appointment.final_value)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {appointment.service_description && (
                <div>
                  <span className="font-medium text-muted-foreground">Descrição:</span>
                  <p className="mt-1 text-sm bg-muted/50 p-3 rounded-md">
                    {appointment.service_description}
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* Informações do Cliente */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Informações do Cliente</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{appointment.clients?.name}</span>
                </div>
                
                {appointment.clients?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.clients.phone}</span>
                  </div>
                )}
                
                {appointment.clients?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{appointment.clients.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Informações do Veículo */}
            {appointment.vehicles && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Informações do Veículo</h3>
                  
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
              </>
            )}

            {/* Observações */}
            {appointment.notes && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Observações</h3>
                  <p className="text-sm bg-muted/50 p-3 rounded-md">
                    {appointment.notes}
                  </p>
                </div>
              </>
            )}

            {/* Ações Rápidas de Status */}
            {appointment.status !== 'concluido' && appointment.status !== 'cancelado' && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Ações Rápidas</h3>
                  <div className="flex gap-2 flex-wrap">
                    {appointment.status === 'agendado' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate('confirmado')}
                        disabled={loading}
                        className="text-green-600 hover:text-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirmar
                      </Button>
                    )}
                    
                    {(appointment.status === 'confirmado' || appointment.status === 'agendado') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate('em_andamento')}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Iniciar
                      </Button>
                    )}
                    
                    {appointment.status === 'em_andamento' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate('concluido')}
                        disabled={loading}
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Finalizar
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate('cancelado')}
                      disabled={loading}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Form */}
      <AppointmentForm
        open={showEditForm}
        onOpenChange={setShowEditForm}
        appointment={appointment}
        onSuccess={() => {
          setShowEditForm(false);
          onUpdate();
        }}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};