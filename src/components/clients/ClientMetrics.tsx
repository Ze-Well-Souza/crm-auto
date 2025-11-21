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
      {/* Total Clients - Landing Page Style */}
      <Card className="bg-white/90 dark:bg-white/5 border-l-4 border-l-blue-600 border-t border-r border-b border-slate-200/50 dark:border-t-white/10 dark:border-r-white/10 dark:border-b-white/10 backdrop-blur-xl shadow-xl shadow-blue-500/10 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <div className="p-2 rounded-lg bg-blue-600/20 dark:bg-blue-500/20">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            Total de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalClients}</div>
          <p className="text-xs text-slate-600 dark:text-slate-400">Cadastrados no sistema</p>
        </CardContent>
      </Card>

      {/* Contact Completeness - Landing Page Style */}
      <Card className="bg-white/90 dark:bg-white/5 border-l-4 border-l-emerald-600 border-t border-r border-b border-slate-200/50 dark:border-t-white/10 dark:border-r-white/10 dark:border-b-white/10 backdrop-blur-xl shadow-xl shadow-emerald-500/10 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <div className="p-2 rounded-lg bg-emerald-600/20 dark:bg-emerald-500/20">
              <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            Dados de Contato
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
              <span>Telefone</span>
              <span>{Math.round(phonePercentage)}%</span>
            </div>
            <Progress value={phonePercentage} className="h-1 bg-slate-200 dark:bg-white/10" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
              <span>Email</span>
              <span>{Math.round(emailPercentage)}%</span>
            </div>
            <Progress value={emailPercentage} className="h-1 bg-slate-200 dark:bg-white/10" />
          </div>
        </CardContent>
      </Card>

      {/* Client Tiers - Landing Page Style */}
      <Card className="bg-white/90 dark:bg-white/5 border-l-4 border-l-purple-600 border-t border-r border-b border-slate-200/50 dark:border-t-white/10 dark:border-r-white/10 dark:border-b-white/10 backdrop-blur-xl shadow-xl shadow-purple-500/10 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <div className="p-2 rounded-lg bg-purple-600/20 dark:bg-purple-500/20">
              <Star className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            Classificação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-300 border-0">VIP</Badge>
            <span className="text-sm font-medium text-slate-900 dark:text-white">{vipClients}</span>
          </div>
          <div className="flex justify-between items-center">
            <Badge className="bg-purple-600/20 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 border-0">Premium</Badge>
            <span className="text-sm font-medium text-slate-900 dark:text-white">{premiumClients}</span>
          </div>
          <div className="flex justify-between items-center">
            <Badge className="bg-blue-600/20 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 border-0">Regular</Badge>
            <span className="text-sm font-medium text-slate-900 dark:text-white">{regularClients}</span>
          </div>
          <div className="flex justify-between items-center">
            <Badge className="bg-slate-500/20 text-slate-700 dark:text-slate-300 border-0">Novo</Badge>
            <span className="text-sm font-medium text-slate-900 dark:text-white">{newClients}</span>
          </div>
        </CardContent>
      </Card>

      {/* Data Quality - Landing Page Style */}
      <Card className="bg-white/90 dark:bg-white/5 border-l-4 border-l-cyan-600 border-t border-r border-b border-slate-200/50 dark:border-t-white/10 dark:border-r-white/10 dark:border-b-white/10 backdrop-blur-xl shadow-xl shadow-cyan-500/10 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <div className="p-2 rounded-lg bg-cyan-600/20 dark:bg-cyan-500/20">
              <TrendingUp className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            Qualidade dos Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
              <span>Endereço Completo</span>
              <span>{Math.round(addressPercentage)}%</span>
            </div>
            <Progress value={addressPercentage} className="h-1 bg-slate-200 dark:bg-white/10" />
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-400">
            {withAddress} de {totalClients} clientes com endereço
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
