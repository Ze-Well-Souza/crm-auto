import { Phone, Mail, MessageSquare, Calendar, Wrench, MapPin, CreditCard, Car, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Client } from "@/types";
import { formatCurrency } from "@/utils/formatters";

interface ClientCardModernProps {
  client: Client;
  onCall?: (client: Client) => void;
  onWhatsApp?: (client: Client) => void;
  onEmail?: (client: Client) => void;
  onSchedule?: (client: Client) => void;
  onNewService?: (client: Client) => void;
}

export const ClientCardModern = ({ 
  client, 
  onCall, 
  onWhatsApp, 
  onEmail, 
  onSchedule, 
  onNewService 
}: ClientCardModernProps) => {
  
  // Determinar tags do cliente
  const isNew = client.service_count === 0 || !client.last_service_date;
  const isVIP = client.is_vip || (client.total_spent && client.total_spent >= 5000);
  
  // Calcular qualidade dos dados
  const qualityScore = client.quality_score || 0;
  const qualityColor = qualityScore >= 80 ? 'text-green-600' : qualityScore >= 50 ? 'text-yellow-600' : 'text-red-600';
  
  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-700">
      {/* Conteúdo Principal */}
      <div className="p-6 space-y-4">
        {/* Header com Nome e Tags */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
              {client.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {isVIP && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                  <Star className="h-3 w-3 mr-1" />
                  VIP
                </Badge>
              )}
              {isNew && (
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                  Novo
                </Badge>
              )}
              {client.tags && client.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Quality Score */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className={`text-2xl font-bold ${qualityColor}`}>
                  {qualityScore}%
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Qualidade dos Dados</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Informações de Contato */}
        <div className="space-y-2 text-sm">
          {client.cpf_cnpj && (
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <span className="font-medium">CPF/CNPJ:</span>
              <span>{client.cpf_cnpj}</span>
            </div>
          )}
          
          {client.email && (
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{client.email}</span>
            </div>
          )}
          
          {client.phone && (
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{client.phone}</span>
            </div>
          )}
          
          {client.address && (
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                {client.address}
                {client.city && `, ${client.city}`}
                {client.state && ` - ${client.state}`}
              </span>
            </div>
          )}
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
              <CreditCard className="h-3.5 w-3.5" />
              <span>Total Gasto</span>
            </div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {formatCurrency(client.total_spent || 0)}
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
              <Car className="h-3.5 w-3.5" />
              <span>Veículos</span>
            </div>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {client.vehicle_count || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Botões de Ação (Aparecem no Hover) */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      flex flex-col items-end justify-end p-6 gap-2 pointer-events-none">
        <div className="w-full space-y-2 pointer-events-auto">
        {/* Primeira linha de botões */}
        <div className="flex gap-2 w-full">
          {onCall && client.phone && (
            <Button
              size="sm"
              variant="secondary"
              className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={() => onCall(client)}
            >
              <Phone className="h-4 w-4 mr-2" />
              Ligar
            </Button>
          )}
          
          {onWhatsApp && client.phone && (
            <Button
              size="sm"
              variant="secondary"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white border-0"
              onClick={() => onWhatsApp(client)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          )}
          
          {onEmail && client.email && (
            <Button
              size="sm"
              variant="secondary"
              className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={() => onEmail(client)}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
          )}
        </div>
        
        {/* Segunda linha de botões */}
        <div className="flex gap-2 w-full">
          {onSchedule && (
            <Button
              size="sm"
              variant="secondary"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-0"
              onClick={() => onSchedule(client)}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Agendar
            </Button>
          )}
          
          {onNewService && (
            <Button
              size="sm"
              variant="secondary"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white border-0"
              onClick={() => onNewService(client)}
            >
              <Wrench className="h-4 w-4 mr-2" />
              Novo Serviço
            </Button>
          )}
        </div>
        </div>
      </div>
    </Card>
  );
};

