import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  
  // Mock data for demonstration - in real app would come from database
  const clientMetrics = {
    totalSpent: Math.random() * 5000 + 500,
    serviceCount: Math.floor(Math.random() * 20) + 1,
    vehicleCount: Math.floor(Math.random() * 3) + 1,
    lastService: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    score: Math.floor(Math.random() * 100) + 1
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
        className="hover:shadow-elevated transition-smooth cursor-pointer group relative overflow-hidden"
        onClick={handleCardClick}
      >
      {/* Background gradient based on tier */}
      <div className={cn(
        "absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10",
        tier.label === 'VIP' && "bg-gradient-to-br from-yellow-400 to-orange-500",
        tier.label === 'Premium' && "bg-gradient-to-br from-purple-400 to-pink-500",
        tier.label === 'Regular' && "bg-gradient-to-br from-blue-400 to-cyan-500",
        tier.label === 'Novo' && "bg-gradient-to-br from-gray-400 to-slate-500"
      )} />

      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(client.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {client.name}
                <Badge variant={tier.variant} className={cn("text-xs", tier.color)}>
                  {tier.label}
                </Badge>
              </CardTitle>
              {client.cpf_cnpj && (
                <CardDescription>
                  CPF/CNPJ: {client.cpf_cnpj}
                </CardDescription>
              )}
            </div>
          </div>
          <ClientActions client={client} onUpdate={onUpdate} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {/* Contact Information */}
        <div className="space-y-2">
          {client.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate flex-1">{client.email}</span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleQuickAction('email')}
              >
                <Mail className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {client.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1">{formatPhone(client.phone)}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0"
                  onClick={() => handleQuickAction('call')}
                >
                  <Phone className="h-3 w-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0"
                  onClick={() => handleQuickAction('whatsapp')}
                >
                  <MessageCircle className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
          
          {client.city && client.state && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{client.city}, {client.state}</span>
            </div>
          )}
        </div>

        {/* Client Metrics */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <DollarSign className="h-3 w-3 text-success" />
              <span className="text-xs font-semibold text-success">
                {formatCurrency(clientMetrics.totalSpent)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Total gasto</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Car className="h-3 w-3 text-info" />
              <span className="text-xs font-semibold">
                {clientMetrics.vehicleCount} veículo{clientMetrics.vehicleCount !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Cadastrado{clientMetrics.vehicleCount !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Last Service */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
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
          <div className="mt-3 p-2 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground line-clamp-2">
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