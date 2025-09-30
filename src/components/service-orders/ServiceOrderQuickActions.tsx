import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CircleCheck as CheckCircle, Play as PlayCircle, Pause as PauseCircle, Circle as XCircle, Phone, MessageCircle, FileText, Send, Clock, TriangleAlert as AlertTriangle, Download, Eye } from "lucide-react";
import type { ServiceOrder } from "@/types";

interface ServiceOrderQuickActionsProps {
  serviceOrder: ServiceOrder;
  onStatusChange?: () => void;
  onContactClient?: () => void;
  onViewDetails?: () => void;
}

export const ServiceOrderQuickActions = ({ 
  serviceOrder, 
  onStatusChange, 
  onContactClient,
  onViewDetails
}: ServiceOrderQuickActionsProps) => {
  const { toast } = useToast();

  const handleContactClient = () => {
    if (serviceOrder.clients?.email) {
      const subject = `Ordem de Serviço ${serviceOrder.order_number}`;
      const body = `Olá ${serviceOrder.clients.name}, sobre a ordem de serviço ${serviceOrder.order_number}...`;
      window.open(`mailto:${serviceOrder.clients.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
      toast({
        title: "Email aberto",
        description: `Enviando email para ${serviceOrder.clients.name}`,
      });
    }
  };

  const handleWhatsAppClient = () => {
    // Mock phone - in real app would get from client data
    const message = encodeURIComponent(`Olá ${serviceOrder.clients?.name}, sobre a ordem de serviço ${serviceOrder.order_number}. Status atual: ${serviceOrder.status}`);
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
    toast({
      title: "WhatsApp aberto",
      description: "Enviando mensagem sobre a ordem",
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Relatório gerado",
      description: "Relatório da ordem de serviço foi gerado",
    });
    // In real app would generate PDF report
  };

  const handleSendUpdate = () => {
    toast({
      title: "Atualização enviada",
      description: "Cliente notificado sobre o progresso",
    });
    // In real app would send status update to client
  };

  const handleViewTimeline = () => {
    toast({
      title: "Timeline",
      description: "Carregando histórico detalhado...",
    });
    onViewDetails?.();
  };

  const getNextAction = () => {
    switch (serviceOrder.status) {
      case 'orcamento':
        return { label: 'Aprovar', icon: CheckCircle, color: 'text-success' };
      case 'aprovado':
        return { label: 'Iniciar', icon: PlayCircle, color: 'text-info' };
      case 'em_andamento':
        return { label: 'Finalizar', icon: CheckCircle, color: 'text-success' };
      case 'aguardando_pecas':
        return { label: 'Retomar', icon: PlayCircle, color: 'text-info' };
      case 'concluido':
        return { label: 'Entregar', icon: CheckCircle, color: 'text-success' };
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
      {serviceOrder.clients && (
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
            Contatar
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
          handleSendUpdate();
        }}
        className="flex items-center gap-1"
      >
        <Send className="h-3 w-3" />
        Notificar
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          handleGenerateReport();
        }}
        className="flex items-center gap-1"
      >
        <Download className="h-3 w-3" />
        Relatório
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          handleViewTimeline();
        }}
        className="flex items-center gap-1"
      >
        <Eye className="h-3 w-3" />
        Timeline
      </Button>
    </div>
  );
};