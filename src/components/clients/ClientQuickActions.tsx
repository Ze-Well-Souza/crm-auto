import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Calendar,
  Car,
  FileText,
  ExternalLink
} from "lucide-react";
import type { Client } from "@/types";

interface ClientQuickActionsProps {
  client: Client;
  onScheduleService?: () => void;
  onCreateServiceOrder?: () => void;
}

export const ClientQuickActions = ({ 
  client, 
  onScheduleService, 
  onCreateServiceOrder 
}: ClientQuickActionsProps) => {
  const { toast } = useToast();

  const handleCall = () => {
    if (client.phone) {
      // In a real app, this would integrate with a phone system
      window.open(`tel:${client.phone.replace(/\D/g, '')}`);
      toast({
        title: "Ligação iniciada",
        description: `Ligando para ${client.name}`,
      });
    }
  };

  const handleEmail = () => {
    if (client.email) {
      window.open(`mailto:${client.email}?subject=Contato da UAutos Pro`);
      toast({
        title: "Email aberto",
        description: `Enviando email para ${client.name}`,
      });
    }
  };

  const handleWhatsApp = () => {
    if (client.phone) {
      const phoneNumber = client.phone.replace(/\D/g, '');
      const message = encodeURIComponent(`Olá ${client.name}, tudo bem? Aqui é da Oficina Eficiente!`);
      window.open(`https://wa.me/55${phoneNumber}?text=${message}`, '_blank');
      toast({
        title: "WhatsApp aberto",
        description: `Enviando mensagem para ${client.name}`,
      });
    }
  };

  const handleGoogleMaps = () => {
    if (client.address && client.city && client.state) {
      const address = encodeURIComponent(`${client.address}, ${client.city}, ${client.state}`);
      window.open(`https://maps.google.com/maps?q=${address}`, '_blank');
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Communication Actions */}
      {client.phone && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCall}
            className="flex items-center gap-1"
          >
            <Phone className="h-3 w-3" />
            Ligar
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleWhatsApp}
            className="flex items-center gap-1 text-green-600 hover:text-green-700"
          >
            <MessageCircle className="h-3 w-3" />
            WhatsApp
          </Button>
        </>
      )}

      {client.email && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleEmail}
          className="flex items-center gap-1"
        >
          <Mail className="h-3 w-3" />
          Email
        </Button>
      )}

      {/* Business Actions */}
      <Button
        size="sm"
        variant="outline"
        onClick={onScheduleService}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
      >
        <Calendar className="h-3 w-3" />
        Agendar
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={onCreateServiceOrder}
        className="flex items-center gap-1 text-purple-600 hover:text-purple-700"
      >
        <Car className="h-3 w-3" />
        Novo Serviço
      </Button>

      {/* Location Action */}
      {client.address && client.city && client.state && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleGoogleMaps}
          className="flex items-center gap-1"
        >
          <ExternalLink className="h-3 w-3" />
          Localizar
        </Button>
      )}
    </div>
  );
};