import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Wrench, FileText, TriangleAlert as AlertTriangle, Phone, MessageCircle, TrendingUp, Settings, ExternalLink } from "lucide-react";
import type { Vehicle } from "@/types";

interface VehicleQuickActionsProps {
  vehicle: Vehicle;
  onScheduleService?: () => void;
  onCreateServiceOrder?: () => void;
  onViewHistory?: () => void;
}

export const VehicleQuickActions = ({ 
  vehicle, 
  onScheduleService, 
  onCreateServiceOrder,
  onViewHistory
}: VehicleQuickActionsProps) => {
  const { toast } = useToast();

  const handleContactOwner = () => {
    if (vehicle.clients?.email) {
      window.open(`mailto:${vehicle.clients.email}?subject=Sobre seu veículo ${vehicle.brand} ${vehicle.model}`);
      toast({
        title: "Email aberto",
        description: `Enviando email para ${vehicle.clients.name}`,
      });
    }
  };

  const handleWhatsAppOwner = () => {
    // Mock phone number - in real app would get from client data
    const message = encodeURIComponent(`Olá ${vehicle.clients?.name}, sobre seu ${vehicle.brand} ${vehicle.model} (${vehicle.license_plate})`);
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
    toast({
      title: "WhatsApp aberto",
      description: `Enviando mensagem sobre o veículo`,
    });
  };

  const handleCheckFIPE = () => {
    // In real app would integrate with FIPE API
    const searchTerm = encodeURIComponent(`${vehicle.brand} ${vehicle.model} ${vehicle.year}`);
    window.open(`https://veiculos.fipe.org.br/?q=${searchTerm}`, '_blank');
    toast({
      title: "Consulta FIPE",
      description: "Abrindo consulta de valor de mercado",
    });
  };

  const handleMaintenanceAlert = () => {
    toast({
      title: "Alerta configurado",
      description: "Lembrete de manutenção criado com sucesso",
    });
  };

  return (
    <div className="flex flex-wrap gap-1">
      {/* Primary Actions */}
      <Button
        size="sm"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          onScheduleService?.();
        }}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
      >
        <Calendar className="h-3 w-3" />
        Agendar
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          onCreateServiceOrder?.();
        }}
        className="flex items-center gap-1 text-purple-600 hover:text-purple-700"
      >
        <Wrench className="h-3 w-3" />
        Serviço
      </Button>

      {/* Communication Actions */}
      {vehicle.clients && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleContactOwner();
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
              handleWhatsAppOwner();
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
          onViewHistory?.();
        }}
        className="flex items-center gap-1"
      >
        <FileText className="h-3 w-3" />
        Histórico
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          handleCheckFIPE();
        }}
        className="flex items-center gap-1"
      >
        <ExternalLink className="h-3 w-3" />
        FIPE
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          handleMaintenanceAlert();
        }}
        className="flex items-center gap-1 text-orange-600 hover:text-orange-700"
      >
        <AlertTriangle className="h-3 w-3" />
        Alerta
      </Button>
    </div>
  );
};