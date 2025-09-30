import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CircleCheck as CheckCircle, CirclePlay as PlayCircle, Circle as XCircle, Phone, MessageCircle, Calendar, Clock, Send, Eye, CreditCard as Edit } from "lucide-react";
import type { Appointment } from "@/types";

interface AppointmentQuickActionsProps {
  appointment: Appointment;
  onStatusChange?: () => void;
  onContactClient?: () => void;
  onReschedule?: () => void;
}

export const AppointmentQuickActions = ({ 
  appointment, 
  onStatusChange, 
  onContactClient,
  onReschedule
}: AppointmentQuickActionsProps) => {
  const { toast } = useToast();

  const handleContactClient = () => {
    if (appointment.clients?.email) {
      const subject = `Agendamento - ${appointment.service_type}`;
      const body = `Olá ${appointment.clients.name}, sobre seu agendamento para ${appointment.scheduled_date} às ${appointment.scheduled_time}...`;
      window.open(`mailto:${appointment.clients.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
      toast({
        title: "Email aberto",
        description: `Enviando email para ${appointment.clients.name}`,
      });
    }
  };

  const handleWhatsAppClient = () => {
    const message = encodeURIComponent(`Olá ${appointment.clients?.name}, sobre seu agendamento de ${appointment.service_type} para ${appointment.scheduled_date} às ${appointment.scheduled_time}.`);
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
    toast({
      title: "WhatsApp aberto",
      description: "Enviando mensagem sobre o agendamento",
    });
  };

  const handleSendReminder = () => {
    toast({
      title: "Lembrete enviado",
      description: "Cliente notificado sobre o agendamento",
    });
  };

  const handleReschedule = () => {
    toast({
      title: "Reagendamento",
      description: "Abrindo opções de reagendamento...",
    });
    onReschedule?.();
  };

  const getNextAction = () => {
    switch (appointment.status) {
      case 'agendado':
        return { label: 'Confirmar', icon: CheckCircle, color: 'text-success' };
      case 'confirmado':
        return { label: 'Iniciar', icon: PlayCircle, color: 'text-info' };
      case 'em_andamento':
        return { label: 'Finalizar', icon: CheckCircle, color: 'text-success' };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  return (
    <div className="flex flex-wrap gap-1">
      {/* Primary Status Action */}
      {nextAction && (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange?.();
          }}
          className={`flex items-center gap-1 ${nextAction.color} hover:${nextAction.color}`}
        >
          <nextAction.icon className="h-3 w-3" />
          {nextAction.label}
        </Button>
      )}

      {/* Communication Actions */}
      {appointment.clients && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleContactClient();
            }}
            className="flex items-center gap-1"
          >
            <Phone className="h-3 w-3" />
            Ligar
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleWhatsAppClient();
            }}
            className="flex items-center gap-1 text-green-600 hover:text-green-700"
          >
            <MessageCircle className="h-3 w-3" />
            WhatsApp
          </Button>
        </>
      )}

      {/* Utility Actions */}
      <Button
        size="sm"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          handleSendReminder();
        }}
        className="flex items-center gap-1"
      >
        <Send className="h-3 w-3" />
        Lembrete
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          handleReschedule();
        }}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
      >
        <Calendar className="h-3 w-3" />
        Reagendar
      </Button>
    </div>
  );
};