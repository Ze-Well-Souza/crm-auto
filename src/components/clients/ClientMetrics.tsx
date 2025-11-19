import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Star,
  TrendingUp,
  Calendar,
  DollarSign
} from "lucide-react";
import type { Client } from "@/types";

interface ClientMetricsProps {
  clients: Client[];
}

export const ClientMetrics = ({ clients }: ClientMetricsProps) => {
  const totalClients = clients.length;
  const withPhone = clients.filter(c => c.phone).length;
  const withEmail = clients.filter(c => c.email).length;
  const withAddress = clients.filter(c => c.address && c.city).length;

  // Mock metrics for demonstration
  const vipClients = Math.floor(totalClients * 0.15);
  const premiumClients = Math.floor(totalClients * 0.25);
  const regularClients = Math.floor(totalClients * 0.45);
  const newClients = totalClients - vipClients - premiumClients - regularClients;

  const phonePercentage = totalClients > 0 ? (withPhone / totalClients) * 100 : 0;
  const emailPercentage = totalClients > 0 ? (withEmail / totalClients) * 100 : 0;
  const addressPercentage = totalClients > 0 ? (withAddress / totalClients) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Clients */}
      <Card className="gradient-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Total de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClients}</div>
          <p className="text-xs text-muted-foreground">Cadastrados no sistema</p>
        </CardContent>
      </Card>

      {/* Contact Completeness */}
      <Card className="gradient-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Phone className="h-4 w-4 text-success" />
            Dados de Contato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Telefone</span>
              <span>{Math.round(phonePercentage)}%</span>
            </div>
            <Progress value={phonePercentage} className="h-1" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Email</span>
              <span>{Math.round(emailPercentage)}%</span>
            </div>
            <Progress value={emailPercentage} className="h-1" />
          </div>
        </CardContent>
      </Card>

      {/* Client Tiers */}
      <Card className="gradient-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Star className="h-4 w-4 text-warning" />
            Classificação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <Badge variant="default" className="bg-amber-500 hover:bg-amber-600 text-white">VIP</Badge>
            <span className="text-sm font-medium">{vipClients}</span>
          </div>
          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="text-purple-600">Premium</Badge>
            <span className="text-sm font-medium">{premiumClients}</span>
          </div>
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="text-blue-600">Regular</Badge>
            <span className="text-sm font-medium">{regularClients}</span>
          </div>
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="text-gray-600">Novo</Badge>
            <span className="text-sm font-medium">{newClients}</span>
          </div>
        </CardContent>
      </Card>

      {/* Data Quality */}
      <Card className="gradient-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-info" />
            Qualidade dos Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Endereço Completo</span>
              <span>{Math.round(addressPercentage)}%</span>
            </div>
            <Progress value={addressPercentage} className="h-1" />
          </div>
          
          <div className="text-xs text-muted-foreground">
            {withAddress} de {totalClients} clientes com endereço
          </div>
        </CardContent>
      </Card>
    </div>
  );
};