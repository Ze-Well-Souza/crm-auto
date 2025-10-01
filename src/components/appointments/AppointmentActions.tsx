import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoveHorizontal as MoreHorizontal, CreditCard as Edit, Trash2, CircleCheck as CheckCircle, Circle as XCircle, Calendar, Phone, MessageCircle, Clock, CirclePlay as PlayCircle } from "lucide-react";
import { AppointmentForm } from "./AppointmentForm";
import { useAppointmentsNew } from "@/hooks/useAppointmentsNew";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/utils/formatters";
import type { Appointment } from "@/types";

interface AppointmentActionsProps {
  appointment: Appointment;
  onUpdate: () => void;
}

export const AppointmentActions = ({ appointment, onUpdate }: AppointmentActionsProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updateAppointment, deleteAppointment } = useAppointmentsNew();
  const { toast } = useToast();

  const handleDelete = async () => {
    setLoading(true);
    
    try {
      await deleteAppointment(appointment.id);
      onUpdate();
    } catch (err) {
      console.error('Erro ao excluir agendamento:', err);
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateAppointment(appointment.id, { status: newStatus });
      onUpdate();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const handleContactClient = () => {
    if (appointment.clients?.email) {
      const subject = `Agendamento - ${appointment.service_type}`;
      const body = `Olá ${appointment.clients.name}, sobre seu agendamento para ${formatDate(appointment.scheduled_date)} às ${appointment.scheduled_time}...`;
      window.open(`mailto:${appointment.clients.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
  };

  const handleReschedule = () => {
    toast({
      title: "Reagendamento",
      description: "Abrindo formulário de reagendamento...",
    });
    setIsEditDialogOpen(true);
  };

  const canConfirm = appointment.status === 'agendado';
  const canStart = appointment.status === 'confirmado';
  const canComplete = appointment.status === 'em_andamento';
  const canCancel = appointment.status !== 'concluido' && appointment.status !== 'cancelado';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            setIsEditDialogOpen(true);
          }}>
            <Edit className="mr-2 h-4 w-4" />
            Editar Agendamento
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            handleReschedule();
          }}>
            <Calendar className="mr-2 h-4 w-4" />
            Reagendar
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Status Change Actions */}
          {canConfirm && (
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              handleStatusChange('confirmado');
            }}>
              <CheckCircle className="mr-2 h-4 w-4 text-success" />
              Confirmar
            </DropdownMenuItem>
          )}
          
          {canStart && (
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              handleStatusChange('em_andamento');
            }}>
              <PlayCircle className="mr-2 h-4 w-4 text-info" />
              Iniciar Atendimento
            </DropdownMenuItem>
          )}
          
          {canComplete && (
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              handleStatusChange('concluido');
            }}>
              <CheckCircle className="mr-2 h-4 w-4 text-success" />
              Finalizar
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          {/* Communication Actions */}
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            handleContactClient();
          }}>
            <Phone className="mr-2 h-4 w-4" />
            Contatar Cliente
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {canCancel && (
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              handleStatusChange('cancelado');
            }}>
              <XCircle className="mr-2 h-4 w-4 text-destructive" />
              Cancelar
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem 
            className="text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Agendamento</DialogTitle>
          </DialogHeader>
          <AppointmentForm 
            appointment={appointment}
            open={false}
            onOpenChange={() => {}}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              onUpdate();
            }} 
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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