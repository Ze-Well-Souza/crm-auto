import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Calendar,
  Car,
  DollarSign,
  MessageCircle,
  Clock,
  TrendingUp
} from "lucide-react";
import { ClientActions } from "./ClientActions";
import { ClientDashboard } from "./ClientDashboard";
import { ClientQuickActions } from "./ClientQuickActions";
import { useClientMetrics } from "@/hooks/useClientMetrics";
import { formatPhone, formatDate, formatCurrency } from "@/utils/formatters";
import { cn } from "@/lib/utils";
import type { Client } from "@/types";

interface ClientCardProps {
  client: Client;
  onUpdate: () => void;
  onQuickAction?: (action: string, client: Client) => void;
}

export const ClientCard = ({ client, onUpdate, onQuickAction }: ClientCardProps) => {
  const [showDashboard, setShowDashboard] = useState(false);
  const { metrics, loading: metricsLoading } = useClientMetrics(client.id);
  
  // Usar métricas reais ou valores padrão durante carregamento
  const clientMetrics = metrics || {
    totalSpent: 0,
    serviceCount: 0,
    vehicleCount: 0,
    lastService: null,
    score: 0
  };

  const getClientTier = (score: number) => {
    if (score >= 80) return { label: 'VIP', variant: 'default' as const, color: 'text-yellow-600' };
    if (score >= 60) return { label: 'Premium', variant: 'secondary' as const, color: 'text-purple-600' };
    if (score >= 40) return { label: 'Regular', variant: 'outline' as const, color: 'text-blue-600' };
    return { label: 'Novo', variant: 'outline' as const, color: 'text-gray-600' };
  };

  const tier = getClientTier(clientMetrics.score);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleQuickAction = (action: string) => {
    onQuickAction?.(action, client);
  };

  const handleCardClick = () => {
    setShowDashboard(true);
  };

  return (
    <>
      <Card
        className="bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer group relative overflow-hidden"
        onClick={handleCardClick}
      >
      {/* Background gradient based on tier - Landing Page Style */}
      <div className={cn(
        "absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10",
        tier.label === 'VIP' && "bg-gradient-to-br from-amber-400 to-orange-500",
        tier.label === 'Premium' && "bg-gradient-to-br from-purple-400 to-pink-500",
        tier.label === 'Regular' && "bg-gradient-to-br from-blue-400 to-cyan-500",
        tier.label === 'Novo' && "bg-gradient-to-br from-gray-400 to-slate-500"
      )} />

      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-purple-500/30">
              <AvatarFallback className="bg-purple-500/20 text-purple-300 font-semibold">
                {getInitials(client.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg flex items-center gap-2 text-white">
                {client.name}
                <Badge className={cn(
                  "text-xs border-0",
                  tier.label === 'VIP' && "bg-amber-500/20 text-amber-300",
                  tier.label === 'Premium' && "bg-purple-500/20 text-purple-300",
                  tier.label === 'Regular' && "bg-blue-500/20 text-blue-300",
                  tier.label === 'Novo' && "bg-slate-500/20 text-slate-300"
                )}>
                  {tier.label}
                </Badge>
              </CardTitle>
              {client.cpf_cnpj && (
                <CardDescription className="text-slate-400">
                  CPF/CNPJ: {client.cpf_cnpj}
                </CardDescription>
              )}
            </div>
          </div>
          <ClientActions client={client} onUpdate={onUpdate} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {/* Contact Information - Landing Page Style */}
        <div className="space-y-2">
          {client.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-slate-400" />
              <span className="truncate flex-1 text-slate-300">{client.email}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                onClick={() => handleQuickAction('email')}
              >
                <Mail className="h-3 w-3" />
              </Button>
            </div>
          )}

          {client.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-slate-400" />
              <span className="flex-1 text-slate-300">{formatPhone(client.phone)}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20"
                  onClick={() => handleQuickAction('call')}
                >
                  <Phone className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20"
                  onClick={() => handleQuickAction('whatsapp')}
                >
                  <MessageCircle className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
          
          {client.city && client.state && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span className="truncate text-slate-300">{client.city}, {client.state}</span>
            </div>
          )}
        </div>

        {/* Client Metrics - Landing Page Style */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <DollarSign className="h-3 w-3 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400">
                {formatCurrency(clientMetrics.totalSpent)}
              </span>
            </div>
            <p className="text-xs text-slate-400">Total gasto</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Car className="h-3 w-3 text-blue-400" />
              <span className="text-xs font-semibold text-white">
                {clientMetrics.vehicleCount} veículo{clientMetrics.vehicleCount !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-xs text-slate-400">Cadastrado{clientMetrics.vehicleCount !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Last Service - Landing Page Style */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Último serviço: {formatDate(clientMetrics.lastService)}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>{clientMetrics.serviceCount} serviços</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ClientQuickActions
            client={client}
            onScheduleService={() => handleQuickAction('schedule')}
            onCreateServiceOrder={() => handleQuickAction('service')}
          />
        </div>

        {client.notes && (
          <div className="mt-3 p-2 bg-white/5 border border-white/10 rounded-md backdrop-blur-sm">
            <p className="text-xs text-slate-400 line-clamp-2">
              {client.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>

      {/* Client Dashboard Modal */}
      <ClientDashboard
        client={client}
        open={showDashboard}
        onOpenChange={setShowDashboard}
      />
    </>
  );
};